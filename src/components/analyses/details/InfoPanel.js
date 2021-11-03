/**
 *
 * @author sriram
 *
 * A panel that displays analysis info
 *
 */
import React, { useState } from "react";
import { useTranslation } from "i18n";

import ids from "../ids";

import GridLoading from "../../utils/GridLoading";
import ErrorTypography from "../../error/ErrorTypography";
import DEErrorDialog from "../../error/DEErrorDialog";

import buildID from "components/utils/DebugIDUtil";
import CopyTextArea from "components/copy/CopyTextArea";
import { formatDate } from "components/utils/DateFormatter";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    List,
    ListItem,
    ListItemText,
    Divider,
    makeStyles,
    Typography,
    useTheme,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    heading: {
        color: theme.palette.info,
        [theme.breakpoints.down("sm")]: {
            maxWidth: 150,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
        },
    },
    accordionDetails: {
        display: "block",
    },
    root: {
        width: "100%",
    },
}));

function Updates(props) {
    const { updates, baseId } = props;
    const classes = useStyles();
    const sortedUpdates = [...updates].reverse();
    return (
        <List className={classes.root} id={baseId}>
            {sortedUpdates.map((update, updateIndex) => {
                const status = update.status;
                const timestamp = update.timestamp;
                const message = update.message;
                return (
                    <>
                        <ListItem id={buildID(baseId, updateIndex)}>
                            <ListItemText
                                primary={`${formatDate(timestamp)} - ${status}`}
                                secondary={`${formatDate(
                                    timestamp
                                )} - ${message}`}
                            />
                        </ListItem>
                        <Divider component="li" />
                    </>
                );
            })}
        </List>
    );
}

function Step(props) {
    const { step_number, step_type, status, updates } = props.step;
    const { baseId } = props;
    const classes = useStyles();
    return (
        <Accordion id={baseId}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                    {step_number}: {step_type} - {status}
                </Typography>
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.accordionDetails }}>
                <Updates
                    updates={updates}
                    baseId={buildID(baseId, ids.INFO.UPDATE)}
                />
            </AccordionDetails>
        </Accordion>
    );
}

function InfoPanel(props) {
    const { info, isInfoFetching, infoFetchError, baseId } = props;
    const { t } = useTranslation("analyses");
    const theme = useTheme();

    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const debugId = buildID(baseId, ids.INFO.INFO);

    if (isInfoFetching) {
        return <GridLoading rows={2} baseId={baseId} />;
    }

    if (!info && !isInfoFetching && !infoFetchError) {
        return null;
    }

    if (infoFetchError) {
        return (
            <>
                <ErrorTypography
                    errorMessage={t("analysisInfoFetchError")}
                    onDetailsClick={() => setErrorDialogOpen(true)}
                />
                <DEErrorDialog
                    open={errorDialogOpen}
                    baseId={baseId}
                    errorObject={infoFetchError}
                    handleClose={() => {
                        setErrorDialogOpen(false);
                    }}
                />
            </>
        );
    }
    return (
        <>
            <div style={{ marginBottom: theme.spacing(1) }}>
                <CopyTextArea
                    text={info?.analysis_id}
                    btnText={t("copyAnalysisId")}
                />
            </div>
            {info.steps.map((s, index) => {
                return (
                    <Step
                        key={index}
                        step={s}
                        baseId={buildID(debugId, ids.INFO.STEP, index)}
                    />
                );
            })}
        </>
    );
}

export default InfoPanel;
