/**
 * @author psarando
 */
import { getIn } from "formik";

const getFormError = (name, touched, errors) => {
    const error = getIn(errors, name);
    const touch = getIn(touched, name);

    return touch && error ? error : null;
};

export default getFormError;
