/**
 * @author sriram
 *
 * A toolbar for tools view
 *
 */

import React, { useState } from "react";
import { useTranslation } from "i18n";

import ids from "../ids";
import ToolsDotMenu from "./ToolsDotMenu";
import SharingButton from "components/sharing/SharingButton";
import Sharing from "components/sharing";
import { formatSharedTools } from "components/sharing/util";

import { build } from "@cyverse-de/ui-lib";

import { Button, Hidden, makeStyles, Toolbar } from "@material-ui/core";

import { Info } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    menuButton: {
        color: theme.palette.info.contrastText,
    },
    divider: {
        flexGrow: 1,
    },
    filter: {
        [theme.breakpoints.down("xs")]: {
            width: 175,
            margin: theme.spacing(0.2),
        },
        [theme.breakpoints.up("sm")]: {
            width: 175,
            margin: theme.spacing(1),
        },
    },
    filterIcon: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.2),
            paddingLeft: 0,
        },
    },
    toolbarItems: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.5),
        },
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
    },
}));

export default function ToolsToolbar(props) {
    const {
        baseId,
        onDetailsSelected,
        isSingleSelection,
        canShare,
        getSelectedTools,
    } = props;
    const [sharingDlgOpen, setSharingDlgOpen] = useState(false);
    const classes = useStyles();
    const { t } = useTranslation("tools");
    const hasSelection = getSelectedTools && getSelectedTools().length > 0;
    const sharingTools = formatSharedTools(getSelectedTools());
    return (
        <>
            <Toolbar variant="dense">
                <div className={classes.divider} />
                <Hidden smDown>
                    {isSingleSelection && (
                        <Button
                            id={build(baseId, ids.MANAGE_TOOLS.TOOL_INFO_BTN)}
                            className={classes.toolbarItems}
                            variant="outlined"
                            disableElevation
                            color="primary"
                            onClick={onDetailsSelected}
                            startIcon={<Info />}
                        >
                            {t("detailsLbl")}
                        </Button>
                    )}
                    {canShare && (
                        <SharingButton
                            baseId={baseId}
                            setSharingDlgOpen={setSharingDlgOpen}
                        />
                    )}
                </Hidden>

                {hasSelection && (
                    <ToolsDotMenu
                        baseId={baseId}
                        onDetailsSelected={onDetailsSelected}
                        isSingleSelection={isSingleSelection}
                        canShare={canShare}
                        setSharingDlgOpen={setSharingDlgOpen}
                    />
                )}
            </Toolbar>
            <Sharing
                open={sharingDlgOpen}
                onClose={() => setSharingDlgOpen(false)}
                resources={sharingTools}
            />
        </>
    );
}
