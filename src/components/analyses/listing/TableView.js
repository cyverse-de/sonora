/**
 * @author sriram
 *
 * A tabular view of analyses
 *
 */
import React from "react";
import {
    build,
    DECheckbox,
    EmptyTable,
    EnhancedTableHead,
    formatDate,
    formatMessage,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";
import {
    IconButton,
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip,
} from "@material-ui/core";
import {
    HourglassEmptyRounded as HourGlass,
    Launch as LaunchIcon,
    UnfoldMore as UnfoldMoreIcon,
} from "@material-ui/icons";
import ids from "../ids";
import { injectIntl } from "react-intl";
import messages from "../messages";
import constants from "../../../constants";
import analysisStatus from "../model/analysisStatus";
import TableLoading from "../../utils/TableLoading";

function AnalysisName(props) {
    const analysis = props.analysis;
    const name = analysis.name;
    const isBatch = analysis.batch;
    const interactiveUrls = analysis.interactive_urls;
    const status = analysis.status;
    const handleInteractiveUrlClick = props.handleInteractiveUrlClick;
    const handleGoToOutputFolder = props.handleGoToOutputFolder;
    const handleBatchIconClick = props.handleBatchIconClick;
    const intl = props.intl;
    const baseId = props.baseId;

    const NameLink = () => {
        return (
            <Tooltip
                title={formatMessage(intl, "goOutputFolderOf") + " " + name}
            >
                <Link
                    onClick={() => handleGoToOutputFolder(analysis)}
                    color="primary"
                >
                    <span style={{ paddingLeft: 8, cursor: "pointer" }}>
                        {name}
                    </span>
                </Link>
            </Tooltip>
        );
    };

    if (isBatch) {
        return (
            <>
                <Tooltip title={getMessage("htDetails")}>
                    <IconButton
                        size="small"
                        onClick={() => handleBatchIconClick(analysis)}
                        id={build(baseId, ids.ICONS.BATCH)}
                    >
                        <UnfoldMoreIcon />
                    </IconButton>
                </Tooltip>
                <NameLink />
            </>
        );
    } else if (
        (status === analysisStatus.SUBMITTED ||
            status === analysisStatus.RUNNING) &&
        interactiveUrls &&
        interactiveUrls.length > 0
    ) {
        return (
            <>
                <Tooltip title={getMessage("goToVice")}>
                    <IconButton
                        onClick={() =>
                            handleInteractiveUrlClick(interactiveUrls[0])
                        }
                        size="small"
                        id={build(baseId, ids.ICONS.INTERACTIVE)}
                    >
                        <LaunchIcon />
                    </IconButton>
                </Tooltip>
                <NameLink />
            </>
        );
    } else {
        return <NameLink />;
    }
}

function AppName(props) {
    const analysis = props.analysis;
    const name = analysis.app_name;
    return <Link>{name}</Link>;
}

function Status(props) {
    const { analysis, username, baseId, analysisUser } = props;
    const allowTimeExtn =
        analysis.interactive_urls &&
        analysis.interactive_urls.length > 0 &&
        analysis.status === analysisStatus.RUNNING &&
        username === analysisUser;
    return (
        <React.Fragment>
            <Link id={build(baseId, ids.STATUS)}>{analysis.status} </Link>
            {allowTimeExtn && (
                <Tooltip title={getMessage("extendTime")}>
                    <IconButton
                        id={build(baseId, ids.BUTTON_EXTEND_TIME_LIMIT)}
                        size="small"
                    >
                        <HourGlass />
                    </IconButton>
                </Tooltip>
            )}
        </React.Fragment>
    );
}

const columnData = [
    {
        id: ids.NAME,
        name: "Name",
        numeric: false,
        enableSorting: true,
        key: "name",
    },
    {
        id: ids.OWNER,
        name: "Owner",
        numeric: false,
        enableSorting: false,
        key: "owner",
    },
    {
        id: ids.APP,
        name: "App",
        numeric: false,
        enableSorting: false,
        key: "app",
    },
    {
        id: ids.START_DATE,
        name: "Start Date",
        numeric: false,
        enableSorting: true,
        key: "startdate",
    },
    {
        id: ids.END_DATE,
        name: "End Date",
        numeric: false,
        enableSorting: true,
        key: "enddate",
    },
    {
        id: ids.STATUS,
        name: "Status",
        numeric: false,
        enableSorting: true,
        key: "status",
    },
];

function TableView(props) {
    const {
        loading,
        error,
        username,
        listing,
        parentId,
        baseId,
        order,
        orderBy,
        selected,
        handleRequestSort,
        handleSelectAllClick,
        handleClick,
        handleInteractiveUrlClick,
        handleGoToOutputFolder,
        handleBatchIconClick,
        intl,
    } = props;

    const analyses = listing?.analyses;
    const tableId = build(baseId, ids.LISTING_TABLE);

    return (
        <TableContainer
            component={Paper}
            style={{
                height: "60vh",
            }}
        >
            <Table stickyHeader={true} size="small">
                <EnhancedTableHead
                    baseId={baseId}
                    selectable={true}
                    numSelected={selected.length}
                    rowsInPage={listing?.analyses ? listing.analyses.length : 0}
                    order={order}
                    orderBy={orderBy}
                    columnData={columnData}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                />
                {loading && (
                    <TableBody>
                        <TableLoading
                            numColumns={columnData.length + 1}
                            numRows={25}
                        />
                    </TableBody>
                )}
                {!loading && (
                    <TableBody>
                        {(!analyses || analyses.length === 0) && !error && (
                            <EmptyTable
                                message={getMessage("noAnalyses")}
                                numColumns={columnData.length}
                            />
                        )}
                        {error && (
                            <EmptyTable
                                message={error.toString()}
                                numColumns={columnData.length}
                            />
                        )}
                        {analyses &&
                            analyses.length > 0 &&
                            analyses.map((analysis, index) => {
                                const id = analysis.id;
                                const user =
                                    analysis.username &&
                                    analysis.username.includes(constants.IPLANT)
                                        ? analysis.username.split("@")[0]
                                        : analysis.username;
                                const isSelected = selected.indexOf(id) !== -1;
                                const rowId = build(baseId, tableId, id);
                                return (
                                    <TableRow
                                        onClick={(event) =>
                                            handleClick(event, id, index)
                                        }
                                        role="checkbox"
                                        aria-checked={isSelected}
                                        tabIndex={-1}
                                        selected={isSelected}
                                        hover
                                        key={id}
                                        id={rowId}
                                    >
                                        <TableCell>
                                            <DECheckbox
                                                id={build(rowId + ids.CHECKBOX)}
                                                checked={isSelected}
                                                tabIndex={0}
                                                inputProps={{
                                                    "aria-label": formatMessage(
                                                        intl,
                                                        "ariaCheckbox",
                                                        {
                                                            label:
                                                                analysis.name,
                                                        }
                                                    ),
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            id={build(
                                                rowId + ids.ANALYSIS_NAME_CELL
                                            )}
                                        >
                                            <AnalysisName
                                                intl={intl}
                                                analysis={analysis}
                                                baseId={build(
                                                    rowId +
                                                        ids.ANALYSIS_NAME_CELL
                                                )}
                                                parentId={parentId}
                                                handleInteractiveUrlClick={
                                                    handleInteractiveUrlClick
                                                }
                                                handleGoToOutputFolder={
                                                    handleGoToOutputFolder
                                                }
                                                handleBatchIconClick={
                                                    handleBatchIconClick
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>{user}</TableCell>
                                        <TableCell
                                            id={build(rowId, ids.APP_NAME_CELL)}
                                        >
                                            <AppName analysis={analysis} />
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(analysis.startdate)}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(analysis.enddate)}
                                        </TableCell>
                                        <TableCell
                                            id={build(rowId, ids.SUPPORT_CELL)}
                                        >
                                            <Status
                                                analysis={analysis}
                                                baseId={baseId}
                                                analysisUser={user}
                                                username={username}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                )}
            </Table>
        </TableContainer>
    );
}

export default withI18N(injectIntl(TableView), messages);
