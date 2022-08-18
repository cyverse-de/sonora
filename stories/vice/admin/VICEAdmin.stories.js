import React from "react";

import { VICEAdmin } from "pages/admin/vice";

import { mockAxios } from "../../axiosMock";

import { viceResources, viceRequests } from "./mocks";

export default {
    title: "VICE / admin / VICEAdmin",
};

export const VICEAdminTest = () => {
    mockAxios
        .onGet(/\/api\/admin\/vice\/resources.*/)
        .reply(200, viceResources);
    mockAxios.onGet(/\/api\/admin\/requests.*/).reply(200, viceRequests);
    return <VICEAdmin />;
};
