/**
 * @author aramsey
 *
 * A page for modifying an existing team
 */

import React from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";

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

export async function getServerSideProps({ locale }) {
    const title = i18n.t("teams");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "teams",
                ...RequiredNamespaces,
            ])),
        },
    };
}
