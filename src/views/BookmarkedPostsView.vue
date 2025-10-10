<template>
  <div class="bookmarked-posts-view">
    <h1>즐겨찾기한 게시글</h1>
    <div v-if="posts.length" class="post-list">
      <ul>
        <li v-for="post in posts" :key="post.id + post.source" class="post-item">
          <div class="post-title">
            <a :href="post.link" target="_blank">{{ post.title }}</a>
            <span class="comment-count"> [{{ post.commentCount }}]</span>
          </div>
          <div class="post-details">
            <span class="post-source" :style="getSourceStyle(post.source)">{{ post.source }}</span>
            <span class="separator">|</span>
            <span>{{ post.author }}</span>
            <span class="separator">|</span>
            <span>{{ formatTimeAgo(post.createdAt) }}</span>
            <span class="separator">|</span>
            <span>조회: {{ post.viewCount }}</span>
            <span class="separator">|</span>
            <span>추천: {{ post.recommendationCount }}</span>
            <button @click="toggleBookmark(post)" class="bookmark-btn bookmarked">★</button>
          </div>
        </li>
      </ul>
    </div>
    <p v-else-if="error">{{ error }}</p>
    <p v-else>즐겨찾기한 게시글이 없습니다.</p>
  </div>
</template>

<script>
import { authInstance } from "@/api";

export default {
  name: "BookmarkedPostsView",
  data() {
    return {
      posts: [],
      error: null,
    };
  },
  created() {
    this.fetchBookmarkedPosts();
  },
  methods: {
    async fetchBookmarkedPosts() {
      try {
        const response = await authInstance.get("/glemoa-member/bookMark/viewBookMarkPost");
        this.posts = response.data;
      } catch (error) {
        console.error("Error fetching bookmarked posts:", error);
        this.error = "즐겨찾기한 게시글을 불러오는 데 실패했습니다.";
      }
    },
    async toggleBookmark(post) {
      try {
        await authInstance.post("/glemoa-member/bookMark/doBookMark", { postId: post.id });
        this.posts = this.posts.filter((p) => p.id !== post.id);
      } catch (error) {
        alert("북마크 삭제에 실패했습니다.");
        console.error("Bookmark error:", error);
      }
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
    getSourceStyle(source) {
      const styles = {
        fmkorea: { backgroundColor: "#5DADE2", color: "#333" },
        dcinside: { backgroundColor: "#48C9B0", color: "#333" },
        humoruniv: { backgroundColor: "#F7DC6F", color: "#333" },
        Etoland: { backgroundColor: "#E74C3C", color: "#333" },
        clien: { backgroundColor: "#8E44AD", color: "#333" },
        ppomppu: { backgroundColor: "#3498DB", color: "#333" },
        inven: { backgroundColor: "#2ECC71", color: "#333" },
        bobaedream: { backgroundColor: "#F1C40F", color: "#333" },
        ruliweb: { backgroundColor: "#E67E22", color: "#333" },
        mlbpark: { backgroundColor: "#1ABC9C", color: "#333" },
        theqoo: { backgroundColor: "#9B59B6", color: "#333" },
        natepann: { backgroundColor: "#D35400", color: "#333" },
        arcalive: { backgroundColor: "#C0392B", color: "#333" },
      };
      return styles[source] || { backgroundColor: "#7F8C8D", color: "white" }; // Default style
    },
  },
};
</script>

<style scoped>
.bookmarked-posts-view {
  padding: 20px;
  color: var(--text-primary);
}

h1 {
  margin-bottom: 20px;
}

.post-list ul {
  list-style-type: none;
  padding: 0;
}

.post-item {
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}

.post-title a {
  text-decoration: none;
  color: var(--text-primary);
}

.post-title a:hover {
  text-decoration: underline;
}

.comment-count {
  color: var(--link-active-color);
  font-weight: bold;
}

.post-details {
  font-size: 0.9em;
  color: var(--text-secondary);
}

.post-details .separator {
  margin: 0 5px;
}

.post-source {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
}

.bookmark-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  margin-left: 8px;
  padding: 2px 5px;
  border-radius: 4px;
  width: 28px;
  text-align: center;
}

.bookmark-btn.bookmarked {
  color: #ffc107;
  border-color: #ffc107;
}

.bookmark-btn:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--text-secondary);
}
</style>
