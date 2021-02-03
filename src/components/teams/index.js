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
    const { baseId, onTeamNameSelected, onCreateTeamSelected } = props;
    const [teamFilter, setTeamFilter] = useState(TEAM_FILTER.ALL_TEAMS);

    return (
        <>
            <Toolbar
                parentId={baseId}
                teamFilter={teamFilter}
                setTeamFilter={setTeamFilter}
                onCreateTeamSelected={onCreateTeamSelected}
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
