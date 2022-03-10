import React, { useState, useEffect } from "react";

import DataTable, { createTheme } from 'react-data-table-component';


const Table = ({dishByDateList}) => {

    const [dishesList, setDishesList] = useState([]);


    useEffect(() => {

        async function getSetDishes() {
        
            setDishesList([]);
            if (dishByDateList !== []) {
    
                dishByDateList.forEach(async d => {
                    setDishesList(dishesList =>
                        [...dishesList,
                            {type: getTypeName(d.idDish.type), name: d.idDish.name, nb: d.numberRemaining, description: d.idDish.description }
                        ]
                    );
                });
            }
        }

        getSetDishes();
   
    }, [dishByDateList]);


    const getTypeName = (type) => {
        switch (type) {
            case "e":
                return "Entrée";
            case "p":
                return "Plat";
            case "de":
                return "Dessert";
            case "di":
                return "Divers";
            default:
                return
        }
    }

    const columns = [
        {
            name: 'Type',
            selector: row => row.type,
            sortable: true,
        },
        {
            name: 'Nom',
            cell: row => (
                <div className="dish__information">
                     <span>{row.name}</span>
                    <div className="dish__description">
                            <div className="dish__description__content">
                                <p>Description : <br/>{row.description}</p>
                            </div>
                        </div>
                </div>               
            ),
            sortable: true,
        },
        {
            name: 'Nombre Dispo',
            selector: row => row.nb,
        }
    ];

    createTheme('dark', {background: {default: 'rgb(51, 51, 51)'}});


    return (
        <div className="table__container">
            <DataTable
                columns={columns}
                data={dishesList}
                noDataComponent="Il n'y a aucun plat à cette date."
                defaultSortFieldId={1}
                theme="dark"
            />
        </div>
   );
}

export default Table;