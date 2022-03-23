import React, { useState, useEffect, useRef } from "react";

import { toast } from "react-toastify";
import moment from "moment";
import "moment/locale/fr";
import InputText from "../../components/generic/InputText";
import TextArea from "../../components/generic/TextArea";
import InputButton from "../../components/generic/InputButton";
import AdminCalendar from "../../components/admin/AdminCalendar";
import Box from "../../components/generic/Box";
import CommandsList from "../../components/admin/CommandsList";

import { getDateByDate, getDates, updateDateNbR, downloadExcel } from "../../services/calendarService";
import { hideCommand, getCommandByDate, updateCommand, getCommandById } from "../../services/commandsService";

const ExcelJS = require('exceljs');

const AdminCommands = () => {  
  const token = localStorage.getItem("adminToken");

  const ref = useRef(null);
  const boxCommand = useRef(null);
  

  const [date, setDate] = useState(new Date(new Date().toDateString()).getTime());

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [nbP, setNbP] = useState("");
  const [total, setTotal] = useState("");
  const [comment, setComment] = useState("");
  const [emptyFields, setEmptyFields] = useState(true);

  const [currentDelete, setCurrentDelete] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const [dateList, setDatesList] = useState([]);

  // pour le rapport 
  const [commandsList, setCommandsList] = useState([]);
  // pour le composant commandslist
  const [visibleCommandsList, setVisibleCommandsList] = useState([]);
  const [pastDate, setPastDate] = useState(false);

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

  const onChangeDate = async (e) => {
    setDate(e);
    resetInput();
    getCommandsByDate();
    setPastDate(e < new Date(new Date().toDateString()).getTime());

    let currentD = dateList.filter(d => d.dateC === e);
    setCurrentDate(currentD[0]);
  }

  const onClickCommand = (d) => {
    setId(d._id);
    setEmptyFields(false);
    setName(d.name);
    setTel(d.tel);
    setNbP(d.nbPlaces);
    setTotal(d.total);
    setComment(d.comment);
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

  // bouton annuler sur la box
  const removeBoxCommand = () => {
    boxCommand.current.style.visibility = "hidden";
    boxCommand.current.style.opacity = 0;
  }

  const onCommandSubmit = async (e) => {
    e.preventDefault();

    if(emptyFields) toast.error("Veuillez sélectioner une commande avant de pouvoir enregistrer.");
    else {
      const currentDate = await getDateByDate(date);
      const currentCommand = await getCommandById(id, token);

      let nbPlacesMax = parseInt(currentDate.nbRemaining + currentCommand.nbPlaces);

      if(nbPlacesMax >= nbP) {
        await updateCommand(id, nbP, comment, total, token);

        let nbRemaining = nbPlacesMax - parseInt(nbP);
        await updateDateNbR(date, nbRemaining, true, token);

        getCommandsByDate();
        resetInput();
      }
      else toast.error("Le nombre de places ne peut être supérieur à " + nbPlacesMax);
    }    
  }

  const resetInput = () => {
    setName("");
    setTel("");
    setTotal("");
    setNbP("");
    setComment("");
  }

  const onClickCSV = async () => {
    await downloadExcel();
  }
  // HANDLE ---------------------------------------------------------------

  const handleNbPChange = (e) => {
    const val = e.target.value;
    if (Number(val) || val === "") {
      setNbP(val);
      setTotal(val*currentDate.price);
    }
  }

  const handleCommentChange = (e) => setComment(e.target.value)


  // RENDER ----------------------------------------------------------------

  return (
    <div className="admin-commands">

      <Box onClickConfirmation={removeBoxCommand} onClickDelete={handleHideCommand} boxRef={boxCommand} message="Voulez-vous vraiment supprimer cette commande ?"/>

      <div className="admin-commands__left">
        <div className="left__commands-list">
          <AdminCalendar
            rightRef={ref}
            dateList={dateList}
            onChangeDate={onChangeDate}
          />
          
          { commandsList.length > 0 &&
          
          <div className="csv__download">
            <button onClick={onClickCSV}>Télécharger le rapport</button>
          </div>
          }
        </div>
      </div>

      <div className="admin-commands__right" ref={ref}>
        <h1 className="right__date">
          {moment(date).locale("fr").format("LL")}
        </h1>
        <div className="commands-list">
          <CommandsList
            commandsListByDate={visibleCommandsList}
            onClickCommand={onClickCommand}
            onClickDelete={onClickCommandDelete}
          />
        </div>
        <div className="right__form">
          <form className="right__form__1" onSubmit={onCommandSubmit}>

            <div className="input-duo">
              <div className="duo-content read">
                <span>Nom : </span>
                <InputText
                value={name}
                placeholder="Nom"
                readOnly
              />
              </div>
              <div className="duo-content read">
                <span>Tel : </span>
                <InputText
                value={tel}
                placeholder="Tel"
                readOnly
              />
              </div>            
            </div>

            <div className="input-duo">
              <div className="duo-content">
                <span>Nombre de personnes : </span>
                <InputText
                  value={nbP}
                  placeholder="Nombre de personnes"
                  handleChange={handleNbPChange}
                />
              </div>
              <div className="duo-content read">
                <span>Total : </span>
                <InputText value={total+"€"} placeholder="Total" readOnly={true}/>
              </div>            
            </div>

            <TextArea
              value={comment}
              placeholder="Commentaire..."
              handleChange={handleCommentChange}
              required={false}
            />

            {!pastDate &&  
            <div className="input-btn---save">
              <InputButton value="Enregistrer" type="submit" />
            </div> }
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCommands;