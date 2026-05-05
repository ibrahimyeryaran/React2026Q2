import { Component } from "react";
import type { ErrorTestButtonState } from "../../types";
import styles from "./Button.module.css";

class ErrorTestButton extends Component<
  Record<string, never>,
  ErrorTestButtonState
> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      shouldThrow: false,
    };
  }

  handleThrowError = () => {
    this.setState({ shouldThrow: true });
  };

  render() {
    if (this.state.shouldThrow) {
      throw new Error(
        "Test error triggered by user! This is a simulated error for testing Error Boundary.",
      );
    }

    return (
      <button className={styles.button} onClick={this.handleThrowError}>
        Test Error Boundary
      </button>
    );
  }
}

export default ErrorTestButton;
