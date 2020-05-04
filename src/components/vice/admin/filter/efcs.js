import { JSONPath } from "jsonpath-plus";

class ExtractFilterCompare {
    constructor(extractorFn, filterFn) {
        this.extractor = extractorFn;
        this.filterFn = filterFn;
    }

    extract(fromObject, ...args) {
        const extractorString = this.extractor(...args);
        return JSONPath({ json: fromObject, path: extractorString });
    }

    filter(fromObject, ...args) {
        const filterString = this.filterFn(...args);

        return JSONPath({ json: fromObject, path: filterString });
    }

    compare(one, two) {
        return one === two;
    }
}

class DeploymentsEFC extends ExtractFilterCompare {
    filter(fromObject, ...args) {
        const filterString = this.filterFn(...args);
        const copy = {
            ...fromObject,
        };
        copy.deployments = JSONPath({
            json: copy,
            path: filterString,
        });
        return copy;
    }
}

export const deployments = {
    image: new DeploymentsEFC(
        () => "$.deployments[*].image",
        (image) => `$.deployments[?(@.image=='${image}')]`
    ),

    port: new DeploymentsEFC(
        () => "$.deployments[*].port",
        (port) => `$.deployments[?(@.port==${port})]`
    ),

    uid: new DeploymentsEFC(
        () => "$.deployments[*].user",
        (uid) => `$.deployments[?(@.user==${uid})]`
    ),

    gid: new DeploymentsEFC(
        () => "$.deployments[*].group",
        (gid) => `$.deployments[?(@.group==${gid})]`
    ),
};

class ServicesEFC extends ExtractFilterCompare {
    // The extra reduce is needed because some of the filtered results
    // are in nested lists of objects meaning there's a result per
    // matched sub-object, creating dupes at the top-level.
    filter(fromObject, ...args) {
        const filterString = this.filterFn(...args);
        const copy = {
            ...fromObject,
        };
        copy.services = JSONPath({
            json: copy,
            path: filterString,
        }).reduce(
            (prev, curr) =>
                prev.findIndex((obj) => obj.externalID === curr.externalID) < 0
                    ? [...prev, curr] // adds curr to the accumulator.
                    : prev, // curr was already there, so don't add it again,
            [] // accumulator
        );
        return copy;
    }
}
export const services = {
    portName: new ServicesEFC(
        () => "$.services[*].ports[*].name",
        (portName) => `$.services[*].ports[?(@.name==='${portName}')]^^^`
    ),

    nodePort: new ServicesEFC(
        () => "$.services[*].ports[*].nodePort",
        (nodePort) => `$.services[*].ports[?(@.nodePort===${nodePort})]^^^`
    ),

    targetPort: new ServicesEFC(
        () => "$.services[*].ports[*].targetPort",
        (targetPort) =>
            `$.services[*].ports[?(@.targetPort===${targetPort})]^^^`
    ),

    targetPortName: new ServicesEFC(
        () => "$.services[*].ports[*].targetPortName",
        (targetPortName) =>
            `$.services[*].ports[?(@.targetPortName==='${targetPortName}')]^^^`
    ),

    protocol: new ServicesEFC(
        () => "$.services[*].ports[*].protocol",
        (protocol) => `$.services[*].ports[?(@.protocol==='${protocol}')]^^^`
    ),
};

class AnalysesEFC extends ExtractFilterCompare {
    filter(fromObject, ...args) {
        const filterString = this.filterFn(...args);
        const copy = {
            ...fromObject,
        };
        for (let [key, value] of Object.entries(fromObject)) {
            copy[key] = JSONPath({ path: filterString, json: value });
        }
        return copy;
    }
}

// Apply these filters to each sub-list (deployments, services, configMaps, etc.)
// separately.
export const analyses = {
    analysisName: new AnalysesEFC(
        () => "$..analysisName",
        (analysisName) => `$..[?(@.analysisName==='${analysisName}')]`
    ),

    appName: new AnalysesEFC(
        () => "$..appName",
        (appName) => `$..[?(@.appName==='${appName}')]`
    ),

    appID: new AnalysesEFC(
        () => "$..appID",
        (appID) => `$..[?(@.appID==='${appID}')]`
    ),

    externalID: new AnalysesEFC(
        () => "$..externalID",
        (externalID) => `$..[?(@.externalID==='${externalID}')]`
    ),

    namespace: new AnalysesEFC(
        () => "$..namespace",
        (namespace) => `$..[?(@.namespace==='${namespace}')]`
    ),

    userID: new AnalysesEFC(
        () => "$..userID",
        (userID) => `$..[?(@.userID==='${userID}')]`
    ),

    username: new AnalysesEFC(
        () => "$..username",
        (username) => `$..[?(@.username==='${username}')]`
    ),

    creationTimestamp: new AnalysesEFC(
        () => "$..creationTimestamp",
        (creationTimestamp) =>
            `$..[?(@.creationTimestamp==='${creationTimestamp}')]`
    ),
};

class PodsEFC extends ExtractFilterCompare {
    filter(fromObject, ...args) {
        const filterString = this.filterFn(...args);
        const copy = {
            ...fromObject,
        };
        copy.pods = JSONPath({ json: copy.pods, path: filterString });
        return copy;
    }
}

export const pods = {
    phase: new PodsEFC(
        () => "$.pods[*].phase",
        (phase) => `$..[?(@.phase==='${phase}')]`
    ),

    message: new PodsEFC(
        () => "$.pods[*].message",
        (message) => `$..[?(@.message==='${message}')]`
    ),

    reason: new PodsEFC(
        () => "$.pods[*].reason",
        (reason) => `$..[?(@.reason==='${reason}')]`
    ),

    containerStatusName: new PodsEFC(
        () => "$.pods[*].containerStatuses[*].name",
        (containerStatusName) =>
            `$..containerStatuses[?(@.name==='${containerStatusName}')]^^^`
    ),

    containerStatusReady: new PodsEFC(
        () => "$.pods[*].containerStatuses[*].ready",
        (containerStatusReady) =>
            `$..containerStatuses[?(@.ready===${containerStatusReady})]^^^`
    ),

    containerStatusRestartCount: new PodsEFC(
        () => "$.pods[*].containerStatuses[*].restartCount",
        (containerStatusRestartCount) =>
            `$..containerStatuses[?(@.restartCount===${containerStatusRestartCount})]`
    ),

    containerStatusImage: new PodsEFC(
        () => "$.pods[*].containerStatuses[*].image",
        (containerStatusImage) =>
            `$..containerStatuses[?(@.image==='${containerStatusImage}')]`
    ),

    containerStatusImageID: new PodsEFC(
        () => "$.pods[*].containerStatuses[*].imageID",
        (containerStatusImageID) =>
            `$..containerStatuses[?(@.imageID==='${containerStatusImageID}')]`
    ),

    containerStatusContainerID: new PodsEFC(
        () => "$.pods[*].containerStatuses[*].containerID",
        (containerStatusContainerID) =>
            `$..containerStatuses[?(@.containerID==='${containerStatusContainerID}')]`
    ),

    containerStatusStarted: new PodsEFC(
        () => "#.pods[*].containerStatuses[*].started",
        (containerStatusStarted) =>
            `$..containerStatuses[?(@.started===${containerStatusStarted})]`
    ),
};
