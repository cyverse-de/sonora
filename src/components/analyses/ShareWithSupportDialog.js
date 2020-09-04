/**
 *
 * @author Sriram
 *
 */
import React from "react";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";

import ids from "../../ids";
import analysisStatus from "../../model/analysisStatus";

import intlData from "../../messages";

import {
    build,
    DEDialogHeader,
    formatHTMLMessage,
    formatMessage,
    getMessage,
    formatDate,
    withI18N,
} from "@cyverse-de/ui-lib";

import Button from "@material-ui/core/Button/Button";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Grid from "@material-ui/core/Grid/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import TextField from "@material-ui/core/TextField";

function AnalysisInfo(props) {
    const { analysis, name, email } = props;
    if (analysis) {
        return (
            <Grid container spacing={3} style={{ marginTop: 2, fontSize: 12 }}>
                <Grid item xs={6}>
                    {getMessage("analysis")}: {analysis.name}
                </Grid>
                <Grid item xs={12}>
                    {getMessage("analysisId")} : {analysis.id}
                </Grid>
                <Grid item xs={12}>
                    {getMessage("app")} : {analysis.app_name}
                </Grid>
                <Grid item xs={12}>
                    {getMessage("currentStatus")} : {analysis.status}
                </Grid>
                <Grid item xs={12}>
                    {getMessage("outputFolder")} : {analysis.resultfolderid}
                </Grid>
                <Grid item xs={12}>
                    {getMessage("startDate")} : {formatDate(analysis.startdate)}
                </Grid>
                <Grid item xs={12}>
                    {getMessage("endDate")} : {formatDate(analysis.enddate)}
                </Grid>
                <Grid item xs={12}>
                    {getMessage("user")} : {analysis.username}
                </Grid>
                <Grid item xs={12}>
                    {getMessage("name")} : {name}
                </Grid>
                <Grid item xs={12}>
                    {getMessage("email")} : {email}
                </Grid>
            </Grid>
        );
    } else {
        return null;
    }
}

function CompletedStateCondition(props) {
    return (
        <FormControl component="fieldset">
            <FormLabel
                component="legend"
                style={{ padding: 5, fontWeight: "bold" }}
            >
                {getMessage("outputConditionHeader")}
            </FormLabel>
            <RadioGroup
                name="condition"
                value={props.outputCondition}
                onChange={props.handleConditionChange}
            >
                <FormControlLabel
                    value="noOutput"
                    control={<Radio />}
                    label={getMessage("noOutput")}
                />
                <FormControlLabel
                    value="unExpectedOutput"
                    control={<Radio />}
                    label={getMessage("unExpectedOutput")}
                />
            </RadioGroup>
        </FormControl>
    );
}

function SubmittedStateSupport(props) {
    const { analysis } = props;
    if (analysis.system_id === "de") {
        return <div>{formatHTMLMessage("condorSubmitted")}</div>;
    } else {
        return <div>{formatHTMLMessage("agaveSubmitted")}</div>;
    }
}

function FailedStateSupport(props) {
    return <div>{formatHTMLMessage("failed")}</div>;
}

function RunningStateSupport(props) {
    const { analysis } = props;
    if (analysis.system_id === "de") {
        return <div>{formatHTMLMessage("condorRunning")}</div>;
    } else {
        return <div>{formatHTMLMessage("agaveRunning")}</div>;
    }
}

function CompletedNoOutputSupport() {
    return <div>{formatHTMLMessage("completedNoOutput")}</div>;
}

function CompletedUnExpectedOutputSupport() {
    return <div>{formatHTMLMessage("completedUnExpectedOutput")}</div>;
}

class ShareWithSupportDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            outputCondition: "noOutput",
            shareWithSupport: false,
            enableSubmit: false,
            comment: "",
        };
        this.handleConditionChange = this.handleConditionChange.bind(this);
    }

    handleConditionChange(event) {
        this.setState({ outputCondition: event.target.value });
    }

    render() {
        const {
            analysis,
            intl,
            name,
            email,
            onShareWithSupport,
            baseId,
        } = this.props;
        const { outputCondition, shareWithSupport, enableSubmit } = this.state;
        const status = analysis.status;
        const baseDebugID = build(baseId, ids.SHARE_WITH_SUPPORT);
        return (
            <Dialog open={this.props.dialogOpen}>
                <DEDialogHeader
                    heading={analysis.name}
                    onClose={() => {
                        this.setState({ shareWithSupport: false });
                        onShareWithSupport(analysis, this.state.comment, false);
                    }}
                />
                <DialogContent>
                    {!shareWithSupport && (
                        <React.Fragment>
                            {status === analysisStatus.COMPLETED && (
                                <CompletedStateCondition
                                    analysis={analysis}
                                    handleConditionChange={
                                        this.handleConditionChange
                                    }
                                    outputCondition={outputCondition}
                                />
                            )}

                            {status === analysisStatus.SUBMITTED && (
                                <SubmittedStateSupport analysis={analysis} />
                            )}

                            {status === analysisStatus.RUNNING && (
                                <RunningStateSupport analysis={analysis} />
                            )}

                            {status === analysisStatus.FAILED && (
                                <FailedStateSupport analysis={analysis} />
                            )}

                            {outputCondition === "noOutput" &&
                                status === analysisStatus.COMPLETED && (
                                    <CompletedNoOutputSupport />
                                )}

                            {outputCondition === "unExpectedOutput" &&
                                status === analysisStatus.COMPLETED && (
                                    <CompletedUnExpectedOutputSupport />
                                )}

                            <Button
                                variant="contained"
                                color="primary"
                                style={{
                                    textTransform: "none",
                                    float: "right",
                                }}
                                onClick={() => {
                                    this.setState({ shareWithSupport: true });
                                }}
                            >
                                {getMessage("needHelp")}
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
                                placeholder={formatMessage(intl, "comments")}
                                style={{ margin: 8 }}
                                fullWidth
                                multiline
                                margin="normal"
                                variant="outlined"
                                onChange={(event) => {
                                    this.setState({
                                        comment: event.target.value,
                                    });
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
                                            this.setState({
                                                enableSubmit:
                                                    event.target.checked,
                                            })
                                        }
                                        value={enableSubmit}
                                    />
                                }
                                label={formatHTMLMessage("shareDisclaimer")}
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
                                    this.setState({ shareWithSupport: false });
                                    onShareWithSupport(
                                        analysis,
                                        this.state.comment,
                                        true
                                    );
                                }}
                            >
                                {getMessage("submit")}
                            </Button>
                        </React.Fragment>
                    )}
                </DialogContent>
            </Dialog>
        );
    }
}

ShareWithSupportDialog.propTypes = {
    analysis: PropTypes.object.isRequired,
};
export default withI18N(injectIntl(ShareWithSupportDialog), intlData);
