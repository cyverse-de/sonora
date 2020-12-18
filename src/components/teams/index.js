/**
 * @author aramsey
 *
 * The entire view that displays when navigating to /teams
 */

import React, { useState } from "react";
import Listing from "./Listing";
import Toolbar from "./Toolbar";

const TEAM_FILTER = {
    MY_TEAMS: "MY_TEAMS",
    ALL_TEAMS: "ALL_TEAMS",
};

function Teams(props) {
    const { baseId } = props;
    const [teamFilter, setTeamFilter] = useState(TEAM_FILTER.ALL_TEAMS);

    const onTeamNameSelected = () => {
        console.log("Team Name Selected!");
    };

    return (
        <>
            <Toolbar
                parentId={baseId}
                teamFilter={teamFilter}
                setTeamFilter={setTeamFilter}
            />
            <Listing
                parentId={baseId}
                teamFilter={teamFilter}
                onTeamNameSelected={onTeamNameSelected}
            />
        </>
    );
}

export default Teams;
export { TEAM_FILTER };
