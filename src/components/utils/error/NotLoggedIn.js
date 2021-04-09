import React from "react";
import ErrorHandler from "components/utils/error/ErrorHandler";

const NotLoggedIn = (props) => {
    return (
        <ErrorHandler errorObject={{ response: { status: 401 } }} {...props} />
    );
};

export default NotLoggedIn;
