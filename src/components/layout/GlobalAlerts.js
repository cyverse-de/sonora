/**
 * Global Alerts component for displaying active alerts.
 *
 * @author mian, psarando
 */
import { useState } from "react";

import { useQuery } from "react-query";

import markdownToHtml from "components/utils/markdownToHtml";

import {
    activeAlerts,
    ACTIVE_ALERTS_QUERY_KEY,
} from "serviceFacades/notifications";

import { Paper, Toolbar, Typography } from "@mui/material";

const GlobalAlerts = () => {
    const [activeAlertsList, setActiveAlertsList] = useState([]);

    useQuery({
        queryKey: ACTIVE_ALERTS_QUERY_KEY,
        queryFn: activeAlerts,
        enabled: true,
        refetchInterval: 2 * 60 * 1000, // 2 minutes
        onSuccess: (queryresp) => {
            const alertsMdPromises = queryresp?.alerts.map((alertMap) =>
                markdownToHtml(alertMap.alert)
            );
            Promise.all(alertsMdPromises).then((values) => {
                if (
                    values.length !== activeAlertsList.length ||
                    !values.every((el, idx) => activeAlertsList[idx] === el)
                ) {
                    setActiveAlertsList(values || []);
                }
            });
        },
    });

    return activeAlertsList.length < 1 ? null : (
        <Paper
            sx={{
                marginBottom: 0.5,
                padding: 0.5,
            }}
        >
            {activeAlertsList.map((text) => {
                return (
                    <Toolbar
                        key={text}
                        variant="dense"
                        sx={{
                            backgroundColor: "#FFC972",
                            color: "#713916",
                            marginBottom: 1,
                        }}
                    >
                        <Typography
                            dangerouslySetInnerHTML={{ __html: text }}
                        />
                    </Toolbar>
                );
            })}
        </Paper>
    );
};

export default GlobalAlerts;
