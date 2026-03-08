import { Outlet } from 'react-router';
import { AdminProvider } from './context/AdminContext';
import { AppProvider } from './context/AppContext';
import ScrollToTop from './components/ScrollToTop';

export default function RootLayout() {
  return (
    <AdminProvider>
      <AppProvider>
        <>
          <ScrollToTop />
          <Outlet />
        </>
      </AppProvider>
    </AdminProvider>
  );
}