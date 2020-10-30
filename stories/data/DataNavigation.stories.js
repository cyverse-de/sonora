import React from "react";
import DataNavigation from "../../src/components/data/toolbar/Navigation";
import { dataRootsResp } from "./DataMocks";
import { mockAxios } from "../axiosMock";
import { ConfigProvider } from "contexts/config";

export const DataNavigationTest = () => {
    mockAxios.onGet(/\/api\/filesystem\/root.*/).reply(200, dataRootsResp);
    return (
        <ConfigProvider>
            <DataNavigation
                path="/iplant/home/ipcdev/analyses/foo/barborkborkborkbarborkborkbork"
                baseId="navigation"
                handlePathChange={console.log}
                handleDataNavError={console.log}
            />
        </ConfigProvider>
    );
};

export default { title: "Data/ Navigation" };
