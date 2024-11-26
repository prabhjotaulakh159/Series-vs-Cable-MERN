import { useEffect, useState, useRef } from 'react';
import './Card.css';

function Card({series}) {
  const [showCard, setShowCard] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setShowCard(true);
        observer.disconnect();
      }
    
    }, { threshold: 0.1 });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

   
  return <div ref={ref} className="results">
    {showCard &&
      <div key={series.id} className="card">
        <span>{series?.name}</span>
        { series?.artwork ? 
          <img loading="lazy" src={series?.artwork} alt={`${series?.name} artwork`} /> 
          :
          <span>Image N/A</span>
        }
        <span>Seasons: {series?.numberOfSeasons}</span>
        <span>Upvotes: {series?.score}</span>
        <span>Genre: {series?.genres[0]}</span>
        <span>Year: {series?.year}</span>
        <span>Company type: {series?.companyType}</span>
      </div>
    }
  </div>;
  
}

export default Card;