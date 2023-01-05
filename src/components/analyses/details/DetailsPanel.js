import React from "react";

import { useTranslation } from "i18n";
import constants from "../../../constants";
import DataPathLink from "../../data/DataPathLink";

import NavigationConstants from "common/NavigationConstants";
import { getAnalysisUser } from "components/analyses/utils";

import analysisStatus from "components/models/analysisStatus";
import CopyTextArea from "components/copy/CopyTextArea";
import CopyLinkButton from "components/utils/CopyLinkButton";
import { copyLinkToClipboardHandler } from "components/utils/copyLinkToClipboardHandler";
import { copyStringToClipboard } from "components/utils/copyStringToClipboard";
import { formatDate } from "components/utils/DateFormatter";
import { getHost } from "components/utils/getHost";
import GridLabelValue from "components/utils/GridLabelValue";
import { useConfig } from "contexts/config";

import { Grid, Typography, useTheme } from "@material-ui/core";

const InfoGridValue = (props) => <Typography variant="body2" {...props} />;

export default function DetailsPanel(props) {
    const { analysis, baseId } = props;
    const { t } = useTranslation("analyses");
    const { t: i18nCommon } = useTranslation("common");
    const theme = useTheme();
    const [config] = useConfig();

    const username = getAnalysisUser(analysis, config);

    return (
        <Grid container spacing={2} style={{ marginTop: theme.spacing(1) }}>
            <GridLabelValue label={t("analysisId")}>
                <CopyTextArea
                    text={analysis.id}
                    btnText={t("copyAnalysisId")}
                />
            </GridLabelValue>
            <GridLabelValue label={t("app")}>
                <InfoGridValue>{analysis?.app_name}</InfoGridValue>
            </GridLabelValue>
            <GridLabelValue label={t("outputFolder")}>
                <div style={{ width: "100%" }}>
                    <div style={{ float: "left" }}>
                        {[
                            analysisStatus.SUBMITTED,
                            analysisStatus.RUNNING,
                        ].includes(analysis?.status) && (
                            <Typography variant="body2">
                                {analysis?.resultfolderid}
                            </Typography>
                        )}
                        {[
                            analysisStatus.COMPLETED,
                            analysisStatus.FAILED,
                            analysisStatus.CANCELED,
                        ].includes(analysis?.status) && (
                            <DataPathLink
                                id={baseId}
                                param_type="FolderInput"
                                path={analysis?.resultfolderid}
                            />
                        )}
                    </div>
                    <div style={{ marginLeft: theme.spacing(0.25) }}>
                        <CopyLinkButton
                            baseId={baseId}
                            onCopyLinkSelected={() => {
                                const link = `${getHost()}/${
                                    NavigationConstants.DATA
                                }/${constants.DATA_STORE_STORAGE_ID}${
                                    analysis?.resultfolderid
                                }`;
                                const copyPromise = copyStringToClipboard(link);
                                copyLinkToClipboardHandler(
                                    i18nCommon,
                                    copyPromise
                                );
                            }}
                        />
                    </div>
                </div>
            </GridLabelValue>
            <GridLabelValue label={t("startDate")}>
                <InfoGridValue>{formatDate(analysis?.startdate)}</InfoGridValue>
            </GridLabelValue>
            <GridLabelValue label={t("endDate")}>
                <InfoGridValue>{formatDate(analysis?.enddate)}</InfoGridValue>
            </GridLabelValue>
            <GridLabelValue label={t("owner")}>
                <InfoGridValue>{username}</InfoGridValue>
            </GridLabelValue>
        </Grid>
    );
}
