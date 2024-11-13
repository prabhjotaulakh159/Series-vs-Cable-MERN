import { IoMdMenu } from 'react-icons/io';
import { IoMdClose } from 'react-icons/io';
import { useState } from 'react';
import { Link } from 'react-router-dom';


export default function MobileNavBar() {
  const [showNav, setShowNav] = useState(false);

  return (
    <>
      <section id="mobileNav" className="navBar">
        <div id="burgerDiv" onClick={() => setShowNav(!showNav)}>
          <IoMdMenu className="burger" size="30px" />
        </div>
        {showNav ? 
          <div className="mobileNavMenu">
            <IoMdClose
              className="closeMenu"
              size="30px"
              onClick={() => setShowNav(!showNav)}
            />
            <Link 
              to="#graph1" 
              className="filterBtn"
              onClick={() => setShowNav(!showNav)}
            >
              Filter 1
            </Link>
            <Link 
              to="#graph2" 
              className="filterBtn"
              onClick={() => setShowNav(!showNav)}
            >
              Filter 2
            </Link>
            <Link 
              to="#graph3" 
              className="filterBtn"
              onClick={() => setShowNav(!showNav)}
            >
              Filter 3
            </Link>
          </div>
          : null}
      </section>
    </>
  );
}
