import { useState } from 'react';
import { useFormStore } from './store/formStore';
import Modal from './components/Modal/Modal';
import UncontrolledForm from './components/UncontrolledForm/UncontrolledForm';
import HookForm from './components/HookForm/HookForm';
import SubmissionCard from './components/SubmissionCard/SubmissionCard';
import styles from './App.module.css';

type ActiveForm = 'uncontrolled' | 'react-hook-form' | null;

const MODAL_TITLES: Record<Exclude<ActiveForm, null>, string> = {
  uncontrolled: 'Uncontrolled Form',
  'react-hook-form': 'React Hook Form',
};

function App() {
  const submissions = useFormStore((state) => state.submissions);
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);

  const closeModal = () => setActiveForm(null);
  const newestId = submissions[0]?.id;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>React Forms</h1>
        <p className={styles.subtitle}>
          Submit the same data using an uncontrolled form or React Hook Form.
        </p>
        <div className={styles.openButtons}>
          <button
            type="button"
            className={styles.openButton}
            onClick={() => setActiveForm('uncontrolled')}
          >
            Open Uncontrolled Form
          </button>
          <button
            type="button"
            className={styles.openButton}
            onClick={() => setActiveForm('react-hook-form')}
          >
            Open React Hook Form
          </button>
        </div>
      </header>

      <main>
        <h2 className={styles.sectionTitle}>
          Submissions ({submissions.length})
        </h2>
        {submissions.length === 0 ? (
          <p className={styles.empty}>
            No submissions yet. Open a form to get started.
          </p>
        ) : (
          <div className={styles.grid}>
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                isNew={submission.id === newestId}
              />
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={activeForm !== null}
        onClose={closeModal}
        title={activeForm ? MODAL_TITLES[activeForm] : ''}
      >
        {activeForm === 'uncontrolled' && (
          <UncontrolledForm onSuccess={closeModal} />
        )}
        {activeForm === 'react-hook-form' && <HookForm onSuccess={closeModal} />}
      </Modal>
    </div>
  );
}

export default App;
