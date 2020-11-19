import apiCall from "./helper";

// Mark as viewed
export const markAsViewed = async username => {
  try {
    return await apiCall("post", "/user/notifications/markAsViewed", {
      username,
    });
  } catch (error) {
    return { error };
  }
};
