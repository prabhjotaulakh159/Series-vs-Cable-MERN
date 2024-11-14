import './FloatingLogos.css';
import netflix from '../assets/netflix.svg';
import amazon from '../assets/amazon.svg';
import disney from '../assets/disney.svg';
import hulu from '../assets/hulu.svg';
import hbo from '../assets/hbo.svg';

function FloatingLogos() {
  return (
    <section id="floating-logos-container">
      <img src={netflix} alt="Netflix"/>
      <img src={amazon} alt="Amazon Prime"/>
      <img src={disney} alt="Disney"/>
      <img src={hulu} alt="Hulu"/>
      <img src={hbo} alt="hbo"/>
    </section>
  );  
}

export default FloatingLogos;