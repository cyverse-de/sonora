import React, { useState } from "react";

import styles from "./styles";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    makeStyles,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import PropTypes from "prop-types";

const useStyles = makeStyles(styles);

function SimpleExpansionPanel(props) {
    const { header, defaultExpanded, children, hasErrors } = props;
    const [expanded, setExpanded] = useState(defaultExpanded);
    const classes = useStyles();

    const handleChange = (event, isExpanded) => {
        setExpanded(!!(isExpanded || hasErrors));
    };

    return (
        <Accordion onChange={handleChange} expanded={expanded}>
            <AccordionSummary
                expandIcon={
                    <ExpandMore className={classes.paramsViewsExpandIcon} />
                }
                className={classes.paramsViewSummary}
            >
                <Typography variant="body1">{header}</Typography>
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.expansionDetails }}>
                {children}
            </AccordionDetails>
        </Accordion>
    );
}

SimpleExpansionPanel.defaultProps = {
    defaultExpanded: true,
};

SimpleExpansionPanel.propTypes = {
    header: PropTypes.any.isRequired,
    defaultExpanded: PropTypes.bool,
    hasErrors: PropTypes.bool,
    children: PropTypes.any.isRequired,
};

export default SimpleExpansionPanel;
