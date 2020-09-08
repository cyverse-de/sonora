/**
 * @author sriram
 *
 * A component used to view contents of a file.
 *
 *
 */

import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";
import { useRouter } from "next/router";

import { useFileManifest, useReadChunk } from "./queries";
import constants from "../../../constants";
import NavigationConstants from "../../../common/NavigationConstants";

import {
    FETCH_FILE_MANIFEST_QUERY_KEY,
    READ_CHUNK_QUERY_KEY,
} from "serviceFacades/filesystem";
import {
    mimeTypes,
    getMimeTypeFromString,
    getViewerMode,
} from "components/models/mimeTypes";
import infoTypes from "components/models/InfoTypes";

import viewerConstants from "./constants";
import TextViewer from "./TextViewer";
import StructuredTextViewer from "./StructuredTextViewer";

import { Button, CircularProgress, Toolbar } from "@material-ui/core";

const VIEWER_TYPE = {
    PLAIN: "plain",
    STRUCTURED: "structured",
};

export default function FileViewer(props) {
    const { path } = props;

    const { t } = useTranslation("data");
    const router = useRouter();

    const [contentType, setContentType] = useState("");
    const [infoType, setInfoType] = useState("");
    const [mode, setMode] = useState(null);
    const [readChunkKey, setReadChunkKey] = useState(READ_CHUNK_QUERY_KEY);
    const [readChunkQueryEnabled, setReadChunkQueryEnabled] = useState(false);
    const [viewerType, setViewerType] = useState(VIEWER_TYPE.PLAIN);

    const { isFetching, error: manifestError } = useFileManifest(
        [FETCH_FILE_MANIFEST_QUERY_KEY, path],
        path !== null && path !== undefined,
        (respData) => {
            console.log(JSON.stringify(respData));
            setContentType(respData["content-type"]);
            setInfoType(respData?.infoType);
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
        const mimeType = getMimeTypeFromString(contentType);
        setMode(getViewerMode(mimeType));
        switch (mimeType) {
            case mimeTypes.PNG:
            case mimeTypes.JPEG:
            case mimeTypes.GIF:
                /*         if(editing) {
                    announcer.schedule(new ErrorAnnouncementConfig("Editing is not supported for this type of file."));
                }
                if((file != null) && !file.getId().isEmpty()){
                    String imageUrl = fileEditorService.getServletDownloadUrl(file.getPath());
                    LOG.fine("Image viewer url: " + imageUrl);
                    ImageViewerImpl imgViewer = new ImageViewerImpl(file, imageUrl);
                    viewers.add(imgViewer);
                }
         */ break;
            case mimeTypes.MP4:
            case mimeTypes.OGG:
            case mimeTypes.WEBM:
                /*         if((file != null) && !file.getPath().isEmpty()){
                    String videoUrl = fileEditorService.getServletDownloadUrl(file.getPath());

                    LOG.fine("Video viewer url: " + videoUrl);
                    VideoViewerImpl videoViewer = new VideoViewerImpl(file, videoUrl);
                    viewers.add(videoViewer);
                }
         */ break;
            case mimeTypes.PDF:
                /*   if(editing) {
                    announcer.schedule(new ErrorAnnouncementConfig("Editing is not supported for this type of file."));
                }
                if(!Strings.isNullOrEmpty(filePath)){
                    String downloadUrl = fileEditorService.getServletDownloadUrl(filePath);
                    String url = downloadUrl + "&attachment=0";
                    LOG.fine("PDF viewer url: " + url);
                    WindowUtil.open(url);
                }
               */ break;

            case mimeTypes.HTML:
            case mimeTypes.XHTML_XML:
                /*    if(editing) {
                    announcer.schedule(new ErrorAnnouncementConfig("Editing is not supported for this type of file."));
                }
                if(!Strings.isNullOrEmpty(filePath)){
                    String downloadUrl = fileEditorService.getServletDownloadUrl(filePath);
                    String url = downloadUrl + "&attachment=0";
                    LOG.fine(type.toString() + " viewer url: " + url);
                    WindowUtil.open(url);
                }
              */ break;

            case mimeTypes.VIZ:
                /*    ExternalVisualizationURLViewerImpl vizUrlViewer = new ExternalVisualizationURLViewerImpl(
                        file,
                        infoType,
                        fileEditorService,
                        diskResourceServiceFacade,
                        genomeBrowserUtil);
                viewers.add(vizUrlViewer);
              */ break;

            case mimeTypes.X_SH:
            case mimeTypes.X_RSRC:
            case mimeTypes.X_PYTHON:
            case mimeTypes.X_PERL:
            case mimeTypes.X_WEB_MARKDOWN:
            case mimeTypes.PLAIN:
            case mimeTypes.PREVIEW:
                setReadChunkKey([
                    READ_CHUNK_QUERY_KEY,
                    { path, chunkSize: viewerConstants.DEFAULT_PAGE_SIZE },
                ]);
                setReadChunkQueryEnabled(true);
                setViewerType(VIEWER_TYPE.PLAIN);
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
                    const separator = getColumnDelimiter(infoType);
                    setReadChunkKey([
                        READ_CHUNK_QUERY_KEY,
                        {
                            path,
                            separator,
                            chunkSize: viewerConstants.DEFAULT_PAGE_SIZE,
                        },
                    ]);
                    setReadChunkQueryEnabled(true);
                    setViewerType(VIEWER_TYPE.STRUCTURED);
                    break;
                } /* else if (HT_ANALYSIS_PATH_LIST.toString().equals(infoType)
                           || MULTI_INPUT_PATH_LIST.toString().equals(infoType)) {
                    PathListViewer pathListViewer = new PathListViewer(file,
                                                                     infoType,
                                                                     editing,
                                                                       presenter,
                                                                       diskResourceUtil);
                   
                } */

                break;
        }
    }, [contentType, infoType, path]);

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
        const errorString = JSON.stringify(manifestError || chunkError);
        router.push(`/${NavigationConstants.ERROR}?errorInfo=` + errorString);
    }

    if (!busy && (!data || data.length === 0)) {
        return <div>No content to display.</div>;
    }

    const LoadMoreButton = () => (
        <Toolbar>
            <Button
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
        let flatData ="";
        data.forEach((page) => {
            flatData = flatData.concat(page.chunk);
        });
        return (
            <>
                <TextViewer data={flatData} mode={mode} loading={isFetchingMore}/>
                <LoadMoreButton />
            </>
        );
    } else if (viewerType === VIEWER_TYPE.STRUCTURED) {
        let flatData = [];
        data.forEach((page) => {
            flatData = [...flatData, ...page.csv];
        });
        return (
            <>
                <StructuredTextViewer
                    data={flatData}
                    loading={isFetchingMore}
                />
                <LoadMoreButton />
            </>
        );
    }
}
