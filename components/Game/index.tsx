import { IomanoidFont, PacFont } from "@lib/fonts";
import styles from "./index.module.scss";
import { useEffect, useRef, useState } from "react";
import Modal from "@components/Modal";

const Game = ({ username }: { username: string }) => {
  const board_ref = useRef<HTMLDivElement>(null);
  const score_label_ref = useRef<HTMLDivElement>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [mainScreenMessage, setMainScreenMessage] = useState<string>(
    " 111 pRESS sPACE kEY tO sTART tHE gAME tHEN uSE aRROW kEYS tO mOVE tHE sNAKE oTHER kEYS aRE nOT aLLOWED CrEdIt RiShI MiShRa 111"
  );

  // Game Constants & Variables
  // const foodSound = new Audio("music/food.mp3");
  // const gameOverSound = new Audio("music/gameover.wav");
  // const musicSound = new Audio("music/music.mp3");

  // const user_details_form = document.querySelector("#user_details_form");
  // const set_form_user_name = document.querySelector("#form_user");
  // const set_form_score = document.querySelector("#form_score");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // var username = localStorage.getItem("username");
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
      // musicSound.pause();
      // gameOverSound.currentTime = 0; /*making the game over sound to start again if it has played before got paused due to some reason*/
      // gameOverSound.play();
      inputDir = { x: 0, y: 0 };
      // image_cnt.style.background = "url('img/gameOver.png')";
      // image_cnt.style.backgroundSize = "100% 100%";
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
      // foodSound.play();
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
    if (board_ref.current) board_ref.current.innerHTML = "";
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
      if (board_ref.current) board_ref.current.appendChild(snakeElement);
    });
    // Display the food
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y.toString();
    foodElement.style.gridColumnStart = food.x.toString();
    foodElement.classList.add(styles.food);
    if (board_ref.current) board_ref.current.appendChild(foodElement);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////Main Logic
  // musicSound.play();
  // image_cnt.style.background = "url('img/snake.png')";
  // image_cnt.style.backgroundSize = "100% 100%";

  const gameInit = (e: KeyboardEvent) => {
    if (!isAlertModalOpen && !isConfirmModalOpen) {
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
  }, [isAlertModalOpen, isConfirmModalOpen]);

  return (
    <>
      <Modal
        title={modalTitle}
        message={modalMessage}
        modalVariant={{
          variant: "confirm",
          buttonText: { yes: "Restart", no: "Home" },
          buttonCallback: {
            yes: () => {
              // gameOverSound.pause();
              // image_cnt.style.background = "url('img/snake.png')";
              // image_cnt.style.backgroundSize = "100% 100%";

              setMainScreenMessage(
                " 111 pRESS sPACE kEY tO sTART tHE gAME tHEN uSE aRROW kEYS tO mOVE tHE sNAKE oTHER kEYS aRE nOT aLLOWED" +
                  " CrEdIt RiShI MiShRa 111"
              );

              // musicSound.play();
              setScore(0);
              console.log("restart");
            },
            no: () => {
              //submit userDetails on firestore-> score & username
              //redirect to home page
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
            <div ref={board_ref} className={styles.board}></div>
          )}
        </div>

        <div className={styles.side_block}>
          <div></div>

          <div
            ref={score_label_ref}
            className={`${styles.score_label} ${PacFont?.className}`}
          >
            sCORE
            <div className={`${styles.score} ${IomanoidFont?.className}`}>
              {score}
            </div>
          </div>
          <div className={styles.image_container}></div>
        </div>
      </div>
    </>
  );
};

export default Game;
