/**
 * @author mian
 *
 * The component that launches a provided instant launch, immediately.
 */
import React from "react";

const InstantLaunchStandalone = (props) => {
    const { id: instant_launch_id } = props;
    return <p>itsa {instant_launch_id}</p>;
};

export default InstantLaunchStandalone;
