import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import 'moment/locale/fr';
import { decodeToken } from 'react-jwt';
import { toast } from 'react-toastify';

import TextArea from '../../components/generic/TextArea';
import OrderTable from "../../components/order/OrderTable";
import Summary from "../../components/order/Summary";

import { getDishByDate, updateDishDate, getDishByDateAndDish } from "../../services/dishesService";
import { getParam } from '../../services/paramsService';
import { getUserById } from '../../services/usersService'; 
import { getDateByDate } from "../../services/calendarService";
import { createCommand } from "../../services/commandsService";
import { createCommandList } from "../../services/commandsListService";


const PassCommand = () => {
    const token = localStorage.getItem('userToken');

    const summary = useRef(null);
    const input = useRef(null);
    const form = useRef(null);

    const { date } = useParams();
    const history = useHistory();

    const [timeC, setTimeC] = useState("");
    const [time, setTime] = useState("");
    const [orderInfo, setOrderInfo] = useState("");
    const [comment, setComment] = useState("");
    const [container, setContainer] = useState(false);
    const [confirmEmail, setConfirmEmail] = useState(false);
    const [total, setTotal] = useState("");
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [firstname, setFirstname] = useState("");
    const [dateComment, setDateComment] = useState("");


    const [dishList, setDishList] = useState([]);
    const [data, setData] = useState([]);

    const [orderedDishes, setOrderedDishes] = useState([]);

    const [summaryTotal, setSummaryTotal] = useState([]);


    useEffect(() => {

      async function getDishList() {
        const dishes = await getDishByDate(date);
        setDishList(dishes);
      }

      async function getCurrentUser() {

        const userDecoded = decodeToken(localStorage.getItem("userToken"));

        if (userDecoded) {

          const user = await getUserById(userDecoded._id);

          // it returns an object with { success: true, user { all the user's info } }
          if (user.success) {

            const { _id, firstname, name } = user.user;
            setUserId(_id);
            setFirstname(firstname);
            setName(name);
            
          }
        }
      }

      async function getTimeLimit() {
        const currentDate = await getDateByDate(date);
        setDateComment(currentDate.comment);
        setTime({min: currentDate.timeMin, max: currentDate.timeMax});
      }

      getTimeLimit();
      getDishList();
      getSetOrderInfo();
      getCurrentUser();

    }, [date]);


    useEffect(() => {

      function getData() {
      
          setData([]);

          if (dishList !== []) {
  
              dishList.forEach((d, i) => {
  
                  setData(data =>
                      [...data, {id:i, _id: d.idDish._id, name: d.idDish.name, price: d.idDish.price, nb: d.numberRemaining, nbC:""}]
                  );
              });
          }
      }

      getData();
  }, [dishList]);


  useEffect(() => {

    const getTotal = () => {

      let nbTotal = 0;
  
      if (data !== []) {
        data.forEach((d) => {
          if(parseInt(d.nbC) <= d.nb) nbTotal += d.price*Number(d.nbC);
        });
      }
      
      setTotal(nbTotal);
      
    }      
    
    getTotal();
  }, [data]);


  const getSetOrderInfo = async () => {
    const orderMess = await getParam("order");
    setOrderInfo(orderMess);
  }

  const onClickConfirmation = () => {

    summary.current.style.visibility = "hidden";
    summary.current.style.opacity = "0";

    history.push("/");
    toast.success("La commande a été passée avec succès !");

  }

  // SUBMIT ------------------------------------------------

  const onOrderSubmit = async (e) => {
    e.preventDefault();
    input.current.blur();

    let wrongCommand = false;
    let commandList = [];
    let total = 0;

    data.forEach(async (d) => {
      // si nombre entré pas vide
      if(d.nbC !== "") {

        // Teste si les nombres des plats sont corrects et les stocke dans un tableau
        if(parseInt(d.nbC) > d.nb) {
            wrongCommand = true;
            if (d.nb === 0) toast.error(`Il n'y a malheureusement plus de ${d.name}, il faut être plus rapide !`, { autoClose: 10000});
            else toast.error(`Le nombre désiré de ${d.name} est supérieur au nombre disponible ${d.nb}.`, { autoClose: 10000});  
        }
        else {
          total += d.price * parseInt(d.nbC);
          commandList.push(d);
        }
      }
    });

    if(!wrongCommand && total > 0) {
      // Créer la commande si aucun des champs entrés est faux
      const command = await createCommand(userId, parseInt(date), timeC, false, container, comment, total, token);
      // Parcours de la liste des commandes et créer chacune d'entre elle
      commandList.forEach(async (d) => {
       
        await createCommandList(command._id, d._id, parseInt(d.nbC), token);
        const dishDate = await getDishByDateAndDish(date, d._id);
        await updateDishDate(dishDate._id, dishDate.numberKitchen, dishDate.numberRemaining - parseInt(d.nbC));
      });
      setOrderedDishes(commandList);
      setSummaryTotal(total);
      
      if (confirmEmail) {
        // emailJS 
        //  ...
      }

      summary.current.style.visibility = "visible";
      summary.current.style.opacity = 1;

    }
    else toast.error("La commande n'a pu être réalisée, vérifiez les champs.", { autoClose: 10000}); // autoClose = le temps du toast     
  }


  // HANDLE ------------------------------------------------

  const handleComment = (e) => setComment(e.target.value);

  const handleContainerChange = () => setContainer(container ? false : true);

  const handleEmailChange = () => setConfirmEmail(confirmEmail ? false : true);

  const handleTimeChange = (e) => setTimeC(e.target.value);

  return (
    <form className="make-order" onSubmit={onOrderSubmit} ref={form}>
      <Summary
        onClickConfirmation={onClickConfirmation}
        sumRef={summary}
        dishList={orderedDishes}
        name={name}
        firstname={firstname}
        total={summaryTotal}
        email={confirmEmail}
      />
      <div className="make-order__container">
        <h1 className="container__date">{moment(new Date(parseInt(date))).locale('fr').format('LL')}</h1>
        <div className="container__comment">
          <p>{orderInfo}</p>
          {dateComment !== "" && <p>{dateComment}</p>}
        </div>
        <div className="container__name">
          <p className="fixed-text name">{firstname} {name}</p>
        </div>
        <OrderTable data={data} setData={setData}/>
        <div className="container__comm-others">
          <TextArea
              value={comment}
              placeholder="Commentaires (facultatif)..."
              required = {false}
              handleChange={handleComment}
          />
          <div className="comm-others__others">
            <div className="others__total">
              <p>Total : </p>
              <p className="fixed-text"> {total} €</p>
            </div>
            <div className="checkbox__container">
              <input
                type="checkbox"
                id="container"
                name="container"
                checked={container}
                onChange={handleContainerChange}
              />
              <label htmlFor="container">J'amène mes propres contenants</label>
            </div>
            <div className="checkbox__container">
              <input
                type="checkbox"
                id="confirm-email"
                name="confirm-email"
                checked={confirmEmail}
                onChange={handleEmailChange}
              />
              <label htmlFor="confirm-email">Recevoir un email de confirmation</label>
            </div>
            <div className="time__container">
              <div className="time__text">
                <p>Heure de retrait : </p>
                <p>({time.min} - {time.max})</p>
              </div>
              <input type="time" min={time.min} max={time.max} value={timeC} onChange={handleTimeChange} ref={input} required />
            </div>
          </div>
        </div>
        <div className="container__mess-btn">
          <div className="input-btn" >
              <input type="submit" value="Commander" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default PassCommand;