import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import 'moment/locale/fr';
import { decodeToken } from 'react-jwt';
import { toast } from 'react-toastify';

import InputText from "../../components/generic/InputText";
import InputNumber from "../../components/generic/InputNumber";
import Counter from "../../components/generic/Counter";
import TextArea from '../../components/generic/TextArea';
import OrderTable from "../../components/order/OrderTable";
import Summary from "../../components/order/Summary";

import { getParam } from '../../services/paramsService';
import { getUserById } from '../../services/usersService'; 
import { getDateByDate } from "../../services/calendarService";
import { createCommand } from "../../services/commandsService";

import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const PassCommand = () => {
    const token = localStorage.getItem('userToken');
    const decodedToken = decodeToken(token);

    const summary = useRef(null);
    const input = useRef(null);
    const form = useRef(null);
    const signup = useRef(null);

    const { date } = useParams();
    const history = useHistory();

    const [orderInfo, setOrderInfo] = useState("");
    const [comment, setComment] = useState("");
    const [confirmEmail, setConfirmEmail] = useState(false);
    const [confirmAccount, setConfirmAccount] = useState(false);
    const [total, setTotal] = useState("");
    const [userId, setUserId] = useState("");

    const [name, setName] = useState("");
    const [tel, setTel] = useState("");
    const [nbP, setNbP] = useState("");
    const [currentDate, setCurrentDate] = useState("");

    const [dateComment, setDateComment] = useState("");


    const [dishList, setDishList] = useState([]);
    const [data, setData] = useState([]);

    const [orderedDishes, setOrderedDishes] = useState([]);

    const [summaryTotal, setSummaryTotal] = useState([]);


    useEffect(() => {

      async function getDishList() {
        const dishes = await getDateByDate(date);
        setDishList(dishes.dishes);
      }

      async function getCurrentUser() {

        const userDecoded = decodeToken(localStorage.getItem("userToken"));

        if (userDecoded) {

          const user = await getUserById(userDecoded._id);

          // it returns an object with { success: true, user { all the user's info } }
          if (user.success) {

            const { _id, name } = user.user;
            setUserId(_id);
            setName(name);
            
          }
        }
      }

      async function getDateComment() {
        const currentDate = await getDateByDate(date);
        setDateComment(currentDate.comment);
      }

      
    async function getCurrentDate() {
      const currentDate = await getDateByDate(date);
      setCurrentDate(currentDate);
      
    }      
      setTotal(0);
      getCurrentDate();
      getDishList();
      getDateComment();
      getSetOrderInfo();
      getCurrentUser();

    }, [date]);


    useEffect(() => {

      function getData() {
      
          setData([]);

          if (dishList !== []) {
  
              dishList.forEach((d, i) => {
  
                  setData(data =>
                      [...data, {id:i, _id: d._id, name: d.name}]
                  );
              });
          }
      }

      getData();
  }, [dishList]);

  const getSetOrderInfo = async () => {
    const orderMess = await getParam("order");
    setOrderInfo(orderMess);
  }

  const onClickConfirmation = () => {

    summary.current.style.visibility = "hidden";
    summary.current.style.opacity = "0";

    history.push("/");
    toast.success("La réservation est passée avec succès !");

  }

  // SUBMIT ------------------------------------------------

  const onOrderSubmit = async (e) => {
    e.preventDefault();
    input.current.blur();
    
    if(confirmAccount) {
      signup.current.style.visibility = "visible"
      signup.current.style.opacity = 1;
    }


    // if(total > 0) {
    //   // Créer la commande si aucun des champs entrés est faux
    //   await createCommand(userId, parseInt(date), false, comment, total, token);

    //   // setOrderedDishes(commandList);
    //   setSummaryTotal(total);
      
    //   if (confirmEmail) {
    //     // emailJS 
    //     //  ...
    //   }

    //   summary.current.style.visibility = "visible";
    //   summary.current.style.opacity = 1;

    // }
    // else toast.error("La commande n'a pu être réalisée, vérifiez les champs.", { autoClose: 10000}); // autoClose = le temps du toast     
  }


  // HANDLE ------------------------------------------------

  const handleNameChange = (e) => setName(e.target.value);

  const handleComment = (e) => setComment(e.target.value);

  const handleEmailChange = () => setConfirmEmail(confirmEmail ? false : true);

  const handleAccountChange = () => setConfirmAccount(confirmAccount ? false : true);

  const handleTelChange = (e) => !isNaN(e.target.value) && setTel(e.target.value);

  const handleNbPChange = (e) => {
    if(!isNaN(e.target.value)){
      setNbP(e.target.value);

      e.target.value <= currentDate.nbRemaining ? setTotal(e.target.value*currentDate.price) : setTotal(0);
    }
  }

  const handlePlusClick = () => {
    if(nbP === "") {
      setNbP(1);
      setTotal(currentDate.price);
    }
    else if(nbP < currentDate.nbRemaining) {
      setNbP(parseInt(nbP)+1);
      setTotal(parseInt(nbP+1)*currentDate.price);
    }
  }

  const handleMinusClick = () => {
    if(parseInt(nbP) > 1) {
      setNbP(parseInt(nbP)-1);
      setTotal(parseInt(nbP-1)*currentDate.price);
    }
    else setNbP("");

    if(parseInt(nbP) === 1) {
      setTotal(0);
    }
  }

  return (
    <form className="make-order" onSubmit={onOrderSubmit} ref={form}>
      <Summary
        onClickConfirmation={onClickConfirmation}
        sumRef={summary}
        dishList={orderedDishes}
        name={name}
        total={summaryTotal}
        email={confirmEmail}
      />
      <div className="make-order__container">
        <h1 className="container__date">{moment(new Date(parseInt(date))).locale('fr').format('LL')}</h1>

        <div className="container__comment">
          <p>{orderInfo}</p>
          {dateComment !== "" && <p>{dateComment}</p>}
        </div>

        <div className="container__content">

          <div className="content__left">

            <div className="container__informations">
              <div className="informations-content">
                <InputText placeholder="Nom" handleChange={handleNameChange} value={name}/>

                <div className="content-tel">
                  <InputNumber placeholder="Tel" handleChange={handleTelChange} value={tel}/>
                  <div className="tel__info">
                    
                    <FontAwesomeIcon icon={faInfoCircle} size="sm"/> 

                    <span>Servira uniquement à vous envoyer un rappel 24h avant la date de réservation.</span>                   
                  </div>

                </div>              
              </div>         
            </div>

            <OrderTable data={data}/>

            <TextArea
              value={comment}
              placeholder="Commentaires (facultatif)..."
              required = {false}
              handleChange={handleComment}
            />

          </div>

          <div className="content__right">

            <div className="container__comm-others">
              <div className="others__nbP">
                <p>Nombre de places désirées :</p>
                <Counter value={nbP} handleChange={handleNbPChange} onClickPlus={handlePlusClick} onClickMinus={handleMinusClick} counterRef={input}/>
              </div>

              <div className="others__total">
                <p>Total : </p>
                <p className="fixed-text"> {total} €</p>
              </div>
              { decodedToken ? 
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
              :
              <div className="checkbox__container">
                <input
                  type="checkbox"
                  id="confirm-acc"
                  name="confirm-acc"
                  checked={confirmAccount}
                  onChange={handleAccountChange}
                  />
                <label htmlFor="confirm-acc">Créer un compte avant de prendre réservation</label>              
              </div>
              }
            </div>
          </div>
        </div>

        <div className="container__mess-btn">
          <div className="input-btn" >
              <input type="submit" value="Réserver" ref={input}/>
          </div>
        </div>

      </div>
    </form>
  );
};

export default PassCommand;