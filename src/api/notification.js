import { authInstance } from './index';

/**
 * 읽지 않은 알림의 개수를 조회합니다.
 * @returns {Promise<number>} 읽지 않은 알림의 개수
 */
export const countUnread = async () => {
    if (!localStorage.getItem('accessToken')) {
        return 0;
    }
    try {
        const response = await authInstance.get('/glemoa-member/notification/count-unread');
        return response.data;
    } catch (error) {
        console.error("Error fetching unread notification count:", error);
        throw error;
    }
};

/**
 * 읽지 않은 알림에 해당하는 게시물 목록을 조회합니다.
 * @returns {Promise<Array>} 게시물 DTO 목록
 */
export const getUnread = async () => {
    if (!localStorage.getItem('accessToken')) {
        return [];
    }
    try {
        const response = await authInstance.get('/glemoa-member/notification/search-unread');
        return response.data;
    } catch (error) {
        console.error("Error fetching unread notifications:", error);
        throw error;
    }
};

/**
 * 읽은 알림에 해당하는 게시물 목록을 조회합니다.
 * @returns {Promise<Array>} 게시물 DTO 목록
 */
export const getRead = async () => {
    if (!localStorage.getItem('accessToken')) {
        return [];
    }
    try {
        const response = await authInstance.get('/glemoa-member/notification/search-read');
        return response.data;
    } catch (error) {
        console.error("Error fetching read notifications:", error);
        throw error;
    }
};

/**
 * 특정 알림을 읽음으로 처리합니다.
 * @param {number} postId - 읽음 처리할 알림의 게시물 ID
 * @returns {Promise<void>}
 */
export const markAsRead = async (postId) => {
    if (!localStorage.getItem('accessToken')) {
        return;
    }
    try {
        await authInstance.patch(`/glemoa-member/notification/read/${postId}`);
    } catch (error) {
        console.error(`Error marking notification for post ${postId} as read:`, error);
        throw error;
    }
};

/**
 * 모든 알림을 읽음으로 처리합니다.
 * @returns {Promise<void>}
 */
export const markAllAsRead = async () => {
    if (!localStorage.getItem('accessToken')) {
        return;
    }
    try {
        await authInstance.patch('/glemoa-member/notification/read-all');
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
    }
};

/**
 * 특정 읽은 알림을 삭제합니다.
 * @param {number} postId - 삭제할 알림의 게시물 ID
 * @returns {Promise<void>}
 */
export const deleteNotification = async (postId) => {
    if (!localStorage.getItem('accessToken')) {
        return;
    }
    try {
        await authInstance.delete(`/glemoa-member/notification/delete/${postId}`);
    } catch (error) {
        console.error(`Error deleting notification for post ${postId}:`, error);
        throw error;
    }
};

/**
 * 모든 읽은 알림을 삭제합니다.
 * @returns {Promise<void>}
 */
export const deleteAllNotifications = async () => {
    if (!localStorage.getItem('accessToken')) {
        return;
    }
    try {
        await authInstance.delete('/glemoa-member/notification/delete-all');
    } catch (error) {
        console.error("Error deleting all notifications:", error);
        throw error;
    }
};
