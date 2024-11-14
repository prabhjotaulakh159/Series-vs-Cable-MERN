import { Link } from 'react-router-dom';

export default function NavLinks({onClick}){
  return(
    <>
      <Link to="#graph1" 
        className="filterBtn"
        onClick = {onClick}
      >
          Graph 1
      </Link>
      <Link to="#graph2" 
        className="filterBtn"
        onClick = {onClick}
      >
          Graph 2
      </Link>
      <Link to="#graph3" 
        className="filterBtn"
        onClick = {onClick}
      >
          Graph 3
      </Link>
    </>
  );
}