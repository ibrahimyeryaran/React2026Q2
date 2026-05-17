import { Component } from "react";
import type { ErrorBoundaryProps, ErrorBoundaryState } from "../../types";
import Button from "../Button/Button";
import styles from "./ErrorBoundary.module.css";

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Something went wrong!</h2>
          <p className={styles.errorMessage}>{this.state.errorMessage}</p>
          <Button onClick={this.handleReset}>Reload Page</Button>
        </div>
      );
    }
    return this.props.children ?? null;
  }
}

export default ErrorBoundary;
