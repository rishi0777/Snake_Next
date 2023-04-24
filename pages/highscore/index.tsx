import { useEffect, useRef } from "react";
import { TfiControlBackward } from "react-icons/tfi";
import { PacFont, HaloFont } from "@lib/fonts";
import { buttonPressPlaybackTime } from "@lib/constant";
import background from "@public/assets/images/background_high.png";
import Image from "next/image";

import styles from "./index.module.scss";
import Button from "@components/Button";

const Highscore = ({}: {}) => {
  const backgroundMusic = useRef<HTMLAudioElement>(null);
  const buttonPress = useRef<HTMLAudioElement>(null);

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

  return (
    <div className={styles.container}>
      <audio ref={backgroundMusic} src="/assets/music/highscore.mp3" />
      <audio ref={buttonPress} src="/assets/music/pressed.mp3" />

      {/* <div className={styles.image_container}>
        <Image src={background?.src} alt="highscore background" fill />
      </div> */}

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
          <div className={styles.player_info}>
            <div className={`${styles.description} ${HaloFont?.className}`}>
              Number
            </div>
            <div className={`${styles.description} ${HaloFont?.className}`}>
              Name
            </div>
            <div className={`${styles.description} ${HaloFont?.className}`}>
              Score
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Highscore;
