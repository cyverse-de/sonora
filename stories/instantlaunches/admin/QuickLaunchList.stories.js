import React from "react";

import QuickLaunchList from "components/instantlaunches/admin";

import { mockAxios } from "../../axiosMock";

import testData from "./QuickLaunchListData";

export default {
    title: "Instant Launches / admin / Quick Launch List",
};

export const QuickLaunchListTest = () => {
    mockAxios.onGet(/\/api\/quicklaunches/).reply(200, testData);

    return <QuickLaunchList />;
};
