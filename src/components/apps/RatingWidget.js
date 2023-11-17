/**
 * @author sriram
 *
 * A widget that allows users to rate an app.
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";
import { useQueryClient, useMutation, useQuery } from "react-query";

import Rate from "components/rating/Rate";

import constants from "../../constants";
import { getAppById, rateApp, APP_BY_ID_QUERY_KEY } from "serviceFacades/apps";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";

import { Grid, Typography } from "@mui/material";

export default function RatingWidget(props) {
    const { appId, systemId, appName } = props;
    const { t } = useTranslation("apps");
    // Get QueryClient from the context
    const queryClient = useQueryClient();

    const [ratingMutationError, setRatingMutationError] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const [appRating, setAppRating] = useState({
        average: 0,
        total: 0,
        user: 0,
    });

    const { isFetching: isAppFetching, error: appByIdError } = useQuery({
        queryKey: [APP_BY_ID_QUERY_KEY, { systemId, appId }],
        queryFn: () => getAppById({ systemId, appId }),
        enabled: !!appId && !!systemId,
        onSuccess: (result) => {
            setSelectedApp(result?.apps[0]);
        },
    });

    const { mutate: rating, status: ratingMutationStatus } = useMutation(
        rateApp,
        {
            onSuccess: () => {
                queryClient.invalidateQueries([
                    APP_BY_ID_QUERY_KEY,
                    { systemId, appId },
                ]);
            },
            onError: (e) => {
                setRatingMutationError(e);
            },
        }
    );

    const onRatingChange = (event, value) => {
        rating({
            appId,
            systemId,
            rating: value,
        });
    };

    const onDeleteRating = () => {
        rating({
            appId,
            systemId,
            rating: null,
        });
    };

    useEffect(() => {
        if (selectedApp) {
            setAppRating(selectedApp.rating);
        }
    }, [selectedApp]);

    const loading = isAppFetching || ratingMutationStatus === constants.LOADING;

    if (appByIdError || ratingMutationError) {
        return (
            <ErrorTypographyWithDialog
                errorMessage={t("ratingMutationError")}
                errorObject={appByIdError || ratingMutationError}
            />
        );
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={6}>
                {!loading && (
                    <Typography variant="caption">
                        {t("rateApp", {
                            appName,
                        })}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={6}>
                {!loading && (
                    <Rate
                        name={"user." + appId}
                        value={appRating?.user}
                        readOnly={false}
                        onChange={onRatingChange}
                        onDelete={appRating?.user ? onDeleteRating : undefined}
                    />
                )}
            </Grid>
        </Grid>
    );
}
