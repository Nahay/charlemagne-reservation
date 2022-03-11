import React, { useState, useEffect, useRef } from 'react';

import { toast } from 'react-toastify';
import moment from "moment";
import 'moment/locale/fr';

import InputText from '../../components/generic/InputText';
import TextArea from '../../components/generic/TextArea';
import InputButton from '../../components/generic/InputButton';
import DishList from '../../components/admin/DishList';
import AdminCalendar from "../../components/admin/AdminCalendar";
import Box from '../../components/generic/Box';

import { getDates, updateDate, createDate, deleteDate, DelDishFromDate, addDishToDate } from '../../services/calendarService';
import { getDishes } from '../../services/dishesService';


const AdminDates = () => {

    const token = localStorage.getItem("adminToken");

    const ref = useRef(null);
    const box = useRef(null);

    const [date, setDate] = useState(new Date(new Date().toDateString()).getTime());
    const [dateList, setDatesList] = useState([]);
    const [dishList, setDishList] = useState([]);

    const [dateExists, setDateExists] = useState(false);
    const [visibility, setVisibility] = useState(true);
    const [comment, setComment] = useState("");
    const [nbP, setNbP] = useState("");
    const [nbR, setNbR] = useState("");
    const [currentDishList, setCurrentDishList] = useState([]);

    const [idD, setIdD] = useState("");
    const [deletedDate, setDeletedDate] = useState(true);

    const [nb, setNb] = useState("");
    const [select, setSelect] = useState("0");


    useEffect(() => {

        async function defineDate(dateC) {
            setDate(dateC);

            const dates = await getDates();
            setDatesList(dates);

            const foundDate = dates.filter((d) => d.dateC === dateC)[0];
    
            // la date existe dans la bdd
            if (foundDate) {
                setDateExists(true);
                setVisibility(foundDate.visibility);
                setComment(foundDate.comment);
                setNb(foundDate.nbPlaces);
                setSelect("0");
                setCurrentDishList(foundDate.dishes);
            }
        }

        getDishList();
        defineDate(new Date(new Date().toDateString()).getTime());

    }, []);
    

    // SET STATES --------------------------------------------------------------

    const getDishList = async () => {
        const dishes = await getDishes();
        setDishList(dishes);
    }

    const getDateList = async () => {
        const dates = await getDates();
        setDatesList(dates);
    }

    const resetValues = () => {
        setDateExists(false);
        setVisibility(true);
        setComment("");
        setSelect("0");
        setNb("");
        setCurrentDishList([]);
    }   

    const resetValuesFromDate = (d) => {
        setDateExists(true);
        setVisibility(d.visibility);
        setComment(d.comment);
        setSelect("0");
        setNbP(d.nbPlaces);
        setNbR(d.nbRemaining);
        setNb(d.nbPlaces);
        setCurrentDishList(d.dishes);
    }

    const onChangeDate = async (dateC) => {

        setDate(dateC);
        const foundDate = dateList.filter((d) => d.dateC === dateC)[0];

        // si la date n'existe pas encore dans la bdd
        if (!foundDate) resetValues();
        else resetValuesFromDate(foundDate);
    }

    const onClickDish = ({_id, idDish}) => {
        setIdD(_id);
        setSelect(idDish._id);
    }


    // HANDLE ---------------------------------------------------------------
    
    const handleVisibilityChange = (e) => {
        if (e.target.id ==='y') setVisibility(true);
        else setVisibility(false);
    }

    const handleCommentChange = (e) => setComment(e.target.value);

    const handleSelectChange = (e) => setSelect(e.target.value);

    const handleNbChange = (e) => {
        const val = e.target.value;
        if(Number(val) || val === "") setNb(val);
    }
    

    // BD -------------------------------------------------------------------

    const saveDate = async () => {

        const nbReserve = nbP - nbR;

        if (!dateExists) {
            if (nb !== "") {
                createDate(date, visibility, comment, nb, token);
                setDateExists(true);
                getDateList();
            }
            else toast.error("Veuillez entrer un nombre de places.")
        }
        else if (nb >= nbReserve) {
            await updateDate(date, visibility, comment, nb, nb-nbReserve, token);
            getDateList();
        }
        else toast.error("Le nombre de places ne peut être inférieur à" +nbR);
    }

    const deleteAndSetDate = async () => {

        if (nbP === nbR) {
            await deleteDate(date, token);
            await getDateList();

            resetValues();

            onChangeDate(new Date(new Date().toDateString()).getTime());
        }
        else toast.error("Il y a une réservation à cette date, vous ne pouvez pas la supprimer.");

        box.current.style.visibility = "hidden";
        box.current.style.opacity = 0;
    }

    const onDateSubmit = async (e) => {
        e.preventDefault();
        saveDate();        
    }

    // btn ajouter la plat à la date
    const onDishSubmit = async (e) => {
        e.preventDefault();

        // si on a sélectionné qqe chose :
        if (select !== "0") {
            if (nb !== "") {

                // si la date existe déjà
                if (dateExists) {

                    const dish = dateList.filter((d) => d.dateC === date)[0].dishes.filter((d) => d._id === e.target.value)[0];

                    // si le plat n'existe pas encore dans la date
                    if (!dish) {
                        // ajouter le plat à la date
                        await addDishToDate(date, select, token);
                        getDateList();
                    }
                    else toast.error("Le plat existe déjà !");
                }

                // la date n'existe pas : on la crée et on ajoute le plat
                else {
                    await createDate(date, visibility, comment, nb, token);
                    setDateExists(true);
                    await addDishToDate(date, select, token);
                    getDateList();
                }

                setNb("");
                setSelect("0");   
            }
            else toast.error("Veuillez entrer un nombre de places.");
        }
        else toast.error("Aucun plat n'est sélectionné.");
    }

    const onClickDelete = async () => {
        await DelDishFromDate(date, idD, token);

        box.current.style.visibility = "hidden";
        box.current.style.opacity = 0;
    }

    const onClickConfirmation = () => {
        box.current.style.visibility = "hidden";
        box.current.style.opacity = 0;
    }

    const onClickDeleteIcon = (e) => {
        if(e.dateC === date) {
            setDeletedDate(false);
        }
        else setDeletedDate(true);

        box.current.style.visibility = "visible";
        box.current.style.opacity = 1;
    }


    // RENDER ----------------------------------------------------------------

    return (
        <div className="admin-dates">
            <Box onClickConfirmation={onClickConfirmation} onClickDelete={deletedDate ? deleteAndSetDate : onClickDelete} message={deletedDate ? "Voulez-vous vraiment supprimer cette date ?" : "Voulez-vous vraiment supprimer le plat de cette date ?"} boxRef={box}/>
            <div className="admin-dates__left">
                <div className="left__dates-list">
                    <AdminCalendar
                        rightRef={ref}
                        dateList={dateList}
                        onChangeDate={onChangeDate}
                    />
                </div>
            </div>
            
            <div className="admin-dates__right" ref={ref}>
                <h1 className="right__date">{moment(date).locale('fr').format('LL')}</h1>
                <div className="right__form">
                    <form className="right__form__1" onSubmit={onDateSubmit}>

                        <div className="right__form__radio" onChange={handleVisibilityChange}>
                            <span>Visible ?</span>
                            <input
                                type="radio"
                                value="Non"
                                name="visibility"
                                id="n"
                                checked={visibility === false}
                                readOnly
                            />
                            <label htmlFor="n">Non</label>
                            <input
                                type="radio" 
                                value="Oui"
                                name="visibility"
                                id="y"
                                checked={visibility === true}
                                readOnly
                            />
                            <label htmlFor="y">Oui</label>
                        </div>

                        <div className="nb-places">
                            <InputText
                                value={nb}
                                placeholder="Places disponibles*"
                                handleChange={handleNbChange}
                                required={true}
                            />
                        </div>

                        <div className="select-container">
                            <select value={select} id="dish-select" className="dish-select" onChange={handleSelectChange}>
                                <option value="0" id="0">Liste des plats</option>
                                <optgroup label="Entrées">
                                    {dishList.filter(d => d.type === 'e').map((d) => {
                                        return <option value={d._id} key={d._id}>{d.name}</option>
                                    })}
                                </optgroup>
                                <optgroup label="Plats">
                                    {dishList.filter(d => d.type === 'p').map((d) => {
                                        return <option value={d._id} key={d._id}>{d.name}</option>
                                    })}
                                </optgroup>
                                <optgroup label="Desserts">
                                    {dishList.filter(d => d.type === 'de').map((d) => {
                                        return <option value={d._id} key={d._id}>{d.name}</option>
                                    })}
                                </optgroup>
                                <optgroup label="Divers">
                                    {dishList.filter(d => d.type === 'di').map((d) => {
                                        return <option value={d._id} key={d._id}>{d.name}</option>
                                    })}
                                </optgroup>
                            </select>

                            <InputButton value= "Ajouter le plat à cette date" type="button" onClick={onDishSubmit}/>
                        </div>

                        <div className="dish-list">
                            <DishList
                                dishByDateList={currentDishList}
                                onClickDish={onClickDish}
                                onClickDelete={onClickDeleteIcon}
                            />
                        </div>
                                    
                        <TextArea
                            value={comment}
                            placeholder="Commentaire pour cette date..."
                            required={false}
                            handleChange={handleCommentChange}
                        />

                        { dateExists ?
                            <div className="multi-btn">

                                    <div onClick={onClickDeleteIcon}>
                                        <InputButton value="Supprimer" type="button"/>
                                    </div>

                                    <InputButton value="Enregistrer" type="submit"/>                                    
                            </div>
                        :
                            <div className="multi-btn">
                                <InputButton value="Créer" type="submit"/>
                            </div>
                        }


                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDates;