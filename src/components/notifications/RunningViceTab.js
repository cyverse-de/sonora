import React from "react";

import buildID from "components/utils/DebugIDUtil";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import { Web } from "@mui/icons-material";
import { Skeleton } from "@mui/material";

import { openInteractiveUrl } from "components/analyses/utils";
import DELink from "components/utils/DELink";
import { useTranslation } from "i18n";
import ids from "./ids";
import { getFormattedDistance } from "components/utils/DateFormatter";

function RunningViceTab(props) {
    const { baseId, handleClose, runningViceJobs, isFetching } = props;
    const { t } = useTranslation("common");

    if (isFetching) {
        return (
            <div id={buildID(baseId, ids.LOADING_SKELETON)}>
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </div>
        );
    }

    if (runningViceJobs?.length === 0) {
        return <Typography>{t("noRunningVice")}</Typography>;
    }

    return (
        <>
            <Typography>{t("runningVice")}</Typography>
            <List component="div" style={{ overflow: "auto" }}>
                {runningViceJobs?.map((analysis) => (
                    <ListItem key={analysis.id}>
                        <ListItemIcon>
                            <Web />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <DELink
                                    onClick={() => {
                                        const accessUrl =
                                            analysis.interactive_urls[0];
                                        openInteractiveUrl(accessUrl);
                                        handleClose();
                                    }}
                                    id={buildID(baseId, analysis.id)}
                                    key={analysis.id}
                                    text={analysis.name}
                                />
                            }
                            secondary={getFormattedDistance(
                                analysis.startdate?.slice(0, -3)
                            )}
                        />
                    </ListItem>
                ))}
            </List>
        </>
    );
}

export default RunningViceTab;
