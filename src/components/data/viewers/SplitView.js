/**
 * View editor and preview on split view side-by-side
 *
 * @sriram
 *
 */
import React from "react";
import { useTranslation } from "i18n";

import ids from "./ids";

import { Typography, makeStyles } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import FormatAlignCenterIcon from "@material-ui/icons/FormatAlignCenter";

const useStyles = makeStyles((theme) => ({
    panelHeader: {
        marginLeft: theme.spacing(1),
        color: theme.palette.info.main,
    },
    panelLeft: {
        float: "left",
        width: "50%",
    },
    panelRight: {
        float: "right",
        width: "50%",
    },
}));

const LEFT_PANEL = "leftPanel";
const RIGHT_PANEL = "rightPanel";
const NONE = "none";

export default function SplitView(props) {
    const { leftPanel, rightPanel, leftPanelTitle, rightPanelTitle } = props;
    const { t } = useTranslation("data");
    const classes = useStyles();
    const [hidden, setHidden] = React.useState(NONE);
    const handleHidden = (event, hiddenPanel) => {
        setHidden(hiddenPanel);
        let leftP = document.getElementById(ids.LEFT_PANEL);
        let rightP = document.getElementById(ids.RIGHT_PANEL);

        switch (hiddenPanel) {
            case LEFT_PANEL:
                leftP.style.display = "none";
                rightP.style.width = "100%";
                rightP.style.display = "block";
                break;
            case RIGHT_PANEL:
                leftP.style.display = "block";
                leftP.style.width = "100%";
                rightP.style.display = "none";
                break;
            default:
                leftP.style.display = "block";
                rightP.style.display = "block";
                rightP.style.width = "50%";
                leftP.style.width = "50%";
        }
    };
    return (
        <>
            <ToggleButtonGroup
                value={hidden}
                exclusive
                onChange={handleHidden}
                aria-label="panelVisibility"
                size="small"
                style={{ margin: "auto" }}
            >
                <ToggleButton
                    value={LEFT_PANEL}
                    aria-label={t("hideLeftPanel")}
                >
                    <FirstPageIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value={NONE} aria-label={t("showAll")}>
                    <FormatAlignCenterIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton
                    value={RIGHT_PANEL}
                    aria-label={t("hideRightPanel")}
                >
                    <LastPageIcon fontSize="small" />
                </ToggleButton>
            </ToggleButtonGroup>
            <div style={{ width: "100%" }}>
                <div id={ids.LEFT_PANEL} className={classes.panelLeft}>
                    <>
                        <Typography
                            className={classes.panelHeader}
                            variant="subtitle2"
                        >
                            {leftPanelTitle}
                        </Typography>
                        {leftPanel}
                    </>
                </div>
                <div id={ids.RIGHT_PANEL} className={classes.panelRight}>
                    <>
                        <Typography
                            className={classes.panelHeader}
                            variant="subtitle2"
                        >
                            {rightPanelTitle}
                        </Typography>
                        {rightPanel}
                    </>
                </div>
            </div>
        </>
    );
}
