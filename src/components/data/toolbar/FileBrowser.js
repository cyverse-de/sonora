import React from "react";

/**
 * A component that remains hidden, but enables file browsing via the browser
 * and passes back the selected files in onChange.  It's activated via the shared
 * element id with the Browse Local menu item.
 *
 * @param id
 * @param handleUploadFiles
 * @returns {*}
 * @constructor
 */
export default function FileBrowser({ id, handleUploadFiles }) {
    return (
        <input
            id={id}
            type="file"
            multiple
            onChange={(event) => {
                handleUploadFiles(event.target.files);
            }}
            style={{ display: "none" }}
        />
    );
}
