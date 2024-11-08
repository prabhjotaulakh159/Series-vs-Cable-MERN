import './nav.css';
import DesktopNavBar from './DesktopNavBar';
import MobileNavBar from './MobileNavBar';

export default function NavBar(){


  return(
    <nav>
      <DesktopNavBar/> 
      <MobileNavBar/>
    </nav>
  );
}