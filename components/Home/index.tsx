import React, { useEffect, useRef, useState } from "react";

import styles from "./index.module.scss";
import Button from "../Button";
import Modal from "../Modal";
import { DebugFont, PacFont, HaloFont } from "@lib/fonts";
import { buttonPressPlaybackTime } from "@lib/constant";

const Home = ({
  username,
  setUsername,
  setGameStarted,
}: {
  username: string | undefined;
  setUsername: (value: string) => void;
  setGameStarted: (val: boolean) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const backgroundMusic = useRef<HTMLAudioElement>(null);
  const buttonPress = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    backgroundMusic?.current?.play();
  }, []);

  const pressedButton = () => {
    backgroundMusic?.current?.pause();
    buttonPress?.current?.play();
  };

  const pressedStart = () => {
    pressedButton();
    setTimeout(() => {
      setIsFormOpen(true);
    }, buttonPressPlaybackTime);
  };

  const pressedHighscore = () => {
    pressedButton();
    setTimeout(() => {
      open("/highscore", "_self");
    }, buttonPressPlaybackTime);
  };

  const pressedAbout = () => {
    pressedButton();
    setTimeout(() => {
      open("https://rishi-mishra.netlify.app/", "_self");
    }, buttonPressPlaybackTime);
  };

  const pressedProceed = () => {
    pressedButton();
    setTimeout(() => {
      if (username) {
        setGameStarted(true);
      } else {
        setIsModalOpen(true);
      }
    }, buttonPressPlaybackTime);
  };

  return (
    <div className={styles.container}>
      <audio ref={backgroundMusic} src="/assets/music/main.mp3" />
      <audio ref={buttonPress} src="/assets/music/pressed.mp3" />

      <div className={styles.not_available_on_phone}>
        <h1 className={`${styles.h1} ${PacFont?.className}`}>iNsTrUcTiOn</h1>
        <div className={`${DebugFont?.className} ${styles.p} `}>
          To play the game you must use a laptop. Not available on other devices
          like phones or tablets.
          <br />
          Contact{" "}
          <a
            className={`${styles.anchor}`}
            href="https://mail.google.com/mail/u/0/?fs=1&to=rishimishra244@gmail.com&su=Support_Snake_Mania&body=&bcc=&tf=cm"
          >
            <span className={DebugFont?.className}>rishi mishra</span>
          </a>
        </div>
      </div>

      <div className={styles.main}>
        <Modal
          title="WARNING"
          message="Please provide your name"
          modalVariant={{
            variant: "alert",
            buttonText: { ok: "OK" },
            buttonCallback: {
              ok: () => {},
            },
          }}
          modalState="failure"
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
        />

        {!isModalOpen && !isFormOpen && (
          <div className={styles.button_container}>
            <Button
              variant="game"
              size="large"
              text=" START"
              onClick={pressedStart}
            />

            <Button
              variant="game"
              size="large"
              text="HIGH SCORE"
              onClick={pressedHighscore}
            />

            <Button
              variant="game"
              size="large"
              text="ABOUT"
              onClick={pressedAbout}
            />
          </div>
        )}
        {!isModalOpen && isFormOpen && (
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
            }}
            autoComplete="off"
          >
            <h1 className={`${styles.h1} ${PacFont?.className}`}>YOUR NAME</h1>
            <input
              className={`${styles.input} ${HaloFont?.className}`}
              type="text"
              placeholder="WRITE HERE"
              value={username}
              onChange={(e) => setUsername(e.target.value.toUpperCase())}
            />
            <Button
              variant="game"
              size="medium"
              text="PROCEED"
              onClick={pressedProceed}
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default Home;
