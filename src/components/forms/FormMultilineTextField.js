/**
 * @author psarando
 */
import React from "react";
import FormTextField from "./FormTextField";

const FormMultilineTextField = (props) => (
    <FormTextField multiline minRows={3} {...props} />
);

export default FormMultilineTextField;
