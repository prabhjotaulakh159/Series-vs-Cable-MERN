import './nav.css';
import Logo from '../assets/favicon-tv.png';
import DesktopNavBar from './DesktopNavBar';
import MobileNavBar from './MobileNavBar';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function NavBar() {

  // Use React Router's useLocation hook to detect changes in the URL
  const location = useLocation();

  useEffect(() => {
    // Scroll to the element when the component mounts or the hash changes
    if (location.hash) {
      const targetElement = document.getElementById(location.hash.replace('#', ''));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <nav>
      <div className="Logo">
        <img src={Logo} alt="logos" />
      </div>
      <h1 id="webpageTitle">TV Networks vs Streaming platforms</h1>
      <DesktopNavBar />
      <MobileNavBar />
    </nav>
  );
}
