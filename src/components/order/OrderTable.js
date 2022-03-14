import React from "react";
import DataTable, { createTheme } from 'react-data-table-component';


const OrderTable = ({data}) => {


    const columns = [
        {
            name: 'Menu',
            cell: row => (
                <div className="dish__information">
                     <span>{row.name}</span>          
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
                data={data}
                noDataComponent="Il n'y a aucun plat à cette date."
                defaultSortFieldId={1}
                theme="dark"
            />
        </div>
   );
}

export default OrderTable;