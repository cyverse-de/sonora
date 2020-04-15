/**
 *
 * @author sriram, aramsey
 */
import React from "react";
import DataStore from "./ds/[...pathItems]";

/**
 *
 * Handle default routing to /data
 *
 */
export default function Data() {
    return (
        <DataStore/>
    );
}
