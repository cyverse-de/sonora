/**
 * @author psarando
 */
import React from "react";
import Slide from "@mui/material/Slide";

export default React.forwardRef(function SlideUpTransition(props, ref) {
    return <Slide ref={ref} direction="up" {...props} />;
});
