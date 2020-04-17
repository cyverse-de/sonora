/**
 *
 * @author sriram, aramsey
 */
import React from "react";
import DataStore from "./[...pathItems]";

/**
 *
 * Handle default routing to /data/ds
 *
 * Go directly to the dynamic path
 */
export default function Data() {
    return <DataStore />;
}
