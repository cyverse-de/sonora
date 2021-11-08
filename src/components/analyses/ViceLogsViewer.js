/**
 *
 * @author sriram
 *
 * A component to display the logs of the VICE analysis
 */

import React from "react";

import ids from "./ids";
import DEDialog from "components/utils/DEDialog";
import { useTranslation } from "i18n";
import buildID from "components/utils/DebugIDUtil";
import Editor from "components/data/viewers/Editor";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import {
    useVICEAnalysisLogs,
    VICE_LOGS_QUERY_KEY,
} from "serviceFacades/analyses";
import { useQueryClient } from "react-query";
import constants from "../../constants";
import {
    Button,
    CircularProgress,
    Divider,
    FormControlLabel,
    FormGroup,
    Switch,
    Toolbar,
    makeStyles,
} from "@material-ui/core";

import RefreshIcon from "@material-ui/icons/Refresh";

const useStyles = makeStyles((theme) => ({
    toolbarItems: {
        margin: theme.spacing(0.5),
    },
}));

function ViceLogsViewer(props) {
    const { open, getSelectedAnalyses, onClose } = props;
    const classes = useStyles();
    const { t } = useTranslation("analyses");
    // Get QueryClient from the context
    const queryClient = useQueryClient();
    const baseId = ids.VICE_LOGS_VIEWER.VIEWER;

    const [logsToDisplay, setLogsToDisplay] = React.useState("");
    const [followLogs, setFollowLogs] = React.useState(false);
    const [sinceTime, setSinceTime] = React.useState("0");
    const [editorInstance, setEditorInstance] = React.useState(null);

    const analysis = getSelectedAnalyses()[0];

    const { isFetching: isLogsFetching, error: logsFetchError } =
        useVICEAnalysisLogs({
            id: analysis?.id,
            sinceTime,
            enabled: !!analysis?.id,
            onSuccess: (data) => {
                setLogsToDisplay(logsToDisplay + data?.lines);
                setSinceTime(data?.since_time);
            },
            refetchInterval: followLogs
                ? constants.VICE_LOGS_POLLING_INTERVAL
                : false,
        });

    const handleAutoRefreshChange = (event) => {
        setFollowLogs(!followLogs);
    };

    const onRefreshClicked = () => {
        queryClient.invalidateQueries([VICE_LOGS_QUERY_KEY, analysis?.id]);
    };

    return (
        <DEDialog
            open={open}
            maxWidth="sm"
            disableBackdropClick
            disableEscapeKeyDown
            scroll="paper"
            id={baseId}
            title={analysis?.name}
            onClose={onClose}
        >
            <Divider />
            <Toolbar variant="dense">
                <FormGroup row>
                    <FormControlLabel
                        labelPlacement="start"
                        className={classes.toolbarItems}
                        control={
                            <Switch
                                checked={followLogs}
                                onChange={handleAutoRefreshChange}
                                value="autoRefresh"
                                color="primary"
                                id={buildID(
                                    baseId,
                                    ids.VICE_LOGS_VIEWER.FOLLOW_LOGS
                                )}
                            />
                        }
                        label={t("followLogs")}
                    />
                    <Button
                        className={classes.toolbarItems}
                        variant="outlined"
                        size="small"
                        onClick={onRefreshClicked}
                        id={buildID(baseId, ids.VICE_LOGS_VIEWER.REFRESH)}
                    >
                        <RefreshIcon color="primary" />
                        {t("refresh")}
                    </Button>
                </FormGroup>
                {isLogsFetching && !logsFetchError && (
                    <CircularProgress
                        size={30}
                        thickness={7}
                    />
                )}
            </Toolbar>
            <Divider />

            {!isLogsFetching && logsFetchError && (
                <ErrorTypographyWithDialog
                    errorObject={logsFetchError}
                    errorMessage={t("viceLogsFetchError")}
                />
            )}
            {!logsFetchError && (
                <Editor
                    baseId={baseId}
                    showLineNumbers={false}
                    editable={false}
                    wrapText={true}
                    editorInstance={editorInstance}
                    setEditorInstance={setEditorInstance}
                    setEditorValue={setLogsToDisplay}
                    setDirty={() => { }}
                    editorValue={logsToDisplay}
                />
            )}
        </DEDialog>
    );
}

export default ViceLogsViewer;
