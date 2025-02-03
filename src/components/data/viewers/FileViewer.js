/**
 * @author sriram
 *
 * A component used to view contents of a file.
 *
 *
 */

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { useConfig } from "contexts/config";
import { useTranslation } from "i18n";
import { useRouter } from "next/router";

import { useQueryClient, useQuery } from "react-query";

import NavigationConstants from "common/NavigationConstants";
import infoTypes from "components/models/InfoTypes";
import {
    getMimeTypeFromString,
    getViewerMode,
    mimeTypes,
} from "components/models/MimeTypes";

import {
    READ_RAW_CHUNK_QUERY_KEY,
    READ_CHUNK_QUERY_KEY,
    FETCH_FILE_MANIFEST_QUERY_KEY,
    readFileChunk,
} from "serviceFacades/filesystem";
import viewerConstants from "./constants";
import DocumentViewer from "./DocumentViewer";
import ids from "./ids";
import ImageViewer from "./ImageViewer";
import PathListViewer from "./PathListViewer";
import { useFileManifest, useReadChunk } from "./queries";
import StructuredTextViewer from "./StructuredTextViewer";
import { CODE_MIRROR_MODES } from "./constants";
import { flattenStructureData } from "./utils";
import { parseNameFromPath, isWritable } from "../utils";

import isQueryLoading from "components/utils/isQueryLoading";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

import buildID from "components/utils/DebugIDUtil";
import { Button, Toolbar, Typography } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

// at the bottom so eslint doesn't complain
const VideoViewer = dynamic(() => import("./VideoViewer"));
const TextViewer = dynamic(() => import("./TextViewer"));

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
        createFileType,
        handlePathChange,
        onNewFileSaved,
        baseId,
        details,
        detailsLoading,
        detailsError,
    } = props;

    const { t } = useTranslation("data");
    const router = useRouter();
    const [readChunkKey, setReadChunkKey] = useState(READ_CHUNK_QUERY_KEY);
    const [readChunkQueryEnabled, setReadChunkQueryEnabled] = useState(false);
    const [readChunkRawQueryEnabled, setReadChunkRawQueryEnabled] =
        useState(false);
    const [viewerType, setViewerType] = useState(null);
    const [manifest, setManifest] = useState(null);
    const [separator, setSeparator] = useState("");
    const [mode, setMode] = useState();
    const [editable, setEditable] = useState(false);
    const [config] = useConfig();

    const fileName = parseNameFromPath(path);
    const manifestKey = [FETCH_FILE_MANIFEST_QUERY_KEY, path];

    // Get QueryClient from the context
    const queryClient = useQueryClient();

    const refreshViewer = (key) =>
        queryClient.invalidateQueries(key, {
            exact: true,
            refetchInactive: true,
        });

    const { isFetching, error: manifestError } = useFileManifest(
        manifestKey,
        path !== null && path !== undefined && !createFileType,
        (resp) => {
            trackIntercomEvent(IntercomEvents.VIEWED_FILE, { ...resp, path });
            setManifest(resp);
        }
    );

    const {
        status,
        data,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
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

    const {
        data: rawData,
        error: rawChunkError,
        isFetching: isFetchingRaw,
    } = useQuery({
        queryKey: [
            READ_RAW_CHUNK_QUERY_KEY,
            { path, chunkSize: viewerConstants.DEFAULT_PAGE_SIZE },
        ],
        queryFn: () =>
            readFileChunk({
                path,
                chunkSize: viewerConstants.DEFAULT_PAGE_SIZE,
            }),
        enabled: readChunkRawQueryEnabled,
    });

    const getColumnDelimiter = (infoType) => {
        if (infoTypes.CSV === infoType) {
            return viewerConstants.COMMA_DELIMITER;
        } else if (
            infoTypes.TSV === infoType ||
            infoTypes.VCF === infoType ||
            infoTypes.GFF === infoType ||
            infoTypes.BED === infoType ||
            infoTypes.GTF === infoType ||
            infoTypes.BOWTIE === infoType
        ) {
            return viewerConstants.TAB_DELIMITER;
        } else if (
            infoTypes.HT_ANALYSIS_PATH_LIST === infoType ||
            infoTypes.MULTI_INPUT_PATH_LIST === infoType
        ) {
            return viewerConstants.NEWLINE_DELIMITER;
        } else {
            return viewerConstants.SPACE_DELIMITER;
        }
    };

    useEffect(() => {
        if (createFileType) {
            switch (createFileType) {
                case CODE_MIRROR_MODES.R:
                case CODE_MIRROR_MODES.YAML:
                case CODE_MIRROR_MODES.DOCKERFILE:
                case CODE_MIRROR_MODES.PYTHON:
                case CODE_MIRROR_MODES.GITHUB_FLAVORED_MARKDOWN:
                case CODE_MIRROR_MODES.PERL:
                case CODE_MIRROR_MODES.SHELL:
                    setMode(createFileType);
                    setViewerType(VIEWER_TYPE.PLAIN);
                    break;

                case infoTypes.HT_ANALYSIS_PATH_LIST:
                case infoTypes.MULTI_INPUT_PATH_LIST:
                    setViewerType(VIEWER_TYPE.PATH_LIST);
                    break;

                case infoTypes.CSV:
                case infoTypes.TSV:
                    setViewerType(VIEWER_TYPE.STRUCTURED);
                    break;

                default:
                    setViewerType(VIEWER_TYPE.PLAIN);
            }
        }
    }, [createFileType, manifest]);

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
                        if (!createFileType) {
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
                        // Special handling for text-based formats that may not use the `text/` prefix.
                        const viewableApplicationTypes = [
                            mimeTypes.JSON,
                            mimeTypes.XML,
                            mimeTypes.X_SH,
                            mimeTypes.X_RSRC,
                            mimeTypes.X_PYTHON,
                            mimeTypes.X_PERL,
                            mimeTypes.X_WEB_MARKDOWN,
                            mimeTypes.PREVIEW,
                        ];

                        if (
                            manifest["content-type"].startsWith("text/") ||
                            (details && details["file-size"] === 0) ||
                            viewableApplicationTypes.includes(mimeType)
                        ) {
                            if (!createFileType) {
                                setReadChunkKey([
                                    READ_CHUNK_QUERY_KEY,
                                    {
                                        path,
                                        chunkSize:
                                            viewerConstants.DEFAULT_PAGE_SIZE,
                                    },
                                ]);
                                setReadChunkQueryEnabled(true);
                            }
                            setViewerType(VIEWER_TYPE.PLAIN);
                        } else {
                            setViewerType(VIEWER_TYPE.DOCUMENT);
                        }
                        break;
                    }
            }
        }
    }, [createFileType, manifest, details, path, separator]);

    useEffect(() => {
        setEditable(
            isWritable(details?.permission) &&
                details["file-size"] <= viewerConstants.DEFAULT_PAGE_SIZE
        );
    }, [details]);

    useEffect(() => {
        setReadChunkRawQueryEnabled(
            editable && viewerType === VIEWER_TYPE.STRUCTURED && !createFileType
        );
    }, [createFileType, editable, viewerType]);

    const memoizedData = useMemo(() => data, [data]);
    const busy = isQueryLoading([
        isFetching,
        isFetchingRaw,
        status,
        detailsLoading,
    ]);

    if (busy) {
        return (
            <Skeleton
                animation="wave"
                width="100%"
                height={viewerConstants.DEFAULT_VIEWER_HEIGHT}
            />
        );
    }

    if (manifestError || chunkError || detailsError || rawChunkError) {
        if (router) {
            const errorString = JSON.stringify(
                manifestError || chunkError || detailsError || rawChunkError
            );
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
        !createFileType &&
        (!memoizedData || memoizedData.pages.length === 0)
    ) {
        return <Typography>{t("noContent")}</Typography>;
    }

    const LoadMoreButton = () => (
        <Toolbar>
            <Button
                id={buildID(baseId, ids.LOAD_MORE_BTN)}
                variant="outlined"
                color="primary"
                style={{ flex: 1 }}
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
            >
                {t("loadMore")}
            </Button>
        </Toolbar>
    );

    if (viewerType === VIEWER_TYPE.PLAIN) {
        let flatData = "";
        if (createFileType) {
            flatData = "";
        } else {
            memoizedData.pages.forEach((page) => {
                flatData = flatData.concat(page.chunk);
            });
        }

        return (
            <>
                <TextViewer
                    baseId={baseId}
                    path={path}
                    fileName={fileName}
                    resourceId={resourceId}
                    data={flatData}
                    loading={isFetchingNextPage}
                    handlePathChange={handlePathChange}
                    onRefresh={() => refreshViewer(manifestKey)}
                    editable={editable || !!createFileType}
                    mode={mode}
                    onNewFileSaved={onNewFileSaved}
                    createFileType={createFileType}
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
                    structuredData={
                        createFileType ? [] : flattenStructureData(memoizedData)
                    }
                    rawData={rawData?.chunk || ""}
                    loading={isFetchingNextPage}
                    handlePathChange={handlePathChange}
                    onRefresh={() => refreshViewer(manifestKey)}
                    editable={editable || !!createFileType}
                    onNewFileSaved={onNewFileSaved}
                    createFileType={createFileType}
                    onSaveComplete={() => {
                        if (editable) {
                            queryClient.invalidateQueries(readChunkKey);
                        }
                    }}
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
                handlePathChange={handlePathChange}
                onRefresh={() => refreshViewer(manifestKey)}
            />
        );
    } else if (viewerType === VIEWER_TYPE.DOCUMENT) {
        return (
            <DocumentViewer
                baseId={baseId}
                path={path}
                fileName={fileName}
                handlePathChange={handlePathChange}
                onRefresh={() => refreshViewer(manifestKey)}
            />
        );
    } else if (viewerType === VIEWER_TYPE.VIDEO) {
        return (
            <VideoViewer
                baseId={baseId}
                path={path}
                fileName={fileName}
                handlePathChange={handlePathChange}
                onRefresh={() => refreshViewer(manifestKey)}
            />
        );
    } else if (viewerType === VIEWER_TYPE.PATH_LIST) {
        let dataToView = "";
        if (createFileType) {
            if (createFileType === infoTypes.HT_ANALYSIS_PATH_LIST) {
                dataToView = [{ 1: config.fileIdentifiers.htPathList }];
            } else if (createFileType === infoTypes.MULTI_INPUT_PATH_LIST) {
                dataToView = [{ 1: config.fileIdentifiers.multiInputPathList }];
            }
        } else {
            dataToView = flattenStructureData(memoizedData);
        }
        return (
            <>
                <PathListViewer
                    editable={editable || createFileType}
                    createFileType={createFileType}
                    baseId={baseId}
                    path={path}
                    fileName={fileName}
                    resourceId={resourceId}
                    data={dataToView}
                    loading={isFetchingNextPage}
                    handlePathChange={handlePathChange}
                    onRefresh={() => refreshViewer(manifestKey)}
                    onNewFileSaved={onNewFileSaved}
                />
                <LoadMoreButton />
            </>
        );
    } else {
        return null;
    }
}
