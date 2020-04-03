import React from "react";

import fetchMock from "fetch-mock";
import Listing from "../../src/components/data/listing/Listing";
import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";
import { fileTypesResp, dataRootsResp } from "./DataMocks";

export default {
    title: "Data",
};

function ListingTest(props) {
    const logger = (message) => {
        console.log(message);
    };

    return (
        <UploadTrackingProvider>
            <Listing
                baseId="tableView"
                path="/iplant/home/ipcdev"
                handlePathChange={(path) => logger("Change to path " + path)}
            />
        </UploadTrackingProvider>
    );
}

const successResp = {
    infoType: null,
    path: "/iplant/home/aramsey",
    "date-created": 1444670130000,
    folders: [
        {
            infoType: null,
            path: "/iplant/home/aramsey/TestData_qa",
            "date-created": 1565225021000,
            permission: "own",
            "date-modified": 1568318834000,
            "file-size": 0,
            badName: false,
            isFavorite: false,
            label: "TestData_qa",
            id: "9183e702-b975-11e9-80ce-d8d385e427d4",
        },
        {
            infoType: null,
            path: "/iplant/home/aramsey/analyses",
            "date-created": 1572887916000,
            permission: "own",
            "date-modified": 1572887916000,
            "file-size": 0,
            badName: false,
            isFavorite: false,
            label: "analyses",
            id: "22d2ecfc-ff27-11e9-80e3-d8d385e427d4",
        },
        {
            infoType: null,
            path: "/iplant/home/aramsey/analyses_qa",
            "date-created": 1565225575000,
            permission: "own",
            "date-modified": 1565225575000,
            "file-size": 0,
            badName: false,
            isFavorite: false,
            label: "analyses_qa",
            id: "db968b28-b976-11e9-80ce-d8d385e427d4",
        },
        {
            infoType: null,
            path: "/iplant/home/aramsey/analyses_qa-3",
            "date-created": 1473896447000,
            permission: "own",
            "date-modified": 1476220776000,
            "file-size": 0,
            badName: false,
            isFavorite: false,
            label: "analyses_qa-3",
            id: "a9546754-7ad4-11e6-bf34-d8d385e427d4",
        },
        {
            infoType: null,
            path: "/iplant/home/aramsey/bad'name",
            "date-created": 1486506280000,
            permission: "own",
            "date-modified": 1486507091000,
            "file-size": 0,
            badName: true,
            isFavorite: false,
            label: "bad'name",
            id: "37982538-ed84-11e6-bf47-d8d385e427d4",
        },
        {
            infoType: null,
            path: "/iplant/home/aramsey/coge_data",
            "date-created": 1554164907000,
            permission: "own",
            "date-modified": 1554164907000,
            "file-size": 0,
            badName: false,
            isFavorite: false,
            label: "coge_data",
            id: "3bf32b14-54de-11e9-80be-d8d385e427d4",
        },
    ],
    permission: "own",
    "date-modified": 1570058506000,
    hasSubDirs: true,
    "file-size": 0,
    badName: true,
    total: 70,
    isFavorite: false,
    label: "aramsey",
    id: "d6f46cca-7104-11e5-b73c-3c4a92e4a804",
    totalBad: 0,
    files: [
        {
            infoType: "ht-analysis-path-list",
            path: "/iplant/home/aramsey/CORE-9077-path.list",
            "date-created": 1512502386000,
            permission: "own",
            "date-modified": 1512502386000,
            "file-size": 90046,
            badName: false,
            isFavorite: false,
            label: "CORE-9077-path.list",
            id: "1e7e91d4-d9f3-11e7-bf79-d8d385e427d4",
        },
        {
            infoType: "unknown",
            path: "/iplant/home/aramsey/CORE-9077_test_file.txt",
            "date-created": 1512516445000,
            permission: "own",
            "date-modified": 1512516445000,
            "file-size": 10,
            badName: false,
            isFavorite: false,
            label: "CORE-9077_test_file.txt",
            id: "da63e3c0-da13-11e7-bf79-d8d385e427d4",
        },
        {
            infoType: "unknown",
            path: "/iplant/home/aramsey/Discovery Environment-CyVerse-blue.svg",
            "date-created": 1562000527000,
            permission: "own",
            "date-modified": 1562000527000,
            "file-size": 7526,
            badName: false,
            isFavorite: false,
            label: "Discovery Environment-CyVerse-blue.svg",
            id: "f5469f94-9c21-11e9-80c7-d8d385e427d4",
        },
    ],
};

export const DataListingTest = () => {
    fetchMock
        .get(/\/api\/filesystem\/paged-directory.*/, successResp)
        .get(/\/api\/filesystem\/root.*/, dataRootsResp)
        .get(/\/api\/filetypes\/type-list/, fileTypesResp);
    return <ListingTest />;
};
