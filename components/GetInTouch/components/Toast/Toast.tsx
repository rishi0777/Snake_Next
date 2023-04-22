import styles from "./index.module.scss";

export type ToastProps = {
  containerClass?: string;
  messageClass?: string;
  color?: ColorVariant;
  message: string;
};

type ColorTypes = "FAILURE" | "SUCCESS" | "DEFAULT" | "DANGER";
export type ColorVariant = "failure" | "success" | "default" | "danger";
export const COLOR_TYPES: Record<ColorTypes, ColorVariant> = {
  FAILURE: "failure",
  SUCCESS: "success",
  DANGER: "danger",
  DEFAULT: "default",
};

const Toast = ({
  containerClass,
  messageClass,
  message,
  color = COLOR_TYPES.DEFAULT,
}: ToastProps) => {
  const colorScheme: Record<ColorVariant, string> = {
    default: "#8197a4",
    failure: "#8197a4",
    success: "#1399de",
    danger: "red",
  };

  return (
    <div
      className={`${styles.container} ${containerClass}`}
      style={{ ["--text-color" as string]: colorScheme[color] }}
    >
      <span className={messageClass}>{message}</span>
    </div>
  );
};

export default Toast;
