/**
 * @author aramsey
 *
 * A page for modifying an existing team
 */

import React from "react";

import { useRouter } from "next/router";

import { serverSideTranslations, RequiredNamespaces } from "i18n";

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

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "teams",
                "sharing",
                ...RequiredNamespaces,
            ])),
        },
    };
}
