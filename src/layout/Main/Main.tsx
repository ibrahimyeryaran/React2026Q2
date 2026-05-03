import { Component } from "react";
import styles from "./Main.module.css";

interface MainProps {
  children: React.ReactNode;
}

class Main extends Component<MainProps> {
  render() {
    return <main className={styles.main}>{this.props.children}</main>;
  }
}

export default Main;
