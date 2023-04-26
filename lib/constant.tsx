import { collection } from "firebase/firestore";
import { db } from "./config";

export const buttonPressPlaybackTime = 1200;
export const highscoreCollectionRef = collection(db, "highscore");
