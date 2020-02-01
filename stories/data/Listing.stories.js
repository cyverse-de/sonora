import React from "react";
import Listing from "../../src/components/data/listing/Listing";

export const DataListingTest = () => {
    const queryResp = {
        data: {
            filesystem: {
                id: "e23e208c-e210-11e3-b8e3-6abdce5a08d5",
                path: "/iplant/home/ipcdev",
                label: "ipcdev",
                dateModified: 1526071162000,
                permission: "READ",
                contents: {
                    listing: [
                        {
                            id: "b7d737ac-7f70-11e6-bf34-d8d385e427d4",
                            label: "analyses_qa-3",
                            path: "/iplant/home/ipcdev/analyses_qa-3",
                            dateModified: 1474403277000,
                            permission: "READ",
                            type: "FOLDER",
                        },
                        {
                            id: "3c1aeb2e-920c-11e5-81de-3c4a92e4a804",
                            label: "test",
                            path: "/iplant/home/ipcdev/test",
                            dateModified: 1530226175000,
                            permission: "OWN",
                            type: "FOLDER",
                        },
                        {
                            id: "07ffbe2c-ed92-11e6-bf47-d8d385e427d4",
                            label: "CORE-8424.txt",
                            path: "/iplant/home/ipcdev/CORE-8424.txt",
                            dateModified: 1486512213000,
                            permission: "READ",
                            type: "FILE",
                            fileSize: 9,
                        },
                        {
                            id: "a4a681ca-6072-11e4-9d04-3c4a92e4a804",
                            label: "sample.csv",
                            path: "/iplant/home/ipcdev/sample.csv",
                            dateModified: 1414700623000,
                            permission: "READ",
                            type: "FILE",
                            fileSize: 15,
                        },
                    ],
                },
            },
        },
    };

    return <Listing data={queryResp.data} baseId="dataView" />;
};

export default { title: "Data" };
