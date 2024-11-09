import './nav.css';
import Logo from '../assets/favicon-tv.png';
import DesktopNavBar from './DesktopNavBar';
import MobileNavBar from './MobileNavBar';

export default function NavBar() {
  return (
    <nav>
      <div className="Logo">
        <img src={Logo} />
      </div>
      <h1 id="webpageTitle">TV Networks vs Streaming platforms</h1>
      <DesktopNavBar />
      <MobileNavBar />
    </nav>
  );
}
