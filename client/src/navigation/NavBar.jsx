import './nav.css';
import Logo from '../assets/favicon-tv.png';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import  NavLinks  from './NavLinks';
import MobileNavBar from './MobileNavBar';

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
      {/* nav bar for desktop navigation */}
      <section id="desktopNav" className="navBar">
        <NavLinks/>
      </section>
      <MobileNavBar />
    </nav>
  );
}
