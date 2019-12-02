import React from 'react';

const BigImage = (props) => {

  let style = {};

if(props.src.position && props.src.position.positionY){
  
  let topPosition = props.src.position.positionY + 160;
  let leftPosition = props.src.position.positionX + 160;

  style = {
    top: topPosition + 'px',
    left: leftPosition + 'px'
  };

  if((leftPosition + 300) > 480){
    style.left = 'unset';
    style.right = '170px';
  }

  if(topPosition > 320){
    style.top = (topPosition - 420) +'px';
  }

}

return (
  <div className="preview" style={style}>
    <img src={props.src.src}  alt=''/>
  </div>
  
)
}

export default BigImage