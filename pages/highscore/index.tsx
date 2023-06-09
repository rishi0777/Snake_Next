import { useEffect, useRef, useState } from "react";
import { PacFont, HaloFont } from "@lib/fonts";
import { buttonPressPlaybackTime } from "@lib/constant";
import Button from "@components/Button";
import { UserData } from "@lib/types";
import { getUserDataFromAPI } from "@lib/helper/getUserData";
import Head from "next/head";
import Image from "next/image";
import backgroundImage from "@public/assets/images/background_high.png";

import styles from "./index.module.scss";
import Loader from "@components/Loader";

const Highscore = ({}: {}) => {
  const backgroundMusic = useRef<HTMLAudioElement>(null);
  const buttonPress = useRef<HTMLAudioElement>(null);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [usersData, setUsersData] = useState<UserData[] | undefined>(undefined);

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

  useEffect(() => {
    if (usersData != undefined) {
      const timer = setTimeout(() => setIsLoading(false), 2000);

      return () => clearTimeout(timer);
    }
  }, [usersData]);

  return (
    <>
      <Head>
        <title>Snake Mania</title>
        <meta
          name="description"
          content="Snake game created on next js with authentication feature"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.image_container}>
        <Image
          src={backgroundImage}
          alt="background_image"
          fill
          placeholder="blur"
        />
      </div>

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
            <div className={`${styles.heading} ${HaloFont?.className}`}>
              RANK
            </div>
            <div className={`${styles.heading} ${HaloFont?.className}`}>
              NAME
            </div>
            <div className={`${styles.heading} ${HaloFont?.className}`}>
              SCORE
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className={styles.player_table}>
              {usersData?.map((user: UserData, idx: number) => {
                return (
                  <div key={idx} className={styles.player_info}>
                    <div
                      className={`${styles.description} ${HaloFont?.className}`}
                    >
                      {idx + 1}
                    </div>
                    <div
                      className={`${styles.description} ${HaloFont?.className}`}
                    >
                      {user.name}
                    </div>
                    <div
                      className={`${styles.description} ${HaloFont?.className}`}
                    >
                      {user.score}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Highscore;
