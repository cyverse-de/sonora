import data from "./test_data";

import * as efcs from "../../../../components/vice/admin/filter/efcs";

it("deployment image filter", () => {
    const expected = [
        {
            group: 1000,
            appName: "jupyter-lab-scipy-notebook-latest",
            analysisName: "jupyter-lab-scipy-notebook-latest-analysis",
            creationTimestamp: "2020-03-26 10:28:39 -0700 MST",
            name: "0f809627-361a-4ab6-97ea-76bf7b6f19a3",
            username: "abwasisi",
            command: [],
            appID: "bc93504c-d584-11e9-8413-008cfa5ae621",
            port: 8888,
            externalID: "0f809627-361a-4ab6-97ea-76bf7b6f19a3",
            userID: "843c85dc-3629-11ea-93db-008cfa5ae621",
            image: "cyversevice/jupyterlab-scipy:latest",
            namespace: "vice-apps",
            user: 1000,
        },
    ];
    const actual = efcs.deployments.image.filter(
        data,
        "cyversevice/jupyterlab-scipy:latest"
    );
    expect(actual.deployments.length).toStrictEqual(1);
    expect(actual.deployments).toStrictEqual(expected);
});
