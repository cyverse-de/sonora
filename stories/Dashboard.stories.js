import React from "react";

import Dashboard from "../src/components/dashboard";

import fetchMock from "fetch-mock";

export default {
    title: "Dashboard",
};

export const DashboardTest = () => {
    fetchMock.restore().get("/api/dashboard", {
        apps: {
            recentlyAdded: [
                {
                    id: "d6bda456-46d4-11ea-a4de-008cfa5ae621",
                    name: "Copy of Rstudio-DESeq2",
                    description: "Rstudio DESeq2 VICE image",
                    wiki_url: null,
                    integration_date: null,
                    edited_date: "2020-02-03T22:30:53.789Z",
                },
                {
                    id: "a25da189-ffe6-4f61-9a91-704711f36bd7",
                    name: "New app",
                    description: "asdf",
                    wiki_url: null,
                    integration_date: null,
                    edited_date: "2014-12-08T06:01:37.242Z",
                },
                {
                    id: "9ed50f34-fa8f-11e9-9bfc-008cfa5ae621",
                    name: "Copy of sequenceserver",
                    description: "sequenceserver test app",
                    wiki_url: null,
                    integration_date: null,
                    edited_date: "2019-10-29T21:04:26.403Z",
                },
                {
                    id: "39896e30-3b5c-11e7-90ce-008cfa5ae621",
                    name: "Copy of New app",
                    description: "asdf",
                    wiki_url: null,
                    integration_date: null,
                    edited_date: "2017-05-17T23:54:54.624Z",
                },
                {
                    id: "b390f5f0-4f13-11e9-8949-008cfa5ae621",
                    name: "test-vice-delay",
                    description:
                        "A test app for testing a tool that has a significant delay or amount of processing to perform in its entrpoint.",
                    wiki_url: null,
                    integration_date: null,
                    edited_date: "2019-03-25T15:36:04.700Z",
                },
                {
                    id: "8bc52f58-4ff6-11e9-adb1-008cfa5ae621",
                    name: "wheee",
                    description: "testing testing testing",
                    wiki_url: null,
                    integration_date: null,
                    edited_date: "2019-03-26T18:39:53.693Z",
                },
                {
                    id: "d3ec0a42-6142-11e9-b580-008cfa5ae621",
                    name: "test-vice-potree-entwine",
                    description: "testing",
                    wiki_url: null,
                    integration_date: null,
                    edited_date: "2019-04-17T18:58:46.260Z",
                },
                {
                    id: "a74b9840-7b23-11e9-86f2-008cfa5ae621",
                    name: "Copy of GEA RNA-Seq QC Demo 0.1",
                    description:
                        "This is a demonstration application for the genomics education alliance RNA-Seq pipeline",
                    wiki_url: null,
                    integration_date: null,
                    edited_date: "2019-05-20T17:21:07.223Z",
                },
                {
                    id: "57712906-d5e7-11e9-869a-008cfa5ae621",
                    name: "Copy of NanoDJ",
                    description:
                        "A Dockerized Jupyter Notebook for Interactive Oxford Nanopore MinION Sequence Manipulation and Genome Assembly",
                    wiki_url: null,
                    integration_date: null,
                    edited_date: "2019-09-13T05:28:39.256Z",
                },
                {
                    id: "ca2fe9aa-d64b-11e9-a503-008cfa5ae621",
                    name: "ssh-ttyd-demo",
                    description: "Demo of ssh and ttyd",
                    wiki_url: null,
                    integration_date: null,
                    edited_date: "2019-09-13T17:27:41.445Z",
                },
            ],
            public: [
                {
                    id: "0dfe3e35-0000-4995-bc31-24b94ee7eada",
                    name: "QA_App-Endpoint-Test-Mod5_QA",
                    description: "Testing new app endpoints.  Modified.",
                    wiki_url: null,
                    integration_date: "2020-03-10T07:19:50.567Z",
                    edited_date: "2020-03-10T07:19:59.254Z",
                },
                {
                    id: "80a67a0c-629f-11ea-9641-c2a97b34bb42",
                    name: "QA_TestForMultiplePanelsTerrain_QA",
                    description:
                        "This is a new description for the shared app.",
                    wiki_url: null,
                    integration_date: "2020-03-10T07:19:41.628Z",
                    edited_date: "2020-03-10T07:19:41.628Z",
                },
                {
                    id: "aee316c6-15d5-11ea-933d-008cfa5ae621",
                    name: "Sequence Properties Analyser",
                    description:
                        "Compares statistical properties of two sets of protein sequences.",
                    wiki_url: null,
                    integration_date: "2020-03-04T18:40:22.199Z",
                    edited_date: "2020-03-04T18:40:22.199Z",
                },
                {
                    id: "58f783bc-5c95-11ea-b10d-008cfa5ae621",
                    name: "ALLMAPS",
                    description: "Performs ALLMAPS merge and path",
                    wiki_url: null,
                    integration_date: "2020-03-02T15:36:48.063Z",
                    edited_date: "2020-03-02T15:36:48.063Z",
                },
                {
                    id: "6ff82cda-5c98-11ea-aad3-008cfa5ae621",
                    name: "ALLMAPS merge",
                    description:
                        "ALLMAPS orders scaffolds by maximizing colinearity to a collection of genetic/genomic maps into the final chromosome build.  This is step one: merging maps into a bed file and generating the weights file. http://goo.gl/KI61Ow",
                    wiki_url: null,
                    integration_date: "2020-03-02T15:33:49.287Z",
                    edited_date: "2020-03-02T15:33:49.287Z",
                },
                {
                    id: "a847402e-ff2a-11e9-815d-008cfa5ae621",
                    name: "QGIS Xpra Desktop",
                    description:
                        "desktop running Xpra with QGIS, SAGA-GIS, GRASS, GDAL, PDAL",
                    wiki_url: null,
                    integration_date: "2020-02-17T22:20:28.291Z",
                    edited_date: "2020-02-17T22:20:28.291Z",
                },
                {
                    id: "c148e480-4fff-11ea-b1a6-008cfa5ae621",
                    name: "Plantmd",
                    description:
                        "Image-based plant disease prediction app that uses CNNs http://plantmd.onrender.com",
                    wiki_url: null,
                    integration_date: "2020-02-17T21:33:53.387Z",
                    edited_date: "2020-02-17T21:33:53.387Z",
                },
                {
                    id: "8132982c-0b86-11ea-a290-008cfa5ae621",
                    name: "PDAL EPT pipeline",
                    description:
                        "Point Data Abstraction Library (PDAL) - https://pdal.io/ \n\nUSGS Entwine Point Tile (EPT) archive: https://usgs.entwine.io/ \n\nTool uses a pre-existing JSON file that extracts data from the USGS EPT archive \n\nPipeline needs to follow the EPT format example https://pdal.io/tutorial/iowa-entwine.html#pipeline",
                    wiki_url: null,
                    integration_date: "2020-01-29T23:15:52.339Z",
                    edited_date: "2020-01-29T23:15:52.339Z",
                },
                {
                    id: "0adf9b82-3c66-11ea-9a20-008cfa5ae621",
                    name: "ALLMAPS path",
                    description:
                        "ALLMAPS orders scaffolds by maximizing colinearity to a collection of genetic/genomic maps into the final chromosome build.  This is step two: using the merged maps and weight files to generate the map. http://goo.gl/KI61Ow",
                    wiki_url: null,
                    integration_date: "2020-01-21T16:53:05.338Z",
                    edited_date: "2020-01-21T16:53:05.338Z",
                },
                {
                    id: "1da2bd9e-37c0-11ea-8932-008cfa5ae621",
                    name: "CEGMA 2.5",
                    description:
                        "CEGMA (Core Eukaryotic Genes Mapping Approach) is a pipeline for building a set of high reliable set of gene annotations in virtually any eukaryotic genome.",
                    wiki_url: null,
                    integration_date: "2020-01-17T17:13:46.955Z",
                    edited_date: "2020-01-17T17:13:46.955Z",
                },
            ],
        },
        analyses: {
            recent: [],
            running: [],
        },
    });

    return <Dashboard />;
};
