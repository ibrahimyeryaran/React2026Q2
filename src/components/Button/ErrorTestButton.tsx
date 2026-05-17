import { useState } from 'react';
import styles from './Button.module.css';

function ErrorTestButton() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error(
      'Test error triggered by user! This is a simulated error for testing Error Boundary.'
    );
  }

  return (
    <button className={styles.button} onClick={() => setShouldThrow(true)}>
      Test Error Boundary
    </button>
  );
}

export default ErrorTestButton;
