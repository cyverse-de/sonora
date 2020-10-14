/**
 * @author aramsey
 *
 * A button meant for controlling when the Sharing dialog opens
 */

import React from "react";

import { build } from "@cyverse-de/ui-lib";
import { Button, makeStyles } from "@material-ui/core";
import { Share } from "@material-ui/icons";

import { useTranslation } from "i18n";
import ids from "./ids";
import styles from "./styles";

const useStyles = makeStyles(styles);

function SharingButton(props) {
    const { baseId, setSharingDlgOpen, size = "medium" } = props;
    const classes = useStyles();
    const { t } = useTranslation("sharing");

    return (
        <Button
            id={build(baseId, ids.BUTTONS.SHARE)}
            variant="outlined"
            disableElevation
            color="primary"
            size={size}
            onClick={() => setSharingDlgOpen(true)}
            className={classes.button}
            startIcon={<Share />}
        >
            {t("share")}
        </Button>
    );
}

export default SharingButton;
