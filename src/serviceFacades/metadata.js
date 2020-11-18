/**
 * @author psarando
 */
import callApi from "../common/callApi";

const FILESYSTEM_METADATA_QUERY_KEY = "fetchFilesystemMetadataKey";

function getFilesystemMetadata(_, { dataId }) {
    return callApi({
        endpoint: `/api/filesystem/${dataId}/metadata`,
        method: "GET",
    });
}

function setFilesystemMetadata({ dataId, metadata }) {
    return callApi({
        endpoint: `/api/filesystem/${dataId}/metadata`,
        method: "POST",
        body: metadata,
    });
}

function saveFilesystemMetadata({ dataId, dest, recursive }) {
    return callApi({
        endpoint: `/api/filesystem/${dataId}/metadata/save`,
        method: "POST",
        body: { dest, recursive },
    });
}

export {
    FILESYSTEM_METADATA_QUERY_KEY,
    getFilesystemMetadata,
    saveFilesystemMetadata,
    setFilesystemMetadata,
};
