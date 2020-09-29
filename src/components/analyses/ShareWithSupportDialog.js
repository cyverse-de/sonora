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

import constants from "../../constants";

import { intercomShow } from "common/intercom";

import analysisStatus from "components/models/analysisStatus";
import systemId from "components/models/systemId";

import ExternalLink from "components/utils/ExternalLink";
import UtilIds from "components/utils/ids";

import { build, formatDate } from "@cyverse-de/ui-lib";

import {
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
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
    Typography,
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
            <FormLabel component="legend">
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

const HelpHeading = (props) => (
    <Typography variant="h6" component="h1" {...props} />
);
const HelpContent = (props) => <Typography variant="body2" {...props} />;

function SubmittedStateSupport(props) {
    const { analysis } = props;

    const { t } = useTranslation("analyses");

    return (
        <dl>
            <dt>
                <HelpHeading>{t("statusHelpSubmittedHeader")}</HelpHeading>
            </dt>
            <dd>
                <HelpContent>
                    <Trans
                        t={t}
                        i18nKey={
                            analysis.system_id === systemId.de
                                ? "statusHelpCondorSubmitted"
                                : "statusHelpAgaveSubmitted"
                        }
                        components={{
                            xsede: (
                                <ExternalLink
                                    href={constants.HELP_DOCS.HPC_APPS}
                                />
                            ),
                        }}
                    />
                </HelpContent>
            </dd>
        </dl>
    );
}

function HelpSpecialChars({ t }) {
    return (
        <Trans
            t={t}
            i18nKey="statusHelpSpecialChars"
            components={{
                b: <b />,
                exampleFileLink: (
                    <ExternalLink href={constants.HELP_DOCS.EXAMPLE_FILE} />
                ),
                specialCharsLink: (
                    <ExternalLink href={constants.HELP_DOCS.SPECIAL_CHARS} />
                ),
            }}
        />
    );
}

function HelpInputFileFormat({ t }) {
    return (
        <Trans
            t={t}
            i18nKey="statusHelpInputFileFormat"
            components={{
                b: <b />,
                appManualLink: (
                    <ExternalLink
                        href={constants.HELP_DOCS.APP_AND_TOOL_INFO}
                    />
                ),
            }}
        />
    );
}

function HelpCorruptedInput({ t }) {
    return (
        <Trans
            t={t}
            i18nKey="statusHelpCorruptedInput"
            components={{
                b: <b />,
                exampleFileLink: (
                    <ExternalLink href={constants.HELP_DOCS.EXAMPLE_FILE} />
                ),
            }}
        />
    );
}

function HelpInvalidParameters({ t }) {
    return (
        <Trans
            t={t}
            i18nKey="statusHelpInvalidParameters"
            components={{
                b: <b />,
                appManualLink: (
                    <ExternalLink
                        href={constants.HELP_DOCS.APP_AND_TOOL_INFO}
                    />
                ),
                logFilesLink: (
                    <ExternalLink href={constants.HELP_DOCS.LOG_FILES} />
                ),
            }}
        />
    );
}

function HelpAppProblem({ t }) {
    return (
        <Trans
            t={t}
            i18nKey="statusHelpAppProblem"
            components={{
                b: <b />,
                ul: <ul />,
                li: <li />,
                appCommentsLink: (
                    <ExternalLink
                        href={constants.HELP_DOCS.APP_RATINGS_COMMENTS}
                    />
                ),
                appStatusLink: (
                    <ExternalLink href={constants.HELP_DOCS.APP_STATUS} />
                ),
                toolInfoLink: (
                    <ExternalLink
                        href={constants.HELP_DOCS.APP_AND_TOOL_INFO}
                    />
                ),
            }}
        />
    );
}

function FailedStateSupport(props) {
    const { t } = useTranslation("analyses");

    return (
        <dl>
            <dt>
                <HelpHeading>{t("statusHelpFailedHeader")}</HelpHeading>
            </dt>
            <dd>
                <HelpContent component="span">
                    <Trans
                        t={t}
                        i18nKey="statusHelpFailed"
                        components={{
                            p: <p />,
                        }}
                    />
                    <ul>
                        <li>
                            <HelpSpecialChars t={t} />
                        </li>
                        <li>
                            <HelpInputFileFormat t={t} />
                        </li>
                        <li>
                            <HelpCorruptedInput t={t} />
                        </li>
                    </ul>
                    <p>{t("statusHelpFailedOtherReasons")}</p>
                    <ul>
                        <li>
                            <HelpInvalidParameters t={t} />
                        </li>
                        <li>
                            <HelpAppProblem t={t} />
                        </li>
                    </ul>
                </HelpContent>
            </dd>
        </dl>
    );
}

function RunningStateSupport(props) {
    const { analysis, baseId } = props;

    const { t } = useTranslation("analyses");

    return (
        <dl>
            <dt>
                <HelpHeading>{t("statusHelpRunningHeader")}</HelpHeading>
            </dt>
            {analysis.system_id === systemId.de ? (
                <HelpContent component="dd">
                    <Trans
                        t={t}
                        i18nKey={"statusHelpCondorRunning"}
                        components={{
                            ul: <ul />,
                            li: <li />,
                            appManualLink: (
                                <ExternalLink
                                    href={constants.HELP_DOCS.APP_AND_TOOL_INFO}
                                />
                            ),
                            support: (
                                <Link
                                    id={build(
                                        baseId,
                                        UtilIds.CONTACT_SUPPORT_BUTTON
                                    )}
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
                </HelpContent>
            ) : (
                <dd>
                    <HelpContent component="span">
                        {t("statusHelpAgaveRunning")}
                    </HelpContent>
                </dd>
            )}
        </dl>
    );
}

function CompletedNoOutputSupport() {
    const { t } = useTranslation("analyses");

    return (
        <dl>
            <dt>
                <HelpHeading>{t("statusHelpNoOutput")}</HelpHeading>
            </dt>
            <dd>
                <HelpContent component="span">
                    <Trans
                        t={t}
                        i18nKey="statusHelpCompletedNoOutput"
                        components={{
                            b: <b />,
                            logFilesLink: (
                                <ExternalLink
                                    href={constants.HELP_DOCS.LOG_FILES}
                                />
                            ),
                        }}
                    />
                    <ul>
                        <li>
                            <HelpSpecialChars t={t} />
                        </li>
                        <li>
                            <HelpCorruptedInput t={t} />
                        </li>
                    </ul>
                </HelpContent>
            </dd>
        </dl>
    );
}

function CompletedUnexpectedOutputSupport() {
    const { t } = useTranslation("analyses");

    return (
        <dl>
            <dt>
                <HelpHeading>{t("statusHelpUnexpectedOutput")}</HelpHeading>
            </dt>
            <dd>
                <HelpContent component="span">
                    {t("statusHelpCompletedUnexpectedOutput")}
                    <ul>
                        <li>
                            <HelpInvalidParameters t={t} />
                        </li>
                        <li>
                            <HelpAppProblem t={t} />
                        </li>
                    </ul>
                </HelpContent>
            </dd>
        </dl>
    );
}

function ShareDisclaimer() {
    const { t } = useTranslation("analyses");

    return (
        <HelpContent style={{ overflow: "auto" }}>
            <Trans
                t={t}
                i18nKey="statusHelpShareDisclaimer"
                components={{
                    sciInformaticiansLink: (
                        <ExternalLink
                            href={constants.HELP_DOCS.SCI_INFORMATICIANS}
                        />
                    ),
                    shareLink: (
                        <ExternalLink
                            href={constants.HELP_DOCS.SHARE_ANALYSIS}
                        />
                    ),
                }}
            />
        </HelpContent>
    );
}

const ShareWithSupportDialog = ({
    open,
    onClose,
    analysis,
    name,
    email,
    onShareWithSupport,
    loading,
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
        <Dialog open={open} onClose={onClose}>
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
                    </React.Fragment>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    disabled={loading}
                    onClick={() => {
                        setShareWithSupport(false);
                        onClose();
                    }}
                >
                    {t("cancel")}
                </Button>

                {shareWithSupport ? (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!enableSubmit || loading}
                        onClick={() => {
                            onShareWithSupport(analysis, comment);
                        }}
                    >
                        {loading ? <CircularProgress size={25} /> : t("submit")}
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setShareWithSupport(true);
                        }}
                    >
                        {t("needHelp")}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

ShareWithSupportDialog.propTypes = {
    analysis: PropTypes.object.isRequired,
    open: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onShareWithSupport: PropTypes.func.isRequired,
};

export default ShareWithSupportDialog;
