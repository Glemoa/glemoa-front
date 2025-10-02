<template>
  <div class="post-view">
    <div class="main-header">
      <h1>실시간 커뮤니티별 인기글</h1>
      <div class="sort-controls">
        <select v-model="globalSortState" @change="handleGlobalSortChange" class="sort-select">
          <option value="latest">전체 최신글</option>
          <option value="recommended">전체 추천순</option>
          <option value="view_count">전체 조회순</option>
        </select>
        <div class="refresh-btn" @click="refreshAllCommunities">&#x21bb;</div>
      </div>
    </div>
    <div v-if="Object.keys(postsByCommunity).length" class="community-container">
      <div v-for="(posts, community) in postsByCommunity" :key="community" class="community-block">
        <div class="community-header">
          <h2>{{ community }}</h2>
          <div class="sort-controls">
            <select v-model="sortState[community]" @change="handleSortChange(community)" class="sort-select">
              <option value="latest">최신글</option>
              <option value="recommended">오늘의 추천</option>
              <option value="view_count">오늘의 조회수</option>
            </select>
            <div class="refresh-btn" @click="refreshCommunity(community)">&#x21bb;</div>
          </div>
        </div>
        <ul>
          <li v-for="post in posts" :key="post.id + post.source" class="post-item">
            <div class="post-title">
              <a :href="post.link" target="_blank">{{ post.title }}</a>
              <span class="comment-count"> [{{ post.commentCount }}]</span>
            </div>
            <div class="post-details">
              <span>{{ post.author }}</span>
              <span class="separator">|</span>
              <span>{{ formatTimeAgo(post.createdAt) }}</span>
              <span class="separator">|</span>
              <span>조회: {{ post.viewCount }}</span>
              <span class="separator">|</span>
              <span>추천: {{ post.recommendationCount }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <p v-else-if="error">{{ error }}</p>
    <p v-else>게시글을 불러오는 중...</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PostListView",
  data() {
    return {
      postsByCommunity: {},
      error: null,
      communities: ["fmkorea", "dcinside", "humoruniv", "Etoland", "clien", "ppomppu", "inven", "bobaedream", "ruliweb", "mlbpark", "theqoo", "natepann", "arcalive"],
      sortState: {},
      globalSortState: 'latest',
    };
  },
  created() {
    this.communities.forEach(community => {
      this.sortState[community] = 'latest';
    });
    this.fetchAllCommunities("recent-posts");
  },
  methods: {
    fetchAllCommunities(endpoint) {
      this.error = null;

      const promises = this.communities.map((community) => axios.get(`${process.env.VUE_APP_API_BASE_URL}/${endpoint}?source=${community}`));

      Promise.all(promises)
        .then((responses) => {
          const groupedPosts = responses.reduce((acc, response) => {
            const posts = response.data;
            if (posts && posts.length > 0) {
              const communityName = posts[0].source;
              acc[communityName] = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            return acc;
          }, {});
          this.postsByCommunity = groupedPosts;
        })
        .catch((error) => {
          console.error(`Error fetching all ${endpoint}:`, error);
          this.error = "데이터를 불러오는 데 실패했습니다. 백엔드 서버 상태를 확인해주세요.";
        });
    },
    fetchCommunityData(community, endpoint) {
      axios
        .get(`${process.env.VUE_APP_API_BASE_URL}/${endpoint}?source=${community}`)
        .then((response) => {
          const posts = response.data;
          this.postsByCommunity = {
            ...this.postsByCommunity,
            [community]: posts && posts.length > 0 ? posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [],
          };
        })
        .catch((error) => {
          console.error(`Error fetching ${endpoint} for ${community}:`, error);
          alert(`${community} 게시글을 불러오는 중 오류가 발생했습니다.`);
        });
    },
    handleGlobalSortChange() {
      const sortBy = this.globalSortState;
      
      this.communities.forEach(community => {
        this.sortState[community] = sortBy;
      });

      if (sortBy === "latest") {
        this.fetchAllCommunities("recent-posts");
      } else if (sortBy === "recommended") {
        this.fetchAllCommunities("today-recommended-posts");
      } else if (sortBy === "view_count") {
        this.fetchAllCommunities("today-view-count-posts");
      }
    },
    refreshAllCommunities() {
      this.handleGlobalSortChange();
    },
    handleSortChange(community) {
      const sortBy = this.sortState[community];
      if (sortBy === "latest") {
        this.fetchCommunityData(community, "recent-posts");
      } else if (sortBy === "recommended") {
        this.fetchCommunityData(community, "today-recommended-posts");
      } else if (sortBy === "view_count") {
        this.fetchCommunityData(community, "today-view-count-posts");
      }
    },
    refreshCommunity(community) {
      this.handleSortChange(community);
    },
    formatTimeAgo(dateString) {
      const now = new Date();
      const postDate = new Date(dateString);
      const seconds = Math.floor((now - postDate) / 1000);

      if (seconds < 60) return `${seconds}초 전`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}분 전`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}시간 전`;
      const days = Math.floor(hours / 24);
      return `${days}일 전`;
    },
  },
};
</script>

<style scoped>
.post-view {
  padding: 20px;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px; /* 아래 community-container와의 간격 */
}

.main-header h1 {
  margin: 0;
}

.community-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.community-block {
  flex: 1 1 350px;
  min-width: 300px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  padding: 15px;
  box-sizing: border-box;
}

.community-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  font-size: 20px;
  color: #333;
  transition: background-color 0.2s, border-color 0.2s;
}

.refresh-btn:hover {
  background-color: #f0f0f0;
  border-color: #c0c0c0;
}

.sort-select {
  /* Resetting default styles */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  /* Custom styles */
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 32px 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;

  /* Custom arrow icon */
  background-image: url("data:image/svg+xml,%3csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M7 10L12 15L17 10' stroke='%234E5968' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;

  /* Smooth transitions */
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.sort-select:hover {
  border-color: #c0c0c0;
}

.sort-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.post-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.post-item:last-child {
  border-bottom: none;
}

.post-title {
  font-size: 0.95em;
  margin-bottom: 4px;
}

.post-title a {
  text-decoration: none;
  color: #333;
}

.post-title a:hover {
  text-decoration: underline;
}

.comment-count {
  color: #1a73e8;
  font-weight: bold;
  font-size: 0.9em;
  margin-left: 4px;
}

.post-details {
  font-size: 0.8em;
  color: #666;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.post-details .separator {
  margin: 0 5px;
}
</style>
