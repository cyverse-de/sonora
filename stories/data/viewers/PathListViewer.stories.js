import React from "react";

import { ConfigProvider } from "../../../src/contexts/config";
import FileViewer from "components/data/viewers/FileViewer";
import { mockAxios } from "../../axiosMock";
import {
    fileTypesResp,
    pathListManifestResp,
    pathListChunk,
    pathListfileStatResp,
} from "../DataMocks";
export default {
    title: "Data / Viewers",
};

function PathListViewerTest(props) {
    return (
        <ConfigProvider>
            <FileViewer
                baseId="data.viewer"
                path="/iplant/home/ipctest/sample-pathlist"
                resourceId="f5469f94-aq12-11e9-80c7-d8d385e427d4"
            />
        </ConfigProvider>
    );
}

export const PathListFileViewerTest = () => {
    mockAxios.onGet(/\/api\/filetypes\/type-list/).reply(200, fileTypesResp);
    mockAxios
        .onGet(
            `/api/filesystem/file/manifest?path=${encodeURIComponent(
                "/iplant/home/ipctest/sample-pathlist"
            )}`
        )
        .reply(200, pathListManifestResp);

    mockAxios
        .onPost(/\/api\/filesystem\/read-csv-chunk.*/)
        .reply(200, pathListChunk);

    mockAxios
        .onPost(/\/api\/filesystem\/stat/)
        .reply(200, pathListfileStatResp);

    return <PathListViewerTest />;
};
