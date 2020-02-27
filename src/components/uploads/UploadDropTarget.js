/**
 * @author johnworth
 *
 * Component that allows files to be uploaded when they are dropped on child components.
 *
 * @module UploadDropTarget
 */

import React, { useState } from "react";
import processDroppedFiles, { trackUpload } from "./UploadDrop";
import { useUploadTrackingDispatch } from "../../contexts/uploadTracking";
import PropTypes from "prop-types";

/**
 * Utility function that prevents an event from propagating or using a
 * default handler.
 *
 * @param {object} event - The event that got fired off.
 * @returns null
 */
const setupEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
};

/**
 * @typedef UploadDropTargetProps
 * @property {Object} children - Child render props.
 * @property {string} path - The upload directory in the data store.
 * @property {number} uploadsCompleted - The number of uploads that have completed.
 * @property {func} setUploadsCompleted - Function that updates uploadsCompleted.
 */

/**
 * Performs file uploads to the `path` directory in the data store when
 * files are dropped onto the child components.
 *
 * @param {UploadDropTargetProps} props - The props for the component.
 * @returns {Object}
 */
const UploadDropTarget = (props) => {
    const uploadDispatch = useUploadTrackingDispatch();
    const [dragCounter, setDragCounter] = useState(0);
    const { children, path } = props;

    const trackAllUploads = (uploadFiles) =>
        uploadFiles.forEach((aFile) => {
            trackUpload(aFile.value, path, uploadDispatch);
        });

    const handleDragOver = (event) => {
        setupEvent(event);
    };

    const handleDragEnter = (event) => {
        setupEvent(event);

        // This event fires for all sub-elements that the items are dragged over,
        // so we track the number of elements and check it below to prevent the
        // border color from flickering for every element that's passed over.
        if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
            setDragCounter(dragCounter + 1);
        }
    };

    const handleDragLeave = (event) => {
        setupEvent(event);

        // See the comment in handleDragIn() for why we're doing this.
        if (dragCounter > 0) {
            setDragCounter(dragCounter - 1);
        }
    };

    const handleDrop = (event) => {
        setupEvent(event);
        setDragCounter(0);
        processDroppedFiles(event.dataTransfer.items, trackAllUploads);
    };

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
                filter: dragCounter > 0 && "opacity(50%)",
            }}
        >
            {children}
        </div>
    );
};

UploadDropTarget.propTypes = {
    children: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
};

export default UploadDropTarget;
