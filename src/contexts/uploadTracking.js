/**
 * Maintains the list of uploads that are queued or in-progress.
 *
 * See the following for reference:
 * - https://kentcdodds.com/blog/application-state-management-with-react
 * - https://kentcdodds.com/blog/how-to-use-react-context-effectively
 * - https://reactjs.org/docs/hooks-reference.html#usereducer
 *
 * @module uploadTracking
 */

import React from "react";
import UUID from "uuid/v4";

export const KindFile = "file";
export const KindURL = "url";

/**
 * @typedef TrackableUpload
 * @property {string} id - Unique identifier for the upload.
 * @property {boolean} isUploading - Whether or not the file is currently uploading.
 * @property {boolean} hasUploaded - Whether or not the file has uploaded.
 * @property {boolean} hasErrored - Whether or not the file upload encountered an error.
 * @property {string} errorMessage - The error message.
 * @property {string} parentPath - The path to the directory the file is being uploaded to.
 * @property {string} filename - The filename of the upload.
 * @property {string} url - The URL being imported. Will be blank for file uploads.
 * @property {File} file - The file being uploaded.
 * @property {Object} cancelFn - The function to call to cancel the import/upload. Should not take any params.
 */

/**
 * Returns a new TrackableUpload object filled out with defaults where no custom settings
 * is provided.
 *
 * @params {TrackableUpload} - can be an empty object.
 * @returns TrackableUpload
 */
export const trackableUpload = ({
    kind = KindFile,
    isUploading = false,
    hasUploaded = false,
    hasErrored = false,
    errorMessage = "",
    parentPath = "",
    filename = "",
    url = "",
    file = null,
    cancelFn = () => {
        console.log("no-op cancelFn called");
    },
}) => ({
    id: UUID(),
    kind,
    isUploading,
    hasUploaded,
    hasErrored,
    errorMessage,
    parentPath,
    filename,
    url,
    file,
    cancelFn,
});

/**
 * @typedef AddState
 * @property {string} id - Same as for TrackableUpload.
 * @property {boolean} [isUploading] - Whether or not the file is currently uploading.
 * @property {boolean} [hasUploaded] - Whether or not the file has uploaded.
 * @property {boolean} [hasErrored] - Whether or not the file upload encountered an error.
 * @property {string} [errorMessage] - The error message.
 * @property {string} [parentPath] - The path to the directory the file is being uploaded to.
 * @property {string} [filename] - The filename of the upload.
 * @property {string} [url] - The URL being imported. Will be blank for file uploads.
 * @property {File} file - The file being uploaded.
 * @property {Object} [cancelFn] - The function to call to cancel the import/upload. Should not take params.
 */

/**
 * @typedef AddAction
 * @property {string} type="add" - Defines the type of action.
 * @property {AddState} upload - The state for the action.
 */

/**
 * Creates a new AddAction.
 * @param {AddState} upload - The state required for the add action.
 * @returns {AddAction}
 */
export const addAction = (upload) => ({
    type: "add",
    upload: {
        ...trackableUpload({}),
        ...upload,
    },
});

/**
 * @typedef RemoveState
 * @property {string} id - Same as for TrackableUpload.
 */

/**
 * @typedef RemoveAction
 * @property {string} type="remove" - Defines the type of action.
 * @property {RemoveState} upload - The state for the action.
 */

/**
 * Creates a new RemoveAction.
 * @param {RemoveState} upload - The state required for the remove action.
 * @returns {RemoveAction}
 */
export const removeAction = (upload) => ({
    type: "remove",
    upload: upload,
});

/**
 * @typedef UpdateStatusState
 * @property {string} id - Same as for TrackableUpload.
 * @property {boolean} [hasUploaded] - New value for hasUploaded.
 * @property {boolean} [isUploading] - New value for isUploading.
 */

/**
 * @typedef UpdateStatusAction
 * @property {string} type="updateStatus" - Defines the type of action.
 * @property {UpdateStatusState} upload - The state for the action.
 */

/**
 * Creates a new UpdateStatusAction.
 * @param {UpdateStatusState} upload - The state required for the update status action.
 * @returns {UpdateStatusAction}
 */
export const updateStatusAction = (upload) => ({
    type: "updateStatus",
    upload: upload,
});

/**
 * @typedef ErrorState
 * @property {string} id - Same as for TrackableUpload.
 * @property {string} [errorMessage] - Same as for TrackableUpload.
 */

/**
 * @typedef ErrorAction
 * @property {string} type="error" - Defines the type of action.
 * @property {ErrorState} upload - The state for the action.
 */

/**
 * Creates a new ErrorAction.
 * @param {ErrorState} upload - The state required for the error action.
 * @returns {ErrorAction}
 */
export const errorAction = (upload) => ({
    type: "error",
    upload: upload,
});

/**
 * @typedef SetCancelFnState
 * @property {string} id - Same as for TrackableUpload.
 * @property {Object} cancelFn - The cancellation callback.
 */

/**
 * @typedef SetCancelFnAction
 * @property {string} type="setCancelFn" - Defines the type of action.
 * @property {setCancelFnState} upload - The function to call to cancel the import/upload. Should not take params.
 */

/**
 * Sets state.cancelFn to a new function.
 * @returns {SetCancelFnAction}
 */
export const setCancelFnAction = (upload) => ({
    type: "setCancelFn",
    upload: upload,
});

/**
 * @typedef UploadTrackingState
 * @property {Array<TrackableUpload>} uploads - An array of tracked uploads.
 */

/**
 * @typedef UploadTrackingReducerAction
 * @property {string} type - The type of action.
 * @property {Object} upload - The new state assocaited with the action.
 */

/**
 * Processes dispatched actions that change the state of the stored
 * TrackableUploads. Returns the new state of the tracked uploads.
 *
 * @param {UploadTrackingState} state - The current state of the UploadTracking context.
 * @param {UploadTrackingReducerAction} action - The operation being done on the UploadTracking context.
 * @returns {UploadTrackingState}
 */
const uploadReducer = (state, action) => {
    switch (action.type) {
        // prepends the action.upload object to the beginning of the
        // state.uploads array.
        case "add": {
            const newState = { ...state };
            newState.uploads = [...newState.uploads, action.upload];
            return newState;
        }

        // uses action.id to specify the upload to remove.
        case "remove": {
            const newState = { ...state };
            const removeIndex = newState.uploads.findIndex(
                (i) => i.id === action.upload.id
            );
            if (removeIndex !== -1) {
                newState.uploads.splice(removeIndex, 1);
            }
            return newState;
        }

        case "updateStatus": {
            const newState = { ...state };
            const idx = newState.uploads.findIndex(
                (i) => i.id === action.upload.id
            );
            const newIsUploading = // Allows isUploading to be optional
                action.upload.isUploading === undefined
                    ? newState.uploads[idx].isUploading
                    : action.upload.isUploading;
            const newHasUploaded = // Allows hasUploaded to be optional
                action.upload.hasUploaded === undefined
                    ? newState.uploads[idx].hasUploaded
                    : action.upload.hasUploaded;
            newState.uploads[idx] = {
                ...newState.uploads[idx],
                isUploading: newIsUploading,
                hasUploaded: newHasUploaded,
            };
            return newState;
        }

        case "setCancelFn": {
            const newState = { ...state };
            const idx = newState.uploads.findIndex(
                (i) => i.id === action.upload.id
            );
            newState.uploads[idx] = {
                ...newState.uploads[idx],
                cancelFn: action.cancelFn,
            };
            return newState;
        }

        case "error": {
            const newState = { ...state };
            const idx = newState.uploads.findIndex(
                (i) => i.id === action.upload.id
            );
            const newErrorMessage = // Allows the errorMessage to be optional
                action.upload.errorMessage !== undefined
                    ? action.upload.errorMessage
                    : "";
            newState.uploads[idx] = {
                ...newState.uploads[idx],
                hasErrored: true,
                errorMessage: newErrorMessage,
            };
            return newState;
        }

        case "setShowQueue": {
            return { ...state, showQueue: action.showQueue };
        }

        case "setQueueMinimized": {
            return { ...state, queueMinimized: action.queueMinimized };
        }

        default: {
            throw new Error(`unsupported action ${action.type}`);
        }
    }
};

const UploadTrackingStateContext = React.createContext();
const UploadTrackingDispatchContext = React.createContext();

/**
 * React components that wraps its child components in state and dispatch context providers
 * in order to allow them to use the useUploadTrackingState() and useUploadTrackingDispatch()
 * hooks to access the state of the tracked uploads.
 *
 * You probably don't want to access this, the entire app is wrapped in an instance of this
 * provider.
 */
const UploadTrackingProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(uploadReducer, {
        uploads: [],
    });
    return (
        <UploadTrackingStateContext.Provider value={state}>
            <UploadTrackingDispatchContext.Provider value={dispatch}>
                {children}
            </UploadTrackingDispatchContext.Provider>
        </UploadTrackingStateContext.Provider>
    );
};

/**
 * A hook that returns a context that allows accessing the current state of the tracked uploads.
 *
 * Use this in your components to access the state of the tracked uploads.
 */
const useUploadTrackingState = () => {
    const context = React.useContext(UploadTrackingStateContext);
    if (context === undefined) {
        throw new Error(
            "useUploadTrackingState must be used within an UploadTrackingProvider"
        );
    }
    return context;
};

/**
 * A hook that returns a context that allows for modifying the state of the tracked uploads.
 *
 * Use this in your components to modify the state of the tracked uploads.
 */
const useUploadTrackingDispatch = () => {
    const context = React.useContext(UploadTrackingDispatchContext);
    if (context === undefined) {
        throw new Error(
            "useUploadTrackingDispatch must be used within an UploadTrackingProvider"
        );
    }
    return context;
};

export {
    UploadTrackingProvider,
    useUploadTrackingState,
    useUploadTrackingDispatch,
};
