import Main from '../../layout/Main/Main';
import styles from './AboutPage.module.css';

function AboutPage() {
  return (
    <Main>
      <div className={styles.container}>
        <h1 className={styles.heading}>About</h1>
        <p className={styles.text}>
          This is a Pokemon Search App built with React as part of the{' '}
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            RS School React Course
          </a>
          .
        </p>
        <div className={styles.authorCard}>
          <h2 className={styles.authorTitle}>Author</h2>
          <p className={styles.authorName}>Ibrahim Yeryaran</p>
          <p className={styles.authorInfo}>RS School React Student</p>
        </div>
      </div>
    </Main>
  );
}

export default AboutPage;
