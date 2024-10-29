/**
 * A form component for setting App version order.
 *
 * @author psarando
 */
import React from "react";

import { FieldArray, Form, Formik } from "formik";
import { useMutation } from "react-query";

import { useTranslation } from "i18n";

import ids from "./ids";
import styles from "./styles";

import { announce } from "components/announcer/CyVerseAnnouncer";
import { SUCCESS } from "components/announcer/AnnouncerConstants";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import TableLoading from "components/table/TableLoading";
import buildID from "components/utils/DebugIDUtil";
import BackButton from "components/utils/BackButton";

import { setAppVersionOrder } from "serviceFacades/apps";

import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    Table,
    Toolbar,
    Typography,
} from "@mui/material";

import { makeStyles } from "tss-react/mui";

import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

const useStyles = makeStyles()(styles);

function VersionOrderForm(props) {
    const { baseId, version, onMoveUp, onMoveDown } = props;

    const { t } = useTranslation("common");
    const { classes } = useStyles();

    const versionBaseId = buildID(baseId, version.version_id);

    return (
        <Card className={classes.paramCard}>
            <CardHeader
                title={version.version}
                titleTypographyProps={{ variant: "body1" }}
                action={
                    <ButtonGroup color="primary" variant="text">
                        <Button
                            id={buildID(versionBaseId, ids.BUTTONS.MOVE_UP_BTN)}
                            aria-label={t("moveUp")}
                            onClick={onMoveUp}
                        >
                            <ArrowUpward />
                        </Button>
                        <Button
                            id={buildID(
                                versionBaseId,
                                ids.BUTTONS.MOVE_DOWN_BTN
                            )}
                            aria-label={t("moveDown")}
                            onClick={onMoveDown}
                        >
                            <ArrowDownward />
                        </Button>
                    </ButtonGroup>
                }
            />
        </Card>
    );
}

function VersionsOrderingForm(props) {
    const { baseId, app, isLoading, error, showErrorAnnouncer } = props;
    const { system_id: systemId, id: appId, versions } = app || {};

    const { t } = useTranslation(["app_editor", "common"]);

    const { mutate: saveAppVersions } = useMutation(
        ({ values }) =>
            setAppVersionOrder({ systemId, appId, versions: values }),
        {
            onSuccess: (resp, { onSuccess }) => {
                onSuccess(resp);
            },
            onError: (error, { onError }) => {
                onError(error);
            },
        }
    );

    return error ? (
        <WrappedErrorHandler errorObject={error} baseId={baseId} />
    ) : isLoading ? (
        <Table>
            <TableLoading baseId={baseId} numColumns={2} numRows={3} />
        </Table>
    ) : (
        <Formik
            initialValues={{ versions }}
            onSubmit={(values, actions) => {
                const { resetForm, setSubmitting, setStatus } = actions;

                const onSuccess = ({ versions }) => {
                    setSubmitting(false);
                    setStatus({ success: true });
                    resetForm({ values: { versions } });

                    announce({
                        text: t("appSaved"),
                        variant: SUCCESS,
                    });
                };

                const onError = (errorMessage) => {
                    showErrorAnnouncer(t("appSaveErr"), errorMessage);

                    setSubmitting(false);
                    setStatus({ success: false, errorMessage });
                };

                saveAppVersions({ values, onSuccess, onError });
            }}
        >
            {({ handleSubmit, isSubmitting, dirty, values }) => {
                return (
                    <Form>
                        <Toolbar variant="dense">
                            <BackButton dirty={dirty} />
                            <Typography
                                id={buildID(baseId, ids.TITLE)}
                                variant="h6"
                                paddingLeft={1}
                                style={{ flex: 1, overflow: "auto" }}
                            >
                                {t("orderAppVersions")}
                            </Typography>
                            <Button
                                id={buildID(baseId, ids.BUTTONS.SAVE_BTN)}
                                variant="contained"
                                type="submit"
                                onClick={handleSubmit}
                                disabled={!dirty || isSubmitting}
                            >
                                {t("common:save")}
                            </Button>
                        </Toolbar>

                        <FieldArray
                            name="versions"
                            render={(arrayHelpers) =>
                                values.versions.map((version, index) => (
                                    <VersionOrderForm
                                        key={version.version_id}
                                        baseId={baseId}
                                        version={version}
                                        onMoveUp={() => {
                                            if (index > 0) {
                                                arrayHelpers.move(
                                                    index,
                                                    index - 1
                                                );
                                            }
                                        }}
                                        onMoveDown={() => {
                                            if (
                                                index + 1 <
                                                values.versions.length
                                            ) {
                                                arrayHelpers.move(
                                                    index,
                                                    index + 1
                                                );
                                            }
                                        }}
                                    />
                                ))
                            }
                        />
                    </Form>
                );
            }}
        </Formik>
    );
}

export default withErrorAnnouncer(VersionsOrderingForm);
