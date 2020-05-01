import React, { useState } from "react";
import { useQuery } from "react-query";
import TableView from "./TableView";
import { getTools } from "../../../serviceFacades/tools";
import { injectIntl } from "react-intl";
import { withI18N } from "@cyverse-de/ui-lib";
import messages from "../Messages";

function Listing(props) {
    const { baseId } = props;
    const [data, setData] = useState(null);

    // Fetches tool listings from the API.
    const { isFetching, error } = useQuery({
        queryKey: "tools",
        queryFn: getTools,
        config: {
            onSuccess: setData,
        },
    });

    return (
        <TableView
            baseId={baseId}
            loading={isFetching}
            error={error}
            listing={data}
        />
    );
}

export default withI18N(injectIntl(Listing), messages);
