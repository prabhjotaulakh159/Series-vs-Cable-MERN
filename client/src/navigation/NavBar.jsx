import './nav.css';
import tempLogo from '../assets/react.svg';
import DesktopNavBar from './DesktopNavBar';
import MobileNavBar from './MobileNavBar';

export default function NavBar(){


  return(
    <nav>
      <div className="Logo">
        <img src={tempLogo}/>
      </div>
      <h1 id="webpageTitle">TV Networks vs Streaming platforms </h1>
      <DesktopNavBar/> 
      <MobileNavBar/>
    </nav>
  );
}