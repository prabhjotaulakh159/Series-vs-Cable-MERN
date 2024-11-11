import { IoMdMenu } from 'react-icons/io';
import { IoMdClose } from 'react-icons/io';
import { useState } from 'react';

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
            <div className="filterBtn">Filter 1</div>
            <div className="filterBtn">Filter 2</div>
            <div className="filterBtn">Filter 3</div>
          </div>
          : null}
      </section>
    </>
  );
}
