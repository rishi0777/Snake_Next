import { useEffect, useRef, useState } from "react";
import { PacFont, HaloFont } from "@lib/fonts";
import { buttonPressPlaybackTime } from "@lib/constant";
import Button from "@components/Button";
import { UserData } from "@lib/types";
import { getUserDataFromAPI } from "@lib/helper/getUserData";

import styles from "./index.module.scss";

const Highscore = ({}: {}) => {
  const backgroundMusic = useRef<HTMLAudioElement>(null);
  const buttonPress = useRef<HTMLAudioElement>(null);

  const [usersData, setUsersData] = useState<UserData[] | undefined>([]);

  const goback = () => {
    backgroundMusic?.current?.pause();
    buttonPress?.current?.play();
    setTimeout(() => {
      open("/", "_self");
    }, buttonPressPlaybackTime);
  };

  useEffect(() => {
    backgroundMusic?.current?.play();
  }, []);

  useEffect(() => {
    getUserDataFromAPI()
      .then((usersDataResposnse) =>
        usersDataResposnse && usersDataResposnse?.length > 10
          ? setUsersData(usersDataResposnse.slice(0, 10))
          : setUsersData(usersDataResposnse)
      )
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={styles.container}>
      <audio
        ref={backgroundMusic}
        src="/assets/music/highscore.mp3"
        autoPlay={true}
        preload="auto"
        loop
      />
      <audio ref={buttonPress} src="/assets/music/pressed.mp3" />

      <div className={`${styles.title_container} ${PacFont?.className}`}>
        <div className={styles.back}>
          <Button size="small" variant="back" onClick={goback} />
        </div>
        <div className={styles.title}>1 HIGHSCORE 1</div>
      </div>

      <div className={styles.score_area}>
        <div className={styles.heading_container}>
          <div className={`${styles.heading} ${HaloFont?.className}`}>RANK</div>
          <div className={`${styles.heading} ${HaloFont?.className}`}>NAME</div>
          <div className={`${styles.heading} ${HaloFont?.className}`}>
            SCORE
          </div>
        </div>

        <div className={styles.player_table}>
          {usersData?.map((user: UserData, idx: number) => {
            return (
              <div key={idx} className={styles.player_info}>
                <div className={`${styles.description} ${HaloFont?.className}`}>
                  {idx + 1}
                </div>
                <div className={`${styles.description} ${HaloFont?.className}`}>
                  {user.name}
                </div>
                <div className={`${styles.description} ${HaloFont?.className}`}>
                  {user.score}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Highscore;
