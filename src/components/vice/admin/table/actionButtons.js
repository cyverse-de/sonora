import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";

import {
    Button,
    //    Popper,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import {
    getMessage as msg,
    announce,
    AnnouncerConstants,
} from "@cyverse-de/ui-lib";

import { id } from "./functions";
import useStyles from "./styles";

import { asyncData } from "../../../../serviceFacades/vice/admin";

const ActionButtonsSkeleton = () => {
    return (
        <Skeleton variant="rect" animation="wave" height={75} width="100%" />
    );
};

const ActionButton = ({ baseID, name, handler, onClick, popperMsgKey }) => {
    const classes = useStyles();
    return (
        <Button
            id={id(baseID, "button", name)}
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

export default ({
    row,
    handleExtendTimeLimit = (_) => {},
    handleDownloadInputs = (_) => {},
    handleUploadOutputs = (_) => {},
    handleExit = (_) => {},
    handleSaveAndExit = (_) => {},
}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const externalID = row.original.externalID;

    const { status, data, error } = useQuery(
        ["async-data", externalID],
        asyncData
    );

    console.log(row);

    const isLoading = status === "loading";
    const hasErrored = status === "error";

    if (hasErrored) {
        console.log(error);
    }

    const onClick = (_event, dataFn, msgKey) => {
        let tlErr;
        let tlData;

        console.log(data);

        try {
            tlData = dataFn(data.analysisID, externalID);
        } catch (err) {
            tlErr = err;
        }

        const variant = tlErr
            ? AnnouncerConstants.ERROR
            : AnnouncerConstants.SUCCESS;
        const text = tlErr ? tlErr.message : msg(msgKey);

        console.log(`text: ${text}    variant: ${variant}`);

        announce({ text, variant });

        return tlData;
    };

    useEffect(() => {
        const timerID = setInterval(() => {
            if (open) {
                setOpen(false);
            }
        }, 3000);
        return () => clearInterval(timerID);
    });

    return (
        <div className={classes.actions}>
            {isLoading ? (
                <ActionButtonsSkeleton />
            ) : (
                <>
                    <ActionButton
                        baseID={externalID}
                        name="extendTimeLimit"
                        handler={handleExtendTimeLimit}
                        popperMsgKey="timeLimitExtended"
                        onClick={onClick}
                    />

                    <ActionButton
                        baseID={externalID}
                        name="downloadInputs"
                        handler={handleDownloadInputs}
                        popperMsgKey="downloadInputsCommandSent"
                        onClick={onClick}
                    />

                    <ActionButton
                        baseID={externalID}
                        name="uploadOutputs"
                        handler={handleUploadOutputs}
                        popperMsgKey="uploadOutputsCommandSent"
                        onClick={onClick}
                    />

                    <ActionButton
                        baseID={externalID}
                        name="exit"
                        handler={handleExit}
                        popperMsgKey="exitCommandSent"
                        onClick={onClick}
                    />

                    <ActionButton
                        baseID={externalID}
                        name="saveAndExit"
                        handler={handleExit}
                        popperMsgKey="saveAndExitCommandSent"
                        onClick={onClick}
                    />
                </>
            )}
        </div>
    );
};
