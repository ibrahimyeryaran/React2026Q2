import styles from './Loader.module.css';

export function Loader({ label }: { label: string }) {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner} />
      <p className={styles.loaderText}>{label}</p>
    </div>
  );
}
