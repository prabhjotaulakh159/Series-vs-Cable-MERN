import './App.css';
import FloatingLogos from './floating-logos/FloatingLogos.jsx';
import 'react-loading-skeleton/dist/skeleton.css';
import './TitleView.css';

function TitleView() {
  return (
    <section id="main-title-view">
      <h1>A competition of services...</h1>
      <FloatingLogos/>
      <p>Prior to the introduction of streaming, cable TV used to dominate as the platform 
        people turned to to watch their favourite shows. However, the early 2000s saw a rise
        in streaming services, who offered the ability to watch shows as well. The major 
        difference: The shows were on demand. This meant the ability to watch and rewatch 
        your favourite shows, and without the constant ads (though recently, this comes at 
        a greater price). <br/>When streaming services were limited, this was great. But as 
        companies decided to buy out their rights and split off into their own companies, 
        many users have wondered if streaming services are still as good as they were. 
        The frequency at which streaming services cancel shows last minute has also affected 
        viewers&apos; opinions. So, we attempted to gather and display data to give users a 
        real visual of what exactly is going on here, and perhaps attempt at answering 
        the question: Cable or streaming? </p>
    </section>
  );
}

export default TitleView;
