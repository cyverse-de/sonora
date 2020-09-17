import React from "react";

import { ConfigProvider } from "../../../src/contexts/config";
import FileViewer from "components/data/viewers/FileViewer";
import { mockAxios } from "../../axiosMock";
import { fileTypesResp, csvMainfestResp, csvChunkResp } from "../DataMocks";
export default {
    title: "Data / Viewers",
};

function CSVViewerTest(props) {
    return (
        <ConfigProvider>
            <FileViewer
                baseId="data.viewer"
                path="/iplant/home/ipctest/geospiza.csv"
                resourceId="f5469f94-aq12-11e9-80c7-d8d385e427d4"
            />
        </ConfigProvider>
    );
}

export const CSVFileViewerTest = () => {
    mockAxios.onGet(/\/api\/filetypes\/type-list/).reply(200, fileTypesResp);
    mockAxios
        .onGet(
            `/api/filesystem/file/manifest?path=${encodeURIComponent(
                "/iplant/home/ipctest/geospiza.csv"
            )}`
        )
        .reply(200, csvMainfestResp);

    mockAxios
        .onPost(/\/api\/filesystem\/read-csv-chunk.*/)
        .reply(200, csvChunkResp);

    return <CSVViewerTest />;
};
