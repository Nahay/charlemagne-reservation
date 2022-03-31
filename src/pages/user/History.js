import React, { useEffect, useRef, useState } from 'react';
import { decodeToken } from 'react-jwt';

import DishCommandList from '../../components/admin/DishCommandList';
import OrderList from '../../components/order/OrderList';
import DishBox from '../../components/generic/DishBox';

import { getCommandByUser } from '../../services/commandsService';
import { getUserById } from '../../services/usersService';
import { getDateByDate } from '../../services/calendarService';
import { toast } from 'react-toastify';

const History = () => {
    const dishBox = useRef(null);

    const token = localStorage.getItem('userToken');

    const [orderList, setOrderList] = useState([]);
    const [dishList, setDishList] = useState([]);

    const [description, setDescription] = useState(false);
    const [date, setDate] = useState("");
    const [dateClicked, setDateClicked] = useState(false);
    const [dishClicked, setDishClicked] = useState({});

    const [user, setUser] = useState({});

    useEffect(() => {   

        async function getOrderList() {
            const userDecoded = decodeToken(localStorage.getItem('userToken'));
            const token = localStorage.getItem('userToken');

            if (userDecoded) {
                const currentUser = await getUserById(userDecoded._id);
                const orders = await getCommandByUser(currentUser.user._id, token);
                setUser(currentUser.user);
                setOrderList(orders);
            }
        }

        getOrderList();

    },[]);

    const onClickDish = (dish) => {
        if(dish.description !== "") { 
            setDishClicked(dish);
            dishBox.current.style.visibility = "visible";
            dishBox.current.style.opacity = 1;
        }
        else {
            toast.error("Aucune description n'est disponible");
        }
       
    }

    const onClickConfirmation = () => {
        dishBox.current.style.visibility = "hidden";
        dishBox.current.style.opacity = 0;
    }

    // HANDLE ------------------------------------------------------------

    const handleOrderClick = async (id) => {
        const commands = await getCommandByUser(user._id, token);
        const command = commands.filter(c => c._id === id);
        const date = await getDateByDate(command[0].dateC);
        setDate(date);
        setDishList(date.dishes);

        let desc = false;
        date.dishes.forEach(d => {
            if(d.description !== "") desc = true;
        });
        setDescription(desc);

        setDateClicked(true);
        setDishClicked({});
    }

    return (
        <div className="history__container"> 
                
            <DishBox onClickConfirmation={onClickConfirmation} dish={dishClicked} dishBoxRef={dishBox}/>            
           
           <div className="history__left">
                   
                <div className="left__content">
                    <div className="history__title">
                        <span className="title-name">{user.firstname} </span> voici l'aperçu de vos réservations
                    </div>
                    <OrderList orderListByUser={orderList} handleClick={handleOrderClick} />
                </div>
           </div>

           <div className="history__right">
               <div className="right__content">
                   {dateClicked ?
                        <>
                            <DishCommandList dishList={dishList} onClickDish={onClickDish} date={date} desc={description}/>

                            {description && 
                                <p className="content__tip">
                                    Cliquez sur un plat pour afficher ses détails.
                                </p>
                            }
                            
                        </>
                    :
                        <div className="content__empty">
                            Veuillez sélectionner une réservation effectuée.
                        </div>    
                    }
                    
               </div>
           </div>
        </div>
    );
}
 
export default History;