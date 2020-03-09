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
    path: "/iplant/home/ipcdev/CORE-8424.txt"
};
