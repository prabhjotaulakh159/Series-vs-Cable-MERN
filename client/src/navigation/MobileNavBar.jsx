import { IoMdMenu } from 'react-icons/io';
import { IoMdClose } from 'react-icons/io';
import { useState } from 'react';
import NavLinks  from './NavLinks';

export default function MobileNavBar() {
  const [showNav, setShowNav] = useState(false);

  return (
    <>
      <section id="mobileNav" className="navBar">
        <div id="burgerDiv" onClick={() => setShowNav(!showNav)}>
          <IoMdMenu className="burger" size="30px" />
        </div>
        {showNav && 
          <div className="mobileNavMenu">
            <IoMdClose
              className="closeMenu"
              size="30px"
              onClick={() => setShowNav(!showNav)}
            />
            <NavLinks onClick={() => setShowNav(!showNav)}/>
          </div>
        }
      </section>
    </>
  );
}
