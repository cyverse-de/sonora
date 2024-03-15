/**
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

const GroupingField = ({
    attribute,
    avu,
    avuFieldName,
    writable,
    ...props
}) => {
    return (
        <FastField name={`${avuFieldName}.value`} component="span" {...props} />
    );
};

export default GroupingField;
