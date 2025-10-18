<template>
  <div class="bookmarked-posts-view">
    <h1>즐겨찾기한 게시글</h1>
    <div v-if="posts.length" class="post-list">
      <ul>
        <li v-for="post in posts" :key="post.id + post.source" class="post-item">
          <div class="post-title">
            <a :href="post.link" target="_blank" @click="increaseViewCount(post.id)">{{ post.title }}</a>
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
      <div class="pagination-container" v-if="pagination.totalPages > 1">
        <button @click="changePage(pagination.currentPage - 1)" :disabled="pagination.currentPage <= 1">이전</button>
        <button v-for="page in getVisiblePages()" :key="page" @click="changePage(page)" :class="{ active: page === pagination.currentPage }">
          {{ page }}
        </button>
        <button @click="changePage(pagination.currentPage + 1)" :disabled="pagination.currentPage >= pagination.totalPages">다음</button>
      </div>
    </div>
    <p v-else-if="error">{{ error }}</p>
    <p v-else>즐겨찾기한 게시글이 없습니다.</p>
  </div>
</template>

<script>
import { authInstance, defaultInstance } from "@/api";

export default {
  name: "BookmarkedPostsView",
  inject: ["settings"],
  data() {
    return {
      posts: [],
      error: null,
      pagination: {
        currentPage: 1,
        pageSize: this.settings?.globalPageSize || 10,
        totalPages: 1,
        totalPosts: 0,
        movablePageCount: 5,
      },
    };
  },
  created() {
    this.fetchBookmarkedPosts(this.pagination.currentPage);
  },
  methods: {
    async increaseViewCount(postId) {
      try {
        await defaultInstance.post(`/glemoa-view-count-rank/views/${postId}`);
      } catch (error) {
        console.error("Error increasing view count:", error);
      }
    },
    async fetchBookmarkedPosts(page) {
      try {
        const response = await authInstance.get(`/glemoa-member/bookMark/viewBookMarkPost?page=${page}&pageSize=${this.pagination.pageSize}&movablePageCount=${this.pagination.movablePageCount}`);
        const { postDtoList, postCount } = response.data;
        this.posts = postDtoList;
        this.pagination.totalPosts = postCount;
        this.pagination.totalPages = Math.ceil(postCount / this.pagination.pageSize);
        this.pagination.currentPage = page;
      } catch (error) {
        console.error("Error fetching bookmarked posts:", error);
        this.error = "즐겨찾기한 게시글을 불러오는 데 실패했습니다.";
      }
    },
    async toggleBookmark(post) {
      try {
        await authInstance.post("/glemoa-member/bookMark/doBookMark", { postId: post.id });
        // Refresh the current page
        this.fetchBookmarkedPosts(this.pagination.currentPage);
      } catch (error) {
        alert("북마크 삭제에 실패했습니다.");
        console.error("Bookmark error:", error);
      }
    },
    changePage(page) {
      if (page > 0 && page <= this.pagination.totalPages) {
        this.fetchBookmarkedPosts(page);
      }
    },
    getVisiblePages() {
      const { totalPages, currentPage, movablePageCount } = this.pagination;
      if (totalPages <= 1) return [];

      let startPage = Math.floor((currentPage - 1) / movablePageCount) * movablePageCount + 1;
      let endPage = startPage + movablePageCount - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
      }

      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
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
  watch: {
    "settings.globalPageSize": {
      handler(newPageSize) {
        this.pagination.pageSize = newPageSize;
        this.fetchBookmarkedPosts(1); // Reset to first page
      },
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

.pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
}

.pagination-container button {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
}

.pagination-container button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.pagination-container button.active {
    font-weight: bold;
    border-color: var(--link-active-color);
    color: var(--link-active-color);
}
</style>
