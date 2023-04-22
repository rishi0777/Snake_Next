import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import Confetti from "./components/Confetti";
import Toast, { COLOR_TYPES, ColorVariant } from "./components/Toast/Toast";
import Loader from "../../../Loader";

type InfoForToast = {
  apiSuccess: boolean;
  toastColor: ColorVariant;
  toastMessage: string;
};

const GetInTouch = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userNameMissing, setUserNameMissing] = useState<boolean>(false);
  const [userEmailMissing, setUserEmailMissing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updated, setUpdated] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [infoForToast, setInfoForToast] = useState<InfoForToast>();
  //sending email
  const sendEmail = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      sendMail();
    }
  };

  //before sending email checking that all fields are filled or not
  const validateForm = () => {
    let validate = true;
    if (userName == "") {
      setUserNameMissing(true);
      validate = false;
    } else setUserNameMissing(false);

    if (userEmail == "") {
      validate = false;
      setUserEmailMissing(true);
    } else setUserEmailMissing(false);

    return validate;
  };

  const sendMail = async () => {
    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({ username: userName, userEmail: userEmail }),
      headers: {
        "content-type": "application/json",
      },
    });

    const data = await res?.json();
    setIsLoading(false);
    if (data?.submitted) {
      setInfoForToast({
        apiSuccess: true,
        toastColor: COLOR_TYPES.SUCCESS,
        toastMessage: "Mail sent successfully!",
      });
    } else {
      setInfoForToast({
        apiSuccess: false,
        toastColor: COLOR_TYPES.FAILURE,
        toastMessage: "Sorry, some error occurrred!",
      });
    }

    setUpdated(!updated);
  };

  useEffect(() => {
    setShowToast(true);
    const timeoutId = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [updated]);

  return (
    <>
      <form ref={formRef} className={styles.contact_form} onSubmit={sendEmail}>
        <input
          className={`${styles.input_field} ${
            userNameMissing ? styles.wrong : styles.right
          }`}
          type="text"
          placeholder="Name"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
        <input
          className={`${styles.input_field} ${
            userEmailMissing ? styles.wrong : styles.right
          }`}
          type="email"
          placeholder="Email"
          value={userEmail}
          onChange={(e) => {
            setUserEmail(e.target.value);
          }}
        />
        <div className={styles.send_button_container}>
          {!isLoading && (
            <button type="submit" className={styles.submit} onClick={sendEmail}>
              Send
            </button>
          )}
          {isLoading && <Loader />}
          {!isLoading && showToast && (
            <div className={styles.toast_container}>
              <Toast
                message={infoForToast?.toastMessage || ""}
                color={infoForToast?.toastColor || COLOR_TYPES.DEFAULT}
              />
              {infoForToast?.apiSuccess && <Confetti />}
            </div>
          )}
        </div>
      </form>
      <div className={styles.success}></div>
    </>
  );
};

export default GetInTouch;
