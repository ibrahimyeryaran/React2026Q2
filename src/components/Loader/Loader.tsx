import styles from './Loader.module.css';

function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner} />
      <p className={styles.loaderText}>Loading Pokémon...</p>
    </div>
  );
}

export default Loader;
