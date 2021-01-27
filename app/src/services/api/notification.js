import apiCall from "./helper";

// Mark as viewed
export const markAsViewed = async username => {
  try {
    return await apiCall("patch", "/user/notifications/markAsViewed", {
      username,
    });
  } catch (error) {
    return { error };
  }
};
