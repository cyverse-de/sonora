import React, { useState } from "react";

import ids from "./ids";
import Toolbar from "./Toolbar";

const TEAM_FILTER = {
    MY_TEAMS: "MY_TEAMS",
    ALL_TEAMS: "ALL",
};

function Teams(props) {
    const [teamFilter, setTeamFilter] = useState(TEAM_FILTER.MY_TEAMS);
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <Toolbar
            parentId={ids.TEAMS.BASE}
            teamFilter={teamFilter}
            setTeamFilter={setTeamFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
        />
    );
}

export default Teams;
export { TEAM_FILTER };
