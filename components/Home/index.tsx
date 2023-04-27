import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import { BsGoogle } from "react-icons/bs";
import { RxDoubleArrowRight } from "react-icons/rx";
import Modal from "../Modal";
import { DebugFont, PacFont } from "@lib/fonts";
import { buttonPressPlaybackTime } from "@lib/constant";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleAuthProvider } from "@lib/config";
import { useAuthState } from "react-firebase-hooks/auth";

import styles from "./index.module.scss";

const Home = ({
  setEmail,
  setUsername,
  setGameStarted,
}: {
  setEmail: (value: string | undefined) => void;
  setUsername: (value: string | undefined) => void;
  setGameStarted: (val: boolean) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAuthenticationFormOpen, setIsAuthenticationFormOpen] =
    useState<boolean>(false);
  const [logoutFormOpen, setLogoutFormOpen] = useState<boolean>(false);
  const backgroundMusic = useRef<HTMLAudioElement>(null);
  const buttonPress = useRef<HTMLAudioElement>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    backgroundMusic?.current?.play();
    if (loading) {
    } else if (user) {
      // console.log(
      //   "username--> logged in",
      //   auth?.currentUser?.displayName?.split(" ")[0]
      // );
      setAuthenticated(true);
      setEmail(user?.email || "");
      setUsername(user?.displayName?.split(" ")[0]);
    } else if (error) {
    }
  }, [user, loading, error]);

  const pressedButton = () => {
    backgroundMusic?.current?.pause();
    buttonPress?.current?.play();
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

  const pressedStart = () => {
    pressedButton();
    setTimeout(() => {
      if (!authenticated) setIsAuthenticationFormOpen(true);
      else setLogoutFormOpen(true);
    }, buttonPressPlaybackTime);
  };

  const pressedSignInWithGoogle = async () => {
    pressedButton();
    setTimeout(async () => {
      try {
        await signInWithPopup(auth, googleAuthProvider).then((res) => {
          const user = res.user;
          setUsername(user?.displayName?.split(" ")[0] || undefined);
          setEmail(user?.email || undefined);
          setGameStarted(true);
        });
      } catch (err) {}
    }, buttonPressPlaybackTime);
  };

  const pressedLogout = async () => {
    pressedButton();
    setTimeout(async () => {
      try {
        await signOut(auth);
        setUsername(undefined);
        setEmail(undefined);
        setAuthenticated(false);
        setLogoutFormOpen(false);
      } catch (err) {
        console.log(err);
      }
    }, buttonPressPlaybackTime);
  };

  const pressedProceed = () => {
    pressedButton();
    setTimeout(() => {
      if (authenticated) {
        setGameStarted(true);
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
          title="OOPS"
          message="Some error occurred"
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

        {/* Game Buttons */}
        {!isAuthenticationFormOpen && !logoutFormOpen && (
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

        {/* Sign in with google */}
        {isAuthenticationFormOpen && !authenticated && !logoutFormOpen && (
          <div className={styles.authentication_container}>
            <div
              className={`${styles.text} ${styles.danger} ${PacFont?.className}`}
            >
              NOT AUTHENTICATED
            </div>
            <div className={`${styles.text} ${DebugFont?.className}`}>
              PLEASE SIGN IN FIRST
            </div>
            <Button
              variant="game"
              size="medium"
              icon={<BsGoogle />}
              text="SIGN IN"
              onClick={pressedSignInWithGoogle}
            />
          </div>
        )}

        {/* Logout Buttons */}
        {logoutFormOpen && !isAuthenticationFormOpen && (
          <div className={styles.authentication_container}>
            <div
              className={`${styles.text} ${styles.danger} ${PacFont?.className}`}
            >
              LOGIN x LOGOUT
            </div>
            <div className={`${styles.text} ${DebugFont?.className}`}>
              Continue with same user or signout
            </div>
            <div className={styles.logout_buttons}>
              <Button
                variant="game"
                size="medium"
                icon={<RxDoubleArrowRight />}
                text="Proceed"
                onClick={pressedProceed}
              />
              <Button
                variant="game"
                size="medium"
                icon={<BsGoogle />}
                text="Sign out"
                onClick={pressedLogout}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
