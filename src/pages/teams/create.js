/**
 * @author aramsey
 *
 * A page for the team listing view
 */

import React from "react";
import TeamForm from "components/teams/form/TeamForm";

export default function CreateTeam() {
    return <TeamForm />;
}

CreateTeam.getInitialProps = async () => ({
    namespacesRequired: ["teams", "sharing", "common"],
});
