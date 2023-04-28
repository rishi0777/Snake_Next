import styles from "./index.module.scss";

const Loader = ({
  isFullScreen = false,
  fixedHeight = undefined,
}: {
  isFullScreen?: boolean;
  fixedHeight?: number;
}) => {
  return (
    <div
      className={`${styles.container} ${
        isFullScreen && styles.loader_container_full_screen
      } ${fixedHeight && styles.loader_container_fixed_height}`}
      style={{ ["--container-height" as string]: fixedHeight }}
    >
      <div className={styles.loader}>
        <div className={styles.division}></div>
        <div className={styles.division}></div>
        <div className={styles.division}></div>
        <div className={styles.division}></div>
      </div>
    </div>
  );
};

export default Loader;
