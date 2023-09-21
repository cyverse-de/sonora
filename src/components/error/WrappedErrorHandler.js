/**
 * @author sriram
 *
 * A component wraps the error handler component in a div
 * and container to display it in the center of a page
 */
import React from "react";
import ErrorHandler from "./ErrorHandler";
import { Container } from "@mui/material";

export default function WrappedErrorHandler(props) {
    return (
        <div style={{ height: "65vh", overflow: "auto", margin: 10 }}>
            <Container maxWidth="sm">
                <ErrorHandler {...props} />
            </Container>
        </div>
    );
}
