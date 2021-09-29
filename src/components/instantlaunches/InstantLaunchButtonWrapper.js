/**
 * @author aramsey
 *
 * A component meant to wrap any other clickable element that should launch
 * an instant launch.
 *
 * The render component will be passed an `onClick` function.
 * The `onClick` function will handle launching the instant launch and
 * briefly displaying the Submission dialog to the user.
 */
import React from "react";

import { useMutation } from "react-query";

import { useDefaultOutputDir } from "components/data/utils";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import { getHost } from "components/utils/getHost";
import constants from "constants.js";
import { InstantLaunchSubmissionDialog } from "./index";
import { instantlyLaunch } from "serviceFacades/instantlaunches";

function InstantLaunchButtonWrapper(props) {
    const { instantLaunch, resource = {}, render, showErrorAnnouncer } = props;
    const output_dir = useDefaultOutputDir();

    const [open, setOpen] = React.useState(false);
    const [ilUrl, setIlUrl] = React.useState();

    React.useEffect(() => {
        if (ilUrl) {
            window.open(`${getHost()}${ilUrl}`);
            setIlUrl(null);
            setOpen(false);
        }
    }, [ilUrl]);

    const { mutate: launch } = useMutation(instantlyLaunch, {
        onSuccess: (listing) => {
            if (listing.analyses.length > 0) {
                const analysis = listing.analyses[0];
                if (analysis.interactive_urls.length > 0) {
                    setIlUrl(
                        `${constants.VICE_LOADING_PAGE}/${encodeURIComponent(
                            analysis.interactive_urls[0]
                        )}`
                    );
                } else {
                    setOpen(false);
                }
            } else {
                setOpen(false);
            }
        },
        onError: (err) => {
            setOpen(false);
            showErrorAnnouncer(err.message, err);
        },
    });

    const onClick = () => {
        setOpen(true);
        launch({ instantLaunch, resource, output_dir });
    };

    return (
        <>
            {render(onClick)}
            <InstantLaunchSubmissionDialog open={open} />
        </>
    );
}

export default withErrorAnnouncer(InstantLaunchButtonWrapper);
