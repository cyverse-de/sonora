import React, { useState } from "react";

import classnames from "classnames";

import {
    Card,
    CardActions,
    CardContent,
    Chip,
    Collapse,
    IconButton,
    makeStyles,
} from "@material-ui/core";

import { ExpandMore } from "@material-ui/icons";

import { build as buildID, withI18N } from "@cyverse-de/ui-lib";

import messages from "./messages";
import ids from "./ids";

const id = (name) => buildID(ids.BASE, name);

const useStyles = makeStyles((theme) => ({
    actions: {
        display: "flex",
    },
    chip: {
        margin: theme.spacing(1),
    },
    chips: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    },
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
    root: {
        marginBottom: theme.spacing(4),
    },
}));

const FilterChip = ({ label, handleDelete }) => {
    const [deleted, setDeleted] = useState(false);
    const classes = useStyles();

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
                label={label}
                onDelete={chipDelete}
                color="primary"
            />
        );
    }

    return <></>;
};

const AnalysesFilter = () => {
    const classes = useStyles();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card id={id(ids.ROOT)} className={classes.root}>
            <CardContent>
                <div className={classes.chips}>
                    <FilterChip label="test0" />
                    <FilterChip label="test1" />
                    <FilterChip label="test2" />
                    <FilterChip label="test3" />
                    <FilterChip label="test4" />
                    <FilterChip label="test5" />
                </div>
            </CardContent>

            <CardActions className={classes.actions} disableSpacing>
                <IconButton
                    className={classnames(classes.expand, {
                        [classes.expandOpen]: isExpanded,
                    })}
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    aria-label="Show Filter Options"
                >
                    <ExpandMore />
                </IconButton>
            </CardActions>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                First pass content, nothing to see here. Move along!
            </Collapse>
        </Card>
    );
};

export default withI18N(AnalysesFilter, messages);
