import { Link } from 'react-router-dom';
import Main from '../../layout/Main/Main';
import styles from './NotFoundPage.module.css';

function NotFoundPage() {
  return (
    <Main>
      <div className={styles.container}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.message}>Page Not Found</h2>
        <p className={styles.description}>
          The page you're looking for doesn't exist.
        </p>
        <Link to="/1" className={styles.homeLink}>
          Go back to Home
        </Link>
      </div>
    </Main>
  );
}

export default NotFoundPage;
