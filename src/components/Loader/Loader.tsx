import { Component } from "react";
import styles from "./Loader.module.css";

class Loader extends Component {
  render() {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner} />
        <p className={styles.loaderText}>Loading Pokémon...</p>
      </div>
    );
  }
}

export default Loader;
