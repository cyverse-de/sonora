import React from "react";

import Dashboard from "../../src/components/dashboard";

import fetchMock from "fetch-mock";
import { mockAxios } from "../axiosMock";

import { appDetails, listingById } from "./appDetails";
import testData from "./data";

export default {
    title: "Dashboard",
};

export const DashboardTest = () => {
    const favoriteUriRegexp = /\/api\/apps\/[^/]+\/[^/]+\/favorite/;
    mockAxios
        .onGet(/\/api\/apps\/[^/]+\/[^/]+\/details/)
        .reply(200, appDetails);
    mockAxios
        .onGet(/\/api\/apps\/[^/]+\/[^/]+\/listing/)
        .reply(200, listingById);
    mockAxios.onGet("/api/dashboard?limit=8").reply(200, testData);
    mockAxios.onPut(favoriteUriRegexp).reply(200);
    mockAxios.onDelete(favoriteUriRegexp).reply(200);

    // mocks for noembed.com image thumbnails
    fetchMock.restore();
    fetchMock.get(
        {
            url: "https://noembed.com/embed?url=https://youtu.be/2GNs2cbhI9Q",
            name: "2GNs2cbhI9Q",
        },
        {
            status: 200,
            body: {
                version: "1.0",
                html: '\n<iframe width=" 480" height="270" src="https://www.youtube.com/embed/2GNs2cbhI9Q?feature=oembed" frameborder="0" allowfullscreen="allowfullscreen"></iframe>\n',
                author_url:
                    "https://www.youtube.com/channel/UC-gvdjTz9rq6RovZ57LoDDA",
                type: "video",
                thumbnail_height: 360,
                provider_url: "https://www.youtube.com/",
                provider_name: "YouTube",
                width: 480,
                url: "https://youtu.be/2GNs2cbhI9Q",
                author_name: "CyVerse.org",
                title: "Webinar: Using VICE DESeq2 for RNA Differential Expression Analysis",
                thumbnail_width: 480,
                height: 270,
                thumbnail_url:
                    "https://i.ytimg.com/vi/2GNs2cbhI9Q/hqdefault.jpg",
            },
        }
    );
    fetchMock.get(
        {
            url: "https://noembed.com/embed?url=https://youtu.be/YytjDtergF4",
            name: "YytjDtergF4",
        },
        {
            status: 200,
            body: {
                version: "1.0",
                html: '\n<iframe width=" 480" height="270" src="https://www.youtube.com/embed/YytjDtergF4?feature=oembed" frameborder="0" allowfullscreen="allowfullscreen"></iframe>\n',
                author_url:
                    "https://www.youtube.com/channel/UC-gvdjTz9rq6RovZ57LoDDA",
                thumbnail_height: 360,
                provider_url: "https://www.youtube.com/",
                type: "video",
                title: "Webinar: Building Your Favorite Software and Environments in the VICE Workbench",
                url: "https://youtu.be/YytjDtergF4",
                author_name: "CyVerse.org",
                width: 480,
                provider_name: "YouTube",
                thumbnail_url:
                    "https://i.ytimg.com/vi/YytjDtergF4/hqdefault.jpg",
                height: 270,
                thumbnail_width: 480,
            },
        }
    );
    fetchMock.get(
        {
            url: "https://noembed.com/embed?url=https://youtu.be/K070WD73ocQ",
            name: "K070WD73ocQ",
        },
        {
            status: 200,
            body: {
                version: "1.0",
                html: '\n<iframe width=" 480" height="270" src="https://www.youtube.com/embed/K070WD73ocQ?feature=oembed" frameborder="0" allowfullscreen="allowfullscreen"></iframe>\n',
                author_url:
                    "https://www.youtube.com/channel/UC-gvdjTz9rq6RovZ57LoDDA",
                thumbnail_height: 360,
                provider_url: "https://www.youtube.com/",
                type: "video",
                author_name: "CyVerse.org",
                title: "Webinar: Don't Let Your Data Drag You Down",
                url: "https://youtu.be/K070WD73ocQ",
                width: 480,
                provider_name: "YouTube",
                height: 270,
                thumbnail_url:
                    "https://i.ytimg.com/vi/K070WD73ocQ/hqdefault.jpg",
                thumbnail_width: 480,
            },
        }
    );
    fetchMock.get(
        {
            url: "https://noembed.com/embed?url=https://youtu.be/6_Oj66jHzgc",
            name: "6_Oj66jHzgc",
        },
        {
            status: 200,
            body: {
                thumbnail_url:
                    "https://i.ytimg.com/vi/6_Oj66jHzgc/hqdefault.jpg",
                height: 270,
                thumbnail_width: 480,
                author_name: "CyVerse.org",
                title: "Webinar: Fall in Love with High Performance Computing at CyVerse",
                url: "https://youtu.be/6_Oj66jHzgc",
                width: 480,
                provider_name: "YouTube",
                thumbnail_height: 360,
                provider_url: "https://www.youtube.com/",
                type: "video",
                author_url:
                    "https://www.youtube.com/channel/UC-gvdjTz9rq6RovZ57LoDDA",
                html: '\n<iframe width=" 480" height="270" src="https://www.youtube.com/embed/6_Oj66jHzgc?feature=oembed" frameborder="0" allowfullscreen="allowfullscreen"></iframe>\n',
                version: "1.0",
            },
        }
    );
    fetchMock.get(
        {
            url: "https://noembed.com/embed?url=https://youtu.be/BCxZvwv4bBE",
            name: "BCxZvwv4bBE",
        },
        {
            status: 200,
            body: {
                html: '\n<iframe width=" 480" height="270" src="https://www.youtube.com/embed/BCxZvwv4bBE?feature=oembed" frameborder="0" allowfullscreen="allowfullscreen"></iframe>\n',
                version: "1.0",
                thumbnail_height: 360,
                provider_url: "https://www.youtube.com/",
                type: "video",
                author_url:
                    "https://www.youtube.com/channel/UC-gvdjTz9rq6RovZ57LoDDA",
                thumbnail_url:
                    "https://i.ytimg.com/vi/BCxZvwv4bBE/hqdefault.jpg",
                height: 270,
                thumbnail_width: 480,
                url: "https://youtu.be/BCxZvwv4bBE",
                author_name: "CyVerse.org",
                title: "Webinar: Metabarcoding and Microbiomes in the ClassroomQIIME2 with DNA Subway",
                provider_name: "YouTube",
                width: 480,
            },
        }
    );
    fetchMock.get(
        {
            url: "https://noembed.com/embed?url=https://youtu.be/piDrI0GK_yA",
            name: "piDrI0GK_yA",
        },
        {
            status: 200,
            body: {
                version: "1.0",
                html: '\n<iframe width=" 480" height="270" src="https://www.youtube.com/embed/piDrI0GK_yA?feature=oembed" frameborder="0" allowfullscreen="allowfullscreen"></iframe>\n',
                author_url:
                    "https://www.youtube.com/channel/UC-gvdjTz9rq6RovZ57LoDDA",
                type: "video",
                provider_url: "https://www.youtube.com/",
                thumbnail_height: 360,
                provider_name: "YouTube",
                width: 480,
                author_name: "CyVerse.org",
                url: "https://youtu.be/piDrI0GK_yA",
                title: "Webinar: VIBRANT: Automated Recovery and Annotation of Microbial Viruses from Genomic Sequences",
                thumbnail_width: 480,
                thumbnail_url:
                    "https://i.ytimg.com/vi/piDrI0GK_yA/hqdefault.jpg",
                height: 270,
            },
        }
    );
    fetchMock.get(
        {
            url: "https://noembed.com/embed?url=https://youtu.be/epq-XaEYNmE",
            name: "epq-XaEYNmE",
        },
        {
            status: 200,
            body: {
                html: '\n<iframe width=" 480" height="270" src="https://www.youtube.com/embed/epq-XaEYNmE?feature=oembed" frameborder="0" allowfullscreen="allowfullscreen"></iframe>\n',
                version: "1.0",
                thumbnail_url:
                    "https://i.ytimg.com/vi/epq-XaEYNmE/hqdefault.jpg",
                height: 270,
                thumbnail_width: 480,
                title: "Webinar: Get Grounded in TERRA-REF: Publicly-accessible, Hi-res Sensor Data for Crop Phenomics",
                author_name: "CyVerse.org",
                url: "https://youtu.be/epq-XaEYNmE",
                provider_name: "YouTube",
                width: 480,
                thumbnail_height: 360,
                provider_url: "https://www.youtube.com/",
                type: "video",
                author_url:
                    "https://www.youtube.com/channel/UC-gvdjTz9rq6RovZ57LoDDA",
            },
        }
    );
    /* commented out because the thumbnail URL is in the data JSON, so this shouldn't use noembed.com
    fetchMock.get(
        {
            url: "https://noembed.com/embed?url=https://youtu.be/8Zlx6FvtHUk",
            name: "8Zlx6FvtHUk",
        },
        {
            status: 200,
            body: {
                thumbnail_width: 480,
                height: 270,
                thumbnail_url:
                    "https://i.ytimg.com/vi/8Zlx6FvtHUk/hqdefault.jpg",
                width: 480,
                provider_name: "YouTube",
                author_name: "CyVerse.org",
                url: "https://youtu.be/8Zlx6FvtHUk",
                title: "Webinar: Workflow Management Using Snakemake",
                type: "video",
                thumbnail_height: 360,
                provider_url: "https://www.youtube.com/",
                author_url:
                    "https://www.youtube.com/channel/UC-gvdjTz9rq6RovZ57LoDDA",
                html:
                    '\n<iframe width=" 480" height="270" src="https://www.youtube.com/embed/8Zlx6FvtHUk?feature=oembed" frameborder="0" allowfullscreen="allowfullscreen"></iframe>\n',
                version: "1.0",
            },
        }
    ); */

    return <Dashboard />;
};
