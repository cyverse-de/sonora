import React, { useState } from "react";

import ids from "./ids";
import styles from "./styles";

import { build } from "@cyverse-de/ui-lib";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";
import PropTypes from "prop-types";

function SimpleExpansionPanel(props) {
    const {
        header,
        parentId,
        defaultExpanded,
        children,
        classes,
        hasErrors,
    } = props;
    const [expanded, setExpanded] = useState(defaultExpanded);

    const handleChange = (event, isExpanded) => {
        setExpanded(!!(isExpanded || hasErrors));
    };

    return (
        <Accordion
            defaultExpanded={defaultExpanded}
            expanded={expanded || hasErrors}
            onChange={handleChange}
        >
            <AccordionSummary
                expandIcon={
                    <ExpandMore
                        id={build(parentId, ids.BUTTONS.EXPAND)}
                        className={classes.paramsViewsExpandIcon}
                    />
                }
                className={classes.paramsViewSummary}
            >
                <Typography variant="body1">{header}</Typography>
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.expansionDetails }}>
                <div>{children}</div>
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

export default withStyles(styles)(SimpleExpansionPanel);
