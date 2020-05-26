import React, { useState } from "react";

import classnames from "classnames";

import {
    Card,
    CardActions,
    CardContent,
    Chip,
    Collapse,
    IconButton,
    Typography,
    CardHeader,
} from "@material-ui/core";

import { ExpandMore } from "@material-ui/icons";

import { getMessage as msg, withI18N } from "@cyverse-de/ui-lib";

import useStyles from "./styles";
import messages from "./messages";
import ids from "./ids";
import { id } from "./functions";

import {
    CommonFilterSection,
    DeploymentFilterSection,
    PodFilterSection,
    ServiceFilterSection,
} from "./sections";

const FilterChip = ({ label, handleDelete }) => {
    const [deleted, setDeleted] = useState(false);
    const classes = useStyles();

    const fixedLabel = label.startsWith("$.") ? label.slice(2) : label;

    const chipDelete = (event, element) => {
        setDeleted(true);
        if (handleDelete) {
            handleDelete(event, element);
        }
    };

    if (!deleted) {
        return (
            <Chip
                className={classes.chip}
                label={fixedLabel}
                onDelete={chipDelete}
                color="primary"
            />
        );
    }
};

const AnalysesFilter = ({ filters, addToFilters, deleteFromFilters }) => {
    const classes = useStyles();
    const [isExpanded, setIsExpanded] = useState(false);

    const filtersPresent = Object.entries(filters).length > 0;

    return (
        <Card id={id(ids.ROOT)} className={classes.root}>
            <CardHeader title={msg("activeFilters")} />
            <CardContent>
                {filtersPresent ? (
                    <div className={classes.chips}>
                        {Object.entries(filters).map(([key, value], index) => (
                            <FilterChip
                                key={`${key}-${index}`}
                                label={`${key}=${value}`}
                                handleDelete={(_ev, _el) =>
                                    deleteFromFilters(key)
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <Typography classes={{ body1: classes.info }}>
                        {msg("noActiveFilters")}
                    </Typography>
                )}
            </CardContent>

            <CardActions disableSpacing>
                <IconButton
                    className={classnames(classes.expand, {
                        [classes.expandOpen]: isExpanded,
                    })}
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    aria-label={msg("showFilterOptions")}
                >
                    <ExpandMore />
                </IconButton>
            </CardActions>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <div className={classes.collapse}>
                    <CommonFilterSection addToFilters={addToFilters} />
                    <DeploymentFilterSection addToFilters={addToFilters} />
                    <ServiceFilterSection addToFilters={addToFilters} />
                    <PodFilterSection addToFilters={addToFilters} />
                </div>
            </Collapse>
        </Card>
    );
};

export default withI18N(AnalysesFilter, messages);
