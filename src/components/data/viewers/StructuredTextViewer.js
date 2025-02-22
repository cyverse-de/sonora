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

import buildID from "components/utils/DebugIDUtil";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

import Skeleton from "@mui/material/Skeleton";

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
    const [editorValue, setEditorValue] = React.useState();
    const [initialValue, setInitialValue] = React.useState();

    useEffect(() => {
        setInitialValue(rawData);
        setEditorValue(rawData);
    }, [rawData]);

    useEffect(() => {
        setDirty(editorValue !== initialValue);
    }, [initialValue, editorValue]);

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
    );
    return (
        <>
            <Toolbar
                baseId={buildID(baseId, ids.VIEWER_STRUCTURED, ids.TOOLBAR)}
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
                    setInitialValue(editorValue);
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
                            baseId={baseId}
                            showLineNumbers={
                                !state?.hiddenColumns?.includes(
                                    LINE_NUMBER_ACCESSOR
                                )
                            }
                            editable={editable}
                            initialValue={initialValue}
                            setEditorValue={setEditorValue}
                        />
                    }
                    rightPanel={<TableView />}
                    leftPanelTitle={t("editor")}
                    rightPanelTitle={t("preview")}
                    baseId={buildID(baseId, ids.SPLIT_VIEW)}
                />
            )}
            {!busy && !editable && <TableView />}
        </>
    );
}
