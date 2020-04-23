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
    MenuItem,
    Select,
    Typography,
} from "@material-ui/core";

import { ExpandMore } from "@material-ui/icons";

import {
    build as buildID,
    getMessage as msg,
    withI18N,
} from "@cyverse-de/ui-lib";

import messages from "./messages";
import ids from "./ids";
import * as constants from "./constants";

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
    collapse: {
        margin: theme.spacing(2),
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

const DeploymentFieldSelect = ({ value, handleChange }) => {
    const fields = {
        image: constants.IMAGE,
        port: constants.PORT,
    };

    return (
        <Select
            labelId="deployment-field-select-label"
            id={id(ids.DEPLOYMENT_FIELD_SELECT)}
            value={value}
            onChange={handleChange}
        >
            {Object.keys(fields).map((key) => (
                <MenuItem key={key} value={fields[key]}>
                    {msg(key)}
                </MenuItem>
            ))}
        </Select>
    );
};

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
    const [depField, setDepField] = useState("");

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
                <div className={classes.collapse}>
                    <Typography noWrap variant="h6" component="h6">
                        Deployments
                    </Typography>
                    <DeploymentFieldSelect
                        value={depField}
                        handleChange={(e) => setDepField(e.target.value)}
                    />
                </div>
            </Collapse>
        </Card>
    );
};

export default withI18N(AnalysesFilter, messages);
