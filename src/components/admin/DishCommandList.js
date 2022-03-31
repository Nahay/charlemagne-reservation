import React from "react";


const DishCommandList = ({ dishList, onClickDish, date, desc}) => {
  
  return (
    <>
      <div className="list__title">Prix du menu : {date.price} €</div>
      <div className="list__container">
     
      {dishList.map((d) => {
           return (
             <div className={desc ? "list__container__box" : "list__container__box default"} key={d._id} onClick={() => desc && onClickDish(d)}> 
               <div className="infos-dish" >
                 <p>{d.name}</p>
               </div>
             </div>
           );
      })}
      </div>
    </>
    
   );
}

export default DishCommandList;