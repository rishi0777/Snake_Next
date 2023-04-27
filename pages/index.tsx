import Highscore from "pages/highscore";
import Head from "next/head";
import Home from "@components/Home";
import Image from "next/image";
import { useState } from "react";
import Game from "@components/Game";
import styles from "./index.module.scss";
import Modal from "@components/Modal";

export default function Main() {
  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main_container}>
        {/* <Game username={username || "sdf"} /> */}
        {!gameStarted ? (
          <Home
            setUsername={setUsername}
            setEmail={setEmail}
            setGameStarted={setGameStarted}
          />
        ) : username ? (
          <Game username={username} />
        ) : (
          <Modal
            title="OOPS..."
            message="Something went wrong. Let's try again!"
            modalVariant={{
              variant: "alert",
              buttonText: { ok: "OK" },
              buttonCallback: {
                ok: () => {
                  setGameStarted(false);
                  setIsOpen(true);
                },
              },
            }}
            modalState="failure"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}
      </div>
    </>
  );
}
