import styles from './fields.module.css';

interface FieldErrorProps {
  message?: string;
  id?: string;
}

/** Renders a field error in a fixed-height slot to prevent layout shifts. */
function FieldError({ message, id }: FieldErrorProps) {
  return (
    <span className={styles.errorSlot} id={id} role="alert">
      {message ?? ''}
    </span>
  );
}

export default FieldError;
