import React from "react";
import ErrorHandler from "components/utils/error/ErrorHandler";

const NotAuthorized = (props) => {
    return (
        <ErrorHandler errorObject={{ response: { status: 403 } }} {...props} />
    );
};

export default NotAuthorized;
