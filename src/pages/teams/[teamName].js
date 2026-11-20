/**
 * @author aramsey
 *
 * A page for modifying an existing team
 */

import React from "react";

import { useRouter } from "next/router";
import { commonServerSideProps } from "common/getServerSideProps";

import { i18n } from "i18n";

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

export async function getServerSideProps(context) {
    const {
        locale,
        params: { teamName },
    } = context;

    const title = i18n.t("teams:pageTitle", { name: teamName });

    return {
        props: {
            title,
            ...(await commonServerSideProps(locale, ["teams"])),
        },
    };
}
