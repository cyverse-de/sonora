/**
 * @author aramsey
 *
 * A page for the team listing view
 */

import React from "react";
import TeamForm from "components/teams/form/TeamForm";
import { useRouter } from "next/router";

export default function EditTeam() {
    const router = useRouter();
    const { teamName } = router.query;

    return <TeamForm team={{ name: teamName }} />;
}

EditTeam.getInitialProps = async () => ({
    namespacesRequired: ["teams", "sharing", "common"],
});
