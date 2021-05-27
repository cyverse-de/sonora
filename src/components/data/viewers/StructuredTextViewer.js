/**
 * View structured text files
 *
 * @author sriram
 *
 */
import React, { useEffect, useMemo } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import { useTable } from "react-table";

import ids from "./ids";
import Toolbar from "./Toolbar";
import { getColumns, LINE_NUMBER_ACCESSOR } from "./utils";
import viewerConstants from "./constants";

import PageWrapper from "components/layout/PageWrapper";

import { build } from "@cyverse-de/ui-lib";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";

import Skeleton from "@material-ui/lab/Skeleton";

export default function StructuredTextViewer(props) {
    const {
        baseId,
        path,
        resourceId,
        structuredData,
        rawData,
        loading,
        handlePathChange,
        onRefresh,
        fileName,
        editable,
        onNewFileSaved,
        createFileType,
        onSaveComplete
    } = props;

    const [firstRowHeader, setFirstRowHeader] = React.useState(false);
    const [dirty, setDirty] = React.useState(false);
    const [isFileSaving, setFileSaving] = React.useState();
    const [editorInstance, setEditorInstance] = React.useState(null);
    const [editorValue, setEditorValue] = React.useState();

    useEffect(() => {
        require("codemirror/lib/codemirror.css");
    }, []);

    useEffect(() => {
        setEditorValue(rawData);
    }, [rawData]);

    useEffect(() => {
        if (editorInstance) {
            editorInstance.setSize("100%", "78vh");
        }
    }, [editorInstance]);

    let columns = useMemo(
        () => getColumns(structuredData, firstRowHeader),
        [structuredData, firstRowHeader]
    );

    const dataToDisplay = useMemo(
        () => (firstRowHeader ? structuredData.slice(1) : structuredData),
        [structuredData, firstRowHeader]
    );

    dataToDisplay.forEach((row, index) => {
        row[LINE_NUMBER_ACCESSOR] = index + 1; //line number starts from 1
    });

    const getContent = () => {
        return editorValue;
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setHiddenColumns,
        state,
    } = useTable({
        columns,
        data: dataToDisplay,
        initialState: {
            hiddenColumns: [],
        },
    });
    const busy = loading || isFileSaving;
    return (
        <>
            <Toolbar
                baseId={build(baseId, ids.VIEWER_STRUCTURED, ids.TOOLBAR)}
                path={path}
                resourceId={resourceId}
                allowLineNumbers={true}
                showLineNumbers={
                    !state?.hiddenColumns?.includes(LINE_NUMBER_ACCESSOR)
                }
                onShowLineNumbers={(showLineNumbers) => {
                    if (showLineNumbers) {
                        setHiddenColumns([]);
                    } else {
                        setHiddenColumns([LINE_NUMBER_ACCESSOR]);
                    }
                }}
                firstRowHeader={firstRowHeader}
                onFirstRowHeader={(header) => setFirstRowHeader(header)}
                handlePathChange={handlePathChange}
                onRefresh={onRefresh}
                fileName={fileName}
                editing={editable}
                dirty={dirty}
                createFileType={createFileType}
                onNewFileSaved={onNewFileSaved}
                getFileContent={getContent}
                onSaving={() => setFileSaving(true)}
                onSaveComplete={() => {
                    setFileSaving(false);
                    setDirty(false);
                    onSaveComplete();
                }}
            />
            {busy && (
                <Skeleton
                    animation="wave"
                    width="100%"
                    height={viewerConstants.DEFAULT_VIEWER_HEIGHT}
                />
            )}
            {!busy && (
                <PageWrapper appBarHeight={120}>
                    <div style={{ width: "100%" }}>
                        <div
                            style={{
                                float: "left",
                                width: editable ? "50%" : "0%",
                            }}
                        >
                            <CodeMirror
                                editorDidMount={(editor) => {
                                    setEditorInstance(editor);
                                }}
                                value={editorValue}
                                options={{
                                    lineNumbers:
                                        !state?.hiddenColumns?.includes(
                                            LINE_NUMBER_ACCESSOR
                                        ),
                                    readOnly: !editable,
                                }}
                                onBeforeChange={(editor, data, value) => {
                                    setEditorValue(value);
                                }}
                                onChange={(editor, value) => {
                                    setDirty(
                                        editorInstance
                                            ? !editorInstance.isClean()
                                            : false
                                    );
                                }}
                            />
                        </div>
                        <div
                            style={{
                                float: "right",
                                width: "50%",
                            }}
                        >
                            <TableContainer
                                component={Paper}
                                style={{ overflow: "auto" }}
                            >
                                <Table
                                    id={build(
                                        baseId,
                                        ids.VIEWER_STRUCTURED,
                                        fileName
                                    )}
                                    size="small"
                                    stickyHeader
                                    {...getTableProps()}
                                >
                                    <TableHead>
                                        {headerGroups.map((headerGroup) => (
                                            <TableRow
                                                {...headerGroup.getHeaderGroupProps()}
                                            >
                                                {headerGroup.headers.map(
                                                    (column) => (
                                                        <TableCell
                                                            {...column.getHeaderProps()}
                                                        >
                                                            {column.render(
                                                                "Header"
                                                            )}
                                                        </TableCell>
                                                    )
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableHead>
                                    <TableBody {...getTableBodyProps()}>
                                        {rows.map((row, index) => {
                                            prepareRow(row);
                                            return (
                                                <TableRow
                                                    {...row.getRowProps()}
                                                >
                                                    {row.cells.map((cell) => {
                                                        return (
                                                            <TableCell
                                                                {...cell.getCellProps()}
                                                            >
                                                                {cell.render(
                                                                    "Cell"
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </PageWrapper>
            )}
        </>
    );
}
