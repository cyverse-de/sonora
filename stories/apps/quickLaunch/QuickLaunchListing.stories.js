import React from "react";
import ListQuickLaunches from "components/apps/quickLaunch/QuickLaunchListing";
import { quickLaunches } from "../AppMocks";
import { mockAxios } from "../../axiosMock";

export const QuickLaunchListingTest = () => {
    const [selected, setSelected] = React.useState(null);

    const onDelete = (qLaunch) => {
        console.log("Delete qlaunch: " + qLaunch.id);
    };

    const useQuickLaunch = (qLaunch) => {
        console.log("Use quick launch: " + qLaunch.id);
    };
    const onCreate = () => {
        console.log("Create quick launch");
    };

    const onSelection = (qLaunch) => {
        console.log("Quick launch selected!");
        setSelected(qLaunch);
    };

    mockAxios.onGet(`/api/quicklaunches/apps/456`).reply(200, quickLaunches);

    return (
        <ListQuickLaunches
            quickLaunches={quickLaunches}
            userName="sriram@iplantcollaborative.org"
            appId="456"
            systemId="de"
            onDelete={onDelete}
            useQuickLaunch={useQuickLaunch}
            onCreate={onCreate}
            baseDebugId="quickLaunchListing"
            loading={false}
            selected={selected}
            onSelection={onSelection}
        />
    );
};

export default { title: "Apps / Quick Launch" };
