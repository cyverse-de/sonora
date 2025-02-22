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
    foundHostForPods,
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
                      foundHostForPods,
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

    mockAxios
        .onPost("/api/support-email")
        .replyOnce(500, {
            error_code: "ERR_NO_SUPPORT",
            reason: "Devs too tired",
        })
        .onPost("/api/support-email")
        .reply(200);

    return <ViceLoading accessUrl={accessUrl} />;
};

ViceLoadingTest.parameters = { chromatic: { disableSnapshot: true } };

ViceLoadingTest.argTypes = {
    statusEndpointError: {
        control: {
            type: "boolean",
        },
    },
    deploymentComplete: {
        control: {
            type: "boolean",
        },
    },
    serviceComplete: {
        control: {
            type: "boolean",
        },
    },
    ingressComplete: {
        control: {
            type: "boolean",
        },
    },
    configMapsComplete: {
        control: {
            type: "boolean",
        },
    },
    foundHostForPods: {
        control: {
            type: "boolean",
        },
    },
    uploadStatus: {
        control: {
            type: "select",
        },
        options: Object.values(POD_STATUS),
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
        control: {
            type: "select",
        },
        options: Object.values(POD_STATUS),
    },
    urlReadyEndpointError: {
        control: {
            type: "boolean",
        },
    },
};

ViceLoadingTest.args = {
    statusEndpointError: false,
    deploymentComplete: false,
    serviceComplete: true,
    ingressComplete: true,
    configMapsComplete: true,
    foundHostForPods: false,
    uploadStatus: POD_STATUS.WAITING_INIT,
    viceProxyPodComplete: false,
    inputFilesPodComplete: false,
    analysisPodStatus: POD_STATUS.WAITING_INIT,
    urlReadyEndpointError: true,
};

export default {
    title: "Vice / Loading",
};
