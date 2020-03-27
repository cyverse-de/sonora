/**
 * @author sriram
 *
 *  * A component intended to be the parent to the apps's table view and
 * thumbnail/tile view.
 *
 */
import React from "react";
import { useQuery } from "react-query";
import { getApps } from "../../../serviceFacade/appServiceFacade";

function Listing(props) {
    const { status, data, error } = useQuery("getApps", getApps);
    return (
        <div>
            {status === "loading" ? (
                <span>Loading...</span>
            ) : status === "error" ? (
                <span>Error: {error.message}</span>
            ) : (
                <span>Total: {data.total} </span>
            )}
        </div>
    );
}
export default Listing;

