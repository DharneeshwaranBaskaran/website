import React from 'react';
import Disatified from "../../images/disatisfied.jpg"
import "./symbol.css"; 

class DissatisfiedSymbol extends React.Component {
  render() {
    return (
      <div>
        <img src={Disatified} alt={Disatified} className="dissatisfied-image" />
      </div>
    );
  }
}

export default DissatisfiedSymbol;
