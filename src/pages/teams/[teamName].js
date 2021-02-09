/**
 * @author aramsey
 *
 * A page for modifying an existing team
 */

import React from "react";

import { useRouter } from "next/router";

import NavigationConstants from "common/NavigationConstants";
import TeamForm from "components/teams/form";

export default function EditTeam() {
    const router = useRouter();
    const { teamName } = router.query;

    const goBackToTeamView = () => {
        router.push(`/${NavigationConstants.TEAMS}`);
    };

    return (
        <TeamForm
            parentId="editTeam"
            teamName={teamName}
            goBackToTeamView={goBackToTeamView}
        />
    );
}

EditTeam.getInitialProps = async () => ({
    namespacesRequired: ["teams", "sharing", "common"],
});
