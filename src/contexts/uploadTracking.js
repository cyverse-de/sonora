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

const UploadTrackingStateContext = React.createContext();
const UploadTrackingDispatchContext = React.createContext();

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

const useUploadTrackingState = () => {
    const context = React.useContext(UploadTrackingStateContext);
    if (context === undefined) {
        throw new Error(
            "useUploadTrackingState must be used within an UploadTrackingProvider"
        );
    }
    return context;
};

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
