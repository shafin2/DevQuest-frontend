import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow pt-16">
        {/* pt-16 adds top padding to account for fixed navbar (64px = h-16) */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
