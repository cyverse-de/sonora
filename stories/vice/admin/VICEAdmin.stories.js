import React from "react";

import { VICEAdmin } from "pages/admin/vice";

import { mockAxios } from "../../axiosMock";

import {
    viceResources,
    viceRequests,
    instantLaunches,
    instantLaunchMetadata,
    instantLaunchMappings,
    publicQuicklaunches,
} from "./mocks";

export default {
    title: "VICE / admin / VICEAdmin",
};

export const VICEAdminTest = () => {
    mockAxios
        .onGet(/\/api\/admin\/vice\/resources.*/)
        .reply(200, viceResources);
    mockAxios.onGet(/\/api\/admin\/requests.*/).reply(200, viceRequests);
    mockAxios
        .onGet(/\/api\/instantlaunches\/full.*/)
        .reply(200, instantLaunches);
    mockAxios
        .onGet(/\/api\/admin\/instantlaunches\/metadata\/full.*/)
        .reply(200, instantLaunchMetadata);
    mockAxios
        .onGet(/\/api\/instantlaunches\/mappings\/defaults\/latest.*/)
        .reply(200, instantLaunchMappings);
    mockAxios
        .onGet(/\/api\/instantlaunches\/quicklaunches\/public.*/)
        .reply(200, publicQuicklaunches);
    return <VICEAdmin />;
};
