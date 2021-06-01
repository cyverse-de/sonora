/**
 * View text based files (plain text, markdown etc..)
 *
 * @author sriram
 *
 */
import React, { useEffect, useCallback, useState } from "react";
import { useTranslation } from "i18n";
import { useMutation, useQuery } from "react-query";

import ids from "./ids";
import Toolbar from "./Toolbar";
import markdownToHtml from "components/utils/markdownToHtml";
import viewerConstants from "./constants";
import {
    FILESYSTEM_METADATA_QUERY_KEY,
    getFilesystemMetadata,
    setFilesystemMetadata,
} from "serviceFacades/metadata";

import { build } from "@cyverse-de/ui-lib";

import Skeleton from "@material-ui/lab/Skeleton";
import SplitView from "./SplitView";
import Editor from "./Editor";

export default function TextViewer(props) {
    const {
        baseId,
        path,
        resourceId,
        data,
        loading,
        handlePathChange,
        onRefresh,
        fileName,
        editable,
        mode,
        onNewFileSaved,
        createFileType,
    } = props;

    const { t } = useTranslation("data");

    const [showLineNumbers, setShowLineNumbers] = useState(true);
    const [wrapText, setWrapText] = useState(false);
    const [editorValue, setEditorValue] = useState();
    const [editorInstance, setEditorInstance] = useState(null);
    const [dirty, setDirty] = useState(false);
    const [isFileSaving, setFileSaving] = React.useState();
    const [markDownPreview, setMarkdownPreview] = useState("");
    const [detectedMode, setDetectedMode] = useState("");

    const isMarkdown =
        mode === viewerConstants.GITHUB_FLAVOR_MARKDOWN ||
        detectedMode === viewerConstants.GITHUB_FLAVOR_MARKDOWN;

    //not sure why but codemirror wants the css loaded here unlike the modes
    useEffect(() => {
        require("codemirror/lib/codemirror.css");
    }, []);

    useEffect(() => {
        if (editorInstance) {
            editorInstance.setSize(
                "100%",
                viewerConstants.DEFAULT_VIEWER_HEIGHT
            );
        }
    }, [editorInstance]);

    useEffect(() => {
        setEditorValue(data);
    }, [data, mode]);

    useEffect(() => {
        if (isMarkdown) {
            markdownToHtml(editorValue).then((html) => {
                setMarkdownPreview(html);
            });
        }
    }, [editorValue, isMarkdown, mode]);

    const { isFetching: isFetchingMetadata, error: metadataError } = useQuery({
        queryKey: [FILESYSTEM_METADATA_QUERY_KEY, { dataId: resourceId }],
        queryFn: getFilesystemMetadata,
        config: {
            enabled: !!resourceId,
            onSuccess: (metadata) => {
                const { avus } = metadata;
                const fileTypeAvu = avus?.filter(
                    (avu) => avu.attr === viewerConstants.IPC_VIEWER_TYPE
                );
                if (fileTypeAvu && fileTypeAvu.length > 0) {
                    setDetectedMode(fileTypeAvu[0].value);
                }
            },
        },
    });

    const [setDiskResourceMetadata] = useMutation(setFilesystemMetadata, {
        onSuccess: (resp) => {
            console.log(resp);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const getContent = () => {
        return editorValue;
    };

    const busy = loading || isFileSaving || isFetchingMetadata;

    const Preview = useCallback(
        () => (
            <div
                dangerouslySetInnerHTML={{
                    __html: markDownPreview,
                }}
            ></div>
        ),
        [markDownPreview]
    );

    return (
        <>
            <Toolbar
                baseId={build(baseId, ids.VIEWER_DOC, ids.TOOLBAR)}
                path={path}
                resourceId={resourceId}
                allowLineNumbers={true}
                showLineNumbers={showLineNumbers}
                onShowLineNumbers={setShowLineNumbers}
                wrapText={wrapText}
                onWrapText={setWrapText}
                handlePathChange={handlePathChange}
                onRefresh={onRefresh}
                fileName={fileName}
                editing={editable}
                dirty={dirty}
                createFileType={createFileType}
                onNewFileSaved={onNewFileSaved}
                getFileContent={getContent}
                onSaving={() => setFileSaving(true)}
                onSaveComplete={(details) => {
                    setFileSaving(false);
                    setDirty(false);
                    if (createFileType) {
                        const metadata = {
                            avus: [
                                {
                                    attr: viewerConstants.IPC_VIEWER_TYPE,
                                    value: createFileType,
                                    unit: "",
                                },
                            ],
                            "irods-avus": [],
                        };

                        setDiskResourceMetadata({
                            dataId: details?.file.id,
                            metadata,
                        });
                    }
                }}
            />
            {busy && (
                <Skeleton
                    animation="wave"
                    width="100%"
                    height={viewerConstants.DEFAULT_VIEWER_HEIGHT}
                />
            )}
            {!busy && isMarkdown && (
                <SplitView
                    leftPanel={
                        <Editor
                            mode={mode || detectedMode}
                            showLineNumbers={showLineNumbers}
                            editable={editable}
                            wrapText={wrapText}
                            editorInstance={editorInstance}
                            setEditorInstance={setEditorInstance}
                            setEditorValue={setEditorValue}
                            setDirty={setDirty}
                            editorValue={editorValue}
                        />
                    }
                    rightPanel={Preview()}
                    leftPanelTitle={t("editor")}
                    rightPanelTitle={t("preview")}
                />
            )}
            {!busy && !isMarkdown && (
                <Editor
                    mode={mode || detectedMode}
                    showLineNumbers={showLineNumbers}
                    editable={editable}
                    wrapText={wrapText}
                    editorInstance={editorInstance}
                    setEditorInstance={setEditorInstance}
                    setEditorValue={setEditorValue}
                    setDirty={setDirty}
                    editorValue={editorValue}
                />
            )}
        </>
    );
}
