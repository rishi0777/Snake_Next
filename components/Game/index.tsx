import { DebugFont, IomanoidFont, PacFont } from "@lib/fonts";
import { useEffect, useRef, useState } from "react";
import Modal from "@components/Modal";
import { getUserDataFromAPI } from "@lib/helper/getUserData";
import { UserData } from "@lib/types";
import Confetti from "@components/Confetti/Confetti";
import { highscoreCollectionRef } from "@lib/constant";
import { addDoc } from "firebase/firestore";
import { GiCrownedSkull } from "react-icons/gi";

import styles from "./index.module.scss";

const Game = ({ username }: { username: string }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const scoreLabelRef = useRef<HTMLDivElement>(null);
  const currentUserRef = useRef<HTMLDivElement>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [mainScreenMessage, setMainScreenMessage] = useState<string>(
    " 111 pRESS sPACE kEY tO sTART tHE gAME tHEN uSE aRROW kEYS tO mOVE tHE sNAKE oTHER kEYS aRE nOT aLLOWED CrEdIt RiShI MiShRa 111"
  );
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const backgroundMusic = useRef<HTMLAudioElement>(null);
  const foodEatenMusic = useRef<HTMLAudioElement>(null);
  const gameOverMusic = useRef<HTMLAudioElement>(null);
  const [topThreeUser, setTopThreeUser] = useState<UserData[]>([]);
  const [thirdPositionAchieved, setThirdPositionAchieved] = useState(false);
  const [secondPositionAchieved, setSecondPositionAchieved] = useState(false);
  const [firstPositionAchieved, setFirstPositionAchieved] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Game Constants & Variables
  const topScorerClass = new Map<number, string>();
  topScorerClass.set(0, styles.first);
  topScorerClass.set(1, styles.second);
  topScorerClass.set(2, styles.third);
  let inputDir = { x: 0, y: 0 };
  let fps = 12;
  let lastPaintTime = 0;
  let snakeArr = [{ x: 14, y: 16 }];
  let food = { x: 17, y: 19 };
  let prev_key: any;
  let start = false;
  let currently_playing = false;

  //For running game loop
  const main = (ctime: any) => {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / fps) {
      return;
    } else if (currently_playing) {
      lastPaintTime = ctime;
      gameEngine();
    }
  };

  //function for checking if snake got bumped into wall or into itself
  function isCollide(snake: any) {
    // If you bump into yourself
    for (let i = 1; i < snakeArr.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
        return true;
      }
    }
    // If you bump into the wall
    if (
      snake[0].x >= 38 ||
      snake[0].x <= 0 ||
      snake[0].y >= 21 ||
      snake[0].y <= 0
    ) {
      return true;
    }
    return false;
  }

  //function which actually executes the game
  function gameEngine() {
    // Part 1: Updating the snake array & Food

    if (isCollide(snakeArr)) {
      //checking if snake got bumped into wall or into itself
      backgroundMusic?.current?.pause();
      /*making the game over sound to start again if it has played before got paused due to some reason*/
      gameOverMusic?.current?.play();
      if (gameOverMusic?.current?.currentTime)
        gameOverMusic.current.currentTime = 0;

      inputDir = { x: 0, y: 0 };
      currently_playing = false;
      start = false;
      setGameStarted(false);
      setModalTitle("Game Over");
      setModalMessage("Do you want to try again!");
      setMainScreenMessage("999 gAME oVER 999");
      setIsConfirmModalOpen(true);
      snakeArr = [{ x: 13, y: 15 }];
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
      foodEatenMusic?.current?.play();
      setScore((val) => val + 1);
      snakeArr.unshift({
        x: snakeArr[0].x + inputDir.x,
        y: snakeArr[0].y + inputDir.y,
      });
      let a = 2;
      let b = 19;
      let c = 28;
      food = {
        x: Math.round(a + (c - a) * Math.random()),
        y: Math.round(a + (b - a) * Math.random()),
      };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
      //we have to remove referrence problem that's why we have destructured our array
      //and created a whole new object and we have not put like this or else our snake will not move
      //due to same refernce all our block pointer of snake will point to same object
      //snakeArr[i+1]=snakeArr[i];
      snakeArr[i + 1] = { ...snakeArr[i] };
    }
    //moving the snake on key press
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    if (boardRef.current) boardRef.current.innerHTML = "";
    snakeArr.forEach((e, index) => {
      let snakeElement = document.createElement("div");
      snakeElement.style.gridRowStart = e.y.toString(); //since row of block will be y co-ordinate
      snakeElement.style.gridColumnStart = e.x.toString(); //since column of block will be x co-ordinate

      if (index === 0) {
        //we have to display the first block that is mouth of snake
        snakeElement.classList.add(styles.head);
      } else {
        //tail of snake
        snakeElement.classList.add(styles.snake);
      }
      if (boardRef.current) boardRef.current.appendChild(snakeElement);
    });
    // Display the food
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y.toString();
    foodElement.style.gridColumnStart = food.x.toString();
    foodElement.classList.add(styles.food);
    if (boardRef.current) boardRef.current.appendChild(foodElement);
  }

  //game initializer and eventListener for arrow buttons
  const gameInit = (e: KeyboardEvent) => {
    if (!isAlertModalOpen && !isConfirmModalOpen && !loading) {
      if (!currently_playing) {
        if (e.code === "Space") {
          inputDir.x = 1;
          inputDir.y = 0;
          setGameStarted(true);
          currently_playing = true;
          window.requestAnimationFrame(main);
        } else {
          setModalTitle("WARNING");
          setModalMessage("PRESS SPACE KEY ONLY");
          setIsAlertModalOpen(true);
        }
      } else if (currently_playing && !start) {
        if (e.key === "ArrowUp") {
          inputDir.x = 0;
          inputDir.y = -1;
          prev_key = e.key;
          start = true;
        } else if (e.key === "ArrowDown") {
          inputDir.x = 0;
          inputDir.y = 1;
          prev_key = e.key;
          start = true;
        } else if (e.key === "ArrowLeft") {
          inputDir.x = -1;
          inputDir.y = 0;
          prev_key = e.key;
          start = true;
        } else if (e.key === "ArrowRight") {
          inputDir.x = 1;
          inputDir.y = 0;
          prev_key = e.key;
          start = true;
        }
      } else if (currently_playing && start) {
        if (prev_key != "ArrowDown" && e.key === "ArrowUp") {
          inputDir.x = 0;
          inputDir.y = -1;
          prev_key = e.key;
        } else if (prev_key != "ArrowUp" && e.key === "ArrowDown") {
          inputDir.x = 0;
          inputDir.y = 1;
          prev_key = e.key;
        } else if (prev_key != "ArrowRight" && e.key === "ArrowLeft") {
          inputDir.x = -1;
          inputDir.y = 0;
          prev_key = e.key;
        } else if (prev_key != "ArrowLeft" && e.key === "ArrowRight") {
          inputDir.x = 1;
          inputDir.y = 0;
          prev_key = e.key;
        }
      }
    }
  };

  useEffect(() => {
    window?.addEventListener("keydown", gameInit);
    return () => {
      window.removeEventListener("keydown", gameInit);
    };
  }, [isAlertModalOpen, isConfirmModalOpen, loading]);

  useEffect(() => {
    backgroundMusic?.current?.play();
    getUserDataFromAPI()
      .then((userDataResponse) => {
        if (userDataResponse && userDataResponse?.length > 0)
          setTopThreeUser(userDataResponse.slice(0, 3));
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    let animationTimer: ReturnType<typeof setTimeout> | null = null;

    if (score >= topThreeUser[0]?.score) {
      if (thirdPositionAchieved && secondPositionAchieved) {
        // console.log("first -> both true");
        currentUserRef?.current?.classList?.add(styles.move_up_again);
      } else if (thirdPositionAchieved) {
        // console.log("first -> one true");
        currentUserRef?.current?.classList?.add(styles.move_up);
        animationTimer = setTimeout(() => {
          currentUserRef?.current?.classList?.add(styles.move_up_again);
        }, 1700);
      } else {
        // console.log("first -> both false");
        currentUserRef?.current?.classList?.add(styles.show_player_name);
        let timesRun = 0;
        animationTimer = setInterval(() => {
          timesRun += 1;
          if (timesRun == 1) {
            currentUserRef?.current?.classList?.add(styles.move_up);
          } else {
            currentUserRef?.current?.classList?.add(styles.move_up_again);
          }
          if (timesRun == 2) animationTimer && clearInterval(animationTimer);
        }, 1700);
      }
      setFirstPositionAchieved(true);
    } else if (!secondPositionAchieved && score >= topThreeUser[1]?.score) {
      if (thirdPositionAchieved) {
        //console.log("second -> thirdPositionAchieved true");
        currentUserRef?.current?.classList?.add(styles.move_up);
      } else {
        //console.log("second -> thirdPositionAchieved false");
        currentUserRef?.current?.classList?.add(styles.show_player_name);
        animationTimer = setTimeout(() => {
          currentUserRef?.current?.classList?.add(styles.move_up);
        }, 1700);
      }
      setThirdPositionAchieved(true);
      setSecondPositionAchieved(true);
    } else if (!thirdPositionAchieved && score >= topThreeUser[2]?.score) {
      currentUserRef?.current?.classList?.add(styles.show_player_name);
      setThirdPositionAchieved(true);
    }

    return animationTimer
      ? () => {
          animationTimer && clearTimeout(animationTimer);
        }
      : () => {};
  }, [score]);

  return (
    <>
      <audio
        ref={backgroundMusic}
        src="/assets/music/game.mp3"
        autoPlay={true}
        loop={true}
      />
      <audio ref={foodEatenMusic} src="/assets/music/food.mp3" />
      <audio ref={gameOverMusic} src="/assets/music/gameover.wav" />
      <Modal
        title={modalTitle}
        message={modalMessage}
        modalVariant={{
          variant: "confirm",
          buttonText: { yes: "Restart", no: "Home" },
          buttonCallback: {
            yes: () => {
              setLoading(true);
              setMainScreenMessage(" Loading ");
              console.log(currentUserRef?.current?.className);
              currentUserRef?.current?.classList?.remove(
                styles.move_up_again,
                styles.move_up,
                styles.show_player_name
              );
              setScore(0);
              gameOverMusic?.current?.pause();
              if (backgroundMusic?.current?.currentTime)
                backgroundMusic.current.currentTime = 0;
              backgroundMusic?.current?.play();

              let timesExecuted = 0,
                dots = "";
              const dotLoaderAnimation = setInterval(() => {
                dots += ".";
                setMainScreenMessage(" Loading " + dots);
                if (dots === "...") dots = "";
                timesExecuted += 1;
                if (timesExecuted == 9) clearInterval(dotLoaderAnimation);
              }, 300);

              setTimeout(() => {
                setMainScreenMessage(
                  " 111 pRESS sPACE kEY tO sTART tHE gAME tHEN uSE aRROW kEYS tO mOVE tHE sNAKE oTHER kEYS aRE nOT aLLOWED" +
                    " CrEdIt RiShI MiShRa 111"
                );
                setFirstPositionAchieved(false);
                setSecondPositionAchieved(false);
                setThirdPositionAchieved(false);
                setLoading(false);
              }, 3000);
            },
            no: async () => {
              await addDoc(highscoreCollectionRef, {
                name: username?.toUpperCase(),
                score: score,
              });
              open("/", "_self");
              console.log("home");
            },
          },
        }}
        modalState="gameOver"
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
      />

      <Modal
        title={modalTitle}
        message={modalMessage}
        modalVariant={{
          variant: "alert",
          buttonText: { ok: "OK" },
          buttonCallback: {
            ok: () => {
              console.log("ok");
            },
          },
        }}
        modalState="failure"
        isOpen={isAlertModalOpen}
        setIsOpen={setIsAlertModalOpen}
      />

      <div className={`${styles.main}`}>
        <div className={styles.game_area}>
          {gameStarted == false ? (
            <div
              className={`${styles.ask_to_press_key_cnt} ${PacFont?.className}`}
            >
              {mainScreenMessage}
            </div>
          ) : (
            <div ref={boardRef} className={styles.board}></div>
          )}
        </div>

        <div className={styles.side_block}>
          <div
            ref={scoreLabelRef}
            className={`${styles.score_label} ${PacFont?.className}`}
          >
            sCORE
            <div className={`${styles.score} ${IomanoidFont?.className}`}>
              {score}
            </div>
          </div>

          {topThreeUser?.length > 0 && (
            <div className={styles.top_scorers}>
              {thirdPositionAchieved && <Confetti />}
              {secondPositionAchieved && <Confetti />}
              {firstPositionAchieved && <Confetti />}
              <div
                ref={currentUserRef}
                className={`${styles.current_player_info}`}
              >
                <div
                  className={`${DebugFont?.className} ${styles.crown_holder}`}
                >
                  {firstPositionAchieved && <GiCrownedSkull color="#FFF" />}
                  {username}
                </div>
                <div className={`${DebugFont?.className}`}>{score}</div>
              </div>
              {topThreeUser?.map((user: UserData, idx: number) => {
                return (
                  <div
                    key={idx}
                    className={`${topScorerClass.get(idx)} ${
                      styles.player_info
                    } `}
                  >
                    <div
                      className={`${DebugFont?.className} ${styles.crown_holder}`}
                    >
                      {idx === 0 && <GiCrownedSkull color="goldenrod" />}
                      {user.name}
                    </div>
                    <div className={`${DebugFont?.className}`}>
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

export default Game;
