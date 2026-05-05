import { Component } from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

class Button extends Component<ButtonProps> {
  render() {
    const { onClick, children } = this.props;
    return (
      <button className={styles.button} onClick={onClick}>
        {children}
      </button>
    );
  }
}

export default Button;
