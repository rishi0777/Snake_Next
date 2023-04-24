import styles from "./index.module.scss";

type ButtonVariant = "back" | "game";
type Size = "large" | "medium" | "small";

type ButtonProps = {
  text?: string;
  size: Size;
  variant: ButtonVariant;
  onClick: () => void;
};

const Button = ({ text, size, variant, onClick }: ButtonProps) => {
  const back_button_size_class =
    size === "small"
      ? styles.small
      : size === "medium"
      ? styles.medium
      : styles.large;

  const game_button_size_class =
    size === "small"
      ? styles.button_small
      : size === "medium"
      ? styles.button_medium
      : styles.button;

  return variant === "game" ? (
    <button
      className={`${game_button_size_class}`}
      role="button"
      onClick={onClick}
    >
      {text}
    </button>
  ) : (
    <div className={styles.back_button_container} role="button" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 17"
        className={`${styles.wrapper} ${back_button_size_class}`}
        version="1.1"
      >
        <g transform="translate(8.500000, 8.500000) scale(-1, 1) translate(-8.500000, -8.500000)">
          <polygon
            className={`${styles.polygon} ${styles.arrow}`}
            points="16.3746667 8.33860465 7.76133333 15.3067621 6.904 14.3175671 14.2906667 8.34246869 6.908 2.42790698 7.76 1.43613596"
          ></polygon>
          <polygon
            className={`${styles.polygon} ${styles.arrow_fixed}`}
            points="16.3746667 8.33860465 7.76133333 15.3067621 6.904 14.3175671 14.2906667 8.34246869 6.908 2.42790698 7.76 1.43613596"
          ></polygon>
          <path
            className={`${styles.path}`}
            d="M-1.48029737e-15,0.56157424 L-1.48029737e-15,16.1929159 L9.708,8.33860465 L-2.66453526e-15,0.56157424 L-1.48029737e-15,0.56157424 Z M1.33333333,3.30246869 L7.62533333,8.34246869 L1.33333333,13.4327013 L1.33333333,3.30246869 L1.33333333,3.30246869 Z"
          ></path>
        </g>
      </svg>
    </div>
  );
};

export default Button;
