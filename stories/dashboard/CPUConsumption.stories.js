import React from "react";
import CPUConsumption from "components/dashboard/dashboardItem/CPUConsumption";

export default {
    title: "Dashboard/CPUConsumption",
};

export const CPUConsumptionTest = () => {
    return (
        <CPUConsumption
            data={{
                id: "3ca5f6a3-722f-4135-8ee0-ee20b75bbb40",
                user_id: "626717be-575e-11ea-8038-008cfa5ae621",
                username: "sonora_test@iplantcollaborative.org",
                total: "168.4269529152434",
                effective_start: "2022-02-03T00:34:41.88739Z",
                effective_end: "2023-02-03T00:34:41.88739Z",
                last_modified: "2022-02-03T02:38:17.906799Z",
            }}
        />
    );
};
