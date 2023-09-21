import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useTranslation } from "i18n";

import { Button } from "@mui/material";
import { Skeleton } from "@mui/material";

import { announce } from "components/announcer/CyVerseAnnouncer";
import { ERROR, SUCCESS } from "components/announcer/AnnouncerConstants";

import { id } from "./functions";
import useStyles from "./styles";

import { asyncData } from "../../../../serviceFacades/vice/admin";

const ActionButtonsSkeleton = () => {
    return (
        <Skeleton
            variant="rectangular"
            animation="wave"
            height={75}
            width="100%"
        />
    );
};

const ActionButton = ({ externalID, name, handler, onClick, popperMsgKey }) => {
    const classes = useStyles();
    const { t } = useTranslation("vice-admin");

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
            {t(name)}
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
}) => {
    const classes = useStyles();
    const { t } = useTranslation("vice-admin");

    const externalID = row.original.externalID;

    const { status, data, error } = useQuery(["async-data", externalID], () =>
        asyncData(externalID)
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

        const variant = tlErr ? ERROR : SUCCESS;
        const text = tlErr ? tlErr.message : t(msgKey);

        announce({ text, variant });

        return tlData;
    };

    useEffect(() => {
        if (hasErrored) {
            announce({
                text: `Action buttons not available: ${error.message}`,
                variant: ERROR,
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

export default ActionButtons;
