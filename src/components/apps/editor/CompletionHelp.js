/**
 * A component for displaying helpful messages and actions as the final step.
 *
 * @author psarando
 */
import React from "react";

import { Trans, useTranslation } from "i18n";
import ids from "./ids";
import buildID from "components/utils/DebugIDUtil";

import {
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    Link,
    Typography,
} from "@material-ui/core";
import { ArrowBack, PlayArrow } from "@material-ui/icons";

export default function CompletionHelp(props) {
    const {
        baseId,
        app,
        dirty,
        hasErrors,
        onExit,
        onLaunch,
        onSaveAndExit,
        onSaveAndLaunch,
        saveDisabled,
    } = props;

    const { t } = useTranslation("app_editor");

    const hasTool = app.tools[0];

    if (hasErrors) {
        return <Typography>{t("formHasErrors")}</Typography>;
    }

    if (dirty) {
        return (
            <Card>
                <CardContent>
                    {!hasTool && <Typography>{t("noToolWarning")}</Typography>}
                    <Typography>{t("formNotSaved")}</Typography>
                </CardContent>
                <CardActions>
                    <ButtonGroup
                        disabled={saveDisabled}
                        color="primary"
                        variant="contained"
                    >
                        <Button
                            id={buildID(baseId, ids.BUTTONS.BACK)}
                            startIcon={<ArrowBack />}
                            onClick={onSaveAndExit}
                        >
                            {t("saveAndExit")}
                        </Button>
                        {hasTool && (
                            <Button
                                id={buildID(baseId, ids.BUTTONS.LAUNCH_BTN)}
                                endIcon={<PlayArrow />}
                                onClick={onSaveAndLaunch}
                            >
                                {t("saveAndLaunch")}
                            </Button>
                        )}
                    </ButtonGroup>
                </CardActions>
            </Card>
        );
    }

    if (!hasTool) {
        return <Typography>{t("noToolWarning")}</Typography>;
    }

    return (
        <Typography>
            <Trans
                t={t}
                i18nKey={"appSavedSuggestions"}
                components={{
                    launch: (
                        <Link
                            id={buildID(baseId, ids.BUTTONS.LAUNCH_BTN)}
                            component="button"
                            variant="body1"
                            onClick={onLaunch}
                        />
                    ),
                    back: (
                        <Link
                            id={buildID(baseId, ids.BUTTONS.BACK)}
                            component="button"
                            variant="body1"
                            onClick={onExit}
                        />
                    ),
                }}
            />
        </Typography>
    );
}
