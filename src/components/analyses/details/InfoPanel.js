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
    Collapse,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    IconButton,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from "@material-ui/core";
import {
    ExpandMore as ExpandMoreIcon,
    KeyboardArrowUp,
    KeyboardArrowDown,
} from "@material-ui/icons";

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
        "& > *": {
            borderBottom: "unset",
        },
    },
    expandedCell: { paddingBottom: 0, paddingTop: 0 },
}));

const columnData = (intl) => [
    {
        id: ids.INFO.EXPAND,
        name: "",
        numeric: false,
        enableSorting: false,
    },
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
];

function UpdateDetails(props) {
    const { status, timestamp, message } = props;
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    return (
        <>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <Typography>{formatDate(timestamp)}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>
                        {status[0].toUpperCase() +
                            status.slice(1).toLowerCase().replace(/[_]/gi, " ")}
                    </Typography>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell className={classes.expandedCell} colSpan={3}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Typography>{message}</Typography>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

function Updates(props) {
    const { updates, intl, baseId } = props;
    let columns = columnData(intl);

    return (
        <Table size="small" stickyHeader={true} style={{ marginTop: 8 }}>
            <TableBody>
                {updates.map((update, index) => {
                    const status = update.status;
                    const timestamp = update.timestamp;
                    return (
                        <UpdateDetails
                            key={index}
                            status={status}
                            timestamp={timestamp}
                            message={update.message}
                        />
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
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                    {step_number}: {step_type} - {status}
                </Typography>
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.accordionDetails }}>
                <div>
                    <CopyTextArea
                        text={external_id}
                        btnText={getMessage("copyAnalysisId")}
                    />
                </div>
                <Updates updates={updates} baseId={baseId} intl={intl} />
            </AccordionDetails>
        </Accordion>
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
