/**
 * @author aramsey
 *
 * A page for the team listing view
 */

import React from "react";

import { useRouter } from "next/router";

import NavigationConstants from "common/NavigationConstants";
import TeamsView from "components/teams";
import { getTeamLinkRefs } from "components/teams/util";

export default function Teams() {
    const router = useRouter();

    const onTeamNameSelected = (teamName) => {
        const [href] = getTeamLinkRefs(teamName);
        router.push(href);
    };

    const onCreateTeamSelected = () => {
        router.push(`/${NavigationConstants.TEAMS}/create`);
    };

    return (
        <TeamsView
            baseId="teams"
            onTeamNameSelected={onTeamNameSelected}
            onCreateTeamSelected={onCreateTeamSelected}
        />
    );
}

Teams.getInitialProps = async () => ({
    namespacesRequired: ["teams"],
});
