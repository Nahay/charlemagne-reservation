import React, {useState, useEffect, useRef} from 'react';

import { toast } from 'react-toastify';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import InputText from '../../components/generic/InputText';
import InputButton from '../../components/generic/InputButton';
import TextArea from '../../components/generic/TextArea';
import AllDishesList from '../../components/admin/AllDishesList';
import Box from '../../components/generic/Box';

import { getDishes, updateDish, createDish, hideDish, getInvisibleDishes, unhideDish, getDishByName } from "../../services/dishesService";


const AdminDishes = () => {

    const token = localStorage.getItem("adminToken");

    const box = useRef(null);
    const e = useRef(null);
    const p = useRef(null);
    const de = useRef(null);
    const di = useRef(null);
    const inv = useRef(null);
    

    const [id, setId] = useState("");
    const [type, setType] = useState('e');
    const [price, setPrice] = useState("");
    const [name, setName] = useState("");
    const [previousName, setPreviousName] = useState("");
    const [desc, setDesc] = useState("");

    const [create, setCreate] = useState(true);
    const [dishList, setDishList] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [invisible, setInvisible] = useState(false);   


    useEffect(() => {
        async function initDishList(fType) {
            const dishes = await getDishes();
            setDishList(dishes);
    
            filterDishes(fType, dishes);
        }

        initDishList('e');
    }, []);

    const getDishList = async (fType) => {
        const dishes = await getDishes();
        setDishList(dishes);

        filterDishes(fType, dishes);
    }

    const getInvisibleList = async () => {
        const dishes = await getInvisibleDishes();
        setFiltered(dishes);
        setInvisible(true);

        if (localStorage.getItem('theme') === 'light') {
            e.current.style.color = "black";
            p.current.style.color = "black";
            de.current.style.color = "black";
            di.current.style.color = "black";
            inv.current.children[0].style.color = "white";
        }

        e.current.style.background = "none";
        p.current.style.background = "none";
        de.current.style.background = "none";
        di.current.style.background = "none";
        inv.current.style.background = "rgb(255, 97, 79)";
    }

    const filterDishes = (fType, list) => {
        const newList = list.filter(d => d.type === fType)
        setFiltered(newList);
        setInvisible(false);
        
        e.current.style.background = "none";
        p.current.style.background = "none";
        de.current.style.background = "none";
        di.current.style.background = "none";
        inv.current.style.background = "none";

        if (localStorage.getItem('theme') === 'light') {
            e.current.style.color = "black";
            p.current.style.color = "black";
            de.current.style.color = "black";
            di.current.style.color = "black";
            inv.current.children[0].style.color = "black";

            if (fType === "e") {
                e.current.style.background = "rgb(255, 97, 79)";
                e.current.style.color = "white";
            }
            else if (fType === "p") {
                p.current.style.background = "rgb(255, 97, 79)";
                p.current.style.color = "white";
            }
            else if (fType === "de") {
                de.current.style.background = "rgb(255, 97, 79)";
                de.current.style.color = "white";
            }

            else {
                di.current.style.background = "rgb(255, 97, 79)";
                di.current.style.color = "white";
            }
        }

        else {
            if (fType === "e") { e.current.style.background = "rgb(255, 97, 79)" }
            else if (fType === "p") { p.current.style.background = "rgb(255, 97, 79)" }
            else if (fType === "de") { de.current.style.background = "rgb(255, 97, 79)" }
            else di.current.style.background = "rgb(255, 97, 79)";
        }
    }


    // HANDLE ---------------------------------------------------------------

    const handleRadioChange = (e) => {
        switch (e.target.id) {
            case 'e' :
                setType('e');
                break;
            case 'p' :
                setType('p');
                break;
            case 'de' :
                setType('de');
                break;
            case 'di' :
                setType('di');
                break;
            default:
                break;
        }
    }

    const handleNameChange = (e) => { setName(e.target.value) }

    const handlePriceChange = (e) => {
        const val = e.target.value;
        if(Number(val) || val === "") setPrice(val);
    }

    const handleDescChange = (e) => { setDesc(e.target.value) }


    // SET STATES ------------------------------------------------------------

    const onClickDish = ({ _id, name, price, description, type }) => {
        setCreate(false);
        setId(_id);
        setName(name);
        setPreviousName(name);
        setPrice(price);
        setDesc(description);
        setType(type);
    }

    const onClickNewDish = () => {
        setCreate(true);
        setType('e');
        setName("");
        setPrice("");
        setDesc("");
    }


    // DB -------------------------------------------------------------------

    const onClickDelete = async () => {
        box.current.style.visibility = "hidden";
        box.current.style.opacity = 0;

        const fType = await hideDish(id, token);

        onClickNewDish();

        getDishList(fType);

    }

    const onClickConfirmation = () => {
        box.current.style.visibility = "hidden";
        box.current.style.opacity = 0;
    }

    const onClickDishDelete = (idToDelete) => {
        box.current.style.visibility = "visible";
        box.current.style.opacity = 1;
        setId(idToDelete);
    }

    
    const onClickInvisible = async (hiddenId) => {
        const fType = await unhideDish(hiddenId, token);
        getDishList(fType);
    }


    const onSubmit = async (e) => {
        e.preventDefault();

        try {

            // submit for a new dish
            if (create) {
                const count = await getDishByName(name);
                if (!count) {
                    await createDish(name, price, desc, type, token);
                    onClickNewDish();
                    getDishList(type);
                }
                else if (!count.visible) toast.error("Ce nom est déjà assigné à un plat actuellement invisible.");
                else toast.error("Ce nom existe déjà.");
            }
    
            // submit for changing a dish
            else {
                if (name !== previousName) {
                    const count = await getDishByName(name);
                    if (!count) {
                        await updateDish(id, name, price, desc, type, token);
                        setPreviousName(name);
                        getDishList(type);
                    }
                    else if (!count.visible) toast.error("Ce nom est déjà assigné à un plat actuellement invisible.");
                    else toast.error("Ce nom existe déjà.");
                }
                else {
                    await updateDish(id, name, price, desc, type, token);
                    setPreviousName(name);
                    getDishList(type);
                }
            }

        } catch(err) { toast.error("Il y a eu une erreur.") }
    }


    // RENDER --------------------------------------------------------------

    return (
        <div className="admin-dishes">
            <Box onClickConfirmation={onClickConfirmation} onClickDelete={onClickDelete} boxRef={box} message="Voulez-vous vraiment supprimer ce plat ?"/>
            <div className="admin-dishes__left">
                <div className="left__dishes-list">

                    <div className="left__icons">
                        <input value="Entrées" ref={e} onClick={() => filterDishes("e", dishList)} readOnly/>
                        <input value="Plats" ref={p} onClick={() => filterDishes("p", dishList)} readOnly/>
                        <input value="Desserts" ref={de} onClick={() => filterDishes("de", dishList)} readOnly/>
                        <input value="Divers" ref={di} onClick={() => filterDishes("di", dishList)} readOnly/>
                        <div className="inv-container" ref={inv} onClick={() => getInvisibleList()}>
                            <FontAwesomeIcon icon={faEye} size="lg"/>
                        </div>
                    </div>
                    
                    <AllDishesList
                        dishList={filtered}
                        invisible={invisible}
                        onClickDish={onClickDish}
                        onClickDelete={onClickDishDelete}
                        onClickInvisible={onClickInvisible}
                    />

                </div>
            </div>
            
            <div className="admin-dishes__right">
                <div className="btn">
                    <button onClick={onClickNewDish}>Nouveau plat</button>
                </div>
                <form className="right__form" onSubmit={onSubmit}>
                    
                    <div className="right__form__radio" onChange={handleRadioChange}>
                        <input
                            type="radio"
                            value="Entrée"
                            name="typePlat"
                            id="e"
                            checked={type === 'e'}
                            readOnly
                        />
                        <label htmlFor="e">Entrée</label>
                        <input
                            type="radio"
                            value="Plat"
                            name="typePlat"
                            id="p"
                            checked={type === 'p'}
                            readOnly
                        />
                        <label htmlFor="p">Plat</label>
                        <input
                            type="radio"
                            value="Dessert"
                            name="typePlat"
                            id="de"
                            checked={type === 'de'}
                            readOnly
                        />
                        <label htmlFor="de">Dessert</label>
                        <input
                            type="radio"
                            value="Dessert"
                            name="typePlat"
                            id="di"
                            checked={type === 'di'}
                            readOnly
                        />
                        <label htmlFor="di">Divers</label>
                    </div>
                    <span>Nom :</span>
                    <InputText
                        value={name}
                        placeholder="Nom du plat*"
                        handleChange={handleNameChange}
                    />
                    <span>Prix :</span>
                    <InputText
                        value={price}
                        placeholder="Prix*"
                        handleChange={handlePriceChange}
                    />
                    <span>Description (facultative) :</span>
                    <TextArea
                        value={desc}
                        placeholder="Description"
                        required={false}
                        handleChange={handleDescChange}
                    />
                    <InputButton value={create? "Créer" : "Enregistrer"} type="submit"/>
                </form>
            </div>
        </div>
    );
};

export default AdminDishes;