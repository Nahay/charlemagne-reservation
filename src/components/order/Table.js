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
                            {name: d.idDish.name, description: d.idDish.description }
                        ]
                    );
                });
            }
        }

        getSetDishes();
   
    }, [dishByDateList]);


    const columns = [
        {
            name: 'Menu',
            cell: row => (
                <div className="dish__information">
                     <span>{row.name}</span>
                    <div className="dish__description">
                        {row.description !== "" &&
                            <div className="dish__description__content">
                                <p>Description : <br/>{row.description}</p>
                            </div>
                        }
                        </div>
                </div>               
            ),
            sortable: false,
        }
    ];

    createTheme('dark', {background: {default: 'rgb(51, 51, 51)'}});


    return (
        <div className="table__container">
            <DataTable
                columns={columns}
                data={dishesList}
                noDataComponent="Il n'y a pas de menu à cette date."
                defaultSortFieldId={1}
                theme="dark"
            />
        </div>
   );
}

export default Table;