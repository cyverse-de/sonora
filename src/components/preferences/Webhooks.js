/**
 * @author sriram
 *
 * Webhook user preferences
 *
 *
 */

import React from "react";
import { useTranslation } from "i18n";
import { Field } from "formik";
import { useQuery } from "react-query";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";
import FormSwitch from "components/forms/FormSwitch";

import { testWebhook, WEBHOOK_TEST_KEY } from "serviceFacades/users";

import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import ids from "./ids";
import styles from "./styles";

import {
    Button,
    Grid,
    Typography,
    MenuItem,
    CircularProgress,
    useTheme,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import useBreakpoints from "components/layout/useBreakpoints";

const useStyles = makeStyles(styles);

export default function Webhooks(props) {
    const { baseId, webhookTopics, webhookTypes, values } = props;
    const { t } = useTranslation("preferences");
    const classes = useStyles();
    const theme = useTheme();
    const { isSmUp } = useBreakpoints();

    const [enableTest, setEnableTest] = React.useState(false);
    const [enableTestButton, setEnableTestButton] = React.useState(false);
    const [testKey, setTestKey] = React.useState(WEBHOOK_TEST_KEY);
    const [testError, setTestError] = React.useState();
    const [testSuccess, setTestSuccess] = React.useState(false);

    const { isFetching: isTesting } = useQuery({
        queryKey: testKey,
        queryFn: () => testWebhook({ url: values?.webhook?.url }),
        enabled: enableTest,
        onSuccess: (resp) => {
            setEnableTest(false);
            setTestError(null);
            setTestSuccess(true);
        },
        onError: (e) => {
            setEnableTest(false);
            setTestError(e);
            setTestSuccess(false);
        },
    });

    React.useEffect(() => {
        const hasURL = values?.webhook?.url ? true : false;
        setEnableTestButton(hasURL && !isTesting);
    }, [isTesting, values]);

    return (
        <>
            <Typography variant="h6" className={classes.sectionHeader}>
                {t("webhooks")}
            </Typography>
            <Grid container spacing={1} className={classes.grid}>
                <Grid item xs={12}>
                    <Typography>{t("webhooksPrompt")}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Field
                        id={buildID(baseId, ids.WEBHOOK_URL_TEXT)}
                        component={FormTextField}
                        name="webhook.url"
                    />
                </Grid>
                <Grid item>
                    <Field
                        name="webhook.type.type"
                        id={buildID(baseId, ids.WEBHOOK_TYPES_SELECT)}
                        label={t("type")}
                        select
                        variant="outlined"
                        size="small"
                        component={FormTextField}
                        sx={{ minWidth: isSmUp ? 75 : 25 }}
                        validate={(value) => {
                            if (values?.webhook?.url && !value) {
                                return t("webhookTypeError");
                            }
                        }}
                    >
                        {webhookTypes?.map((type, index) => (
                            <MenuItem
                                key={index}
                                value={type.type}
                                id={buildID(
                                    baseId,
                                    ids.WEBHOOK_TYPES_SELECT,
                                    type.type
                                )}
                            >
                                {type.type}
                            </MenuItem>
                        ))}
                    </Field>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2">
                        {t("webhookSelectedTopics")}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.grid}>
                {webhookTopics?.map((topic, index) => (
                    <Grid item xs={12} key={index}>
                        <Field
                            id={buildID(
                                baseId,
                                ids.WEBHOOK_TOPIC_SWITCH,
                                topic.topic
                            )}
                            component={FormSwitch}
                            name={`webhook.${topic.topic}`}
                            color="primary"
                            label={t(`${topic.topic}`)}
                        />
                    </Grid>
                ))}
            </Grid>
            <Grid container spacing={3} className={classes.grid}>
                {isTesting && (
                    <Grid item>
                        <CircularProgress size={30} thickness={5} />
                    </Grid>
                )}
                <Grid item>
                    <Button
                        id={buildID(baseId, ids.WEBHOOK_TEST_BTN)}
                        variant="outlined"
                        disabled={!enableTestButton}
                        onClick={() => {
                            setTestKey([
                                WEBHOOK_TEST_KEY,
                                { url: values?.webhook?.url },
                            ]);
                            setTestSuccess(false);
                            setTestError(null);
                            setEnableTest(values?.webhook?.url ? true : false);
                        }}
                        startIcon={
                            testSuccess ? (
                                <CheckCircleIcon />
                            ) : testError ? (
                                <ErrorIcon />
                            ) : null
                        }
                        style={{ color: theme.palette.info.main }}
                    >
                        {t("test")}
                    </Button>
                </Grid>
                {testError && (
                    <Grid item>
                        <ErrorTypographyWithDialog
                            baseId={baseId}
                            errorMessage={t("webhookTestFailed")}
                            errorObject={testError}
                        />
                    </Grid>
                )}
            </Grid>
        </>
    );
}
