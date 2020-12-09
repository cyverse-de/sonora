import React from "react";

import ids from "./ids";
import styles from "./styles";

import { build } from "@cyverse-de/ui-lib";
import { Fab, IconButton, makeStyles } from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const StyledAddBtn = withStyles(styles)(AddBtn);

function AddBtn(props) {
    const { parentId, onClick, classes } = props;

    return (
        <Fab
            color="primary"
            size="small"
            id={build(parentId, ids.BUTTONS.ADD)}
            className={classes.addBtn}
            onClick={onClick}
        >
            <Add />
        </Fab>
    );
}

const useStyles = makeStyles(styles);

function DeleteBtn(props) {
    const { parentId, onClick } = props;
    const classes = useStyles();
    return (
        <IconButton
            className={classes.deleteBtn}
            size="small"
            id={build(parentId, ids.BUTTONS.DELETE)}
            onClick={onClick}
        >
            <Delete />
        </IconButton>
    );
}

AddBtn.propTypes = {
    onClick: PropTypes.func.isRequired,
    parentId: PropTypes.string.isRequired,
};

DeleteBtn.propTypes = {
    onClick: PropTypes.func.isRequired,
    parentId: PropTypes.string.isRequired,
};

export { StyledAddBtn, DeleteBtn };
