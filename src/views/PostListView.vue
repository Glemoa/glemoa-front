<template>
  <div class="post-view">
    <div class="main-header">
      <h1>실시간 커뮤니티별 인기글</h1>
      <div class="controls">
        <button @click="showCommunitySelector = true" class="community-select-btn">커뮤니티 선택</button>
        <div class="sort-controls">
          <select v-model="globalSortState" @change="handleGlobalSortChange" class="sort-select">
            <option value="latest">최신글</option>
            <option value="recommended">오늘의 추천</option>
            <option value="view_count">오늘의 조회수</option>
          </select>
          <div class="refresh-btn" @click="refreshAllCommunities">&#x21bb;</div>
        </div>
      </div>
    </div>

    <CommunitySelector :show="showCommunitySelector" @close="showCommunitySelector = false" @selection-changed="handleSelectionChanged" />

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
              <button v-if="isLoggedIn" @click="toggleBookmark(post)" :class="{ bookmarked: bookmarkedPostIds.has(post.id) }" class="bookmark-btn">{{ bookmarkedPostIds.has(post.id) ? "★" : "☆" }}</button>
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
import { defaultInstance, authInstance } from "@/api";
import CommunitySelector from "@/components/CommunitySelector.vue";

export default {
  name: "PostListView",
  components: {
    CommunitySelector,
  },
  data() {
    return {
      postsByCommunity: {},
      error: null,
      communities: [],
      allCommunities: ["fmkorea", "dcinside", "humoruniv", "Etoland", "clien", "ppomppu", "inven", "bobaedream", "ruliweb", "mlbpark", "theqoo", "natepann", "arcalive"],
      sortState: {},
      globalSortState: "latest",
      bookmarkedPostIds: new Set(),
      isLoggedIn: false,
      showCommunitySelector: false,
    };
  },
  created() {
    this.checkLoginStatus();
    this.loadSelectedCommunities();
    this.initializeSortState();
    this.fetchAllCommunities("recent-posts");
    if (this.isLoggedIn) {
      this.fetchBookmarkedPostIds();
    }
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem("accessToken");
    },
    loadSelectedCommunities() {
      const savedCommunities = localStorage.getItem("selectedCommunities");
      if (savedCommunities) {
        this.communities = JSON.parse(savedCommunities);
      } else {
        this.communities = [...this.allCommunities];
      }
    },
    initializeSortState() {
      this.allCommunities.forEach((community) => {
        this.sortState[community] = "latest";
      });
    },
    handleSelectionChanged(selectedCommunities) {
      this.communities = selectedCommunities;
      this.postsByCommunity = {}; // Clear existing posts
      this.fetchAllCommunities(this.getEndpointForSortState(this.globalSortState));
    },
    getEndpointForSortState(sortState) {
      if (sortState === "recommended") return "today-recommended-posts";
      if (sortState === "view_count") return "today-view-count-posts";
      return "recent-posts";
    },
    async fetchBookmarkedPostIds() {
      try {
        const response = await authInstance.get("/glemoa-member/bookMark/viewBookMaredPostId");
        this.bookmarkedPostIds = new Set(response.data);
      } catch (error) {
        console.error("Error fetching bookmarked post IDs:", error);
      }
    },
    async toggleBookmark(post) {
      try {
        await authInstance.post("/glemoa-member/bookMark/doBookMark", { postId: post.id });
        if (this.bookmarkedPostIds.has(post.id)) {
          this.bookmarkedPostIds.delete(post.id);
        } else {
          this.bookmarkedPostIds.add(post.id);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("로그인이 필요합니다.");
        } else {
          alert("북마크 추가/삭제에 실패했습니다.");
          console.error("Bookmark error:", error);
        }
      }
    },
    fetchAllCommunities(endpoint) {
      this.error = null;
      if (this.communities.length === 0) {
        this.postsByCommunity = {};
        return;
      }

      const promises = this.communities.map((community) => defaultInstance.get(`/glemoa-reader/${endpoint}?source=${community}`));

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
          this.error = "데이터를 불러오는 데 실패했습니다. 백엔드 서버 상태를 확인해주세요..";
        });
    },
    fetchCommunityData(community, endpoint) {
      defaultInstance
        .get(`/glemoa-reader/${endpoint}?source=${community}`)
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
      this.communities.forEach((community) => {
        this.sortState[community] = sortBy;
      });
      this.fetchAllCommunities(this.getEndpointForSortState(sortBy));
    },
    refreshAllCommunities() {
      this.handleGlobalSortChange();
    },
    handleSortChange(community) {
      const sortBy = this.sortState[community];
      this.fetchCommunityData(community, this.getEndpointForSortState(sortBy));
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
  color: var(--text-primary);
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.main-header h1 {
  margin: 0;
  color: var(--text-primary);
}

.controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.community-select-btn {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.community-select-btn:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--text-secondary);
}

.community-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.community-block {
  flex: 1 1 350px;
  min-width: 300px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  padding: 15px;
  box-sizing: border-box;
  transition: background-color 0.3s, border-color 0.3s;
}

.community-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 10px;
  margin-bottom: 10px;
  transition: border-color 0.3s;
}

.community-header h2 {
  color: var(--text-primary);
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
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  cursor: pointer;
  font-size: 20px;
  color: var(--text-primary);
  transition: background-color 0.2s, border-color 0.2s, color 0.3s;
}

.refresh-btn:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--text-secondary);
}

.sort-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 32px 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M7 10L12 15L17 10' stroke='%234E5968' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.3s, color 0.3s;
}

.sort-select:hover {
  border-color: var(--text-secondary);
}

.sort-select:focus {
  outline: none;
  border-color: var(--link-active-color);
  box-shadow: 0 0 0 2px var(--link-active-color-translucent, rgba(66, 133, 244, 0.25));
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.post-item {
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
  transition: border-color 0.3s;
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
  color: var(--text-primary);
  transition: color 0.3s;
}

.post-title a:hover {
  text-decoration: underline;
}

.comment-count {
  color: var(--link-active-color);
  font-weight: bold;
  font-size: 0.9em;
  margin-left: 4px;
}

.post-details {
  font-size: 0.8em;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  transition: color 0.3s;
}

.post-details .separator {
  margin: 0 5px;
}

.bookmark-btn.bookmarked {
  color: #ffc107;
  border-color: #ffc107;
}

.bookmark-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  margin-left: 8px;
  padding: 2px 5px;
  border-radius: 4px;
  width: 28px; /* Adjust width to fit star */
  text-align: center;
}

.bookmark-btn:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--text-secondary);
}
</style>
