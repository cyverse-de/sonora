import React from "react";

import FileViewer from "components/data/viewers/FileViewer";
import { mockAxios } from "../../axiosMock";
import {
    fileTypesResp,
    pathListManifestResp,
    pathListChunk,
} from "../DataMocks";
export default {
    title: "Data / Viewers",
};

function PathListViewerTest(props) {
    return (
        <FileViewer
            baseId="data.viewer"
            path="/iplant/home/ipctest/sample-pathlist"
            resourceId="f5469f94-aq12-11e9-80c7-d8d385e427d4"
        />
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

    return <PathListViewerTest />;
};
