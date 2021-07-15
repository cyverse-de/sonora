/**
 * @author psarando
 */
import React from "react";
import FormTextField from "./FormTextField";

const FormMultilineTextField = (props) => (
    <FormTextField multiline rows={3} {...props} />
);

export default FormMultilineTextField;
