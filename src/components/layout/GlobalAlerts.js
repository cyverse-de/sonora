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

import { Card, CardHeader, Typography } from "@mui/material";
import AnnounceIcon from "@mui/icons-material/Warning";

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

    return activeAlertsList.length < 1
        ? null
        : activeAlertsList.map((text) => {
              return (
                  <Card
                      key={text}
                      sx={{
                          marginTop: 2,
                          marginBottom: 2,
                      }}
                  >
                      <CardHeader
                          avatar={
                              <AnnounceIcon
                                  sx={{ color: "gold" }}
                                  fontSize="large"
                              />
                          }
                          title={
                              <Typography
                                  dangerouslySetInnerHTML={{ __html: text }}
                              />
                          }
                      />
                  </Card>
              );
          });
};

export default GlobalAlerts;
