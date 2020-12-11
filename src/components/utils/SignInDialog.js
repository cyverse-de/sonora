/**
 * A DEErrorDialog pre-populated with a 401 error object,
 * in order to display the dialog with a sign-in prompt.
 *
 * @author psarando
 */
import React from "react";

import DEErrorDialog from "./error/DEErrorDialog";

const SignInDialog = (props) => {
    return (
        <DEErrorDialog errorObject={{ response: { status: 401 } }} {...props} />
    );
};

export default SignInDialog;
