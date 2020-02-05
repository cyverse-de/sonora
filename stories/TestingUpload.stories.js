import React from "react";
import { storiesOf } from "@storybook/react";
import Uploadform from "../src/pages/testing/upload";
import fetchMock from "fetch-mock";

storiesOf("Test Uploadform", module)
    .add("with a mocked API call", () => {
        fetchMock.restore().post(/\/api\/upload\/?\??.*/, {
            file: {
                infoType: "",
                path: "/iplant/home/ipcdev/lein-plugins.txt",
                "share-count": 0,
                "date-created": 1580918919000,
                md5: "1deaf230acfa890bb0dabab537aff216",
                permission: "own",
                "date-modified": 1580918919000,
                type: "file",
                "file-size": 285,
                label: "lein-plugins.txt",
                id: "c5f7e42a-4831-11ea-a8b1-fa163e806578",
                "content-type": "text/plain",
            },
        });

        return <Uploadform />;
    })
    .add("with another mocked API call", () => {
        fetchMock.restore().post(/\/api\/upload\/?\??.*/, {
            file: {
                infoType: "",
                path: "/iplant/home/ipcdev/plugins.json",
                "share-count": 0,
                "date-created": 1580918919000,
                md5: "1deaf230acfa890bb0dabab537aff216",
                permission: "own",
                "date-modified": 1580918919000,
                type: "file",
                "file-size": 285,
                label: "lein-plugins.txt",
                id: "c5f7e42a-4831-11ea-a8b1-fa163e806578",
                "content-type": "application/json",
            },
        });

        return <Uploadform />;
    });
