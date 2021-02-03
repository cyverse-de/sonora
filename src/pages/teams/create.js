/**
 * @author aramsey
 *
 * A page for the team listing view
 */

import React from "react";

import { useRouter } from "next/router";

import NavigationConstants from "common/NavigationConstants";
import TeamForm from "components/teams/form/";

export default function CreateTeam() {
    const router = useRouter();
    const onTeamSaved = () => {
        router.push(`/${NavigationConstants.TEAMS}`);
    };

    return <TeamForm onTeamSaved={onTeamSaved} />;
}

CreateTeam.getInitialProps = async () => ({
    namespacesRequired: ["teams", "sharing", "common"],
});
