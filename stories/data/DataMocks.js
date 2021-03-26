import React from "react";

import { mockAxios } from "../axiosMock";

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
            path: "/iplant/home/ipcdev",
            label: "ipcdev",
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

export const pathListfileStatResp = {
    paths: {
        "/iplant/home/ipctest/sample-pathlist": {
            infoType: "bam",
            path: "/iplant/home/ipctest/sample-pathlist",
            "share-count": 0,
            "date-created": 1569007396000,
            md5: "e02ad19784cef44fe4ecdfqwba33c8fc",
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

export const createFolderSuccessResp = {
    path: "/iplant/home/ipcdev/test",
    "share-count": 0,
    "date-created": 1587585065000,
    permission: "own",
    "date-modified": 1587585065000,
    type: "dir",
    "dir-count": 0,
    label: "blah",
    id: "9a841114-84d2-11ea-a8b6-fa163e806578",
    "file-count": 0,
};

export const createFolderFailResp = {
    path: "/iplant/home/ipcdev/test",
    error_code: "ERR_EXISTS",
};

export const csvMainfestResp = {
    "content-type": "text/csv",
    infoType: "csv",
    urls: [],
};

export const plainManifestResp = {
    "content-type": "text/plain",
    infoType: "unknown",
    urls: [],
};

export const pathListManifestResp = {
    "content-type": "text/plain",
    infoType: "ht-analysis-path-list",
    urls: [],
};

export const csvChunkResp = {
    path: "/iplant/home/ipctest/geospiza.csv",
    user: "sriram",
    "chunk-size": "851",
    "file-size": "851",
    page: "1",
    "number-pages": "1",
    "max-cols": "6",
    csv: [
        {
            0: "",
            1: "wingL",
            2: "tarsusL",
            3: "culmenL",
            4: "BeakD",
            5: "gonysW",
        },
        {
            0: "magnirostris",
            1: "4.402",
            2: "3.03895",
            3: "2.2724667",
            4: "2.823767",
            5: "2.675983",
        },
        {
            0: "conirostris",
            1: "4.398667",
            2: "2.9842",
            3: "2.6544",
            4: "2.5138",
            5: "2.360167",
        },
        {
            0: "difficilis",
            1: "4.224067",
            2: "2.898917",
            3: "2.277183",
            4: "2.0111",
            5: "1.929983",
        },
        {
            0: "scandens",
            1: "4.261222",
            2: "2.929033",
            3: "2.621789",
            4: "2.1447",
            5: "2.036944",
        },
        {
            0: "fortis",
            1: "4.244008",
            2: "2.894717",
            3: "2.407025",
            4: "2.362658",
            5: "2.221867",
        },
        {
            0: "fuliginosa",
            1: "4.123957",
            2: "2.806513",
            3: "2.094971",
            4: "1.941157",
            5: "1.845379",
        },
        {
            0: "pallida",
            1: "4.265425",
            2: "3.08945",
            3: "2.43025",
            4: "2.01635",
            5: "1.949125",
        },
        {
            0: "fusca",
            1: "3.975393",
            2: "2.936536",
            3: "2.051843",
            4: "1.191264",
            5: "1.401186",
        },
        {
            0: "parvulus",
            1: "4.136",
            2: "2.97306",
            3: "1.97442",
            4: "1.87354",
            5: "1.81334",
        },
        {
            0: "pauper",
            1: "4.2325",
            2: "3.0359",
            3: "2.871",
            4: "2.0734",
            5: "1.9621",
        },
        {
            0: "pinaroloxias",
            1: "4",
            2: "2.9802",
            3: "2.3111",
            4: "1.5475",
            5: "1.6301",
        },
        {
            0: "Platyspiza",
            1: "4.419686",
            2: "3.270543",
            3: "2.331471",
            4: "2.347471",
            5: "2.282445",
        },
        {
            0: "psittacula",
            1: "4.23502",
            2: "3.04912",
            3: "2.25964",
            4: "2.23004",
            5: "2.07394",
        },
        {
            0: "ostracaia",
            1: "4.5934",
            2: "2.3002",
            3: "1.97856",
            4: "2.34204",
            5: "2.10002",
        },
        {
            0: "notrealia",
            1: "5.0659",
            2: "3.4295",
            3: "1.9472643",
            4: "1.232341",
            5: "3.038235",
        },
        {
            0: "goofybird",
            1: "4.35675",
            2: "3.109876",
            3: "2.5647893",
            4: "2.4356532",
            5: "1.9873542",
        },
    ],
};

export const plainChunk = {
    path: "/iplant/home/ipctest/test.txt",
    user: "sriram",
    start: "0",
    "chunk-size": "8192",
    "file-size": "329",
    chunk:
        '"It was a dark and stormy night; the rain fell in torrents--except at occasional intervals, when it was checked by a violent gust of wind which swept up the streets (for it is in London that our scene lies), rattling along the housetops, and fiercely agitating the scanty flame of the lamps that struggled against the darkness."\n',
};

export const pathListChunk = {
    path: "/iplant/home/sriram/ht-limit",
    user: "sriram",
    "chunk-size": "899",
    "file-size": "899",
    page: "1",
    "number-pages": "1",
    "max-cols": "2",
    csv: [
        { 0: "# application/vnd.de.path-list+csv; version=1" },
        {
            0: "/iplant/home/sriram/data_files/Bio-Perl/02_character-polymorphic-uncertain.nex",
            1: "",
        },
        {
            0: "/iplant/home/sriram/data_files/Bio-Perl/02_character-polymorphic.nex",
            1: "",
        },
        {
            0: "/iplant/home/sriram/data_files/Bio-Perl/02_character-state-frequency.nex",
            1: "",
        },
        {
            0: "/iplant/home/sriram/data_files/Bio-Perl/02_character-uncertain.nex",
            1: "",
        },
        {
            0: "/iplant/home/sriram/data_files/Bio-Perl/02_characters-block_format_01.nex",
            1: "",
        },
        {
            0: "/iplant/home/sriram/data_files/Bio-Perl/02_characters-block_format_02.nex",
            1: "",
        },
        {
            0: "/iplant/home/sriram/data_files/Bio-Perl/02_characters-block_initial.nex",
            1: "",
        },
        {
            0: "/iplant/home/sriram/data_files/Bio-Perl/02_notes-text.nex",
            1: "",
        },
        {
            0: "/iplant/home/sriram/data_files/Bio-Perl/02_wtset-scores.nex",
            1: "",
        },
        {
            0: "/iplant/home/sriram/data_files/Bio-Perl/04_block_level_methods.nex",
            1: "",
        },
        {
            0: "/iplant/home/sriram/data_files/Bio-Perl/04_charactersblock_methods_01.nex",
            1: "",
        },
        {
            0: "/iplant/home/sriram/data_files/Bio-Perl/04_charactersblock_methods_02.nex",
            1: "",
        },
    ],
};

export const initMockAxiosFileFolderSelector = () => {
    mockAxios
        .onGet(/\/api\/filesystem\/paged-directory.*/)
        .reply(200, pagedDirectoryResp);
    mockAxios.onGet(/\/api\/filesystem\/root.*/).reply(200, dataRootsResp);
    mockAxios.onGet(/\/api\/filetypes\/type-list/).reply(200, fileTypesResp);
    mockAxios
        .onPost("/api/preferences")
        .reply((config) => [200, { preferences: JSON.parse(config.data) }]);
};
