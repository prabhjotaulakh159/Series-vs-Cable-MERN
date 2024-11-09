import { IoMdMenu } from 'react-icons/io';

export default function MobileNavBar(){
  return(
    <>
      <section id="mobileNav" className="navBar">
        <div id="menuDiv">
          <IoMdMenu className="menu" size="30px"/>
        </div>
      </section>
    </>
  );
}