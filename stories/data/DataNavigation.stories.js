import React from "react";
import DataNavigation from "../../src/components/data/DataNavigation";
import { dataRootsResp } from "./DataMocks";
import fetchMock from "fetch-mock";

export const DataNavigationTest = () => {
    fetchMock.get(/\/api\/filesystem\/root.*/, dataRootsResp);
    return (
        <DataNavigation
            path="/iplant/home/ipcdev/analyses/foo/barborkborkborkbarborkborkbork"
            baseId="navigation"
            handlePathChange={console.log}
        />
    );
};

export default { title: "Data" };
