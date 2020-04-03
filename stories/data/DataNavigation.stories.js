import React from "react";
import DataNavigation from "../../src/components/data/DataNavigation";
import { dataRootsResp } from "./DataMocks";

export const DataNavigationTest = () => {
    const basePaths = dataRootsResp["base-paths"];
    return (
        <DataNavigation
            path="/iplant/home/ipctest/analyses/foo/barborkborkborkbarborkborkbork"
            dataRoots={dataRootsResp.roots}
            userHomePath={basePaths["user_home_path"]}
            userTrashPath={basePaths["user_trash_path"]}
        />
    );
};

export default { title: "Data" };
