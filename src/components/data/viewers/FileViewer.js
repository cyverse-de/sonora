/**
 * @author sriram
 *
 * A component used to view contents of a file.
 *
 *
 */

import React, { useEffect, useState } from "react";

import { useConfig } from "contexts/config";
import { useTranslation } from "i18n";
import { useRouter } from "next/router";

import NavigationConstants from "common/NavigationConstants";
import infoTypes from "components/models/InfoTypes";
import {
    getMimeTypeFromString,
    getViewerMode,
    mimeTypes,
} from "components/models/MimeTypes";

import {
    FETCH_FILE_MANIFEST_QUERY_KEY,
    READ_CHUNK_QUERY_KEY,
} from "serviceFacades/filesystem";
import constants from "../../../constants";
import viewerConstants from "./constants";
import DocumentViewer from "./DocumentViewer";
import ids from "./ids";
import ImageViewer from "./ImageViewer";
import PathListViewer from "./PathListViewer";
import { useFileManifest, useReadChunk } from "./queries";
import StructuredTextViewer from "./StructuredTextViewer";
import TextViewer from "./TextViewer";
import { flattenStructureData } from "./utils";
import VideoViewer from "./VideoViewer";
import { parseNameFromPath } from "../utils";

import { build } from "@cyverse-de/ui-lib";
import {
    Button,
    CircularProgress,
    Toolbar,
    Typography,
} from "@material-ui/core";

const VIEWER_TYPE = {
    PLAIN: "plain",
    PATH_LIST: "pathList",
    STRUCTURED: "structured",
    IMAGE: "image",
    VIDEO: "video",
    DOCUMENT: "document", //pdf,xml etc...
};

export default function FileViewer(props) {
    const {
        path,
        resourceId,
        createFile,
        onRefresh,
        onNewFileSaved,
        baseId,
    } = props;

    const { t } = useTranslation("data");
    const router = useRouter();
    const [mode, setMode] = useState(null);
    const [readChunkKey, setReadChunkKey] = useState(READ_CHUNK_QUERY_KEY);
    const [readChunkQueryEnabled, setReadChunkQueryEnabled] = useState(false);
    const [viewerType, setViewerType] = useState(null);
    const [manifest, setManifest] = useState(null);
    const [separator, setSeparator] = useState("");
    const [config] = useConfig();

    const fileName = parseNameFromPath(path);

    const { isFetching, error: manifestError } = useFileManifest(
        [FETCH_FILE_MANIFEST_QUERY_KEY, path],
        path !== null && path !== undefined && !createFile,
        (resp) => {
            setManifest(resp);
        }
    );

    const {
        status,
        data,
        isFetchingMore,
        fetchMore,
        canFetchMore,
        error: chunkError,
    } = useReadChunk(
        readChunkKey,
        readChunkQueryEnabled,
        (lastGroup, allGroups) => {
            const totalPages = Math.ceil(
                lastGroup["file-size"] / viewerConstants.DEFAULT_PAGE_SIZE
            );
            if (allGroups.length < totalPages) {
                return allGroups.length;
            } else {
                return false;
            }
        }
    );

    const getColumnDelimiter = (infoType) => {
        if (infoTypes.CSV === infoType) {
            return viewerConstants.COMMA_DELIMITER;
        } else if (
            infoTypes.TSV === infoType ||
            infoTypes.VCF === infoType ||
            infoTypes.GFF === infoType ||
            infoTypes.BED === infoType ||
            infoTypes.GTF === infoType ||
            infoTypes.BOWTIE === infoType ||
            infoTypes.HT_ANALYSIS_PATH_LIST === infoType ||
            infoTypes.MULTI_INPUT_PATH_LIST === infoType
        ) {
            return viewerConstants.TAB_DELIMITER;
        } else {
            return viewerConstants.SPACE_DELIMITER;
        }
    };

    useEffect(() => {
        if (
            createFile === infoTypes.HT_ANALYSIS_PATH_LIST ||
            createFile === infoTypes.MULTI_INPUT_PATH_LIST
        ) {
            setManifest({
                "content-type": "text/plain",
                infoType: createFile,
                urls: [],
            });
        }
    }, [createFile]);

    useEffect(() => {
        if (manifest) {
            const mimeType = getMimeTypeFromString(manifest["content-type"]);
            const infoType = manifest?.infoType;
            const separator = getColumnDelimiter(infoType);

            setMode(getViewerMode(mimeType));
            setSeparator(separator);

            switch (mimeType) {
                case mimeTypes.PNG:
                case mimeTypes.JPEG:
                case mimeTypes.GIF:
                    setViewerType(VIEWER_TYPE.IMAGE);
                    break;
                case mimeTypes.MP4:
                case mimeTypes.OGG:
                case mimeTypes.WEBM:
                    setViewerType(VIEWER_TYPE.VIDEO);
                    break;
                case mimeTypes.PDF:
                case mimeTypes.HTML:
                case mimeTypes.XHTML_XML:
                    setViewerType(VIEWER_TYPE.DOCUMENT);
                    break;

                case mimeTypes.X_SH:
                case mimeTypes.X_RSRC:
                case mimeTypes.X_PYTHON:
                case mimeTypes.X_PERL:
                case mimeTypes.X_WEB_MARKDOWN:
                case mimeTypes.PLAIN:
                case mimeTypes.PREVIEW:
                default:
                    if (
                        infoTypes.CSV === infoType ||
                        infoTypes.TSV === infoType ||
                        infoTypes.VCF === infoType ||
                        infoTypes.GFF === infoType ||
                        infoTypes.GTF === infoType ||
                        infoTypes.BED === infoType ||
                        infoTypes.BOWTIE === infoType
                    ) {
                        setReadChunkKey([
                            READ_CHUNK_QUERY_KEY,
                            {
                                path,
                                separator,
                                chunkSize: viewerConstants.DEFAULT_PAGE_SIZE,
                            },
                        ]);
                        setViewerType(VIEWER_TYPE.STRUCTURED);
                        setReadChunkQueryEnabled(true);
                        break;
                    } else if (
                        infoTypes.HT_ANALYSIS_PATH_LIST === infoType ||
                        infoTypes.MULTI_INPUT_PATH_LIST === infoType
                    ) {
                        if (!createFile) {
                            setReadChunkKey([
                                READ_CHUNK_QUERY_KEY,
                                {
                                    path,
                                    separator,
                                    chunkSize:
                                        viewerConstants.DEFAULT_PAGE_SIZE,
                                },
                            ]);
                            setReadChunkQueryEnabled(true);
                        }
                        setViewerType(VIEWER_TYPE.PATH_LIST);
                        break;
                    } else {
                        setReadChunkKey([
                            READ_CHUNK_QUERY_KEY,
                            {
                                path,
                                chunkSize: viewerConstants.DEFAULT_PAGE_SIZE,
                            },
                        ]);
                        setReadChunkQueryEnabled(true);
                        setViewerType(VIEWER_TYPE.PLAIN);
                        break;
                    }
            }
        }
    }, [createFile, manifest, path, separator]);

    const busy = isFetching || status === constants.LOADING;

    if (busy) {
        return (
            <CircularProgress
                thickness={7}
                color="primary"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                }}
            />
        );
    }

    if (manifestError || chunkError) {
        if (router) {
            const errorString = JSON.stringify(manifestError || chunkError);
            router.push(
                `/${NavigationConstants.ERROR}?errorInfo=` + errorString
            );
        }
    }

    if (
        !busy &&
        viewerType !== VIEWER_TYPE.IMAGE &&
        viewerType !== VIEWER_TYPE.DOCUMENT &&
        viewerType !== VIEWER_TYPE.VIDEO &&
        !createFile &&
        (!data || data.length === 0)
    ) {
        return <Typography>{t("noContent")}</Typography>;
    }

    const LoadMoreButton = () => (
        <Toolbar>
            <Button
                id={build(baseId, ids.LOAD_MORE_BTN)}
                variant="outlined"
                color="primary"
                style={{ flex: 1 }}
                onClick={() => fetchMore()}
                disabled={!canFetchMore || isFetchingMore}
            >
                {t("loadMore")}
            </Button>
        </Toolbar>
    );

    if (viewerType === VIEWER_TYPE.PLAIN) {
        let flatData = "";
        data.forEach((page) => {
            flatData = flatData.concat(page.chunk);
        });
        return (
            <>
                <TextViewer
                    baseId={baseId}
                    path={path}
                    fileName={fileName}
                    resourceId={resourceId}
                    data={flatData}
                    mode={mode}
                    loading={isFetchingMore}
                    onRefresh={onRefresh}
                />
                <LoadMoreButton />
            </>
        );
    } else if (viewerType === VIEWER_TYPE.STRUCTURED) {
        return (
            <>
                <StructuredTextViewer
                    baseId={baseId}
                    path={path}
                    fileName={fileName}
                    resourceId={resourceId}
                    data={flattenStructureData(data)}
                    loading={isFetchingMore}
                    onRefresh={onRefresh}
                />
                <LoadMoreButton />
            </>
        );
    } else if (viewerType === VIEWER_TYPE.IMAGE) {
        return (
            <ImageViewer
                baseId={baseId}
                path={path}
                fileName={fileName}
                onRefresh={onRefresh}
            />
        );
    } else if (viewerType === VIEWER_TYPE.DOCUMENT) {
        return (
            <DocumentViewer
                baseId={baseId}
                path={path}
                fileName={fileName}
                onRefresh={onRefresh}
            />
        );
    } else if (viewerType === VIEWER_TYPE.VIDEO) {
        return (
            <VideoViewer
                baseId={baseId}
                path={path}
                fileName={fileName}
                onRefresh={onRefresh}
            />
        );
    } else if (viewerType === VIEWER_TYPE.PATH_LIST) {
        let dataToView = "";
        if (createFile) {
            if (createFile === infoTypes.HT_ANALYSIS_PATH_LIST) {
                dataToView = [{ 1: config.fileIdentifiers.htPathList }];
            } else if (createFile === infoTypes.MULTI_INPUT_PATH_LIST) {
                dataToView = [{ 1: config.fileIdentifiers.multiInputPathList }];
            }
        } else {
            dataToView = flattenStructureData(data);
        }
        return (
            <>
                <PathListViewer
                    createFile={createFile}
                    baseId={baseId}
                    path={path}
                    fileName={fileName}
                    resourceId={resourceId}
                    data={dataToView}
                    loading={isFetchingMore}
                    separator={separator}
                    onRefresh={onRefresh}
                    onNewFileSaved={onNewFileSaved}
                />
                <LoadMoreButton />
            </>
        );
    } else {
        return null;
    }
}
