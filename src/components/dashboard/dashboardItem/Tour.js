/**
 * A dashboard item that will prompt users to take a tour of the DE
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import buildID from "components/utils/DebugIDUtil";

import ids from "../ids";
import ProductTour from "components/help/ProductTour";

import ExploreIcon from "@mui/icons-material/Explore";
import {
    Card,
    CardHeader,
    CardActions,
    CardContent,
    Button,
    Typography,
    useTheme,
} from "@mui/material";

export default function Tour(props) {
    const { baseId, showTourPrompt, user, onDismiss } = props;
    const theme = useTheme();
    const { t } = useTranslation("intro");
    const [runTour, setRunTour] = React.useState(false);
    //users who don't have `showTourPrompt` key in preferences or explicity set to true
    if (
        showTourPrompt === null ||
        showTourPrompt === undefined ||
        showTourPrompt
    ) {
        return (
            <>
                <Card>
                    <CardHeader
                        avatar={
                            <ExploreIcon
                                style={{ color: theme.palette.gold }}
                                fontSize="large"
                            />
                        }
                        title={
                            <Typography variant="subtitle2">
                                {t("tourPromptTitle")}
                            </Typography>
                        }
                        style={{ color: theme.palette.info.main }}
                    />
                    <CardContent>
                        <Typography variant="body2" gutterBottom>
                            {t("tourPrompt", { user })}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            id={buildID(baseId, ids.DISMISS_BTN)}
                            size="small"
                            onClick={onDismiss}
                        >
                            {t("dismiss")}
                        </Button>
                        <Button
                            id={buildID(baseId, ids.TOUR_BTN)}
                            size="small"
                            color="primary"
                            onClick={() => setRunTour(true)}
                        >
                            {t("startTour")}
                        </Button>
                    </CardActions>
                </Card>
                <ProductTour
                    onTourExit={() => {
                        setRunTour(false);
                        onDismiss();
                    }}
                    runTour={runTour}
                />
            </>
        );
    }
    //users who have dismissed tour card.
    return null;
}
