import React from "react";
import {
    UploadTrackingProvider,
    useUploadTrackingDispatch,
    useUploadTrackingState,
} from "../src/contexts/uploadTracking";

export default {
    title: "Contexts/UploadTracking",
};

export const TryUploadTrackingProvider = () => {
    const TestComponent = () => {
        const uploads = useUploadTrackingState();
        return <div>Should be 0 => {uploads.uploads.length}</div>;
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
                Should be 1 => {tracked.uploads.length} <br /> Should be
                test-value-0 => {tracked.uploads[0].value}
            </div>
        );
    };
    const TestDispatcher = () => {
        const dispatch = useUploadTrackingDispatch();
        dispatch({
            type: "add",
            upload: { id: "test-0", value: "test-value-0" },
        });
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
            <div>
                Should not have test-2:
                {tracked.uploads.map((u) => (
                    <div>
                        test-{u.id} {u.value}
                    </div>
                ))}
            </div>
        );
    };
    const TestDispatcher = () => {
        const dispatch = useUploadTrackingDispatch();
        for (let upload of [0, 1, 2, 3]) {
            dispatch({
                type: "add",
                upload: { id: `${upload}`, value: `test-${upload}` },
            });
        }
        return <div></div>;
    };
    const TestDeleteTwo = () => {
        const dispatch = useUploadTrackingDispatch();
        dispatch({ type: "remove", id: "2" });
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
