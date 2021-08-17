import React from "react";
import ListSavedLaunches from "components/apps/savedLaunch/SavedLaunchListing";
import { savedLaunches } from "../AppMocks";
import { mockAxios } from "../../axiosMock";

export const SavedLaunchListingTest = () => {
    const [selected, setSelected] = React.useState(null);

    const onDelete = (qLaunch) => {
        console.log("Delete saved launch: " + qLaunch.id);
    };

    const onCreate = () => {
        console.log("Create saved launch");
    };

    const onSelection = (savedLaunch) => {
        console.log("Saved launch selected!");
        setSelected(savedLaunch);
    };

    mockAxios.onGet(`/api/quicklaunches/apps/456`).reply(200, savedLaunches);

    return (
        <ListSavedLaunches
            userName="sriram@iplantcollaborative.org"
            appId="456"
            systemId="de"
            onDelete={onDelete}
            onCreate={onCreate}
            baseDebugId="savedLaunchListing"
            loading={false}
            selected={selected}
            onSelection={onSelection}
        />
    );
};

export default { title: "Apps / Saved Launch / Listing" };
