import data from "./test_data";

import efcs from "../../../../components/vice/admin/filter/efcs";

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
    const actual = efcs.deployments.image.filterIt(
        data,
        "cyversevice/jupyterlab-scipy:latest"
    );
    expect(actual.deployments.length).toStrictEqual(1);
    expect(actual.deployments).toStrictEqual(expected);
});

const expectedDeployments = data.deployments;

it("deployment filter port returns values", () => {
    const result = efcs.deployments.port.filterIt(data, 8888);
    expect(result.deployments.length).toBe(4);
    expect(result.deployments).toStrictEqual(expectedDeployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.services).toStrictEqual(data.services);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("deployment filter port returns nothing", () => {
    const result = efcs.deployments.port.filterIt(data, 7777);
    expect(result.deployments.length).toBe(0);
    expect(result.deployments).toStrictEqual([]);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.services).toStrictEqual(data.services);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("deployment filter uid returns values", () => {
    const result = efcs.deployments.uid.filterIt(data, 1000);
    expect(result.deployments.length).toBe(4);
    expect(result.deployments).toStrictEqual(expectedDeployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.services).toStrictEqual(data.services);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("deployment filter uid returns nothing", () => {
    const result = efcs.deployments.uid.filterIt(data, 0);
    expect(result.deployments.length).toBe(0);
    expect(result.deployments).toStrictEqual([]);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.services).toStrictEqual(data.services);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("deployment filter gid returns values", () => {
    const result = efcs.deployments.gid.filterIt(data, 1000);
    expect(result.deployments.length).toBe(4);
    expect(result.deployments).toStrictEqual(expectedDeployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.services).toStrictEqual(data.services);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("deployment filter gid returns nothing", () => {
    const result = efcs.deployments.gid.filterIt(data, 0);
    expect(result.deployments.length).toBe(0);
    expect(result.deployments).toStrictEqual([]);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.services).toStrictEqual(data.services);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

// data.services should be a const, so modifying it will throw an error,
// which we want.
const expectedServices = data.services;

it("service filter portName returns values", () => {
    const result = efcs.services.portName.filterIt(data, "tcp-proxy");
    expect(result.services.length).toBe(4);
    expect(result.services).toStrictEqual(expectedServices);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("service filter portName returns nothing", () => {
    const result = efcs.services.portName.filterIt(data, "bad-value");
    expect(result.services.length).toBe(0);
    expect(result.services).toStrictEqual([]);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("service filter portName returns one value", () => {
    const result = efcs.services.portName.filterIt(data, "filter-value");
    expect(result.services.length).toBe(1);
    expect(result.services).toStrictEqual(data.services.slice(-1));
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("service filter targetPort returns values", () => {
    const result = efcs.services.targetPort.filterIt(data, 0);
    expect(result.services.length).toBe(4);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("service filter targetPort returns nothing", () => {
    const result = efcs.services.targetPort.filterIt(data, 7777);
    expect(result.services.length).toBe(0);
    expect(result.services).toStrictEqual([]);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("service filter targetPort returns one result", () => {
    const result = efcs.services.targetPort.filterIt(data, 1);
    expect(result.services.length).toBe(1);
    expect(result.services).toStrictEqual(data.services.slice(-1));
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("service filter targetPortName returns values", () => {
    const result = efcs.services.targetPortName.filterIt(data, "tcp-proxy");
    expect(result.services.length).toBe(4);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("service filter targetPortName returns nothing", () => {
    const result = efcs.services.targetPortName.filterIt(
        data,
        "does not exist"
    );
    expect(result.services.length).toBe(0);
    expect(result.services).toStrictEqual([]);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("service filter targetPortName returns one value", () => {
    const result = efcs.services.targetPortName.filterIt(
        data,
        "target-port-name"
    );
    expect(result.services.length).toBe(1);
    expect(result.services).toStrictEqual(result.services.slice(-1));
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("service filter protocol returns values", () => {
    const result = efcs.services.protocol.filterIt(data, "TCP");
    expect(result.services.length).toBe(4);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("service filter protocol returns no valaues", () => {
    const result = efcs.services.protocol.filterIt(data, "BLAH");
    expect(result.services.length).toBe(0);
    expect(result.services).toStrictEqual([]);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("service filter protocol returns one value", () => {
    const result = efcs.services.protocol.filterIt(data, "UDP");
    expect(result.services.length).toBe(1);
    expect(result.services).toStrictEqual(data.services.slice(-1));
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
    expect(result.pods).toStrictEqual(data.pods);
});

it("analysis filter analysisName returns values", () => {
    const expected = "jupyter-lab-scipy-google-earth-engine-analysis";
    const result = efcs.analyses.analysisName.filterIt(data, expected);
    expect(result.deployments.length).toBe(1);
    expect(result.services.length).toBe(1);
    expect(result.configMaps.length).toBe(2);
    expect(result.ingresses.length).toBe(1);
    expect(result.pods.length).toBe(1);
    expect(result.deployments[0].analysisName).toBe(expected);
    expect(result.services[0].analysisName).toBe(expected);
    expect(result.configMaps[0].analysisName).toBe(expected);
    expect(result.configMaps[1].analysisName).toBe(expected);
    expect(result.ingresses[0].analysisName).toBe(expected);
    expect(result.pods[0].analysisName).toBe(expected);
    expect(result.deployments[0]).toStrictEqual(data.deployments.slice(-1)[0]);
    expect(result.services[0]).toStrictEqual(data.services.slice(-1)[0]);
    expect(result.configMaps[0]).toStrictEqual(data.configMaps[3]);
    expect(result.configMaps[1]).toStrictEqual(data.configMaps[7]);
    expect(result.ingresses[0]).toStrictEqual(data.ingresses.slice(-1)[0]);
    expect(result.pods[0]).toStrictEqual(data.pods.slice(-1)[0]);
});

it("analysis filter analysisName returns no values", () => {
    const expected = "nope";
    const result = efcs.analyses.analysisName.filterIt(data, expected);
    expect(result.deployments.length).toBe(0);
    expect(result.services.length).toBe(0);
    expect(result.configMaps.length).toBe(0);
    expect(result.ingresses.length).toBe(0);
    expect(result.pods.length).toBe(0);
    expect(result.deployments).toStrictEqual([]);
    expect(result.services).toStrictEqual([]);
    expect(result.configMaps).toStrictEqual([]);
    expect(result.ingresses).toStrictEqual([]);
    expect(result.pods).toStrictEqual([]);
});

it("analysis filter appName returns values", () => {
    const expected = "jupyter-lab-scipy-google-earth-engine";
    const result = efcs.analyses.appName.filterIt(data, expected);
    expect(result.deployments.length).toBe(1);
    expect(result.services.length).toBe(1);
    expect(result.configMaps.length).toBe(2);
    expect(result.ingresses.length).toBe(1);
    expect(result.pods.length).toBe(1);
    expect(result.deployments[0].appName).toBe(expected);
    expect(result.services[0].appName).toBe(expected);
    expect(result.configMaps[0].appName).toBe(expected);
    expect(result.configMaps[1].appName).toBe(expected);
    expect(result.ingresses[0].appName).toBe(expected);
    expect(result.pods[0].appName).toBe(expected);
    expect(result.deployments[0]).toStrictEqual(data.deployments.slice(-1)[0]);
    expect(result.services[0]).toStrictEqual(data.services.slice(-1)[0]);
    expect(result.configMaps[0]).toStrictEqual(data.configMaps[3]);
    expect(result.configMaps[1]).toStrictEqual(data.configMaps[7]);
    expect(result.ingresses[0]).toStrictEqual(data.ingresses.slice(-1)[0]);
    expect(result.pods[0]).toStrictEqual(data.pods.slice(-1)[0]);
});

it("analysis filter appName returns no values", () => {
    const expected = "nope";
    const result = efcs.analyses.appName.filterIt(data, expected);
    expect(result.deployments.length).toBe(0);
    expect(result.services.length).toBe(0);
    expect(result.configMaps.length).toBe(0);
    expect(result.ingresses.length).toBe(0);
    expect(result.pods.length).toBe(0);
    expect(result.deployments).toStrictEqual([]);
    expect(result.services).toStrictEqual([]);
    expect(result.configMaps).toStrictEqual([]);
    expect(result.ingresses).toStrictEqual([]);
    expect(result.pods).toStrictEqual([]);
});

it("analysis filter appID returns values", () => {
    const expected = "1f5e7f3a-e46c-11e9-870d-008cfa5ae621";
    const result = efcs.analyses.appID.filterIt(data, expected);
    expect(result.deployments.length).toBe(1);
    expect(result.services.length).toBe(1);
    expect(result.configMaps.length).toBe(2);
    expect(result.ingresses.length).toBe(1);
    expect(result.pods.length).toBe(1);
    expect(result.deployments[0].appID).toBe(expected);
    expect(result.services[0].appID).toBe(expected);
    expect(result.configMaps[0].appID).toBe(expected);
    expect(result.configMaps[1].appID).toBe(expected);
    expect(result.ingresses[0].appID).toBe(expected);
    expect(result.pods[0].appID).toBe(expected);
    expect(result.deployments[0]).toStrictEqual(data.deployments.slice(-1)[0]);
    expect(result.services[0]).toStrictEqual(data.services.slice(-1)[0]);
    expect(result.configMaps[0]).toStrictEqual(data.configMaps[3]);
    expect(result.configMaps[1]).toStrictEqual(data.configMaps[7]);
    expect(result.ingresses[0]).toStrictEqual(data.ingresses.slice(-1)[0]);
    expect(result.pods[0]).toStrictEqual(data.pods.slice(-1)[0]);
});

it("analysis filter appID returns no values", () => {
    const expected = "nope";
    const result = efcs.analyses.appID.filterIt(data, expected);
    expect(result.deployments.length).toBe(0);
    expect(result.services.length).toBe(0);
    expect(result.configMaps.length).toBe(0);
    expect(result.ingresses.length).toBe(0);
    expect(result.pods.length).toBe(0);
    expect(result.deployments).toStrictEqual([]);
    expect(result.services).toStrictEqual([]);
    expect(result.configMaps).toStrictEqual([]);
    expect(result.ingresses).toStrictEqual([]);
    expect(result.pods).toStrictEqual([]);
});

it("analysis filter externalID returns values", () => {
    const expected = "e112629a-67ec-4018-bf28-30b244e940c3";
    const result = efcs.analyses.externalID.filterIt(data, expected);
    expect(result.deployments.length).toBe(1);
    expect(result.services.length).toBe(1);
    expect(result.configMaps.length).toBe(2);
    expect(result.ingresses.length).toBe(1);
    expect(result.pods.length).toBe(1);
    expect(result.deployments[0].externalID).toBe(expected);
    expect(result.services[0].externalID).toBe(expected);
    expect(result.configMaps[0].externalID).toBe(expected);
    expect(result.configMaps[1].externalID).toBe(expected);
    expect(result.ingresses[0].externalID).toBe(expected);
    expect(result.pods[0].externalID).toBe(expected);
    expect(result.deployments[0]).toStrictEqual(data.deployments.slice(-1)[0]);
    expect(result.services[0]).toStrictEqual(data.services.slice(-1)[0]);
    expect(result.configMaps[0]).toStrictEqual(data.configMaps[3]);
    expect(result.configMaps[1]).toStrictEqual(data.configMaps[7]);
    expect(result.ingresses[0]).toStrictEqual(data.ingresses.slice(-1)[0]);
    expect(result.pods[0]).toStrictEqual(data.pods.slice(-1)[0]);
});

it("analysis filter externalID returns no values", () => {
    const expected = "nope";
    const result = efcs.analyses.externalID.filterIt(data, expected);
    expect(result.services.length).toBe(0);
    expect(result.configMaps.length).toBe(0);
    expect(result.ingresses.length).toBe(0);
    expect(result.pods.length).toBe(0);
    expect(result.deployments).toStrictEqual([]);
    expect(result.services).toStrictEqual([]);
    expect(result.configMaps).toStrictEqual([]);
    expect(result.ingresses).toStrictEqual([]);
    expect(result.pods).toStrictEqual([]);
});

it("analyses filter namespace returns values", () => {
    const expected = "vice-apps";
    const result = efcs.analyses.namespace.filterIt(data, expected);
    expect(result.deployments.length).toBe(4);
    expect(result.services.length).toBe(4);
    expect(result.configMaps.length).toBe(8);
    expect(result.ingresses.length).toBe(4);
    expect(result.pods.length).toBe(4);

    for (const dep of result.deployments) {
        expect(dep.namespace).toBe(expected);
    }

    for (const svc of result.services) {
        expect(svc.namespace).toBe(expected);
    }

    for (const cm of result.configMaps) {
        expect(cm.namespace).toBe(expected);
    }

    for (const ing of result.ingresses) {
        expect(ing.namespace).toBe(expected);
    }

    for (const pod of result.pods) {
        expect(pod.namespace).toBe(expected);
    }
});

it("analyses filter namespace returns no values", () => {
    const expected = "nope";
    const result = efcs.analyses.namespace.filterIt(data, expected);
    expect(result.services.length).toBe(0);
    expect(result.configMaps.length).toBe(0);
    expect(result.ingresses.length).toBe(0);
    expect(result.pods.length).toBe(0);
    expect(result.deployments).toStrictEqual([]);
    expect(result.services).toStrictEqual([]);
    expect(result.configMaps).toStrictEqual([]);
    expect(result.ingresses).toStrictEqual([]);
    expect(result.pods).toStrictEqual([]);
});

it("analyses filter userID returns values", () => {
    const expected = "6bec60d2-854a-11e4-b87e-1f417f9dbc81";
    const result = efcs.analyses.userID.filterIt(data, expected);
    expect(result.deployments.length).toBe(1);
    expect(result.services.length).toBe(1);
    expect(result.configMaps.length).toBe(2);
    expect(result.ingresses.length).toBe(1);
    expect(result.pods.length).toBe(1);
    expect(result.deployments[0].userID).toBe(expected);
    expect(result.services[0].userID).toBe(expected);
    expect(result.configMaps[0].userID).toBe(expected);
    expect(result.configMaps[1].userID).toBe(expected);
    expect(result.ingresses[0].userID).toBe(expected);
    expect(result.pods[0].userID).toBe(expected);
    expect(result.deployments[0]).toStrictEqual(data.deployments.slice(-1)[0]);
    expect(result.services[0]).toStrictEqual(data.services.slice(-1)[0]);
    expect(result.configMaps[0]).toStrictEqual(data.configMaps[3]);
    expect(result.configMaps[1]).toStrictEqual(data.configMaps[7]);
    expect(result.ingresses[0]).toStrictEqual(data.ingresses.slice(-1)[0]);
    expect(result.pods[0]).toStrictEqual(data.pods.slice(-1)[0]);
});

it("analyses filter userID returns no values", () => {
    const expected = "nope";
    const result = efcs.analyses.userID.filterIt(data, expected);
    expect(result.services.length).toBe(0);
    expect(result.configMaps.length).toBe(0);
    expect(result.ingresses.length).toBe(0);
    expect(result.pods.length).toBe(0);
    expect(result.deployments).toStrictEqual([]);
    expect(result.services).toStrictEqual([]);
    expect(result.configMaps).toStrictEqual([]);
    expect(result.ingresses).toStrictEqual([]);
    expect(result.pods).toStrictEqual([]);
});

it("analyses filter username returns values", () => {
    const expected = "psarando";
    const result = efcs.analyses.username.filterIt(data, expected);
    expect(result.deployments.length).toBe(1);
    expect(result.services.length).toBe(1);
    expect(result.configMaps.length).toBe(2);
    expect(result.ingresses.length).toBe(1);
    expect(result.pods.length).toBe(1);
    expect(result.deployments[0].username).toBe(expected);
    expect(result.services[0].username).toBe(expected);
    expect(result.configMaps[0].username).toBe(expected);
    expect(result.configMaps[1].username).toBe(expected);
    expect(result.ingresses[0].username).toBe(expected);
    expect(result.pods[0].username).toBe(expected);
    expect(result.deployments[0]).toStrictEqual(data.deployments.slice(-1)[0]);
    expect(result.services[0]).toStrictEqual(data.services.slice(-1)[0]);
    expect(result.configMaps[0]).toStrictEqual(data.configMaps[3]);
    expect(result.configMaps[1]).toStrictEqual(data.configMaps[7]);
    expect(result.ingresses[0]).toStrictEqual(data.ingresses.slice(-1)[0]);
    expect(result.pods[0]).toStrictEqual(data.pods.slice(-1)[0]);
});

it("analyses filter username returns no values", () => {
    const expected = "nope";
    const result = efcs.analyses.username.filterIt(data, expected);
    expect(result.services.length).toBe(0);
    expect(result.configMaps.length).toBe(0);
    expect(result.ingresses.length).toBe(0);
    expect(result.pods.length).toBe(0);
    expect(result.deployments).toStrictEqual([]);
    expect(result.services).toStrictEqual([]);
    expect(result.configMaps).toStrictEqual([]);
    expect(result.ingresses).toStrictEqual([]);
    expect(result.pods).toStrictEqual([]);
});

it("analyses filter creationTimestamp returns values", () => {
    const expected = "2020-01-31 18:35:21 -0700 MST";
    const result = efcs.analyses.creationTimestamp.filterIt(data, expected);
    expect(result.deployments.length).toBe(1);
    expect(result.services.length).toBe(1);
    expect(result.configMaps.length).toBe(2);
    expect(result.ingresses.length).toBe(1);
    expect(result.pods.length).toBe(1);
    expect(result.deployments[0].creationTimestamp).toBe(expected);
    expect(result.services[0].creationTimestamp).toBe(expected);
    expect(result.configMaps[0].creationTimestamp).toBe(expected);
    expect(result.configMaps[1].creationTimestamp).toBe(expected);
    expect(result.ingresses[0].creationTimestamp).toBe(expected);
    expect(result.pods[0].creationTimestamp).toBe(expected);
    expect(result.deployments[0]).toStrictEqual(data.deployments.slice(-1)[0]);
    expect(result.services[0]).toStrictEqual(data.services.slice(-1)[0]);
    expect(result.configMaps[0]).toStrictEqual(data.configMaps[3]);
    expect(result.configMaps[1]).toStrictEqual(data.configMaps[7]);
    expect(result.ingresses[0]).toStrictEqual(data.ingresses.slice(-1)[0]);
    expect(result.pods[0]).toStrictEqual(data.pods.slice(-1)[0]);
});

it("analyses filter creationTimestamp returns no values", () => {
    const expected = "nope";
    const result = efcs.analyses.creationTimestamp.filterIt(data, expected);
    expect(result.services.length).toBe(0);
    expect(result.configMaps.length).toBe(0);
    expect(result.ingresses.length).toBe(0);
    expect(result.pods.length).toBe(0);
    expect(result.deployments).toStrictEqual([]);
    expect(result.services).toStrictEqual([]);
    expect(result.configMaps).toStrictEqual([]);
    expect(result.ingresses).toStrictEqual([]);
    expect(result.pods).toStrictEqual([]);
});

it("pods filter phase returns values", () => {
    const expected = "Running";
    const result = efcs.pods.phase.filterIt(data, expected);
    expect(result.pods.length).toBe(4);
    expect(result.pods).toStrictEqual(data.pods);

    for (const pod of result.pods) {
        expect(pod.phase).toBe(expected);
    }

    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter phase returns no values", () => {
    const expected = "nope";
    const result = efcs.pods.phase.filterIt(data, expected);
    expect(result.pods.length).toBe(0);
    expect(result.pods).toStrictEqual([]);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter message returns values", () => {
    const expected = "";
    const result = efcs.pods.message.filterIt(data, expected);
    expect(result.pods.length).toBe(4);
    expect(result.pods).toStrictEqual(data.pods);

    for (const pod of result.pods) {
        expect(pod.message).toBe(expected);
    }

    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter message returns no values", () => {
    const expected = "nope";
    const result = efcs.pods.message.filterIt(data, expected);
    expect(result.pods.length).toBe(0);
    expect(result.pods).toStrictEqual([]);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter reason returns values", () => {
    const expected = "";
    const result = efcs.pods.reason.filterIt(data, expected);
    expect(result.pods.length).toBe(4);
    expect(result.pods).toStrictEqual(data.pods);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter reason returns no values", () => {
    const expected = "nope";
    const result = efcs.pods.reason.filterIt(data, expected);
    expect(result.pods.length).toBe(0);
    expect(result.pods).toStrictEqual([]);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter containerStatusName returns values", () => {
    const expected = "analysis";
    const result = efcs.pods.containerStatusName.filterIt(data, expected);
    expect(result.pods.length).toBe(4);
    expect(result.pods).toStrictEqual(data.pods);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter containerStatusName returns no values", () => {
    const expected = "nope";
    const result = efcs.pods.containerStatusName.filterIt(data, expected);
    expect(result.pods.length).toBe(0);
    expect(result.pods).toStrictEqual([]);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter containerStatusReady returns values", () => {
    const expected = true;
    const result = efcs.pods.containerStatusReady.filterIt(data, expected);
    expect(result.pods.length).toBe(4);
    expect(result.pods).toStrictEqual(data.pods);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter containerStatusReady returns no values", () => {
    const expected = false;
    const result = efcs.pods.containerStatusReady.filterIt(data, expected);
    expect(result.pods.length).toBe(0);
    expect(result.pods).toStrictEqual([]);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter containerStatusRestartCount returns values", () => {
    const expected = 0;
    const result = efcs.pods.containerStatusRestartCount.filterIt(
        data,
        expected
    );
    expect(result.pods.length).toBe(4);
    expect(result.pods).toStrictEqual(data.pods);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter containerStatusRestartCount returns no values", () => {
    const expected = 45;
    const result = efcs.pods.containerStatusRestartCount.filterIt(
        data,
        expected
    );
    expect(result.pods.length).toBe(0);
    expect(result.pods).toStrictEqual([]);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter containerStatusImage returns values", () => {
    const expected = "discoenv/vice-proxy:qa";
    const result = efcs.pods.containerStatusImage.filterIt(data, expected);
    expect(result.pods.length).toBe(4);
    expect(result.pods).toStrictEqual(data.pods);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter containerStatusImage returns no values", () => {
    const expected = "nope";
    const result = efcs.pods.containerStatusImage.filterIt(data, expected);
    expect(result.pods.length).toBe(0);
    expect(result.pods).toStrictEqual([]);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter containerStatusImageID returns values", () => {
    const expected =
        "docker-pullable://discoenv/vice-proxy@sha256:e171184d3e7ac7ac9095b6ac015a1a03dcc157f888801a1cd8526fed4fb22a11";
    const result = efcs.pods.containerStatusImageID.filterIt(data, expected);
    expect(result.pods.length).toBe(4);
    expect(result.pods).toStrictEqual(data.pods);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter containerStatusImageID returns no values", () => {
    const expected = "nope";
    const result = efcs.pods.containerStatusImageID.filterIt(data, expected);
    expect(result.pods.length).toBe(0);
    expect(result.pods).toStrictEqual([]);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter containerStatusImageID resturns one value", () => {
    const expected =
        "docker-pullable://cyversevice/jupyterlab-scipy@sha256:0d33bdcb49a4bf0785b35f2c8a51ebf3896940d50522db36b3a73155bc46eaf9";
    const result = efcs.pods.containerStatusImageID.filterIt(data, expected);
    expect(result.pods.length).toBe(1);
    expect(result.pods).toStrictEqual(data.pods.slice(-1));
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter containerStatusContainerID returns values", () => {
    const expected =
        "docker://6ab00c47768ec1a9fecc4fb386d7c8a88eaff140b205bbea14307496959b5204";
    const result = efcs.pods.containerStatusContainerID.filterIt(
        data,
        expected
    );
    expect(result.pods.length).toBe(1);
    expect(result.pods).toStrictEqual(data.pods.slice(-1));
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter containerStatusContainerID returns no values", () => {
    const expected = "nope";
    const result = efcs.pods.containerStatusContainerID.filterIt(
        data,
        expected
    );
    expect(result.pods.length).toBe(0);
    expect(result.pods).toStrictEqual([]);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods filter containerStatusStarted returns values", () => {
    const expected = true;
    const result = efcs.pods.containerStatusStarted.filterIt(data, expected);
    expect(result.pods.length).toBe(4);
    expect(result.pods).toStrictEqual(data.pods);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});

it("pods fitler containerStatusStarted returns no values", () => {
    const expected = false;
    const result = efcs.pods.containerStatusStarted.filterIt(data, expected);
    expect(result.pods.length).toBe(0);
    expect(result.pods).toStrictEqual([]);
    expect(result.services).toStrictEqual(data.services);
    expect(result.deployments).toStrictEqual(data.deployments);
    expect(result.configMaps).toStrictEqual(data.configMaps);
    expect(result.ingresses).toStrictEqual(data.ingresses);
});
