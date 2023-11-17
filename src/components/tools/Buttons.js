import React from "react";

import ids from "./ids";
import styles from "./styles";

import buildID from "components/utils/DebugIDUtil";
import { Fab, IconButton } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Add, Delete } from "@mui/icons-material";
import PropTypes from "prop-types";

const useStyles = makeStyles(styles);

function AddBtn(props) {
    const { parentId, onClick } = props;
    const classes = useStyles();
    return (
        <Fab
            color="primary"
            size="small"
            id={buildID(parentId, ids.BUTTONS.ADD)}
            className={classes.addBtn}
            onClick={onClick}
        >
            <Add />
        </Fab>
    );
}

function DeleteBtn(props) {
    const { parentId, onClick } = props;
    const classes = useStyles();
    return (
        <IconButton
            className={classes.deleteBtn}
            size="small"
            id={buildID(parentId, ids.BUTTONS.DELETE)}
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

export { AddBtn, DeleteBtn };
