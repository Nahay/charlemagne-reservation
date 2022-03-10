import React from "react";
import moment from "moment";
import "moment/locale/fr";

const OrderList = ({ orderListByUser, handleClick }) => {
  return (
    <div className="list__container">

    {orderListByUser.map((o, i) => { 
        return (
          <div className="list__container__box" onClick={() => handleClick(o._id)} key={i}>
            <div className="infos-command">
              <p>Pour {o.timeC} le {moment(new Date(parseInt(o.dateC))).locale("fr").format("L")}</p>
              <div className="command__total">
                <p>Total : {o.total} €</p>
              </div>
            </div>              
          </div>
        );
      }
    )}    
  </div>
   );
}

export default OrderList;