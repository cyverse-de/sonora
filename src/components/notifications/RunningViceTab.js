import React, { useState } from "react";

import { build } from "@cyverse-de/ui-lib";
import { List, ListItem, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import { openInteractiveUrl } from "components/analyses/utils";
import DELink from "components/utils/DELink";
import { useUserProfile } from "contexts/userProfile";
import { useTranslation } from "i18n";
import ids from "./ids";
import { useRunningViceJobs } from "serviceFacades/analyses";

function RunningViceTab(props) {
    const { baseId, handleClose } = props;
    const { t } = useTranslation("common");
    const [analyses, setAnalyses] = useState([]);
    const [userProfile] = useUserProfile();

    const { isFetching } = useRunningViceJobs({
        enabled: userProfile?.id,
        onSuccess: (resp) => {
            const analyses = resp?.analyses?.filter(
                (analysis) => analysis?.interactive_urls?.length > 0
            );
            setAnalyses(analyses);
        },
    });

    if (isFetching) {
        return (
            <div id={build(baseId, ids.LOADING_SKELETON)}>
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </div>
        );
    }

    if (analyses?.length === 0) {
        return <Typography>{t("noRunningVice")}</Typography>;
    }

    return (
        <>
            <Typography>{t("runningVice")}</Typography>
            <List component="div">
                {analyses?.map((analysis) => (
                    <ListItem>
                        <DELink
                            onClick={() => {
                                const accessUrl = analysis.interactive_urls[0];
                                openInteractiveUrl(accessUrl);
                                handleClose();
                            }}
                            id={build(baseId, analysis.id)}
                            key={analysis.id}
                            text={analysis.name}
                        />
                    </ListItem>
                ))}
            </List>
        </>
    );
}

export default RunningViceTab;
