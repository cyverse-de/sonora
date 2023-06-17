import React from "react";

import FileViewer from "components/data/viewers/FileViewer";
import { AXIOS_DELAY, mockAxios } from "../../axiosMock";
import { fileTypesResp, csvMainfestResp, csvChunkResp } from "../DataMocks";
export default {
    title: "Data / Viewers / CSV",
};

function CSVViewerTest(props) {
    return (
        <FileViewer
            baseId="data.viewer"
            path="/iplant/home/ipctest/geospiza.csv"
            resourceId="f5469f94-aq12-11e9-80c7-d8d385e427d4"
        />
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
CSVFileViewerTest.parameters = { chromatic: { delay: AXIOS_DELAY * 2 } };
