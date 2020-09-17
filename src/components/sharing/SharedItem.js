import React from "react";
import { Chip, makeStyles } from "@material-ui/core";
import { getSharingFns } from "./util";
import styles from "./styles";
import { build } from "@cyverse-de/ui-lib";
const useStyles = makeStyles(styles);

function SharedItem(props) {
    const { baseId, type, item } = props;
    const { idFn, labelFn, icon } = getSharingFns(type);
    const classes = useStyles();

    return (
        <Chip
            id={build(baseId, idFn(item))}
            classes={{ root: classes.chip }}
            label={labelFn(item)}
            icon={icon}
            color="primary"
            variant="outlined"
        />
    );
}

export default SharedItem;
