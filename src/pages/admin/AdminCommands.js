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

import { getDates } from "../../services/calendarService";
import { hideCommand, deleteCommand, getCommandByDate, updateCommand } from "../../services/commandsService";
import { deleteCommandList, getCommandListById } from "../../services/commandsListService";


const AdminCommands = () => {

  const token = localStorage.getItem("adminToken");

  const ref = useRef(null);
  const boxCommand = useRef(null);
  const boxCommandList = useRef(null);
  
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

  const [date, setDate] = useState(new Date(new Date().toDateString()).getTime());

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [nbP, setNbP] = useState("");
  const [total, setTotal] = useState(0);
  const [comment, setComment] = useState("");
  const [emptyFields, setEmptyFields] = useState(true);

  const [currentDelete, setCurrentDelete] = useState("");

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

  const onChangeDate = async (e) => {
    setDate(e);
    resetInput();
    getCommandsByDate();
    setPastDate(e < new Date(new Date().toDateString()).getTime());
  }

  const onClickCommand = (d) => {
    setId(d._id);
    setEmptyFields(false);
    setName(d.user.name);
    setNbP(d.user.firstname);
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
      await updateCommand(id, comment, total, token);

      getCommandsByDate();
      resetInput();
    }    
  }

  const resetInput = () => {
    setName("");
    setNbP("");
    setComment("");
    setTotal(0);
  }


  // HANDLE ---------------------------------------------------------------

  const handleNameChange = (e) => setName(e.target.value)

  const handleNbPChange = (e) => {
    const val = e.target.value;
    if (Number(val) || val === "") setNbP(val);
  }

  const handleTotalChange = (e) => {
    const val = e.target.value;
    if (Number(val) || val === "") setTotal(val);
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
                <ExcelFile filename={`RAPPORT-${moment(date).format("DD-MM-YYYY")}`} element={<button>Télécharger le rapport</button>}>
                    <ExcelSheet dataSet={csvData} name={`RAPPORT-${moment(date).format("DD-MM-YYYY")}`}/>
                </ExcelFile>
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
              <InputText
                value={name}
                placeholder="Nom"
                id="Name"
                divId="inputName"
                handleChange={handleNameChange}
                readOnly
              />
              <InputText
                value={nbP}
                placeholder="Nombre de places"
                id="nbP"
                divId="inputNbP"
                handleChange={handleNbPChange}
                readOnly
              />
            </div>

            <div className="total__content">
              <p>Total :</p>
              <InputText value={total+" €"} handleChange={handleTotalChange} readOnly/>
            </div>

            <TextArea
              value={comment}
              placeholder="Commentaire..."
              id="comment"
              handleChange={handleCommentChange}
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