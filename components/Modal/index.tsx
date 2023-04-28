import Image from "next/image";
import done from "@public/assets/images/done.gif";
import try_again from "@public/assets/images/try_again.gif";
import game_over from "@public/assets/images/game_over.png";

import styles from "./index.module.scss";

type ModalVariant = {
  variant: string;
  buttonText: { ok?: string; yes?: string; no?: string };
  buttonCallback: { ok?: () => void; yes?: () => void; no?: () => void };
};

type ModalState = "success" | "failure" | "gameOver";

type ModalProps = {
  title: string;
  message: string;
  modalState: ModalState;
  modalVariant: ModalVariant;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
};

const Modal = ({
  modalState,
  title,
  message,
  modalVariant,
  isOpen,
  setIsOpen,
}: ModalProps) => {
  const textColor = modalState === "success" ? "#10ab8b" : "#d74646";

  const pressedOk = () => {
    setIsOpen(false);
    modalVariant?.buttonCallback?.ok && modalVariant?.buttonCallback?.ok();
  };

  const pressedYes = () => {
    setIsOpen(false);
    modalVariant?.buttonCallback?.yes && modalVariant?.buttonCallback?.yes();
  };

  const pressedNo = () => {
    setIsOpen(false);
    modalVariant?.buttonCallback?.no && modalVariant?.buttonCallback?.no();
  };

  return isOpen ? (
    <div
      className={styles.modal_container}
      style={{ ["--text-color" as string]: textColor }}
    >
      <div
        className={styles.modal}
        style={{ ["--game-over-padding" as string]: "30px" }}
      >
        <div className={styles.image_container}>
          <Image
            alt="snake_image"
            fill
            src={
              modalState === "success"
                ? done
                : modalState === "failure"
                ? try_again
                : game_over
            }
            placeholder="blur"
          />
        </div>

        <div className={styles.content}>
          <div className={styles.modal_head}>{title}</div>
          <div className={styles.modal_body}>{message}</div>

          {modalVariant?.variant === "alert" ? (
            <div className={styles.alert_buttons}>
              <button
                className={`${styles.btn_alert}`}
                role="button"
                onClick={pressedOk}
              >
                {modalVariant?.buttonText?.ok}
              </button>
            </div>
          ) : (
            <div className={styles.confirm_buttons}>
              <button
                className={`${styles.btn_confirm_yes}`}
                role="button"
                onClick={pressedYes}
              >
                {modalVariant?.buttonText?.yes}
              </button>
              <div></div>
              <button
                className={`${styles.btn_confirm_no}`}
                role="button"
                onClick={pressedNo}
              >
                {modalVariant?.buttonText?.no}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Modal;
