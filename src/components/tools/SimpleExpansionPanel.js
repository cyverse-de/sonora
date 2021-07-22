import React, { useState } from "react";

import ids from "./ids";
import styles from "./styles";

import buildID from "components/utils/DebugIDUtil";

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
    const { header, parentId, defaultExpanded, children, hasErrors } = props;
    const [expanded, setExpanded] = useState(defaultExpanded);
    const classes = useStyles();

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

SimpleExpansionPanel.defaultProps = {
    defaultExpanded: true,
};

SimpleExpansionPanel.propTypes = {
    header: PropTypes.any.isRequired,
    parentId: PropTypes.string.isRequired,
    defaultExpanded: PropTypes.bool,
    hasErrors: PropTypes.bool,
    children: PropTypes.any.isRequired,
};

export default SimpleExpansionPanel;
