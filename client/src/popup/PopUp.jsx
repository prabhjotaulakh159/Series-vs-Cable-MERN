import './PopUp.css';

function PopUp({data}) {
  return (
    <div className="pop-up-container">
      <p>{data.x}, {Math.floor(data.y)}</p>
    </div>
  );
}

export default PopUp;