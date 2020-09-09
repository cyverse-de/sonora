/**
 * @author sriram
 *
 * A toolbar for file viewer.
 *
 *
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";
import { useQuery, queryCache } from "react-query";

import { parseNameFromPath } from "../utils";
import ResourceTypes from "components/models/ResourceTypes";
import DetailsDrawer from "components/data/details/Drawer";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import { getInfoTypes, INFO_TYPES_QUERY_KEY } from "serviceFacades/filesystem";

import {
    Button,
    Divider,
    Hidden,
    FormGroup,
    FormControlLabel,
    Switch,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Info, CloudDownload } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    divider: {
        flexGrow: 1,
    },
    toolbarItems: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.5),
        },
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
    },
}));

function ViewerToolbar(props) {
    const {
        path,
        resourceId,
        showLineNumbers,
        onShowLineNumbers,
        showErrorAnnouncer,
    } = props;
    const { t } = useTranslation("data");
    const [detailsResource, setDetailsResource] = useState(null);
    const [infoTypes, setInfoTypes] = useState([]);
    const [infoTypesQueryEnabled, setInfoTypesQueryEnabled] = useState(false);
    const [download, setDownload] = useState(false);
    const label = parseNameFromPath(path);
    const classes = useStyles();

    let infoTypesCache = queryCache.getQueryData(INFO_TYPES_QUERY_KEY);

    useEffect(() => {
        if (!infoTypesCache || infoTypesCache.length === 0) {
            setInfoTypesQueryEnabled(true);
        } else {
            if (infoTypes === null || infoTypes.length === 0) {
                setInfoTypes(infoTypesCache.types);
            }
        }
    }, [infoTypes, infoTypesCache]);

    useEffect(() => {
        if (download) {
            const protocol = window.location.protocol;
            const slashes = protocol.concat("//");
            const host = slashes.concat(window.location.host);
            window.open(`${host}/api/download?path=${path}`, "_blank");
            setDownload(false);
        }
    }, [path, download]);

    useQuery({
        queryKey: INFO_TYPES_QUERY_KEY,
        queryFn: getInfoTypes,
        config: {
            enabled: infoTypesQueryEnabled,
            onSuccess: (resp) => setInfoTypes(resp.types),
            staleTime: Infinity,
            cacheTime: Infinity,
            onError: (e) => {
                showErrorAnnouncer(t("infoTypeFetchError"), e);
            },
        },
    });

    return (
        <>
            <Toolbar variant="dense">
                <Typography variant="body2" color="primary">
                    {label}
                </Typography>

                {onShowLineNumbers && (
                    <>
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Switch
                                        size="small"
                                        checked={showLineNumbers}
                                        onChange={(event) =>
                                            onShowLineNumbers(
                                                event.target.checked
                                            )
                                        }
                                        name={t("showLineNumbers")}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Typography variant="body2">
                                        {t("showLineNumbers")}
                                    </Typography>
                                }
                            />
                        </FormGroup>
                        <Divider
                            orientation="vertical"
                            flexItem
                            style={{ margin: 8 }}
                        />
                    </>
                )}
                <div className={classes.divider} />
                <Button
                    className={classes.toolbarItems}
                    variant="outlined"
                    disableElevation
                    color="primary"
                    onClick={() =>
                        setDetailsResource({
                            id: resourceId,
                            path,
                            label,
                            type: ResourceTypes.FILE,
                        })
                    }
                    startIcon={<Info />}
                >
                    <Hidden xsDown>{t("details")}</Hidden>
                </Button>
                <Button
                    className={classes.toolbarItems}
                    variant="outlined"
                    disableElevation
                    color="primary"
                    onClick={() => setDownload(true)}
                    startIcon={<CloudDownload />}
                >
                    <Hidden xsDown>{t("download")}</Hidden>
                </Button>
            </Toolbar>
            {detailsResource && (
                <DetailsDrawer
                    resource={detailsResource}
                    onClose={() => setDetailsResource(null)}
                    baseId={"viewer"}
                    open={detailsResource !== null}
                    infoTypes={infoTypes}
                />
            )}
        </>
    );
}
export default withErrorAnnouncer(ViewerToolbar);
