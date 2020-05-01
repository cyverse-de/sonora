import { JSONPath } from "jsonpath-plus";

export const NAME = "name";
export const NAMESPACE = "namespace";

class ExtractFilterCompare {
    constructor(extractorFn, filterFn) {
        this.extractor = extractorFn;
        this.filter = filterFn;
    }

    extract(fromObject, ...args) {
        const extractorString = this.extractor(...args);
        return JSONPath({ json: fromObject, path: extractorString });
    }

    filter(fromObject, ...args) {
        const filterString = this.filter(...args);
        return JSONPath({ json: fromObject, path: filterString });
    }

    compare(one, two) {
        return one === two;
    }
}

class AnalysesEFC extends ExtractFilterCompare {
    filter(fromObject, ...args) {
        const filterString = this.filter(...args);
        const copy = {
            ...fromObject,
        };
        for (let [key, value] of Object.entries(fromObject)) {
            copy[key] = JSONPath({ path: filterString, json: value });
        }
        return copy;
    }
}

export const deployments = {
    image: new ExtractFilterCompare(
        () => "$.deployments[*].image",
        (image) => `$.deployments[?(@.image=='${image}')]`
    ),

    port: new ExtractFilterCompare(
        () => "$.deployments[*].port",
        (port) => `$.deployments[?(@.port==${port})]`
    ),

    uid: new ExtractFilterCompare(
        () => "$.deployments[*].user",
        (uid) => `$.deployments[?(@.user==${uid})]`
    ),

    gid: new ExtractFilterCompare(
        () => "$.deployments[*].group",
        (gid) => `$.deployments[?(@.group==${gid})]`
    ),
};

export const services = {
    portName: new ExtractFilterCompare(
        () => "$.services[*].ports[*].name",
        (portName) => `$.services[*].ports[?(@.name==='${portName}')]^^^`
    ),

    nodePort: new ExtractFilterCompare(
        () => "$.services[*].ports[*].nodePort",
        (nodePort) => `$.services[*].ports[?(@.nodePort===${nodePort})]^^^`
    ),

    targetPort: new ExtractFilterCompare(
        () => "$.services[*].ports[*].targetPort",
        (targetPort) =>
            `$.services[*].ports[?(@.targetPort===${targetPort})]^^^`
    ),

    targetPortName: new ExtractFilterCompare(
        () => "$.services[*].ports[*].targetPortName",
        (targetPortName) =>
            `$.services[*].ports[?(@.targetPortName==='${targetPortName}')]^^^`
    ),

    protocol: new ExtractFilterCompare(
        () => "$.services[*].ports[*].protocol",
        (protocol) => `$.services[*].ports[?(@.protocol==='${protocol}')]^^^`
    ),
};

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

    userID: new AnalysesEFC(
        () => "$..userID",
        (userID) => `$..[?(@.userID==='${userID}')]`
    ),

    username: new AnalysesEFC(
        () => "$..username",
        (username) => `$..[?(@.username==='${username}')]`
    ),

    creationTimestamp: new AnalysesEFC(
        () => "$..userID",
        (creationTimestamp) =>
            `$..[?(@.creationTimestamp==='${creationTimestamp}')]`
    ),
};

// Pod constants.
export const PHASE = "$.phase";
export const MESSAGE = "$.message";
export const REASON = "$.reason";
export const CONTAINER_STATUS_NAME = "$.containerStatuses[*].name";
export const CONTAINER_STATUS_READY = "$.containerStatuses[*].ready";
export const CONTAINER_STATUS_RESTART_COUNT =
    "$.containerStatuses[*].restartCount";
export const CONTAINER_STATUS_IMAGE = "$.containerStatuses[*].image";
export const CONTAINER_STATUS_IMAGE_ID = "$.containerStatuses[*].imageID";
export const CONTAINER_STATUS_CONTAINER_ID =
    "$.containerStatuses[*].containerID";
export const CONTAINER_STATUS_STARTED = "$.containerStatuses[*].started";
