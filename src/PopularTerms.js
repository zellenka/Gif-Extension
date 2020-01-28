import React from 'react';

const termsList = [
  'Hello',
  'Good Bay',
  'Thanks',
  'No',
  'Yes'
]

const PopularTerms = (props) => {
  return(
    <div>
      <ul className="terms__list">
      {termsList.map((item, index) =>
        <li className="terms__item" key={index}>
          <button value={item} className="terms__button" onClick={props.clickHandler}>{item}</button>
        </li>
      )}
      </ul>
    </div>
  )
}

export default PopularTerms