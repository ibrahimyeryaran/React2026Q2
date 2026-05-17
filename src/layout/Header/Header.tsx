import { NavLink, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  const location = useLocation();
  const isHome = !location.pathname.startsWith('/about');

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Pokemon Search App</h1>
      <nav className={styles.nav}>
        <NavLink
          to="/1"
          className={isHome ? styles.navLinkActive : styles.navLink}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? styles.navLinkActive : styles.navLink
          }
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
