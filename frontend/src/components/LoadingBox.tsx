import styles from "../styles/components/LoadingBox.module.css";

interface LoadingProps {
  text?: string;
}

export function LoadingBox({ text }: LoadingProps) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.shadow}></div>
        <div className={styles.shadow}></div>
        <div className={styles.shadow}></div>
        <span>{text ? text : "Carregando..."}</span>
      </div>
    </div>
  );
}
