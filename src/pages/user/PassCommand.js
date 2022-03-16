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
import SignBox from "../../components/order/SignBox";

import { getParam } from '../../services/paramsService';
import { getUserById } from '../../services/usersService'; 
import { getDateByDate, updateDateNbR, updateDateNbRNL } from "../../services/calendarService";
import { createCommand, createCommandNL } from "../../services/commandsService";
import { userSignUp } from "../../services/usersService";

import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const PassCommand = () => {
    const token = localStorage.getItem('userToken');

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

    const [loggedIn, setLoggedIn] = useState(false);

    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
     
    const nameReg = /^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'-]+$/;
    const emailReg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

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

            const { _id, name, comment, tel } = user.user;
            setUserId(_id);
            setName(name);
            setTel(tel);
            setComment(comment);
            setLoggedIn(true);
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
    summary.current.style.opacity = 0;

    history.push("/");
    toast.success("La réservation est passée avec succès !");

  }

  // SUBMIT ------------------------------------------------
  const onSignUpSubmit = async (e) => {
    e.preventDefault();

    if(emailReg.test(email)) {
      const signUp = await userSignUp(email, password, name, firstname, tel, comment);

      if(signUp.success){
          toast.success("Le compte a été crée avec succès ! Voici la confirmation de votre réservation.");

          await createCommand(signUp.savedUser.user._id, name, tel, date, nbP, comment, total, signUp.token);
          await updateDateNbR(date, currentDate.nbRemaining - parseInt(nbP), false, signUp.token);

          localStorage.setItem('userToken', signUp.token);

          signup.current.style.visibility = "hidden";
          signup.current.style.opacity = 0;

          summary.current.style.visibility = "visible";
          summary.current.style.opacity = 1;
      }
      else toast.error(signUp.message);
  }
  else toast.error("L'adresse email entrée n'est pas valide.");

  }

  const onOrderSubmit = async (e) => {
    e.preventDefault();
    input.current.blur();
    
    if(total > 0) {

      if(loggedIn) {

        await createCommand(userId, name, tel, date, nbP, comment, total, token);
        await updateDateNbR(date, currentDate.nbRemaining - parseInt(nbP), false, token);

        if(confirmEmail) {
          // emailJS
        }

        summary.current.style.visibility = "visible";
        summary.current.style.opacity = 1;
      }
      else {

        if(confirmAccount) {
          signup.current.style.visibility = "visible";
          signup.current.style.opacity = 1;
        }

        else {
          await createCommandNL(name, tel, date, nbP, comment, total);
          await updateDateNbRNL(date, currentDate.nbRemaining - parseInt(nbP));

          summary.current.style.visibility = "visible";
          summary.current.style.opacity = 1;
        }
      }

    }
    else toast.error("La commande n'a pu être réalisée, vérifiez les champs.", { autoClose: 10000});
  }


  // HANDLE ------------------------------------------------

  const handleNameChange = (e) => setName(e.target.value);

  const handleComment = (e) => setComment(e.target.value);

  const handleConfirmEmailChange = () => setConfirmEmail(confirmEmail ? false : true);

  const handleAccountChange = () => setConfirmAccount(confirmAccount ? false : true);

  const handleTelChange = (e) => !isNaN(e.target.value) && setTel(e.target.value);

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleFirstnameChange = (e) => (nameReg.test(e.target.value) || e.target.value === "") && setFirstname(e.target.value);

  const handleEmailChange = (e) => setEmail(e.target.value);

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
    <>
    <SignBox  
      handleEmailChange={handleEmailChange}
      handlePasswordChange={handlePasswordChange}
      handleNameChange={handleNameChange}
      handleFirstnameChange={handleFirstnameChange}
      handleTelChange={handleTelChange}
      handleSignUpSubmit={onSignUpSubmit} 
      password={password}
      name={name}
      firstname={firstname}
      email={email}
      tel={tel}
      signRef={signup}
    />

    <Summary
        onClickConfirmation={onClickConfirmation}
        sumRef={summary}
        dishList={dishList}
        name={name}
        total={total}
        email={confirmEmail}
        nbP={nbP}
    />

    <form className="make-order" onSubmit={onOrderSubmit} ref={form}>
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
              { loggedIn ?
              <div className="checkbox__container">
                <input
                type="checkbox"
                id="confirm-email"
                name="confirm-email"
                checked={confirmEmail}
                onChange={handleConfirmEmailChange}
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
    </>
  );
};

export default PassCommand;