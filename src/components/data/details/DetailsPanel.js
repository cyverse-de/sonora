/**
 * @author aramsey
 *
 * A component for displaying the details on a data resource.
 * Intended to be within a TabPanel.
 */
import React, { Fragment, useEffect, useState } from "react";

import {
    build,
    CopyTextArea,
    formatDate,
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
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import { getFileSize } from "../listing/FileSize";
import ids from "../ids";
import messages from "../messages";
import styles from "../styles";
import TagSearch from "../TagSearch";
import { getResourceDetails, updateInfoType } from "../../endpoints/Filesystem";

const useStyles = makeStyles(styles);

// A grid where the secondary column, values, intentionally take up more
// space than the first column, labels
function FormRow(props) {
    const classes = useStyles();
    const { label, children } = props;

    return (
        <>
            <Grid item sm={3} xs={6}>
                {label}
            </Grid>
            <Grid item sm={9} xs={6} className={classes.restrictWidth}>
                {children}
            </Grid>
        </>
    );
}

function DetailsTabPanel(props) {
    const classes = useStyles();
    const { baseId, resource, infoTypes, setSelfPermission } = props;

    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const resourcePath = resource.path;
        setLoading(true);
        getResourceDetails([resourcePath]).then((resp) => {
            const details = resp?.paths[resourcePath];
            setDetails(details);
            setSelfPermission(details?.permission);
            setLoading(false);
        });
    }, [resource, setSelfPermission]); // lint error without setSelfPermission

    const onInfoTypeChange = (event) => {
        const type = event.target.value;
        setLoading(true);
        updateInfoType(resource.path, type).then((resp) => {
            const updatedDetails = { ...details, infoType: resp.type };
            setDetails(updatedDetails);
            setLoading(false);
        });
    };

    if (loading) {
        const arrayRows = [...Array(10)];
        return (
            <Grid container spacing={2}>
                {arrayRows.map((el, index) => (
                    <Fragment key={index}>
                        <FormRow label={<Skeleton variant="text" />}>
                            <Skeleton variant="text" />
                        </FormRow>
                    </Fragment>
                ))}
            </Grid>
        );
    }

    const isFile = details.type !== "dir";

    return (
        <>
            <Grid container spacing={2}>
                {isFile && (
                    <FormRow label={getMessage("type")}>
                        {details["content-type"]}
                    </FormRow>
                )}
                {isFile && (
                    <FormRow
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
                    </FormRow>
                )}
                <FormRow
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
                </FormRow>
                {isFile && (
                    <FormRow label={getMessage("fileSize")}>
                        {getFileSize(details["file-size"])}
                    </FormRow>
                )}
                <FormRow label={getMessage("modified")}>
                    {formatDate(details["date-modified"])}
                </FormRow>
                <FormRow label={getMessage("created")}>
                    {formatDate(details["date-created"])}
                </FormRow>
                {isFile && (
                    <FormRow label={getMessage("md5")}>{details.md5}</FormRow>
                )}
            </Grid>

            <Divider className={classes.dividerMargins} />
            <TagSearch id={build(baseId, ids.TAG_SEARCH)} resource={resource} />
        </>
    );
}

export default withI18N(DetailsTabPanel, messages);
