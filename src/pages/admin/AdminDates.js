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

import {getDates, updateDate, getDateByDate, createDate, deleteDate} from '../../services/calendarService';
import {getDishes, createDishDate, getDishByDate, deleteAllDishesDate, deleteDishDate, updateDishDate} from '../../services/dishesService';

const AdminDates = () => {

    const token = localStorage.getItem("adminToken");

    const ref = useRef(null);
    const box = useRef(null);

    const [date, setDate] = useState(new Date(new Date().toDateString()).getTime());
    const [dateList, setDatesList] = useState([]);
    const [dishByDateList, setDishByDateList] = useState([]);

    const [dateExists, setDateExists] = useState(false);
    const [visibility, setVisibility] = useState(true);
    const [comment, setComment] = useState("");


    const [upD, setUpD] = useState(false);
    const [nb, setNb] = useState("");
    const [idD, setIdD] = useState("");
    const [nbC, setNbC] = useState("");
    const [nbR, setNbR] = useState("");
    const [timeMin, setTimeMin] = useState("12:00");
    const [timeMax, setTimeMax] = useState("16:00");
    const [currentCommandList, setCurrentCommandList] = useState({});
    const [deletedDate, setDeletedDate] = useState(true);

    const [select, setSelect] = useState("0");
    const [dishList, setDishList] = useState([]);


    useEffect(() => {

        async function defineDate(dateC) {
            setDate(dateC);
            const foundDate = await getDateByDate(dateC);
    
            // la date n'existe pas encore dans la bdd
            if (foundDate !== null) {
                setDateExists(true);
                setVisibility(foundDate.visibility);
                setComment(foundDate.comment);
                setTimeMin(foundDate.timeMin);
                setTimeMax(foundDate.timeMax);
                setSelect("0");
                setNb("");

                getDishByDateList(foundDate.dateC);
            }
        }

        getDishList();
        getDateList();
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

    const getDishByDateList = async (dateC) => {
        
        const dishes = await getDishByDate(dateC);

        if (dishes === null) setDishByDateList([]);
        else setDishByDateList(dishes);
    }

    const resetValues = () => {
        setDateExists(false);
        setVisibility(true);
        setComment("");
        setSelect("0");
        setNb("");
        setTimeMin("12:00");
        setTimeMax("16:00");
        setDishByDateList([]);
    }   

    const resetValuesFromDate = (foundDate) => {
        setDateExists(true);
        setVisibility(foundDate.visibility);
        setComment(foundDate.comment);
        setTimeMin(foundDate.timeMin);
        setTimeMax(foundDate.timeMax);
        setSelect("0");
        setNb(""); 
        getDishByDateList(foundDate.dateC);
    }

    const onChangeDate = async (dateC) => {

        setDate(dateC);
        const foundDate = await getDateByDate(dateC);

        // si la date n'existe pas encore dans la bdd
        if (foundDate === null) resetValues();
        else resetValuesFromDate(foundDate);
    }

    const onClickDish = ({_id, idDish, numberKitchen, numberRemaining}) => {
        setUpD(true);

        setIdD(_id);
        setSelect(idDish._id);
        setNb(numberKitchen);
        setNbC(numberKitchen);
        setNbR(numberRemaining);
    }


    // HANDLE ---------------------------------------------------------------
    
    const handleVisibilityChange = (e) => {
        if (e.target.id ==='y') setVisibility(true);
        else setVisibility(false);
    }

    const handleCommentChange = (e) => setComment(e.target.value);

    const handleSelectChange = (e) => {
        setSelect(e.target.value);

        const dish = dishByDateList.filter(d => d.idDish._id === e.target.value);
        if(dish.length > 0) onClickDish(dish[0]);
        else setUpD(false);
    }

    const handleNbChange = (e) => {
        const val = e.target.value;
        if(Number(val) || val === "") setNb(val);
    }

    const handleTimeMinChange = (e) => setTimeMin(e.target.value);

    const handleTimeMaxChange = (e) => setTimeMax(e.target.value);
    

    // BD -------------------------------------------------------------------

    const saveDate = async () => {

        if (!dateExists) {
            createDate(date, visibility, comment, timeMin, timeMax, token);
            setDateExists(true);
            getDateList();
        }
        else updateDate(date, visibility, comment, timeMin, timeMax, token);
    }

    const deleteAndSetDate = async () => {
        let haveCommand = false;
        dishByDateList.forEach(d => {
            if (d.numberKitchen !== d.numberRemaining) haveCommand = true;
        });

        if (!haveCommand) {
            await deleteDate(date, token);
            await deleteAllDishesDate(date, token);
            await getDateList();
            onChangeDate(new Date(new Date().toDateString()).getTime());
        }
        else toast.error("Il y a une commande à cette date, vous ne pouvez pas la supprimer.");

        box.current.style.visibility = "hidden";
        box.current.style.opacity = 0;
    }

    const onDateSubmit = async (e) => {
        e.preventDefault();
        saveDate();        
    }

    const onDishSubmit = async (e) => {
        e.preventDefault();        
        // si on a sélectionné qqe chose :
        if (select !== "0") {
            if(nb !== "") {
                if (dateExists) {

                    let dishExists = false;
                    dishByDateList.forEach(d => {
                        if (d.idDish._id === select) dishExists = true;
                    });

                    if (!dishExists) {
                        await createDishDate(date, select, nb, token);
                        getDishByDateList(date);
                    }
                    else toast.error("Le plat existe déjà !");
                }

                // la date n'existe pas : on la crée et on ajoute le plat
                else {
                    await createDate(date, visibility, comment, timeMin, timeMax, token);
                    setDateExists(true);
                    await createDishDate(date, select, nb, token);
                    getDishByDateList(date);
                    getDateList();
                }

                setNb("");
                setSelect("0");
            }
            else toast.error("Veuillez entrer un nombre cuisine.");
        }
        else toast.error("Aucun plat n'est sélectionné.");
    }


    const onUpdateDishSubmit = async (e) => {
        e.preventDefault();

        const nbCommande = nbC - nbR;

        if (nb >= nbCommande) {
            await updateDishDate(idD, nb, nb-nbCommande);
            getDishByDateList(date);
            toast.success("La quantité a été mise à jour !")
        }
        else toast.error(`Vous ne pouvez pas mettre un nombre inférieur au nombre de commandes qui est de : ${nbCommande}.`);
    }

    const onClickDelete = async () => {
        if (currentCommandList.numberKitchen === currentCommandList.numberRemaining) {
            await deleteDishDate(currentCommandList._id, token);
            getDishByDateList(date);
        }
        else toast.error("Ce plat a déjà été commandé, vous ne pouvez pas le supprimer.");

        box.current.style.visibility = "hidden";
        box.current.style.opacity = 0;
    }

    const onClickConfirmation = () => {
        box.current.style.visibility = "hidden";
        box.current.style.opacity = 0;
    }

    const onClickDeleteIcon = (e) => {
        if(e.dateC === date) {
            setCurrentCommandList(e);
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

                        <div className='input-time'>
                            <div className="input-time___min">
                                <p>Heure min :</p>
                                <input type="time" value={timeMin} onChange={handleTimeMinChange} required/>
                            </div>
                            <div className="input-time___max">
                                <p>Heure max :</p>
                                <input type="time" value={timeMax} onChange={handleTimeMaxChange} required/>
                            </div>
                            
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
                            <div className="input-duo">
                                <InputText
                                    value={nb}
                                    placeholder="Nombre Cuisine*"
                                    handleChange={handleNbChange}
                                    required={false}
                                />
                                <InputButton value= { upD ? "Enregistrer nombre" : "Ajouter le plat à cette date" } type="button" onClick={upD ? onUpdateDishSubmit : onDishSubmit}/>
                            </div>
                        </div>

                        <div className="dish-list">
                            <DishList
                                dishByDateList={dishByDateList}
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
                                        <InputButton type="button" value="Supprimer"/>
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