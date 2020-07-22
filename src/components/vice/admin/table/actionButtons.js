import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { injectIntl } from "react-intl";

import { Button } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import {
    getMessage as msg,
    formatMessage as fmt,
    announce,
    AnnouncerConstants,
    withI18N,
} from "@cyverse-de/ui-lib";

import { id } from "./functions";
import useStyles from "./styles";
import messages from "./messages";

import { asyncData } from "../../../../serviceFacades/vice/admin";

const ActionButtonsSkeleton = () => {
    return (
        <Skeleton variant="rect" animation="wave" height={75} width="100%" />
    );
};

const ActionButton = ({ externalID, name, handler, onClick, popperMsgKey }) => {
    const classes = useStyles();

    return (
        <Button
            id={id(externalID, "button", name)}
            variant="contained"
            color="primary"
            onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                return onClick(event, handler, popperMsgKey);
            }}
            className={classes.actionButton}
        >
            {msg(name)}
        </Button>
    );
};

const ActionButtons = ({
    row,
    handleExtendTimeLimit = (_) => {},
    handleDownloadInputs = (_) => {},
    handleUploadOutputs = (_) => {},
    handleExit = (_) => {},
    handleSaveAndExit = (_) => {},
    intl,
}) => {
    const classes = useStyles();

    const externalID = row.original.externalID;

    const { status, data, error } = useQuery(
        ["async-data", externalID],
        asyncData
    );

    const isLoading = status === "loading";
    const hasErrored = status === "error";

    const onClick = (_event, dataFn, msgKey) => {
        let tlErr;
        let tlData;

        try {
            tlData = dataFn(data.analysisID, externalID);
        } catch (err) {
            tlErr = err;
        }

        const variant = tlErr
            ? AnnouncerConstants.ERROR
            : AnnouncerConstants.SUCCESS;
        const text = tlErr ? tlErr.message : fmt(intl, msgKey);

        announce({ text, variant });

        return tlData;
    };

    useEffect(() => {
        if (hasErrored) {
            announce({
                text: `Action buttons not available: ${error.message}`,
                variant: AnnouncerConstants.ERROR,
            });
        }
    }, [hasErrored, error]);

    return (
        <div className={classes.actions}>
            {isLoading ? (
                <ActionButtonsSkeleton id={id(externalID, "skeleton")} />
            ) : !hasErrored ? (
                <>
                    <ActionButton
                        external={externalID}
                        name="extendTimeLimit"
                        handler={handleExtendTimeLimit}
                        popperMsgKey="timeLimitExtended"
                        onClick={onClick}
                    />

                    <ActionButton
                        externalID={externalID}
                        name="downloadInputs"
                        handler={handleDownloadInputs}
                        popperMsgKey="downloadInputsCommandSent"
                        onClick={onClick}
                    />

                    <ActionButton
                        externalID={externalID}
                        name="uploadOutputs"
                        handler={handleUploadOutputs}
                        popperMsgKey="uploadOutputsCommandSent"
                        onClick={onClick}
                    />

                    <ActionButton
                        externalID={externalID}
                        name="exit"
                        handler={handleExit}
                        popperMsgKey="exitCommandSent"
                        onClick={onClick}
                    />

                    <ActionButton
                        externalID={externalID}
                        name="saveAndExit"
                        handler={handleExit}
                        popperMsgKey="saveAndExitCommandSent"
                        onClick={onClick}
                    />
                </>
            ) : null}
        </div>
    );
};

export default withI18N(injectIntl(ActionButtons), messages);
