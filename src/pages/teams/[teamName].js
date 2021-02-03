/**
 * @author aramsey
 *
 * A page for the team listing view
 */

import React from "react";

import { useRouter } from "next/router";

import NavigationConstants from "common/NavigationConstants";
import TeamForm from "components/teams/form";

export default function EditTeam() {
    const router = useRouter();
    const { teamName } = router.query;

    const onTeamSaved = () => {
        router.push(`/${NavigationConstants.TEAMS}`);
    };

    return <TeamForm team={{ name: teamName }} onTeamSaved={onTeamSaved} />;
}

EditTeam.getInitialProps = async () => ({
    namespacesRequired: ["teams", "sharing", "common"],
});
