import './PopUp.css';

function PopUp({year, topContender}) {
  return (
    <div className="pop-up-container">
      <p>{year}</p>
      <p>{topContender}</p>
    </div>
  );
}

export default PopUp;