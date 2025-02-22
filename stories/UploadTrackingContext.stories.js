import React from "react";
import {
    UploadTrackingProvider,
    useUploadTrackingDispatch,
    useUploadTrackingState,
    addAction,
    removeAction,
} from "../src/contexts/uploadTracking";

export default {
    title: "Contexts / UploadTracking",
};

export const TryUploadTrackingProvider = () => {
    const TestComponent = () => {
        const uploads = useUploadTrackingState();
        return (
            <div>
                Should be 0 ={">"} {uploads.uploads.length}
            </div>
        );
    };

    return (
        <UploadTrackingProvider>
            <TestComponent />
        </UploadTrackingProvider>
    );
};

export const WithOneUpload = () => {
    const TestComponent = () => {
        const tracked = useUploadTrackingState();
        return (
            <div>
                Should be 1 ={">"} {tracked.uploads.length}
                <br />
                Should be test-value-0 ={">"} {tracked.uploads[0]?.filename}
            </div>
        );
    };
    const TestDispatcher = () => {
        const dispatch = useUploadTrackingDispatch();
        dispatch(
            addAction({
                id: "test-0",
                filename: "test-value-0",
            })
        );
        return <div></div>;
    };
    return (
        <UploadTrackingProvider>
            <TestDispatcher />
            <TestComponent />
        </UploadTrackingProvider>
    );
};

export const RemoveAnUpload = () => {
    const TestComponent = () => {
        const tracked = useUploadTrackingState();
        return (
            <ul>
                Should not have test-2:
                {tracked.uploads.map((u) => (
                    <li key={u.filename}>{u.filename}</li>
                ))}
            </ul>
        );
    };
    const TestDispatcher = () => {
        const dispatch = useUploadTrackingDispatch();
        for (let upload of [0, 1, 2, 3]) {
            dispatch(
                addAction({ id: `${upload}`, filename: `test-${upload}` })
            );
        }
        return <div></div>;
    };
    const TestDeleteTwo = () => {
        const dispatch = useUploadTrackingDispatch();
        dispatch(removeAction({ id: "2" }));
        return <div></div>;
    };
    return (
        <UploadTrackingProvider>
            <TestDispatcher />
            <TestDeleteTwo />
            <TestComponent />
        </UploadTrackingProvider>
    );
};
