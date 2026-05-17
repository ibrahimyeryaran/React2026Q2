import type { ReactNode } from 'react';
import styles from './Main.module.css';

interface MainProps {
  children: ReactNode;
}

function Main({ children }: MainProps) {
  return <main className={styles.main}>{children}</main>;
}

export default Main;
