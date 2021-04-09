import React from "react";
import ErrorHandler from "components/utils/error/ErrorHandler";
import { signInErrorResponse } from "./errorCode";

const NotLoggedIn = (props) => {
    return <ErrorHandler errorObject={signInErrorResponse} {...props} />;
};

export default NotLoggedIn;
