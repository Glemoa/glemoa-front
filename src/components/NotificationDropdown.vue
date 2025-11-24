<template>
  <transition name="dropdown-fade">
    <div v-if="show" class="notification-dropdown">
      <div class="dropdown-header">
        <div class="tabs">
          <button :class="{ active: activeTab === 'unread' }" @click="activeTab = 'unread'">
            안 읽은 알림
          </button>
          <button :class="{ active: activeTab === 'read' }" @click="activeTab = 'read'">
            읽은 알림
          </button>
          <button :class="{ active: activeTab === 'keywords' }" @click="activeTab = 'keywords'">
            키워드 설정
          </button>
        </div>
      </div>
      <div class="dropdown-body">
        <div v-if="activeTab === 'unread' || activeTab === 'read'">
          <div v-if="isLoading" class="loading-spinner">
            <p>로딩 중...</p>
          </div>
          <div v-else-if="notifications.length === 0" class="no-notifications">
            <p>알림이 없습니다.</p>
          </div>
          <ul v-else class="notification-list">
            <li v-for="(post, index) in notifications" :key="post.id" class="post-item">
              <div class="post-title">
                <a :href="post.link" target="_blank" @click.stop>{{ post.title }}</a>
                <span class="comment-count"> [{{ post.commentCount }}]</span>
              </div>
              <div class="post-details">
                <span>{{ post.community }}</span>
                <span class="separator">|</span>
                <span>{{ formatTimeAgo(post.createdAt) }}</span>
                <span class="separator">|</span>
                <span>조회: {{ post.viewCount }}</span>
                <span class="separator">|</span>
                <span>추천: {{ post.recommendationCount }}</span>
                <button v-if="isLoggedIn" @click.stop="handleToggleBookmark(post)" :class="{ bookmarked: bookmarkedPostIds.has(post.id) }" class="action-btn bookmark-btn">{{ bookmarkedPostIds.has(post.id) ? "★" : "☆" }}</button>
                <button v-if="isLoggedIn && activeTab ==='unread'" @click.stop="handleNotificationClick(post, index)" class="action-btn read-btn" title="읽음으로 표시">✔</button>
                <button v-if="isLoggedIn && activeTab ==='read'" @click.stop="handleDeleteNotification(post, index)" class="action-btn delete-btn" title="삭제">🗑️</button>
              </div>
            </li>
          </ul>
        </div>
        <KeywordSettings
            v-else-if="activeTab === 'keywords'"
            :currentKeywords="currentKeywords"
            @keywords-changed="$emit('keywords-changed')"
        />
      </div>
      <div v-if="(activeTab === 'unread' || activeTab === 'read') && notifications.length > 0" class="dropdown-footer">
        <button v-if="activeTab === 'unread'" @click="handleMarkAllAsRead" class="mark-all-read-btn">모두 읽음으로 표시</button>
        <button v-if="activeTab === 'read'" @click="handleDeleteAllNotifications" class="delete-all-btn">모두 삭제</button>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, watch, onMounted, inject } from "vue";
import { getUnread, getRead, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } from "@/api/notification";
import { fetchBookmarkedPostIds, toggleBookmark } from "@/api/bookmark";
import KeywordSettings from "./KeywordSettings.vue";

export default {
  name: "NotificationDropdown",
  components: {
    KeywordSettings,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    currentKeywords: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["keywords-changed", "notification-read", "notifications-all-read"],
  setup(props, { emit }) {
    const isLoggedIn = inject("isLoggedIn");
    const activeTab = ref("unread");
    const notifications = ref([]);
    const isLoading = ref(false);
    const bookmarkedPostIds = ref(new Set());

    const formatTimeAgo = (dateString) => {
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
    };

    const handleToggleBookmark = async (post) => {
      if (!isLoggedIn.value) return;
      try {
        await toggleBookmark(post.id);
        if (bookmarkedPostIds.value.has(post.id)) {
          bookmarkedPostIds.value.delete(post.id);
        } else {
          bookmarkedPostIds.value.add(post.id);
        }
      } catch (error) {
        console.error("Failed to toggle bookmark:", error);
      }
    };

    const handleNotificationClick = async (post, index) => {
      if (activeTab.value !== 'unread') return;
      try {
        await markAsRead(post.id);
        notifications.value.splice(index, 1); // Optimistically remove from list
        emit('notification-read'); // Notify parent to update count
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    };

    const handleMarkAllAsRead = async () => {
      try {
        await markAllAsRead();
        notifications.value = []; // Optimistically clear list
        emit('notifications-all-read'); // Notify parent to update count
      } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
      }
    };

    const handleDeleteNotification = async (post, index) => {
      try {
        await deleteNotification(post.id);
        notifications.value.splice(index, 1);
      } catch (error) {
        console.error(`Failed to delete notification for post ${post.id}:`, error);
      }
    };

    const handleDeleteAllNotifications = async () => {
      try {
        await deleteAllNotifications();
        notifications.value = [];
      } catch (error) {
        console.error("Failed to delete all notifications:", error);
      }
    };

    const fetchInitialData = async () => {
      if (!props.show) return;
      if (activeTab.value !== "keywords") {
        isLoading.value = true;
        try {
          const fetcher = activeTab.value === "unread" ? getUnread : getRead;
          notifications.value = await fetcher();
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
          notifications.value = [];
        } finally {
          isLoading.value = false;
        }
      }
      if (isLoggedIn.value) {
        try {
          bookmarkedPostIds.value = await fetchBookmarkedPostIds();
        } catch (error) {
          console.error("Failed to fetch bookmarks:", error);
        }
      }
    };

    watch(
      () => props.show,
      (newVal) => {
        if (newVal) {
          activeTab.value = "unread";
          fetchInitialData();
        }
      }
    );

    watch(activeTab, fetchInitialData);

    onMounted(() => {
      if (props.show) {
        fetchInitialData();
      }
    });

    return {
      isLoggedIn,
      activeTab,
      notifications,
      isLoading,
      bookmarkedPostIds,
      handleToggleBookmark,
      formatTimeAgo,
      handleNotificationClick,
      handleMarkAllAsRead,
      handleDeleteNotification,
      handleDeleteAllNotifications,
    };
  },
};
</script>

<style scoped>
.notification-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  width: 380px;
  max-height: 500px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}
.tabs {
  display: flex;
}
.tabs button {
  padding: 12px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s, border-bottom 0.2s;
  border-bottom: 2px solid transparent;
}
.tabs button.active {
  color: var(--link-active-color);
  border-bottom-color: var(--link-active-color);
}
.dropdown-body {
  overflow-y: auto;
  flex-grow: 1;
}
.loading-spinner,
.no-notifications {
  padding: 20px;
  text-align: center;
  color: var(--text-secondary);
}
.notification-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.post-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  transition: border-color 0.3s;
}
.post-item:hover {
  background-color: var(--bg-primary);
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
.action-btn {
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
.action-btn:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--text-secondary);
}
.bookmark-btn.bookmarked {
  color: #ffc107;
  border-color: #ffc107;
}
.read-btn {
  color: #4caf50;
}
.delete-btn {
  color: #f44336;
}
.dropdown-footer {
  padding: 10px;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  flex-shrink: 0;
}
.mark-all-read-btn {
  width: 100%;
  padding: 10px;
  background-color: var(--link-active-color);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  transition: opacity 0.2s;
}
.mark-all-read-btn:hover {
  opacity: 0.9;
}
.delete-all-btn {
  width: 100%;
  padding: 10px;
  background-color: #f44336;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  transition: opacity 0.2s;
}
.delete-all-btn:hover {
  opacity: 0.9;
}
</style>
