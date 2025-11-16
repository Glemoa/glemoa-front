<template>
  <div class="daily-rank-view" :class="{ mobile: isMobile }">
    <h3 class="rank-title">다들 뭐 보지?</h3>
    <div v-if="loading" class="loading">불러오는 중...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div class="rank-container" v-if="posts.length">
      <ul class="rank-list" :style="{ animationDuration: animationDuration }">
        <li v-for="(post, index) in posts" :key="post.id" class="rank-item">
          <span class="rank-number">{{ index + 1 }}</span>
          <a :href="post.link" target="_blank" @click="increaseViewCount(post.id)" class="post-title">{{ post.title }}</a>
        </li>
        <!-- Duplicate the list for a seamless loop -->
        <li v-for="(post, index) in posts" :key="post.id + '-clone'" class="rank-item">
          <span class="rank-number">{{ index + 1 }}</span>
          <a :href="post.link" target="_blank" @click="increaseViewCount(post.id)" class="post-title">{{ post.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defaultInstance } from "@/api";

export default {
  name: "DailyRankView",
  props: {
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      posts: [],
      loading: false,
      error: null,
      polling: null,
    };
  },
  computed: {
    animationDuration() {
      // Adjust speed based on the number of items
      return `${this.posts.length * 2.5}s`;
    },
  },
  created() {
    this.fetchDailyRank();
    this.polling = setInterval(() => {
      this.fetchDailyRank();
    }, 600000);
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  methods: {
    async fetchDailyRank() {
      this.loading = true;
      this.error = null;
      try {
        const response = await defaultInstance.get("/glemoa-view-count-rank/ranks/daily");
        this.posts = response.data;
      } catch (error) {
        console.error("Error fetching daily rank:", error);
        this.error = "일간 순위를 불러오는 데 실패했습니다.";
      } finally {
        this.loading = false;
      }
    },
    async increaseViewCount(postId) {
      try {
        await defaultInstance.post(`/glemoa-view-count-rank/views/${postId}`);
      } catch (error) {
        console.error("Error increasing view count:", error);
      }
    },
  },
};
</script>

<style scoped>
.daily-rank-view {
  position: absolute;
  right: 20px;
  top: 15px;
  width: 300px; /* Adjust width as needed */
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 5px 15px;
  font-size: 14px;
  max-height: 60px; /* Initial collapsed height */
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
  z-index: 10;
}

.daily-rank-view:hover {
  max-height: 300px; /* Expanded height */
}

.daily-rank-view.mobile {
  position: static;
  margin-top: 15px;
  width: 90%;
  max-width: 600px;
}

.rank-title {
  margin: 0 0 5px 0;
  font-size: 0.9em;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  cursor: pointer;
}

.rank-container {
  height: 240px; /* Adjust height to show about 5-6 items */
  overflow: hidden;
  position: relative;
}

.rank-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  width: 100%;
  animation-name: scroll;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-number {
  font-weight: bold;
  color: var(--link-active-color);
  margin-right: 10px;
  min-width: 20px;
  text-align: center;
}

.post-title {
  color: var(--text-primary);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-title:hover {
  text-decoration: underline;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  color: var(--text-secondary);
}

@keyframes scroll {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
}
</style>
