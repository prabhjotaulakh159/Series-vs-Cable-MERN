import { Link } from 'react-router-dom';

export default function DesktopNavBar() {
  
  return(
    <>
      <section id="desktopNav" className="navBar">
        <Link to="#graph1" className="filterBtn">Filter 1</Link>
        <Link to="#graph2" className="filterBtn">Filter 2</Link>
        <Link to="#graph3" className="filterBtn">Filter 3</Link>
      </section>
    </>
  );
}