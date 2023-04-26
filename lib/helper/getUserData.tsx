import { highscoreCollectionRef } from "@lib/constant";
import { UserData } from "@lib/types";
import { getDocs, orderBy, query } from "firebase/firestore";

export const getUserDataFromAPI = async () => {
  try {
    const usersDataResponse = query(
      highscoreCollectionRef,
      orderBy("score", "desc")
    );
    const querySnapshot = await getDocs(usersDataResponse);
    const uData: UserData[] =
      querySnapshot.docs.map((user) => user.data() as UserData) || [];
    return uData;
  } catch (err) {
    console.log("Firebase Error->", err);
    // return [] as UserData;
  }
};
