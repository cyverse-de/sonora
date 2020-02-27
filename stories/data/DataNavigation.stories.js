import React from "react";
import fetchMock from "fetch-mock";
import DataNavigation from "../../src/components/data/DataNavigation";
const successResp = {
    roots: [
        {
            id: "3afc8c52-e10a-11e3-8335-6abdce5a08d5",
            path: "/iplant/home/ipctest",
            label: "ipctest",
            "date-created": 1322887233000,
            "date-modified": 1463599086000,
            permission: "own",
            hasSubDirs: true,
        },
        {
            id: "7fa53922-e104-11e3-80a7-6abdce5a08d5",
            path: "/iplant/home/shared",
            label: "Community Data",
            "date-created": 1310756895000,
            "date-modified": 1363276169000,
            permission: "read",
            hasSubDirs: true,
        },
        {
            id: "86d5a8d2-e102-11e3-bfb4-6abdce5a08d5",
            path: "/iplant/home",
            label: "Shared With Me",
            "date-created": 1265955755000,
            "date-modified": 1451943447000,
            permission: "read",
            hasSubDirs: true,
        },
        {
            id: "754ab2dc-6de9-11e9-80c4-d8d385e427d4",
            path: "/iplant/trash/home/de-irods/ipctest",
            label: "Trash",
            "date-created": 1556918507000,
            "date-modified": 1556918507000,
            permission: "own",
            hasSubDirs: true,
        },
    ],
    "base-paths": {
        user_home_path: "/iplant/home/ipctest",
        user_trash_path: "/iplant/trash/home/de-irods/ipctest",
        base_trash_path: "/iplant/trash/home/de-irods",
    },
};
export const DataNavigationTest = () => {
    fetchMock.restore().get(/\/api\/filesystem\/root.*/, successResp);
    return (
        <DataNavigation path="/iplant/home/ipctest/analyses/foo/barborkborkborkbarborkborkbork" />
    );
};

export default { title: "Data" };
