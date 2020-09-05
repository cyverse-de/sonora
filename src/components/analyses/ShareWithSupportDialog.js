/**
 *
 * @author Sriram, psarando
 *
 */
import React from "react";

import { useTranslation } from "i18n";
import PropTypes from "prop-types";
import { Trans } from "react-i18next";

import ids from "./ids";
import constants from "./constants";

import { intercomShow } from "common/intercom";
import analysisStatus from "components/models/analysisStatus";
import UtilIds from "components/utils/ids";

import { build, formatDate } from "@cyverse-de/ui-lib";

import {
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    FormControlLabel,
    Grid,
    Link,
    Radio,
    RadioGroup,
    TextField,
} from "@material-ui/core";

function AnalysisInfo(props) {
    const { analysis, name, email } = props;

    const { t } = useTranslation("analyses");

    if (analysis) {
        return (
            <Grid container spacing={3} style={{ marginTop: 2, fontSize: 12 }}>
                <Grid item xs={6}>
                    {t("analysis")}: {analysis.name}
                </Grid>
                <Grid item xs={12}>
                    {t("analysisId")} : {analysis.id}
                </Grid>
                <Grid item xs={12}>
                    {t("app")} : {analysis.app_name}
                </Grid>
                <Grid item xs={12}>
                    {t("currentStatus")} : {analysis.status}
                </Grid>
                <Grid item xs={12}>
                    {t("outputFolder")} : {analysis.resultfolderid}
                </Grid>
                <Grid item xs={12}>
                    {t("startDate")} : {formatDate(analysis.startdate)}
                </Grid>
                <Grid item xs={12}>
                    {t("endDate")} : {formatDate(analysis.enddate)}
                </Grid>
                <Grid item xs={12}>
                    {t("user")} : {analysis.username}
                </Grid>
                <Grid item xs={12}>
                    {t("name")} : {name}
                </Grid>
                <Grid item xs={12}>
                    {t("email")} : {email}
                </Grid>
            </Grid>
        );
    } else {
        return null;
    }
}

function CompletedStateCondition({ outputCondition, handleConditionChange }) {
    const { t } = useTranslation("analyses");

    return (
        <FormControl component="fieldset">
            <FormLabel
                component="legend"
                style={{ padding: 5, fontWeight: "bold" }}
            >
                {t("statusHelpOutputConditionHeader")}
            </FormLabel>
            <RadioGroup
                name="condition"
                value={outputCondition}
                onChange={handleConditionChange}
            >
                <FormControlLabel
                    value="noOutput"
                    control={<Radio />}
                    label={t("statusHelpNoOutput")}
                />
                <FormControlLabel
                    value="unexpectedOutput"
                    control={<Radio />}
                    label={t("statusHelpUnexpectedOutput")}
                />
            </RadioGroup>
        </FormControl>
    );
}

function SubmittedStateSupport(props) {
    const { analysis } = props;

    const { t } = useTranslation("analyses");

    if (analysis.system_id === "de") {
        return (
            <Trans
                t={t}
                i18nKey="statusHelpCondorSubmitted"
                components={{
                    // eslint-disable-next-line jsx-a11y/heading-has-content
                    heading: <h4 />,
                    content: <p style={{ margin: 10 }} />,
                }}
            />
        );
    } else {
        return (
            <Trans
                t={t}
                i18nKey="statusHelpAgaveSubmitted"
                components={{
                    // eslint-disable-next-line jsx-a11y/heading-has-content
                    heading: <h4 />,
                    content: <p style={{ margin: 10 }} />,
                    xsede: (
                        <Link
                            href={constants.XSEDE_ACCESS_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    ),
                }}
            />
        );
    }
}

function FailedStateSupport(props) {
    const { t } = useTranslation("analyses");

    return (
        <Trans
            t={t}
            i18nKey="statusHelpFailed"
            components={{
                // eslint-disable-next-line jsx-a11y/heading-has-content
                heading: <h4 />,
                b: <b />,
                content: <p style={{ margin: 10 }} />,
                content2: <p style={{ paddingLeft: 10, margin: 10 }} />,
                content3: <p style={{ paddingLeft: 20, margin: 10 }} />,
                appCommentsLink: (
                    <Link
                        href={constants.APP_RATINGS_COMMENTS_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                ),
                appManualLink: (
                    <Link
                        href={constants.APP_MANUAL_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                ),
                appStatusLink: (
                    <Link
                        href={constants.APP_STATUS_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                ),
                exampleFileLink: (
                    <Link
                        href={constants.EXAMPLE_FILE_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                ),
                specialCharsLink: (
                    <Link
                        href={constants.SPECIAL_CHARS_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                ),
                toolInfoLink: (
                    <Link
                        href={constants.TOOL_INFO_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                ),
            }}
        />
    );
}

function RunningStateSupport(props) {
    const { analysis, baseId } = props;

    const { t } = useTranslation("analyses");

    if (analysis.system_id === "de") {
        return (
            <Trans
                t={t}
                i18nKey="statusHelpCondorRunning"
                components={{
                    // eslint-disable-next-line jsx-a11y/heading-has-content
                    heading: <h4 />,
                    content: <p style={{ paddingLeft: 10, margin: 10 }} />,
                    appManualLink: (
                        <Link
                            href={constants.APP_MANUAL_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    ),
                    support: (
                        <Link
                            id={build(baseId, UtilIds.CONTACT_SUPPORT_BUTTON)}
                            component="button"
                            onClick={(event) => {
                                // prevent form submission
                                event.preventDefault();
                                intercomShow();
                            }}
                        />
                    ),
                }}
            />
        );
    } else {
        return (
            <Trans
                t={t}
                i18nKey="statusHelpAgaveRunning"
                components={{
                    // eslint-disable-next-line jsx-a11y/heading-has-content
                    heading: <h4 />,
                    content: <p style={{ margin: 10 }} />,
                }}
            />
        );
    }
}

function CompletedNoOutputSupport() {
    const { t } = useTranslation("analyses");

    return (
        <Trans
            t={t}
            i18nKey="statusHelpCompletedNoOutput"
            components={{
                // eslint-disable-next-line jsx-a11y/heading-has-content
                heading: <h4 />,
                b: <b />,
                content: <p style={{ margin: 10 }} />,
                content2: <p style={{ paddingLeft: 10, margin: 10 }} />,
                appManualLink: (
                    <Link
                        href={constants.APP_MANUAL_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                ),
                logFilesLink: (
                    <Link
                        href={constants.LOG_FILES_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                ),
                specialCharsLink: (
                    <Link
                        href={constants.SPECIAL_CHARS_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                ),
            }}
        />
    );
}

function CompletedUnexpectedOutputSupport() {
    const { t } = useTranslation("analyses");

    return (
        <Trans
            t={t}
            i18nKey="statusHelpCompletedUnexpectedOutput"
            components={{
                // eslint-disable-next-line jsx-a11y/heading-has-content
                heading: <h4 />,
                b: <b />,
                content: <p style={{ margin: 10 }} />,
                content2: <p style={{ paddingLeft: 10, margin: 10 }} />,
                content3: <p style={{ paddingLeft: 20, margin: 10 }} />,
                appCommentsLink: (
                    <Link
                        href={constants.APP_RATINGS_COMMENTS_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                ),
                appManualLink: (
                    <Link
                        href={constants.APP_MANUAL_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                ),
                appStatusLink: (
                    <Link
                        href={constants.APP_STATUS_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                ),
                logFilesLink: (
                    <Link
                        href={constants.LOG_FILES_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                ),
            }}
        />
    );
}

function ShareDisclaimer() {
    const { t } = useTranslation("analyses");

    return (
        <Trans
            t={t}
            i18nKey="statusHelpShareDisclaimer"
            components={{
                content: <span style={{ overflow: "auto" }} />,
                sciInformaticiansLink: (
                    <Link
                        href={constants.SCI_INFORMATICIANS_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                ),
                shareLink: (
                    <Link
                        href={constants.SHARE_ANALYSIS_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                ),
            }}
        />
    );
}

const ShareWithSupportDialog = ({
    open,
    analysis,
    name,
    email,
    onShareWithSupport,
    baseId,
}) => {
    const [outputCondition, setOutputCondition] = React.useState("noOutput");
    const [shareWithSupport, setShareWithSupport] = React.useState(false);
    const [enableSubmit, setEnableSubmit] = React.useState(false);
    const [comment, setComment] = React.useState("");

    const { t } = useTranslation("analyses");

    const status = analysis.status;
    const baseDebugID = build(baseId, ids.SHARE_WITH_SUPPORT);

    return (
        <Dialog
            open={open}
            onClose={() => {
                setShareWithSupport(false);
                onShareWithSupport(analysis, comment, false);
            }}
        >
            <DialogTitle>{analysis.name}</DialogTitle>
            <DialogContent>
                {!shareWithSupport && (
                    <React.Fragment>
                        {status === analysisStatus.COMPLETED && (
                            <CompletedStateCondition
                                handleConditionChange={(event) => {
                                    setOutputCondition(event.target.value);
                                }}
                                outputCondition={outputCondition}
                            />
                        )}

                        {status === analysisStatus.SUBMITTED && (
                            <SubmittedStateSupport analysis={analysis} />
                        )}

                        {status === analysisStatus.RUNNING && (
                            <RunningStateSupport
                                analysis={analysis}
                                baseId={baseDebugID}
                            />
                        )}

                        {status === analysisStatus.FAILED && (
                            <FailedStateSupport />
                        )}

                        {outputCondition === "noOutput" &&
                            status === analysisStatus.COMPLETED && (
                                <CompletedNoOutputSupport />
                            )}

                        {outputCondition === "unexpectedOutput" &&
                            status === analysisStatus.COMPLETED && (
                                <CompletedUnexpectedOutputSupport />
                            )}

                        <Button
                            variant="contained"
                            color="primary"
                            style={{
                                textTransform: "none",
                                float: "right",
                            }}
                            onClick={() => {
                                setShareWithSupport(true);
                            }}
                        >
                            {t("needHelp")}
                        </Button>
                    </React.Fragment>
                )}

                {shareWithSupport && (
                    <React.Fragment>
                        <AnalysisInfo
                            analysis={analysis}
                            name={name}
                            email={email}
                        />
                        <TextField
                            id={build(baseDebugID, ids.COMMENTS)}
                            placeholder={t("comments")}
                            style={{ margin: 8 }}
                            fullWidth
                            multiline
                            margin="normal"
                            variant="outlined"
                            onChange={(event) => {
                                setComment(event.target.value);
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={enableSubmit}
                                    onChange={(event) =>
                                        setEnableSubmit(event.target.checked)
                                    }
                                    value={enableSubmit}
                                />
                            }
                            label={<ShareDisclaimer />}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            style={{
                                textTransform: "none",
                                float: "right",
                            }}
                            disabled={!enableSubmit}
                            onClick={() => {
                                setShareWithSupport(false);
                                onShareWithSupport(analysis, comment, true);
                            }}
                        >
                            {t("submit")}
                        </Button>
                    </React.Fragment>
                )}
            </DialogContent>
        </Dialog>
    );
};

ShareWithSupportDialog.propTypes = {
    analysis: PropTypes.object.isRequired,
};

export default ShareWithSupportDialog;
