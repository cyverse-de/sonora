import React from "react";
import { mockAxios } from "../../axiosMock";

import ViceLoading from "components/vice/loading";
import { POD_STATUS, statusMock, urlReadyMock } from "./ViceLoadingMocks";

export const ViceLoadingTest = ({
    statusEndpointError,
    deploymentComplete,
    serviceComplete,
    ingressComplete,
    configMapsComplete,
    uploadStatus,
    viceProxyPodComplete,
    inputFilesPodComplete,
    analysisPodStatus,
    urlReadyEndpointError,
}) => {
    const accessUrl = "https://a2a4db420.cyverse.run:4343";

    mockAxios.onGet("/api/vice/a2a4db420/description").reply(() => {
        return statusEndpointError
            ? [
                  500,
                  { error_code: "ERR_NO_STATUS", reason: "Mind your business" },
              ]
            : [
                  200,
                  statusMock(
                      deploymentComplete,
                      serviceComplete,
                      ingressComplete,
                      configMapsComplete,
                      uploadStatus,
                      viceProxyPodComplete,
                      inputFilesPodComplete,
                      analysisPodStatus
                  ),
              ];
    });

    mockAxios.onGet("/api/vice/a2a4db420/url-ready").reply(() => {
        return urlReadyEndpointError
            ? [
                  500,
                  {
                      error_code: "ERR_READY_FAILED",
                      reason: "Failure to launch",
                  },
              ]
            : [200, urlReadyMock];
    });

    return <ViceLoading accessUrl={accessUrl} />;
};

ViceLoadingTest.argTypes = {
    statusEndpointError: {
        defaultValue: false,
        control: {
            type: "boolean",
        },
    },
    deploymentComplete: {
        defaultValue: true,
        control: {
            type: "boolean",
        },
    },
    serviceComplete: {
        defaultValue: true,
        control: {
            type: "boolean",
        },
    },
    ingressComplete: {
        defaultValue: true,
        control: {
            type: "boolean",
        },
    },
    configMapsComplete: {
        defaultValue: true,
        control: {
            type: "boolean",
        },
    },
    uploadStatus: {
        defaultValue: POD_STATUS.WAITING_INIT,
        control: {
            type: "select",
            options: Object.values(POD_STATUS),
        },
    },
    viceProxyPodComplete: {
        control: {
            type: "boolean",
        },
    },
    inputFilesPodComplete: {
        control: {
            type: "boolean",
        },
    },
    analysisPodStatus: {
        defaultValue: POD_STATUS.WAITING_INIT,
        control: {
            type: "select",
            options: Object.values(POD_STATUS),
        },
    },
    urlReadyEndpointError: {
        defaultValue: false,
        control: {
            type: "boolean",
        },
    },
};

export default {
    title: "Vice / Loading",
};
