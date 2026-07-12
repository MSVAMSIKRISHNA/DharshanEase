import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ToastContainer from '../components/common/ToastContainer';

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default PublicLayout;
