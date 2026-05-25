import { Outlet } from 'react-router-dom';
import Header from './layout/Header/Header';
import Flyout from './components/Flyout/Flyout';

function App() {
  return (
    <div>
      <Header />
      <Outlet />
      <Flyout />
    </div>
  );
}

export default App;
