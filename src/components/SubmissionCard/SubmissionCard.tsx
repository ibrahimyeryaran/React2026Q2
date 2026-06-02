import type { FormSubmission } from '../../types/form';
import styles from './SubmissionCard.module.css';

interface SubmissionCardProps {
  submission: FormSubmission;
  isNew: boolean;
}

function SubmissionCard({ submission, isNew }: SubmissionCardProps) {
  return (
    <article
      className={`${styles.card} ${isNew ? styles.new : ''}`}
      data-testid="submission-card"
    >
      <img
        src={submission.image}
        alt={`${submission.name}'s profile`}
        className={styles.image}
      />
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.name}>{submission.name}</h3>
          <span className={styles.badge}>{submission.source}</span>
        </div>
        <dl className={styles.details}>
          <div className={styles.row}>
            <dt>Age</dt>
            <dd>{submission.age}</dd>
          </div>
          <div className={styles.row}>
            <dt>Email</dt>
            <dd>{submission.email}</dd>
          </div>
          <div className={styles.row}>
            <dt>Gender</dt>
            <dd>{submission.gender}</dd>
          </div>
          <div className={styles.row}>
            <dt>Country</dt>
            <dd>{submission.country}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export default SubmissionCard;
