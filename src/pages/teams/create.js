/**
 * @author aramsey
 *
 * A page for creating a new team
 */

import React from "react";

import { useRouter } from "next/router";

import NavigationConstants from "common/NavigationConstants";
import TeamForm from "components/teams/form/";

export default function CreateTeam() {
    const router = useRouter();
    const goBackToTeamView = () => {
        router.push(`/${NavigationConstants.TEAMS}`);
    };

    return (
        <TeamForm parentId="createTeam" goBackToTeamView={goBackToTeamView} />
    );
}

CreateTeam.getInitialProps = async () => ({
    namespacesRequired: ["teams", "sharing", "common"],
});
