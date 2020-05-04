import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import TableView from "./TableView";
import { getTools } from "../../../serviceFacades/tools";
import { injectIntl } from "react-intl";
import { withI18N } from "@cyverse-de/ui-lib";
import messages from "../Messages";

/**
 * Returns the tool listing component.
 * @param {Object} props - the component properties
 */
function Listing(props) {
    const { baseId } = props;
    const [data, setData] = useState(null);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [toolsKey, setToolsKey] = useState(null);

    useEffect(() => {
        setToolsKey(["getTools", { order, orderBy }]);
    }, [order, orderBy]);

    // Fetches tool listings from the API.
    const { isFetching, error } = useQuery({
        queryKey: toolsKey,
        queryFn: getTools,
        config: {
            onSuccess: setData,
        },
    });

    // Handles a request to sort the tools.
    const handleRequestSort = (_, property) => {
        setOrder(orderBy === property && order === "asc" ? "desc" : "asc");
        setOrderBy(property);
    };

    return (
        <TableView
            baseId={baseId}
            error={error}
            handleRequestSort={handleRequestSort}
            listing={data}
            loading={isFetching}
            order={order}
            orderBy={orderBy}
        />
    );
}

export default withI18N(injectIntl(Listing), messages);
