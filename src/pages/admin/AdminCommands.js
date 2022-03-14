import React, { useState, useEffect, useRef } from "react";

import { toast } from "react-toastify";
import moment from "moment";
import "moment/locale/fr";
import ReactExport from 'react-data-export';

import InputText from "../../components/generic/InputText";
import TextArea from "../../components/generic/TextArea";
import InputButton from "../../components/generic/InputButton";
import AdminCalendar from "../../components/admin/AdminCalendar";
import Box from "../../components/generic/Box";
import CommandsList from "../../components/admin/CommandsList";
import DishCommandList from "../../components/admin/DishCommandList";

import { getDateByDate, getDates } from "../../services/calendarService";
import { hideCommand, deleteCommand, getCommandByDate, updateCommand, getNbOfDishByDay } from "../../services/commandsService";
import { deleteCommandList, updateQuantity, getCommandListById } from "../../services/commandsListService";
import {  getDishById } from "../../services/dishesService";


const AdminCommands = () => {

  const token = localStorage.getItem("adminToken");

  const ref = useRef(null);
  const boxCommand = useRef(null);
  const boxCommandList = useRef(null);
  
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

  const [date, setDate] = useState(new Date(new Date().toDateString()).getTime());

  const [id, setId] = useState("");
  const [commandId, setCommandId] = useState("");
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [time, setTime] = useState("");
  const [container, setContainer] = useState(false);
  const [total, setTotal] = useState(0);
  const [comment, setComment] = useState("");
  const [emptyFields, setEmptyFields] = useState(true);
  const [paid, setPaid] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [currentCommandList, setCurrentCommandList] = useState([]);
  const [dishClicked, setDishClicked] = useState(false);

  const [currentDelete, setCurrentDelete] = useState("");

  const [dishList, setDishList] = useState([]);
  const [dateList, setDatesList] = useState([]);
  const [commandsList, setCommandsList] = useState([]);
  const [visibleCommandsList, setVisibleCommandsList] = useState([]);
  const [pastDate, setPastDate] = useState(false);

  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    async function getCommandsByDate() {
      const commands = await getCommandByDate(date, token);
      setCommandsList(commands);
      const visibleCommands = commands.filter((c) => c.visible);
      setVisibleCommandsList(visibleCommands);
    };

    getDateList();
    getCommandsByDate();
  }, [date]);

  const getDateList = async () => {
    const dates = await getDates();
    setDatesList(dates);
  }

  const getCommandsByDate = async () => {
    const commands = await getCommandByDate(date, token);
    setCommandsList(commands);

    const visibleCommands = commands.filter((c) => c.visible);
    setVisibleCommandsList(visibleCommands);
  };


  const getDishList = async (commandId) => {
    const d = commandsList.filter((d) => d._id === commandId)[0].list;
    setDishList(d);
  }

  const onChangeDate = async (e) => {
    setDate(e);
    resetInput();
    getCommandsByDate();
    setDishClicked(false);
    setPastDate(e < new Date(new Date().toDateString()).getTime());
  }

  const onClickCommand = (d) => {
    getDishList(d._id);
    setId(d._id);
    setEmptyFields(false);
    setCommandId(d._id);
    setName(d.user.name);
    setFirstname(d.user.firstname);
    setContainer(d.container);
    setTotal(d.total);
    setTime(d.timeC);
    setComment(d.comment);
    setPaid(d.paid);

    setCurrentCommandList(d.list);
    setDishClicked(false);
    setQuantity(0);
  }

  const onClickDish = (d) => {
    setQuantity(d.quantity);
    setCurrentCommandList(d);
    setDishClicked(true);
  }

  // suppression de la commande (invisible)
  const handleHideCommand = async () => {

    await hideCommand(currentDelete, token);
    
    getCommandsByDate();
    resetInput();

    boxCommand.current.style.visibility = "hidden";
    boxCommand.current.style.opacity = 0;
  }

  // apparition de la box pour supprimer la commande
  const onClickCommandDelete =  (commandListId) => {
    boxCommand.current.style.visibility = "visible";
    boxCommand.current.style.opacity = 1;
    setCurrentDelete(commandListId);
  }

  // suppression d'un plat d'une commande
  const handleDeleteCommandList = async () => {
    const cl = await getCommandListById(currentDelete, token);

    await deleteCommandList(cl[0]._id, token);

    const remaining = commandsList.filter((c) => c._id === id)[0].list.length;
    remaining === 1 && await deleteCommand(id, token);

    getCommandsByDate();
    resetInput();

    boxCommandList.current.style.visibility = "hidden";
    boxCommandList.current.style.opacity = 0;
  }

  // apparition de la box pour supprimer un plat d'une commande
  const onClickCommandListDelete =  (_id) => {
    if(!pastDate) {
      boxCommandList.current.style.visibility = "visible";
      boxCommandList.current.style.opacity = 1;
      setCurrentDelete(_id);
    }
    else toast.error("Le contenu de la commande ne peut être modifié.")
  }

  // bouton annuler sur la box
  const removeBoxCommand = () => {
    boxCommand.current.style.visibility = "hidden";
    boxCommand.current.style.opacity = 0;
  }
  const removeBoxCommandList = () => {
    boxCommandList.current.style.visibility = "hidden";
    boxCommandList.current.style.opacity = 0;
  }

  const onCommandSubmit = async (e) => {
    e.preventDefault();

    if(emptyFields) toast.error("Veuillez sélectioner une commande avant de pouvoir enregistrer.");

    else {
      await updateCommand(commandId, time, paid, container, comment, total, token);

      getCommandsByDate();
      resetInput();
    }    
  }

  const onModifyQuantity = async () => {

    if(quantity === "") {
      toast.error("Veuillez renseigner une quantité.")
      return;
    }

    const dish = await getDishById(currentCommandList.dishID._id);

    // Calcul pour le total étant donné que la quantité change
    // pour ne pas créer d'anomalie il est en readOnly
    let t = total - dish.price * currentCommandList.quantity + dish.price * quantity;
    setTotal(t);

    // on donne la nouvelle valeur de la quantité dans le state
    currentCommandList.quantity = parseInt(quantity);

    // update le nombre dispo en cuisine

    // update la quantité dans la command list
    await updateQuantity(currentCommandList._id, quantity, token);

    setDishClicked(false);
    setQuantity("");
    getDishList(id);
    
  }

  const resetInput = () => {
    setName("");
    setFirstname("");
    setContainer(false);
    setComment("");
    setDishList([]);
    setTotal(0);
    setTime("");
    setQuantity("");
    setPaid(false);
  }

  // HANDLE

  const handleQuantityChange = (e) => (Number(e.target.value) || e.target.value === "") && setQuantity(e.target.value)

  const handleCommentChange = (e) => setComment(e.target.value)

  const handleNameChange = (e) => setName(e.target.value)

  const handleFirstnameChange = (e) => setFirstname(e.target.value)

  const handleTimeChange = (e) => setTime(e.target.value)

  const handleCheckboxChange = (e) => (e.target.checked = true)

  const handleTotalChange = (e) => {
    const val = e.target.value;
    if (Number(val) || val === "") setTotal(val);
  }

  const handleContainerChange = (e) => {
    if (e.target.id === "y---container") setContainer(true);
    else setContainer(false);
  }


  // RENDER ----------------------------------------------------------------

  return (
    <div className="admin-commands">

      
    </div>
  );
};

export default AdminCommands;