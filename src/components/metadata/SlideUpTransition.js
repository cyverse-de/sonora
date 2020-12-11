/**
 * @author psarando
 */
import React from "react";
import Slide from "@material-ui/core/Slide";

export default React.forwardRef((props, ref) => (
    <Slide ref={ref} direction="up" {...props} />
));
