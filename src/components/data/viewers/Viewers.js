/**
 * @author sriram
 *
 * A component used to view contents of a file.
 *
 *
 */

import React, { useEffect, useState } from "react";

import { useQuery } from "react-query";

import {
    FETCH_FILE_MANIFEST_QUERY_KEY,
    fileManifest,
} from "serviceFacades/filesystem";

import MimeTypes from "components/models/MimeTypes";
import { CircularProgress } from "@material-ui/core";

export function Viewers(props) {
    const { path } = props;
    const [contentType, setContentType] = useState("");
    const [infoType, setInfoType] = useState("");
    const [visURLs, setVisURLs] = useState([]);

    const { isFetching } = useQuery({
        queryKey: [FETCH_FILE_MANIFEST_QUERY_KEY, path],
        queryFn: fileManifest,
        config: {
            enabled: path !== null && path !== undefined,
            onSuccess: (respData) => {
                console.log(JSON.stringify(respData));
                setContentType(respData["content-type"]);
                setInfoType(respData?.infoType);
                setVisURLs(respData?.urls);
            },
            onError: (e) => {
                console.log("error=>" + e);
            },
        },
    });

    useEffect(() => {
        switch (contentType) {
            case MimeTypes.PNG:
            case MimeTypes.JPEG:
            case MimeTypes.GIF:
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
            case MimeTypes.MP4:
            case MimeTypes.OGG:
            case MimeTypes.WEBM:
                /*         if((file != null) && !file.getPath().isEmpty()){
                    String videoUrl = fileEditorService.getServletDownloadUrl(file.getPath());

                    LOG.fine("Video viewer url: " + videoUrl);
                    VideoViewerImpl videoViewer = new VideoViewerImpl(file, videoUrl);
                    viewers.add(videoViewer);
                }
         */ break;
            case MimeTypes.PDF:
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

            case MimeTypes.HTML:
            case MimeTypes.XHTML_XML:
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

            case MimeTypes.VIZ:
                /*    ExternalVisualizationURLViewerImpl vizUrlViewer = new ExternalVisualizationURLViewerImpl(
                        file,
                        infoType,
                        fileEditorService,
                        diskResourceServiceFacade,
                        genomeBrowserUtil);
                viewers.add(vizUrlViewer);
              */ break;

            case MimeTypes.X_SH:
            case MimeTypes.X_RSRC:
            case MimeTypes.X_PYTHON:
            case MimeTypes.X_PERL:
            case MimeTypes.X_WEB_MARKDOWN:
                /*  Preconditions.checkArgument(!Strings.isNullOrEmpty(textViewerMode),
                                            "Text viewer mode should not be empty or null.");
                LOG.fine("mode-->" + textViewerMode);
                TextViewerImpl textViewer = new TextViewerImpl(file,
                                                               infoType,
                                                               textViewerMode,
                                                               editing,
                                                               presenter);
                viewers.add(textViewer); */
                break;

            case MimeTypes.PLAIN:
            case MimeTypes.PREVIEW:
            default:
                /*   Integer columns = null;
                if(manifest.getColumns() != null){
                    columns = manifest.getColumns();
                    LOG.fine("Columns are defined: " + columns);
                }
                if(CSV.toString().equals(infoType)
                    || TSV.toString().equals(infoType)
                    || VCF.toString().equals(infoType)
                    || GFF.toString().equals(infoType)
                    || GTF.toString().equals(infoType)
                    || BED.toString().equals(infoType)
                    || BOWTIE.toString().equals(infoType)){
                    StructuredTextViewer structuredTextViewer = new StructuredTextViewer(file,
                                                                                         infoType,
                                                                                         editing,
                                                                                         columns,
                                                                                         presenter);
                    viewers.add(structuredTextViewer);
                } else if (HT_ANALYSIS_PATH_LIST.toString().equals(infoType)
                           || MULTI_INPUT_PATH_LIST.toString().equals(infoType)) {
                    PathListViewer pathListViewer = new PathListViewer(file,
                                                                     infoType,
                                                                     editing,
                                                                       presenter,
                                                                       diskResourceUtil);
                    viewers.add(pathListViewer);
                }
                TextViewerImpl textViewer1 = new TextViewerImpl(file,
                                                                infoType,
                                                                null,
                                                                editing,
                                                                presenter);
                viewers.add(textViewer1); */
                break;
        }
    }, [contentType]);

    if (isFetching) {
        return <CircularProgress />;
    } else {
        return <div> Got manifest!</div>;
    }
}
