import { useRouteError, useNavigate } from 'react-router-dom';
import styles from './ErrorBoundary.module.css';

function RouteErrorFallback() {
  const error = useRouteError();
  const navigate = useNavigate();

  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred.';

  return (
    <div className={styles.errorContainer}>
      <h2 className={styles.errorTitle}>Something went wrong!</h2>
      <p className={styles.errorMessage}>{message}</p>
      <button className={styles.reloadButton} onClick={() => navigate('/1')}>
        Go to Home
      </button>
    </div>
  );
}

export default RouteErrorFallback;
