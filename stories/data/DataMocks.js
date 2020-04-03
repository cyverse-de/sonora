import React from "react";

import HomeIcon from "@material-ui/icons/Home";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import GroupIcon from "@material-ui/icons/Group";
import DeleteIcon from "@material-ui/icons/Delete";

export const pagedDirectoryResp = {
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

export const dataRootsResp = {
    roots: [
        {
            id: "3afc8c52-e10a-11e3-8335-6abdce5a08d5",
            path: "/iplant/home/sriram",
            label: "sriram",
            "date-created": 1322887233000,
            "date-modified": 1463599086000,
            permission: "own",
            hasSubDirs: true,
            icon: <HomeIcon />,
        },
        {
            id: "7fa53922-e104-11e3-80a7-6abdce5a08d5",
            path: "/iplant/home/shared",
            label: "Community Data",
            "date-created": 1310756895000,
            "date-modified": 1363276169000,
            permission: "read",
            hasSubDirs: true,
            icon: <FolderSharedIcon />,
        },
        {
            id: "86d5a8d2-e102-11e3-bfb4-6abdce5a08d5",
            path: "/iplant/home",
            label: "Shared With Me",
            "date-created": 1265955755000,
            "date-modified": 1451943447000,
            permission: "read",
            hasSubDirs: true,
            icon: <GroupIcon />,
        },
        {
            id: "754ab2dc-6de9-11e9-80c4-d8d385e427d4",
            path: "/iplant/trash/home/de-irods/sriram",
            label: "Trash",
            "date-created": 1556918507000,
            "date-modified": 1556918507000,
            permission: "own",
            hasSubDirs: true,
            icon: <DeleteIcon />,
        },
    ],
    "base-paths": {
        user_home_path: "/iplant/home/sriram",
        user_trash_path: "/iplant/trash/home/de-irods/sriram",
        base_trash_path: "/iplant/trash/home/de-irods",
    },
};

export const fileTypesResp = {
    types: [
        "ace",
        "bam",
        "bash",
        "bed",
        "bedgz",
        "bigbed",
        "bigwig",
        "blast",
        "bowtie",
        "tsv",
        "vcf",
        "vcfgz",
        "zip",
    ],
};

export const dirResource = {
    id: "b7d737ac-7f70-11e6-bf34-d8d385e427d4",
    label: "analyses_qa-3",
    path: "/iplant/home/ipcdev/analyses_qa-3",
    dateModified: 1474403277000,
    permission: "READ",
    type: "FOLDER",
};

export const fileResource = {
    id: "07ffbe2c-ed92-11e6-bf47-d8d385e427d4",
    label: "CORE-8424.txt",
    path: "/iplant/home/ipcdev/CORE-8424.txt",
    dateModified: 1486512213000,
    permission: "READ",
    type: "FILE",
    fileSize: 9,
};

export const dirStatResp = {
    paths: {
        "/iplant/home/ipcdev/analyses_qa-3": {
            path: "/iplant/home/ipcdev/analyses_qa-3",
            "share-count": 0,
            "date-created": 1516294884000,
            permission: "own",
            "date-modified": 1516294884000,
            type: "dir",
            "dir-count": 0,
            label: "1_18_18",
            id: "371db1ac-fc71-11e7-bf99-d8d385e427d4",
            "file-count": 3,
        },
    },
    ids: {},
};

export const fileStatResp = {
    paths: {
        "/iplant/home/ipcdev/CORE-8424.txt": {
            infoType: "bam",
            path: "/iplant/home/ipcdev/CORE-8424.txt",
            "share-count": 0,
            "date-created": 1569007396000,
            md5: "e02ad19784cef44fe4ecdfdcba33c8fc",
            permission: "own",
            "date-modified": 1569007396000,
            type: "file",
            "file-size": 270233707,
            label: "accepted_hits.bam",
            id: "1cbb2f32-dbdc-11e9-8c1e-90e2ba675364",
            "content-type": "application/gzip",
        },
    },
    ids: {},
};

export const resourceTagResp = {
    tags: [
        {
            id: "631334a=b4-52a9-11ea-b48d-008cfa5ae621",
            value: "testTag1",
            description: "",
        },
        {
            id: "631334c4-52a9-11ea-b48d-008cfa5ae721",
            value: "testTag2",
            description: "",
        },
    ],
};

export const resourceUpdatedInfoTypeResp = {
    type: "ace",
    user: "ipcdev",
    path: "/iplant/home/ipcdev/CORE-8424.txt",
};
