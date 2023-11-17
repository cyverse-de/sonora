/**
 * @author psarando
 */
import React from "react";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import { onCheckboxChange } from "./FormCheckbox";

const FormCheckboxTableCell = ({
    field: { value, onChange, ...field },
    form: { setFieldValue },
    ...custom
}) => (
    <TableCell padding="checkbox">
        <Checkbox
            color="primary"
            checked={!!value}
            onClick={(event) => event.stopPropagation()}
            onChange={onCheckboxChange(setFieldValue, field.name)}
            {...custom}
        />
    </TableCell>
);

export default FormCheckboxTableCell;
