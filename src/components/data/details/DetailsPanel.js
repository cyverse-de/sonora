/**
 * @author aramsey
 *
 * A component for displaying the details on a data resource.
 * Intended to be within a TabPanel.
 */
import React, { useState } from "react";

import {
    announce,
    build,
    CopyTextArea,
    formatDate,
    formatMessage,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";
import {
    Divider,
    Grid,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    Typography,
} from "@material-ui/core";
import { injectIntl } from "react-intl";
import { queryCache, useMutation, useQuery } from "react-query";

import { getFileSize } from "../listing/FileSize";
import ids from "../ids";
import messages from "../messages";
import styles from "../styles";
import TagSearch from "../TagSearch";
import {
    getResourceDetails,
    updateInfoType,
} from "../../../serviceFacade/filesystemServiceFacade";
import GridLabelValue from "../../utils/GridLabelValue";
import GridLoading from "../../utils/GridLoading";
import isQueryLoading from "../../utils/isQueryLoading";

const useStyles = makeStyles(styles);

function DetailsTabPanel(props) {
    const classes = useStyles();
    const { baseId, resource, infoTypes, setSelfPermission, intl } = props;

    const [details, setDetails] = useState(null);
    const [error, setError] = useState(false);
    const resourcePath = resource.path;

    const fetchDetailsKey = ["dataResourceDetails", { paths: [resourcePath] }];

    const { isFetching } = useQuery({
        queryKey: fetchDetailsKey,
        queryFn: getResourceDetails,
        config: {
            onSuccess: (resp) => {
                const details = resp?.paths[resourcePath];
                setDetails(details);
                setSelfPermission(details?.permission);
            },
            onError: setError,
        },
    });

    const [changeInfoType, { status: updateInfoTypeStatus }] = useMutation(
        updateInfoType,
        {
            onSuccess: () => queryCache.refetchQueries(fetchDetailsKey),
            onError: () =>
                announce({
                    text: formatMessage(intl, "updateInfoTypeError"),
                    variant: "error",
                }),
        }
    );

    const onInfoTypeChange = (event) => {
        const type = event.target.value;
        changeInfoType({ path: resourcePath, infoType: type });
    };


    if (isQueryLoading([isFetching, updateInfoTypeStatus])) {
        return <GridLoading baseId={baseId} rows={10} />;
    }

    if (error || !details) {
        return <Typography>{getMessage("detailsError")}</Typography>;
    }

    const isFile = details.type !== "dir";
    return (
        <>
            <Grid container spacing={2}>
                {isFile && (
                    <GridLabelValue label={getMessage("type")}>
                        {details["content-type"]}
                    </GridLabelValue>
                )}
                {isFile && (
                    <GridLabelValue
                        label={
                            <InputLabel
                                classes={{ root: classes.inputLabel }}
                                id={build(baseId, ids.INFO_TYPES, ids.LABEL)}
                            >
                                {getMessage("infoType")}
                            </InputLabel>
                        }
                    >
                        {infoTypes ? (
                            <Select
                                labelId={build(
                                    baseId,
                                    ids.INFO_TYPES,
                                    ids.LABEL
                                )}
                                id={build(baseId, ids.INFO_TYPES)}
                                value={details.infoType}
                                onChange={onInfoTypeChange}
                            >
                                {infoTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : (
                            <>{details.infoType}</>
                        )}
                    </GridLabelValue>
                )}
                <GridLabelValue
                    label={
                        <InputLabel
                            classes={{ root: classes.inputLabel }}
                            id={build(baseId, ids.PATH, ids.LABEL)}
                        >
                            {getMessage("path")}
                        </InputLabel>
                    }
                >
                    <CopyTextArea
                        text={details.path}
                        multiline
                        debugIdPrefix={build(baseId, ids.PATH)}
                    />
                </GridLabelValue>
                {isFile && (
                    <GridLabelValue label={getMessage("fileSize")}>
                        {getFileSize(details["file-size"])}
                    </GridLabelValue>
                )}
                <GridLabelValue label={getMessage("modified")}>
                    {formatDate(details["date-modified"])}
                </GridLabelValue>
                <GridLabelValue label={getMessage("created")}>
                    {formatDate(details["date-created"])}
                </GridLabelValue>
                {isFile && (
                    <GridLabelValue label={getMessage("md5")}>
                        {details.md5}
                    </GridLabelValue>
                )}
            </Grid>

            <Divider className={classes.dividerMargins} />
            <TagSearch id={build(baseId, ids.TAG_SEARCH)} resource={resource} />
        </>
    );
}

export default withI18N(injectIntl(DetailsTabPanel), messages);
