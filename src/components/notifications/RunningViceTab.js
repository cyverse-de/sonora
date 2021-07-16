import React from "react";

import buildID from "components/utils/DebugIDUtil";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@material-ui/core";
import { Web } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";

import { openInteractiveUrl } from "components/analyses/utils";
import DELink from "components/utils/DELink";
import { useTranslation } from "i18n";
import ids from "./ids";
import { getTimeStamp } from "./utils";

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
                    <ListItem>
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
                            secondary={getTimeStamp(analysis.startdate)}
                        />
                    </ListItem>
                ))}
            </List>
        </>
    );
}

export default RunningViceTab;
