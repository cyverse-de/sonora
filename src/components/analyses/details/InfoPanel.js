/**
 *
 * @author sriram
 *
 * A panel that displays analysis info
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
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
    expansionPanelDetails: {
        display: "block",
    },
}));

const columnData = (intl) => [
    {
        id: ids.INFO.TIMESTAMP,
        name: formatMessage(intl, "date"),
        numeric: false,
        enableSorting: false,
    },
    {
        id: ids.INFO.STATUS,
        name: formatMessage(intl, "status"),
        numeric: false,
        enableSorting: false,
    },
    {
        id: ids.INFO.MESSAGE,
        name: formatMessage(intl, "message"),
        numeric: false,
        enableSorting: false,
    },
];

function Updates(props) {
    const { updates, intl, baseId } = props;
    let columns = columnData(intl);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    //hide messages on small screens
    if (isSmall) {
        columns = columns.filter((column) => column.id !== ids.INFO.MESSAGE);
    }
    return (
        <Table size="small" stickyHeader={true}>
            <TableBody>
                {updates.map((update, index) => {
                    const status = update.status;
                    const timestamp = update.timestamp;

                    return (
                        <TableRow key={index}>
                            <TableCell>
                                <Typography>{formatDate(timestamp)}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>
                                    {status[0].toUpperCase() +
                                        status
                                            .slice(1)
                                            .toLowerCase()
                                            .replace(/[_]/gi, " ")}
                                </Typography>
                            </TableCell>
                            {!isSmall && (
                                <TableCell>
                                    <Typography>{update.message}</Typography>
                                </TableCell>
                            )}
                        </TableRow>
                    );
                })}
            </TableBody>
            <EnhancedTableHead
                selectable={false}
                columnData={columns}
                rowsInPage={updates.length}
                baseId={baseId}
            />
        </Table>
    );
}

function Step(props) {
    const { step_number, external_id, step_type, status, updates } = props.step;
    const { baseId, intl } = props;
    const classes = useStyles();
    return (
        <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                    {step_number}: {step_type} - {status}
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
                <Updates updates={updates} baseId={baseId} intl={intl} />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

function InfoPanel(props) {
    const { info, isInfoFetching, infoFetchError, intl, baseId } = props;
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const debugId = build(baseId, ids.INFO.INFO);

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
                return (
                    <Step key={index} step={s} baseId={debugId} intl={intl} />
                );
            })}
        </Paper>
    );
}

export default withI18N(injectIntl(InfoPanel), messages);
