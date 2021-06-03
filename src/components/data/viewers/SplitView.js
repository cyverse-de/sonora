/**
 * A component that allows a side-by-side view.
 *
 * @sriram
 *
 */
import React from "react";
import { useTranslation } from "i18n";

import ids from "./ids";

import { Grid, Typography, makeStyles } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";

const useStyles = makeStyles((theme) => ({
    panelHeader: {
        color: theme.palette.info.main,
        padding: 0,
        margin: 0,
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
    const [leftWidth, setLeftWidth] = React.useState(5);
    const [rightWidth, setRightWidth] = React.useState(5);
    const handleHidden = (event, hiddenPanel) => {
        setHidden(hiddenPanel);
        let leftP = document.getElementById(ids.LEFT_PANEL);
        let rightP = document.getElementById(ids.RIGHT_PANEL);

        switch (hiddenPanel) {
            case LEFT_PANEL:
                leftP.style.display = "none";
                rightP.style.display = "block";
                setLeftWidth(0);
                setRightWidth(11);
                break;
            case RIGHT_PANEL:
                leftP.style.display = "block";
                rightP.style.display = "none";
                setLeftWidth(11);
                setRightWidth(0);
                break;
            default:
                leftP.style.display = "block";
                rightP.style.display = "block";
                setLeftWidth(5);
                setRightWidth(5);
        }
    };
    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="stretch"
            style={{ flexGrow: 1 }}
            spacing={0}
        >
            <Grid item xs={leftWidth}>
                <div id={ids.LEFT_PANEL}>
                    <Typography
                        className={classes.panelHeader}
                        variant="subtitle2"
                    >
                        {leftPanelTitle}
                    </Typography>
                    {leftPanel}
                </div>
            </Grid>
            <Grid item>
                <ToggleButtonGroup
                    value={hidden}
                    exclusive
                    onChange={handleHidden}
                    aria-label="panelVisibility"
                    size="small"
                    orientation="vertical"
                    style={{
                        position: "relative",
                        top: "35vh",
                    }}
                >
                    <ToggleButton
                        value={LEFT_PANEL}
                        aria-label={t("hideLeftPanel")}
                        title={t("hideLeftPanel")}
                    >
                        <FirstPageIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton
                        value={NONE}
                        aria-label={t("showSplitView")}
                        title={t("showSplitView")}
                    >
                        <CompareArrowsIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton
                        value={RIGHT_PANEL}
                        aria-label={t("hideRightPanel")}
                        title={t("hideRightPanel")}
                    >
                        <LastPageIcon fontSize="small" />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <Grid xs={rightWidth}>
                <div id={ids.RIGHT_PANEL}>
                    <Typography
                        className={classes.panelHeader}
                        variant="subtitle2"
                    >
                        {rightPanelTitle}
                    </Typography>
                    {rightPanel}
                </div>
            </Grid>
        </Grid>
    );
}
