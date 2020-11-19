import apiCall from "./helper";
import { getAuth } from "../../utils/utils";

// Mark as viewed
export const markAsViewed = async username => {
  const auth = await getAuth();
  //   const username = auth.username;
  try {
    return await apiCall("post", "/user/notifications/markAsViewed", {
      username,
    });
  } catch (error) {
    return { error };
  }
};
