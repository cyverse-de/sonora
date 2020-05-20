/**
 *
 * @author sriram
 *
 */
import React, { useState } from "react";
import { injectIntl } from "react-intl";
import ids from "../ids";
import messages from "../messages";
import GridLoading from "../../utils/GridLoading";
import ErrorTypography from "../../utils/error/ErrorTypography";
import DEErrorDialog from "../../utils/error/DEErrorDialog";

import {
    build,
    CopyTextArea,
    EnhancedTableHead,
    formatMessage,
    formatDate,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";
import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
    heading: {
        color: theme.palette.info,
        flexBasis: "33.33%",
        flexShrink: 0,
    },
    secondaryHeading: {
        color: theme.palette.info,
    },
    expansionPanelDetails: {
        display: "block",
    },
}));

const columnData = [
    {
        id: ids.INFO.TIMESTAMP,
        name: "Date",
        numeric: false,
        enableSorting: false,
    },
    {
        id: ids.INFO.MESSAGE,
        name: "Message",
        numeric: false,
        enableSorting: false,
    },
    {
        id: ids.INFO.STATUS,
        name: "Status",
        numeric: false,
        enableSorting: false,
    },
];

function Updates(props) {
    const { updates, baseId } = props;
    return (
        <Table>
            <TableBody>
                {updates.map((update, index) => {
                    const status = update.status;
                    const timestamp = update.timestamp;

                    return (
                        <TableRow key={index}>
                            <TableCell>{formatDate(timestamp)}</TableCell>
                            <TableCell>{update.message}</TableCell>
                            <TableCell>
                                {status[0].toUpperCase() +
                                    status
                                        .slice(1)
                                        .toLowerCase()
                                        .replace(/[_]/gi, " ")}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
            <EnhancedTableHead
                selectable={false}
                columnData={columnData}
                rowsInPage={updates.length}
                baseId={baseId}
            />
        </Table>
    );
}

function Step(props) {
    const { step_number, external_id, step_type, status, updates } = props.step;
    const { debugId } = props;
    const classes = useStyles();
    return (
        <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                    {step_number}: {step_type} - {status}
                </Typography>
                <Typography
                    variant="subtitle2"
                    className={classes.secondaryHeading}
                >
                    {getMessage("analysisId")}: {external_id}
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
                classes={{ root: classes.expansionPanelDetails }}
            >
                <div>
                    <CopyTextArea
                        text={external_id}
                        btnText={getMessage("copyAnalysisId")}
                    />
                </div>
                <Updates updates={updates} debugId={debugId} />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

function InfoPanel(props) {
    const { info, isInfoFetching, infoFetchError, intl, baseId } = props;
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const debugId = build(baseId, ids.INFO.INFO);
    if (!info) {
        return null;
    }
    if (isInfoFetching) {
        return <GridLoading rows={2} baseId={baseId} />;
    }
    if (infoFetchError) {
        return (
            <>
                <ErrorTypography
                    errorMessage={formatMessage(intl, "analysisInfoFetchError")}
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
        <Paper>
            {info.steps.map((s, index) => {
                return <Step key={index} step={s} baseId={debugId} />;
            })}
        </Paper>
    );
}

export default withI18N(injectIntl(InfoPanel), messages);
