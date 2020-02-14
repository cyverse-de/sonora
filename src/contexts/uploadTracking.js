/**
 * Maintains the list of uploads that are queued or in-progress.
 *
 * See the following for reference:
 * - https://kentcdodds.com/blog/application-state-management-with-react
 * - https://kentcdodds.com/blog/how-to-use-react-context-effectively
 * - https://reactjs.org/docs/hooks-reference.html#usereducer
 *
 */

import React from "react";

/**
 * @typedef TrackableUpload
 * @property {string} id - Unique identifier for the upload.
 */

/**
 * @typedef UploadTrackingReducerAction
 * @property {string} type - One of 'add' or 'remove'.
 * @property {Trackableupload} upload - A trackable upload that is being added or removed.
 */

/**
 * @typedef UploadTrackingState
 * @property {Array<TrackableUpload>} uploads - An array of tracked uploads.
 */

const UploadTrackingStateContext = React.createContext();
const UploadTrackingDispatchContext = React.createContext();

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
            newState.uploads.unshift(action.upload);
            return newState;
        }

        // uses action.id to specify the upload to remove.
        case "remove": {
            const newState = { ...state };
            const removeIndex = newState.uploads.findIndex(
                (i) => i.id === action.id
            );
            if (removeIndex !== -1) {
                newState.uploads.splice(removeIndex, 1);
            }
            return newState;
        }

        default: {
            throw new Error(`unsupported action ${action.type}`);
        }
    }
};

/**
 * React components that wraps its child components in state and dispatch context providers
 * in order to allow them to use the useUploadTrackingState() and useUploadTrackingDispatch()
 * hooks to access the state of the tracked uploads.
 *
 * You probably don't want to access this, the entire app is wrapped in an instance of this
 * provider.
 */
const UploadTrackingProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(uploadReducer, { uploads: [] });
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
