/**
 * View structured text files
 *
 * @author sriram
 *
 */
import React, { useEffect, useMemo } from "react";
import { useTable } from "react-table";
import { useTranslation } from "i18n";

import ids from "./ids";
import Toolbar from "./Toolbar";
import { getColumns, LINE_NUMBER_ACCESSOR } from "./utils";
import viewerConstants from "./constants";
import SplitView from "./SplitView";
import Editor from "./Editor";

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
        onSaveComplete,
    } = props;

    const { t } = useTranslation("data");

    const [firstRowHeader, setFirstRowHeader] = React.useState(false);
    const [dirty, setDirty] = React.useState(false);
    const [isFileSaving, setFileSaving] = React.useState();
    const [editorInstance, setEditorInstance] = React.useState(null);
    const [editorValue, setEditorValue] = React.useState();

    useEffect(() => {
        setEditorValue(rawData);
    }, [rawData]);

    useEffect(() => {
        if (editorInstance) {
            editorInstance.setSize(
                "100%",
                viewerConstants.DEFAULT_VIEWER_HEIGHT
            );
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

    const TableView = () => (
        <TableContainer
            component={Paper}
            style={{
                height: viewerConstants.DEFAULT_VIEWER_HEIGHT,
            }}
        >
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
    );
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
                editable={editable}
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
            {!busy && editable && (
                <SplitView
                    leftPanel={
                        <Editor
                            showLineNumbers={
                                !state?.hiddenColumns?.includes(
                                    LINE_NUMBER_ACCESSOR
                                )
                            }
                            editable={editable}
                            editorInstance={editorInstance}
                            setEditorInstance={setEditorInstance}
                            setEditorValue={setEditorValue}
                            setDirty={setDirty}
                            editorValue={editorValue}
                        />
                    }
                    rightPanel={TableView()}
                    leftPanelTitle={t("editor")}
                    rightPanelTitle={t("preview")}
                />
            )}
            {!busy && !editable && <TableView />}
        </>
    );
}
