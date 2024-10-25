/**
 * A form component for setting App version order.
 *
 * @author psarando
 */
import React from "react";

import { FieldArray, Form, Formik } from "formik";

import { useTranslation } from "i18n";

import ids from "./ids";
import styles from "./styles";

import buildID from "components/utils/DebugIDUtil";

import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    Toolbar,
    Typography,
} from "@mui/material";

import { makeStyles } from "tss-react/mui";

import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import BackButton from "components/utils/BackButton";

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
    const { baseId, versions } = props;

    const { t } = useTranslation(["app_editor", "common"]);

    return (
        <Formik
            initialValues={{ versions }}
            onSubmit={({ versions }, actions) => {
                console.log({ versions });
            }}
        >
            {({ handleSubmit, dirty, values }) => {
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

export default VersionsOrderingForm;
