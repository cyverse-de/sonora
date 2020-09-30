import React from "react";

import { ConfigProvider } from "../../../src/contexts/config";
import FileViewer from "components/data/viewers/FileViewer";
import { mockAxios } from "../../axiosMock";
import { fileTypesResp, plainManifestResp, plainChunk } from "../DataMocks";
export default {
    title: "Data / Viewers",
};

function PlainTextViewerTest(props) {
    return (
        <ConfigProvider>
            <FileViewer
                baseId="data.viewer"
                path="/iplant/home/ipctest/test.txt"
                resourceId="f5469f94-aq12-11e9-81er-d8d385e427d4"
            />
        </ConfigProvider>
    );
}

export const PlainTextFileViewerTest = () => {
    mockAxios.onGet(/\/api\/filetypes\/type-list/).reply(200, fileTypesResp);
    mockAxios
        .onGet(
            `/api/filesystem/file/manifest?path=${encodeURIComponent(
                "/iplant/home/ipctest/test.txt"
            )}`
        )
        .reply(200, plainManifestResp);

    mockAxios.onPost(/\/api\/filesystem\/read-chunk.*/).reply(200, plainChunk);

    return <PlainTextViewerTest />;
};
