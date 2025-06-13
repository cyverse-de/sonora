/**
 *
 * A MUI accordion that allows for displaying and
 * hiding additional content when clicked.
 *
 */

import React, { useState } from "react";

import ids from "./ids";

import buildID from "components/utils/DebugIDUtil";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { ExpandMore } from "@mui/icons-material";
import PropTypes from "prop-types";

const styles = (theme) => ({
    expansionDetails: {
        flexDirection: "column",
    },
    paramsViewSummary: {
        color: theme.palette.info.contrastText,
        backgroundColor: theme.palette.info.main,
    },
    paramsViewsExpandIcon: {
        color: theme.palette.info.contrastText,
    },
});

const useStyles = makeStyles()(styles);

function SimpleExpansionPanel(props) {
    const {
        header,
        parentId,
        defaultExpanded = true,
        children,
        hasErrors,
    } = props;
    const [expanded, setExpanded] = useState(defaultExpanded);
    const { classes } = useStyles();

    const handleChange = (event, isExpanded) => {
        setExpanded(!!(isExpanded || hasErrors));
    };

    return (
        <Accordion onChange={handleChange} expanded={expanded}>
            <AccordionSummary
                expandIcon={
                    <ExpandMore
                        id={buildID(parentId, ids.BUTTONS.EXPAND)}
                        className={classes.paramsViewsExpandIcon}
                    />
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

SimpleExpansionPanel.propTypes = {
    header: PropTypes.any.isRequired,
    parentId: PropTypes.string.isRequired,
    defaultExpanded: PropTypes.bool,
    hasErrors: PropTypes.bool,
    children: PropTypes.any.isRequired,
};

export default SimpleExpansionPanel;
