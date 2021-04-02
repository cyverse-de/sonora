/**
 * A DEErrorDialog pre-populated with a 401 error object,
 * in order to display the dialog with a sign-in prompt.
 *
 * @author psarando
 */
import React from "react";

import DEErrorDialog from "./error/DEErrorDialog";
import { signInErrorResponse } from "./error/errorCode";

const SignInDialog = (props) => {
    return <DEErrorDialog errorObject={signInErrorResponse} {...props} />;
};

export default SignInDialog;
