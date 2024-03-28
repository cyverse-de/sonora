/**
 * View / Edit path list files
 *
 * @author sriram
 *
 */
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { useRowSelect, useTable } from "react-table";
import { useTranslation } from "i18n";

import constants from "../../../constants";
import { UploadTrackingProvider } from "contexts/uploadTracking";

import ids from "./ids";
import Toolbar from "./Toolbar";
import { getColumns, LINE_NUMBER_ACCESSOR } from "./utils";

import DataSelectionDrawer from "components/data/SelectionDrawer";
import { useSelectorDefaultFolderPath } from "components/data/utils";
import PageWrapper from "components/layout/PageWrapper";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import buildID from "components/utils/DebugIDUtil";

import {
    Checkbox,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = useRef();
        const resolvedRef = ref || defaultRef;

        useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
        }, [resolvedRef, indeterminate]);

        return <Checkbox type="Checkbox" ref={resolvedRef} {...rest} />;
    }
);

function PathListViewer(props) {
    const {
        baseId,
        path,
        resourceId,
        loading,
        createFileType,
        handlePathChange,
        onRefresh,
        onNewFileSaved,
        fileName,
        data,
        editable,
        startingPath,
    } = props;

    const { t } = useTranslation("data");
    const [open, setOpen] = useState(false);

    const [dirty, setDirty] = useState(false);
    const [editorData, setEditorData] = useState([]);
    const [fileSaveStatus, setFileSaveStatus] = useState();

    const defaultStartingPath = useSelectorDefaultFolderPath();

    const columns = useMemo(
        () => getColumns(data, false, t("path")),
        [data, t]
    );

    const pathAccessor = columns[1].accessor;

    const setLineNumbers = useCallback(
        (tableData) => {
            const tableDataWithLineNumbers = tableData.map((row, index) => {
                const pathKey = pathAccessor;
                const val = row[pathKey];
                const newRow = {};
                //line number starts from 1
                newRow[LINE_NUMBER_ACCESSOR] = index + 1;
                newRow[pathKey] = val;
                return newRow;
            });
            return tableDataWithLineNumbers;
        },
        [pathAccessor]
    );

    useEffect(() => {
        //hide the shebang row
        const dataToDisplay = data.slice(1);
        setEditorData(setLineNumbers(dataToDisplay));
    }, [data, setLineNumbers]);

    const getContent = () => {
        //add back the shebang line
        let content = data[0][pathAccessor].concat("\n");
        editorData.forEach((row, index) => {
            content = content.concat(row[pathAccessor]).concat("\n");
        });
        return content;
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setHiddenColumns,
        selectedFlatRows,
        state: { hiddenColumns, selectedRowIds },
    } = useTable(
        {
            columns,
            data: editorData,
            initialState: {
                hiddenColumns: [],
            },
        },
        useRowSelect,
        (hooks) => {
            hooks.allColumns.push((columns) => [
                // Let's make a column for selection
                {
                    id: "selection",
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <IndeterminateCheckbox
                            {...getToggleAllRowsSelectedProps()}
                        />
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <IndeterminateCheckbox
                            {...row.getToggleRowSelectedProps()}
                        />
                    ),
                },
                ...columns,
            ]);
        }
    );
    return (
        <PageWrapper appBarHeight={120}>
            <Toolbar
                baseId={buildID(baseId, ids.VIEWER_STRUCTURED, ids.TOOLBAR)}
                path={path}
                resourceId={resourceId}
                allowLineNumbers={true}
                showLineNumbers={!hiddenColumns?.includes(LINE_NUMBER_ACCESSOR)}
                onShowLineNumbers={(showLineNumbers) => {
                    if (showLineNumbers) {
                        setHiddenColumns([]);
                    } else {
                        setHiddenColumns([LINE_NUMBER_ACCESSOR]);
                    }
                }}
                editable={editable}
                onAddRow={() => {
                    setOpen(true);
                }}
                onDeleteRow={() => {
                    selectedFlatRows.forEach((selRow) => {
                        const newData = editorData.filter(
                            (row, index) => index !== selRow.index
                        );
                        setEditorData(setLineNumbers([...newData]));
                        setDirty(true);
                    });
                }}
                dirty={dirty}
                selectionCount={Object.keys(selectedRowIds).length}
                handlePathChange={handlePathChange}
                onRefresh={onRefresh}
                fileName={fileName}
                createFileType={createFileType}
                onNewFileSaved={onNewFileSaved}
                getFileContent={getContent}
                onSaving={setFileSaveStatus}
                onSaveComplete={() => setDirty(false)}
                isPathListViewer={true}
            />
            {(loading || fileSaveStatus === constants.LOADING) && (
                <CircularProgress
                    thickness={7}
                    color="primary"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                    }}
                />
            )}
            <TableContainer component={Paper} style={{ overflow: "auto" }}>
                <Table
                    id={buildID(baseId, ids.VIEWER_STRUCTURED, fileName)}
                    size="small"
                    stickyHeader
                    {...getTableProps()}
                >
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                {...headerGroup.getHeaderGroupProps()}
                            >
                                {headerGroup.headers.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        {...column.getHeaderProps()}
                                    >
                                        {column.render("Header")}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <TableRow key={row.id} {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <TableCell
                                                key={cell.row.id}
                                                {...cell.getCellProps()}
                                            >
                                                {cell.render("Cell")}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <UploadTrackingProvider>
                <DataSelectionDrawer
                    open={open}
                    onClose={() => setOpen(false)}
                    onConfirm={(resources) => {
                        setOpen(false);
                        if (resources?.length > 0) {
                            const selPaths = [];
                            resources.forEach((resource) => {
                                const key = pathAccessor;
                                const pathObj = {};
                                pathObj[key] = resource?.path;
                                selPaths.push(pathObj);
                            });
                            const dataWithLineNumbers = setLineNumbers([
                                ...editorData,
                                ...selPaths,
                            ]);
                            setEditorData(dataWithLineNumbers);
                            setDirty(true);
                        }
                    }}
                    multiSelect={true}
                    startingPath={startingPath || defaultStartingPath}
                />
            </UploadTrackingProvider>
        </PageWrapper>
    );
}

export default withErrorAnnouncer(PathListViewer);
