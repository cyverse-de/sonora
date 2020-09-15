/**
 * View / Edit path list files
 *
 * @author sriram
 *
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRowSelect, useTable } from "react-table";
import { queryCache, useQuery, useMutation } from "react-query";
import { useTranslation } from "i18n";

import constants from "../../../constants";
import ids from "./ids";

import { uploadTextAsFile } from "serviceFacades/fileio";
import {
    getResourceDetails,
    DATA_DETAILS_QUERY_KEY,
} from "serviceFacades/filesystem";
import Toolbar from "./Toolbar";
import { getColumns, LINE_NUMBER_ACCESSOR } from "./utils";
import { parseNameFromPath, isWritable } from "../utils";

import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";
import PageWrapper from "components/layout/PageWrapper";
import DataSelectionDrawer from "components/data/SelectionDrawer";
import { UploadTrackingProvider } from "../../../contexts/uploadTracking";
import { AnnouncerConstants, announce, build } from "@cyverse-de/ui-lib";

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
} from "@material-ui/core";

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
        separator,
        loading,
        showErrorAnnouncer,
        query_key,
    } = props;

    const { t } = useTranslation("data");

    const [data, setData] = useState(props.data);
    const [open, setOpen] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [permission, setPermission] = useState(null);
    const fileName = parseNameFromPath(path);

    let columns = useMemo(() => getColumns(data, false, t("path")), [data, t]);

    //hide the shebang row
    const dataToDisplay = useMemo(() => data.slice(1), [data]);

    dataToDisplay.forEach((row, index) => {
        row[LINE_NUMBER_ACCESSOR] = index + 1; //line number starts from 1
    });

    const [saveTextAsFile, { status: fileSaveStatus }] = useMutation(
        uploadTextAsFile,
        {
            onSuccess: () => {
                setDirty(false);
                announce({
                    text: t("fileSaveSuccess", {
                        fileName,
                    }),
                    variant: AnnouncerConstants.SUCCESS,
                });
                //invalidate query to prevent cached data from loading
                queryCache.invalidateQueries(query_key);
            },
            onError: (error) => {
                showErrorAnnouncer(t("fileSaveError", { fileName }), error);
            },
        }
    );

    const { isFetching: fetchingDetails } = useQuery({
        queryKey: [DATA_DETAILS_QUERY_KEY, { paths: [path] }],
        queryFn: getResourceDetails,
        config: {
            enabled: true,
            onSuccess: (resp) => {
                const details = resp?.paths[path];
                setPermission(details?.permission);
            },
            onError: (e) => {
                showErrorAnnouncer(t("detailsError"), e);
            },
        },
    });

    const getContent = () => {
        //add back the shebang line
        let content = data[0][columns[1].accessor].concat("\n");
        data.forEach((row, index) => {
            if (index !== 0) {
                content = content
                    .concat(row[columns[1].accessor])
                    .concat(separator)
                    .concat("\n");
            }
        });
        return content;
    };

    const saveFile = () => {
        saveTextAsFile({ dest: path, content: getContent(), newFile: false });
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
            data: dataToDisplay,
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
                baseId={build(baseId, ids.VIEWER_STRUCTURED, ids.TOOLBAR)}
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
                editing={!fetchingDetails && isWritable(permission)}
                onAddRow={() => {
                    setOpen(true);
                }}
                onDeleteRow={() => {
                    selectedFlatRows.forEach((selRow) => {
                        const newData = data.filter(
                            (row) =>
                                row[columns[1].accessor] !==
                                selRow.original[columns[1].accessor]
                        );
                        setData([...newData]);
                        setDirty(true);
                    });
                }}
                onSave={saveFile}
                dirty={dirty}
                selectionCount={Object.keys(selectedRowIds).length}
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
                    id={build(baseId, ids.VIEWER_STRUCTURED, fileName)}
                    size="small"
                    stickyHeader
                    {...getTableProps()}
                >
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <TableCell {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {rows.map((row, index) => {
                            prepareRow(row);
                            return (
                                <TableRow {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <TableCell {...cell.getCellProps()}>
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
                    onConfirm={(selections) => {
                        setOpen(false);
                        const selPaths = [];
                        selections.forEach((path) => {
                            const key = columns[1].accessor;
                            const pathObj = {};
                            pathObj[key] = path;
                            selPaths.push(pathObj);
                        });
                        setData([...data, ...selPaths]);
                        setDirty(true);
                    }}
                    baseId={build(baseId, "dataSelection")}
                    multiSelect={true}
                />
            </UploadTrackingProvider>
        </PageWrapper>
    );
}

export default withErrorAnnouncer(PathListViewer);
