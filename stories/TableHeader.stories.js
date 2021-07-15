import React, { useState } from "react";

import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";

import EnhancedTableHead from "../src/util/table/EnhancedTableHead";
import DECheckbox from "../src/util/table/DECheckbox";

export const DETableHeader = () => {
    const [checked, setChecked] = useState(false);

    const logger = (msg) => console.log(msg);

    const headCells = [
        {
            id: "name",
            align: "left",
            enableSorting: true,
            name: "Dessert (100g serving)",
        },
        { id: "calories", align: "left", name: "Calories" },
        { id: "fat", align: "left", name: "Fat (g)" },
        { id: "carbs", align: "left", name: "Carbs (g)" },
        { id: "protein", align: "left", name: "Protein (g)" },
    ];

    const createData = (name, calories, fat, carbs, protein) => {
        return { name, calories, fat, carbs, protein };
    };

    const rows = [
        createData("Cupcake", 305, 3.7, 67, 4.3),
        createData("Donut", 452, 25.0, 51, 4.9),
        createData("Eclair", 262, 16.0, 24, 6.0),
        createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
        createData("Gingerbread", 356, 16.0, 49, 3.9),
        createData("Honeycomb", 408, 3.2, 87, 6.5),
        createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
        createData("Jelly Bean", 375, 0.0, 94, 0.0),
        createData("KitKat", 518, 26.0, 65, 7.0),
        createData("Lollipop", 392, 0.2, 98, 0.0),
        createData("Marshmallow", 318, 0, 81, 2.0),
        createData("Nougat", 360, 19.0, 9, 37.0),
        createData("Oreo", 437, 18.0, 63, 4.0),
    ];

    return (
        <Table>
            <EnhancedTableHead
                selectable={true}
                numSelected={checked ? 1 : 0}
                onSelectAllClick={() => setChecked(!checked)}
                rowsInPage={1}
                order="asc"
                orderBy="name"
                baseId="exampleId"
                columnData={headCells}
                onRequestSort={() => logger("Sort")}
                selectAllLabel="Select All"
                sortLabel="Sort"
            />
            <TableBody>
                {rows.map((row, index) => (
                    <TableRow hover key={index}>
                        <TableCell padding="checkbox">
                            <DECheckbox />
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.calories}</TableCell>
                        <TableCell>{row.fat}</TableCell>
                        <TableCell>{row.carbs}</TableCell>
                        <TableCell>{row.protein}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default {
    title: "TableHeader",
};
