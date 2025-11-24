import { authInstance } from './index';

/**
 * 사용자가 북마크한 모든 게시물의 ID 목록을 가져옵니다.
 * @returns {Promise<Set<number>>} 북마크된 게시물 ID의 Set
 */
export const fetchBookmarkedPostIds = async () => {
    try {
        const response = await authInstance.get("/glemoa-member/bookMark/viewBookMaredPostId");
        return new Set(response.data);
    } catch (error) {
        console.error("Error fetching bookmarked post IDs:", error);
        throw error; // Re-throw to be handled by the caller
    }
};

/**
 * 게시물의 북마크 상태를 토글합니다.
 * @param {number} postId - 북마크할 게시물의 ID
 * @returns {Promise<void>}
 */
export const toggleBookmark = async (postId) => {
    try {
        await authInstance.post("/glemoa-member/bookMark/doBookMark", { postId });
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        throw error; // Re-throw to be handled by the caller
    }
};
