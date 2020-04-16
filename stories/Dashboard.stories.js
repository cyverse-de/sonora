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
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2020-02-03T22:30:53.789Z",
                },
                {
                    id: "a25da189-ffe6-4f61-9a91-704711f36bd7",
                    name: "New app",
                    description: "asdf",
                    wiki_url: null,
                    integration_date: null,
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2014-12-08T06:01:37.242Z",
                },
                {
                    id: "9ed50f34-fa8f-11e9-9bfc-008cfa5ae621",
                    name: "Copy of sequenceserver",
                    description: "sequenceserver test app",
                    wiki_url: null,
                    integration_date: null,
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2019-10-29T21:04:26.403Z",
                },
                {
                    id: "39896e30-3b5c-11e7-90ce-008cfa5ae621",
                    name: "Copy of New app",
                    description: "asdf",
                    wiki_url: null,
                    integration_date: null,
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2017-05-17T23:54:54.624Z",
                },
                {
                    id: "b390f5f0-4f13-11e9-8949-008cfa5ae621",
                    name: "test-vice-delay",
                    description:
                        "A test app for testing a tool that has a significant delay or amount of processing to perform in its entrpoint.",
                    wiki_url: null,
                    integration_date: null,
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2019-03-25T15:36:04.700Z",
                },
                {
                    id: "8bc52f58-4ff6-11e9-adb1-008cfa5ae621",
                    name: "wheee",
                    description: "testing testing testing",
                    wiki_url: null,
                    integration_date: null,
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2019-03-26T18:39:53.693Z",
                },
                {
                    id: "d3ec0a42-6142-11e9-b580-008cfa5ae621",
                    name: "test-vice-potree-entwine",
                    description: "testing",
                    wiki_url: null,
                    integration_date: null,
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2019-04-17T18:58:46.260Z",
                },
                {
                    id: "a74b9840-7b23-11e9-86f2-008cfa5ae621",
                    name: "Copy of GEA RNA-Seq QC Demo 0.1",
                    description:
                        "This is a demonstration application for the genomics education alliance RNA-Seq pipeline",
                    wiki_url: null,
                    integration_date: null,
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2019-05-20T17:21:07.223Z",
                },
                {
                    id: "57712906-d5e7-11e9-869a-008cfa5ae621",
                    name: "Copy of NanoDJ",
                    description:
                        "A Dockerized Jupyter Notebook for Interactive Oxford Nanopore MinION Sequence Manipulation and Genome Assembly",
                    wiki_url: null,
                    integration_date: null,
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2019-09-13T05:28:39.256Z",
                },
                {
                    id: "ca2fe9aa-d64b-11e9-a503-008cfa5ae621",
                    name: "ssh-ttyd-demo",
                    description: "Demo of ssh and ttyd",
                    wiki_url: null,
                    integration_date: null,
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2019-09-13T17:27:41.445Z",
                },
            ],
            public: [
                {
                    id: "0dfe3e35-0000-4995-bc31-24b94ee7eada",
                    name: "QA_App-Endpoint-Test-Mod5_QA",
                    description: "Testing new app endpoints.  Modified.",
                    wiki_url: null,
                    integration_date: "2020-03-16T07:14:46.656Z",
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2020-03-16T07:14:56.813Z",
                },
                {
                    id: "c81731dc-6755-11ea-908b-c2a97b34bb42",
                    name: "QA_TestForMultiplePanelsTerrain_QA",
                    description:
                        "This is a new description for the shared app.",
                    wiki_url: null,
                    integration_date: "2020-03-16T07:14:35.636Z",
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2020-03-16T07:14:35.636Z",
                },
                {
                    id: "9e989f50-6109-11ea-ab9d-008cfa5ae621",
                    name: "Snakemake-VICE",
                    description:
                        "VICE app with jupyter lab and snakemake-minimal. Also conda and RNAseq analysis tools",
                    wiki_url: null,
                    integration_date: "2020-03-10T21:48:05.803Z",
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2020-03-10T21:48:05.803Z",
                },
                {
                    id: "b91ffda4-4df0-11ea-bd40-008cfa5ae621",
                    name: "HTSeqQC 1.0",
                    description:
                        "HTSeqQC is an automated quality control analysis tool for a single and paired-end high-throughput sequencing data (HTS) generated from Illumina sequencing platforms.",
                    wiki_url: null,
                    integration_date: "2020-03-09T21:13:54.884Z",
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2020-03-09T21:13:54.884Z",
                },
                {
                    id: "aee316c6-15d5-11ea-933d-008cfa5ae621",
                    name: "Sequence Properties Analyser",
                    description:
                        "Compares statistical properties of two sets of protein sequences.",
                    wiki_url: null,
                    integration_date: "2020-03-04T18:40:22.199Z",
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2020-03-04T18:40:22.199Z",
                },
                {
                    id: "58f783bc-5c95-11ea-b10d-008cfa5ae621",
                    name: "ALLMAPS",
                    description: "Performs ALLMAPS merge and path",
                    wiki_url: null,
                    integration_date: "2020-03-02T15:36:48.063Z",
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2020-03-02T15:36:48.063Z",
                },
                {
                    id: "6ff82cda-5c98-11ea-aad3-008cfa5ae621",
                    name: "ALLMAPS merge",
                    description:
                        "ALLMAPS orders scaffolds by maximizing colinearity to a collection of genetic/genomic maps into the final chromosome build.  This is step one: merging maps into a bed file and generating the weights file. http://goo.gl/KI61Ow",
                    wiki_url: null,
                    integration_date: "2020-03-02T15:33:49.287Z",
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2020-03-02T15:33:49.287Z",
                },
                {
                    id: "a847402e-ff2a-11e9-815d-008cfa5ae621",
                    name: "QGIS Xpra Desktop",
                    description:
                        "desktop running Xpra with QGIS, SAGA-GIS, GRASS, GDAL, PDAL",
                    wiki_url: null,
                    integration_date: "2020-02-17T22:20:28.291Z",
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2020-02-17T22:20:28.291Z",
                },
                {
                    id: "c148e480-4fff-11ea-b1a6-008cfa5ae621",
                    name: "Plantmd",
                    description:
                        "Image-based plant disease prediction app that uses CNNs http://plantmd.onrender.com",
                    wiki_url: null,
                    integration_date: "2020-02-17T21:33:53.387Z",
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2020-02-17T21:33:53.387Z",
                },
                {
                    id: "8132982c-0b86-11ea-a290-008cfa5ae621",
                    name: "PDAL EPT pipeline",
                    description:
                        "Point Data Abstraction Library (PDAL) - https://pdal.io/ \n\nUSGS Entwine Point Tile (EPT) archive: https://usgs.entwine.io/ \n\nTool uses a pre-existing JSON file that extracts data from the USGS EPT archive \n\nPipeline needs to follow the EPT format example https://pdal.io/tutorial/iowa-entwine.html#pipeline",
                    wiki_url: null,
                    integration_date: "2020-01-29T23:15:52.339Z",
                    username: "ipctest@iplantcollaborative.org",
                    edited_date: "2020-01-29T23:15:52.339Z",
                },
            ],
        },
        analyses: {
            recent: [],
            running: [],
        },
        feeds: {
            news: [
                {
                    id: "110 at https://cyverse.org",
                    name:
                        "Researchers Go on Offense, Defense in Battle Against Hackers",
                    description:
                        "Researchers Go on Offense, Defense in Battle Against Hackers\nlittin\nMon, 12/09/2019 - 14:57",
                    link:
                        "https://cyverse.org/Researchers-Go-on-Offense-Defense-in-Battle-Against-Hackers",
                    date_added: "2019-12-09T21:57:33.000Z",
                },
                {
                    id: "88 at https://cyverse.org",
                    name: "Researchers 'Light Up' the Plant Tree of Life",
                    description:
                        "Researchers 'Light Up' the Plant Tree of Life\nlittin\nThu, 10/24/2019 - 08:42",
                    link:
                        "https://cyverse.org/Researchers-Light-Up-the-Plant-Tree-of-Life",
                    date_added: "2019-10-24T15:42:11.000Z",
                },
                {
                    id: "65 at https://cyverse.org",
                    name: "CyVerse ‘Power User’ Joins Boyce Thompson Institute",
                    description:
                        "CyVerse ‘Power User’ Joins Boyce Thompson Institute\nlittin\nThu, 10/03/2019 - 00:27",
                    link:
                        "https://cyverse.org/CyVerse-%E2%80%98Power-User%E2%80%99-Joins-Boyce-Thompson-Institute",
                    date_added: "2019-10-03T07:27:35.000Z",
                },
                {
                    id: "81 at https://cyverse.org",
                    name:
                        "ECSS Program Accelerates XSEDE User's Career in Geoinformatics",
                    description:
                        "ECSS Program Accelerates XSEDE User's Career in Geoinformatics\nmwall\nMon, 10/07/2019 - 15:36",
                    link:
                        "https://cyverse.org/ECSS-Program-Accelerates-XSEDE-User%27s-Career-in-Geoinformatics",
                    date_added: "2019-10-07T22:36:42.000Z",
                },
                {
                    id: "5 at https://cyverse.org",
                    name:
                        "Introducing DataHog: A Novel New App to Analyze Stored Files",
                    description:
                        "Introducing DataHog: A Novel New App to Analyze Stored Files\nlittin\nMon, 08/05/2019 - 22:53",
                    link:
                        "https://cyverse.org/Introducing%20DataHog%3A%20A%20Novel%20New%20App%20to%20Analyze%20Stored%20Files",
                    date_added: "2019-08-06T05:53:13.000Z",
                },
                {
                    id: "6 at https://cyverse.org",
                    name:
                        "Inaugural Open Science Course Teaches Best Practices",
                    description:
                        "Inaugural Open Science Course Teaches Best Practices\nlittin\nMon, 08/05/2019 - 23:28",
                    link:
                        "https://cyverse.org/Inaugural-Open-Science-Course-Teaches-Best-Practices",
                    date_added: "2019-08-06T06:28:31.000Z",
                },
                {
                    id: "54 at https://cyverse.org",
                    name:
                        "NSF 2026 Idea Machine: Reinventing Scientific Talent",
                    description:
                        "NSF 2026 Idea Machine: Reinventing Scientific Talent\nlittin\nMon, 09/02/2019 - 21:17",
                    link:
                        "https://cyverse.org/NSF-2026-Idea-Machine%3A-Reinventing-Scientific-Talent",
                    date_added: "2019-09-03T04:17:03.000Z",
                },
                {
                    id: "55 at https://cyverse.org",
                    name:
                        "UA Campus Comes Together to Celebrate Digital Literacy",
                    description:
                        "UA Campus Comes Together to Celebrate Digital Literacy\nlittin\nMon, 09/02/2019 - 21:41",
                    link:
                        "https://cyverse.org/UA-Campus-Comes-Together-to-Celebrate-Digital-Literacy",
                    date_added: "2019-09-03T04:41:02.000Z",
                },
                {
                    id: "56 at https://cyverse.org",
                    name:
                        "Research Bazaar Returns to the University of Arizona on May 20–22",
                    description:
                        "Research Bazaar Returns to the University of Arizona on May 20–22\nlittin\nMon, 09/02/2019 - 21:51",
                    link:
                        "https://cyverse.org/Research-Bazaar-Returns-to-the-University-of-Arizona-on-May-20%E2%80%9322",
                    date_added: "2019-09-03T04:51:48.000Z",
                },
                {
                    id: "57 at https://cyverse.org",
                    name:
                        "CyVerse Community Member and Astrophysicist Helps Lead Event Horizon Telescope Data Processing",
                    description:
                        "CyVerse Community Member and Astrophysicist Helps Lead Event Horizon Telescope Data Processing\nlittin\nMon, 09/02/2019 - 23:03",
                    link:
                        "https://cyverse.org/CyVerse-Community-Member-and-Astrophysicist-Helps-Lead-Event-Horizon-Telescope-Data-Processing",
                    date_added: "2019-09-03T06:03:54.000Z",
                },
                {
                    id: "114 at https://cyverse.org",
                    name: " Data Mining 3D Protein Structures, CyVerse Style",
                    description:
                        "Data Mining 3D Protein Structures, CyVerse Style\nlittin\nThu, 12/19/2019 - 04:18",
                    link:
                        "https://cyverse.org/data-mining-3d-protein-structures-cyverse-style",
                    date_added: "2019-12-19T11:18:43.000Z",
                },
                {
                    id: "66 at https://cyverse.org",
                    name: "Researchers Explore Creation of CyVerse Australia",
                    description:
                        "Researchers Explore Creation of CyVerse Australia\nmwall\nThu, 10/03/2019 - 12:43",
                    link:
                        "https://cyverse.org/Researchers-Explore-Creation-of-CyVerse-Australia",
                    date_added: "2019-10-03T19:43:44.000Z",
                },
                {
                    id: "72 at https://cyverse.org",
                    name:
                        "Data on Demand: Creating a Search Engine for Microbiome Sciences",
                    description:
                        "Data on Demand: Creating a Search Engine for Microbiome Sciences\nmwall\nMon, 10/07/2019 - 13:00",
                    link:
                        "https://cyverse.org/Data-on-Demand%3A-Creating-a-Search-Engine-for-Microbiome-Sciences",
                    date_added: "2019-10-07T20:00:23.000Z",
                },
                {
                    id: "74 at https://cyverse.org",
                    name:
                        "CyVerse Receives Third NSF Award for Enabling Data Science",
                    description:
                        "CyVerse Receives Third NSF Award for Enabling Data Science\nmwall\nMon, 10/07/2019 - 13:36",
                    link:
                        "https://cyverse.org/CyVerse-Receives-Third-NSF-Award-for-Enabling-Data-Science",
                    date_added: "2019-10-07T20:36:30.000Z",
                },
                {
                    id: "75 at https://cyverse.org",
                    name: "Measuring Species Traits to Monitor Biodiversity",
                    description:
                        "Measuring Species Traits to Monitor Biodiversity\nmwall\nMon, 10/07/2019 - 13:48",
                    link:
                        "https://cyverse.org/Measuring-Species-Traits-to-Monito-Biodiversity",
                    date_added: "2019-10-07T20:48:09.000Z",
                },
                {
                    id: "76 at https://cyverse.org",
                    name:
                        "Summer Interns Work with Drone Datasets, RNA Analyses",
                    description:
                        "Summer Interns Work with Drone Datasets, RNA Analyses\nmwall\nMon, 10/07/2019 - 13:56",
                    link:
                        "https://cyverse.org/Summer-Interns-Work-with-Drone-Datasets%2C-RNA-Analyses",
                    date_added: "2019-10-07T20:56:17.000Z",
                },
                {
                    id: "78 at https://cyverse.org",
                    name:
                        "CyVerse Hosts 2018 Earth Science Information Partners",
                    description:
                        "CyVerse Hosts 2018 Earth Science Information Partners\nmwall\nMon, 10/07/2019 - 15:01",
                    link:
                        "https://cyverse.org/CyVerse-Hosts-2018-Earth-Science-Information-Partners",
                    date_added: "2019-10-07T22:01:50.000Z",
                },
                {
                    id: "79 at https://cyverse.org",
                    name: "Observing Ecology with CyVerse Atmosphere",
                    description:
                        "Observing Ecology with CyVerse Atmosphere\nmwall\nMon, 10/07/2019 - 15:15",
                    link:
                        "https://cyverse.org/Observing-Ecology-with-CyVerse-Atmosphere",
                    date_added: "2019-10-07T22:15:43.000Z",
                },
                {
                    id: "80 at https://cyverse.org",
                    name:
                        "Staff Spotlight: Ramona Walls, Living in a World of Art and Science",
                    description:
                        "Staff Spotlight: Ramona Walls, Living in a World of Art and Science\nmwall\nMon, 10/07/2019 - 15:20",
                    link:
                        "https://cyverse.org/Staff-Spotlight%3A-Ramona-Walls%2C-Living-in-a-World-of-Art-and-Science",
                    date_added: "2019-10-07T22:20:17.000Z",
                },
                {
                    id: "77 at https://cyverse.org",
                    name: "Meeting Those Midnight Computing Needs",
                    description:
                        "Meeting Those Midnight Computing Needs\nmwall\nMon, 10/07/2019 - 14:36",
                    link:
                        "https://cyverse.org/Meeting-Those-Midnight-Computing-Needs",
                    date_added: "2019-10-07T21:36:44.000Z",
                },
            ],
            events: [
                {
                    id: "129 at https://cyverse.org",
                    name: "Webinar: Workflow Management Using Snakemake",
                    description:
                        "Webinar: Workflow Management Using Snakemake\n\n              \n      tinal\nMon, 03/02/2020 - 13:46\n\n            Webinar: Workflow Management Using Snakemake\n\n      \n            March 27, 2020 | Virtual\n\n10am Pacific | 11am Mountain | 12noon Central | 1pm Eastern (DST)\n\n      \n            About this Webinar:\n\nFrom where and how to get data for your analysis, to where and how to treat the outputs, workflow managers can help you achieve better scientific reproducibility and scalability. In this webinar, University of Arizona graduate student Sateesh Peri will demonstrate Snakemake, an open source workflow management tool. Sateesh will first identify use cases where workflow managers are helpful for automation so that you can understand Snakefile componenets, such as the rules, inputs, outputs and actions. Then he will lead us through how to write and run a Snakefile in CyVerse VICE (Visual and Interactive Compute Environment). Once you learn to properly use Snakemake (or similar workflow management tools), keeping track of and sharing your work becomes second nature, not only saving you time whenever you need to re-run all or part of an analysis but helping you reduce errors that naturally get introduced whenever a non-automated activity is done (i.e., as part of the human condition of doing computational science and not being a bot!).\n\nRegister Here\n\nAbout the Presenter: \nSateesh PeriSateesh Peri is a PhD candidate in Eric Lyon’s lab at the University of Arizona and also works at CyVerse as a graduate intern. His primary research focus is on identification and characterization of long non-coding RNAs (lincRNAs); in his spare time, Sateesh likes learning and teaching computational skills to biologists (which is why we love working with him at CyVerse!). He is an open-science evangelist and an active instructor for Data Carpentry and for CyVerse's Foundational Open Source Skills (FOSS) and Container Camp.",
                    link:
                        "https://cyverse.org/webinar-workflow-management-using-snakemake",
                    date_added: "2020-03-02T20:46:03.000Z",
                },
                {
                    id: "124 at https://cyverse.org",
                    name:
                        "Webinar: Get Grounded in TERRA-REF: Publicly-accessible Hi-res Sensor Data for Crop Phenomics",
                    description:
                        "Webinar: Get Grounded in TERRA-REF: Publicly-accessible Hi-res Sensor Data for Crop Phenomics\n\n              \n      tinal\nTue, 01/28/2020 - 13:47\n\n            Webinar: Get Grounded in TERRA-REF: Publicly-accessible, Hi-res Sensor Data for Crop Phenomics\n\n      \n            March 13, 2020 | Virtual\n\n10am Pacific | 11am Mountain | 12noon Central | 1pm Eastern (Daylight Savings Time)\n\n      \n            Presentation Slides\n\n      \n            Webinar Video-recording:\n\n\n\nAbout this Webinar: \n\n\n\n\n\n/*-->*/\n\n/*-->*/\n\n/*-->*/\n\n/*-->*/\n\nThis webinar will introduce the TERRA-REF project that produced a large, high resolution public domain dataset to advance high throughput plant phenomics. The TERRA REF dataset contains remote sensing, plant trait, environmental, agronomic and genomic data. The dataset was produced to enable researchers to evaluate and develop new computational pipelines for converting sensor data into biological and agronomic understanding and solutions. David LeBauer, who led development of TERRA-REF's data and computing pipeline will describe the project along with its computing infrastructure and datasets. He will showcase the diverse suite of data generated by thermal, hyperspectral, color, laser 3D, and active photosynthetic fluorescence cameras as well as hand measurements, environmental sensors, and deep genomic sequencing.\n\nAnyone interested in plant sciences, robotics, statistics, remote sensing, data science, and how to make such data FAIR (findable, accessible, interoperable, and reusable) will benefit from learning about TERRA-REF's publicly-funded and publicly-accessible crop phenotype datasets. David will describe how the TERRA REF data was produced and how users can learn more and get started using the data and contributing new algorithms to high throughput phenomics pipelines.\n\nAbout the Presenter:\n\n\n\nDavid LeBauer is the director of Data Science for the Agricultural Experiment Station at the University of Arizona. His research is focused on using science to engineer more sustainable and productive crops and agricultural systems. To support this effort, he develops open software and data to integrate data and knowledge across disciplines. Key projects include the Predictive Ecosystem Analyzer (PEcAn) framework for data synthesis and forecasting with crop and ecosystem models and the TERRA Reference phenotyping database and computing pipeline.",
                    link:
                        "https://cyverse.org/webinar-get-grounded-in-terra-ref-publicly-accessible-hi-res-sensor-data-for-crop-phenomics",
                    date_added: "2020-01-28T20:47:52.000Z",
                },
            ],
        },
    });

    return <Dashboard />;
};
