import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import MainPage from './pages/MainPage/MainPage';
import DetailPage from './pages/DetailPage/DetailPage';
import AboutPage from './pages/AboutPage/AboutPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import RouteErrorFallback from './components/ErrorBoundary/RouteErrorFallback';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        element: <Navigate to="/1" replace />,
      },
      {
        path: ':page',
        element: <MainPage />,
        errorElement: <RouteErrorFallback />,
        children: [
          {
            path: 'details/:detailId',
            element: <DetailPage />,
            errorElement: <RouteErrorFallback />,
          },
        ],
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
