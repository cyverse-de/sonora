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
import SignInDialog from "components/utils/SignInDialog";
import constants from "constants.js";
import { useUserProfile } from "contexts/userProfile";
import { InstantLaunchSubmissionDialog } from "./index";
import { instantlyLaunch } from "serviceFacades/instantlaunches";
import { useTranslation } from "i18n";
import { Trans } from "react-i18next";
import { Link } from "@material-ui/core";
import { useConfig } from "contexts/config";

function InstantLaunchButtonWrapper(props) {
    const {
        instantLaunch,
        computeLimitExceeded,
        resource = {},
        render,
        showErrorAnnouncer,
    } = props;
    const [config] = useConfig();
    const output_dir = useDefaultOutputDir();
    const [userProfile] = useUserProfile();

    const [open, setOpen] = React.useState(false);
    const [signInDlgOpen, setSignInDlgOpen] = React.useState(false);
    const [ilUrl, setIlUrl] = React.useState();

    const { t } = useTranslation("launch");

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

    const computeLimitExceededMsg = (
        <Trans
            t={t}
            i18nKey="computeLimitExceeded"
            components={{
                buy: (
                    <Link
                        component="button"
                        onClick={() => {
                            window.open(
                                config?.subscriptions?.checkout_url,
                                "_blank"
                            );
                        }}
                    />
                ),
            }}
        />
    );

    const onClick = () => {
        if (userProfile?.id) {
            if (computeLimitExceeded) {
                showErrorAnnouncer(computeLimitExceededMsg);
            } else {
                setOpen(true);
                launch({ instantLaunch, resource, output_dir });
            }
        } else {
            setSignInDlgOpen(true);
        }
    };

    return (
        <>
            {render(onClick)}
            <InstantLaunchSubmissionDialog open={open} />
            <SignInDialog
                open={signInDlgOpen}
                handleClose={() => setSignInDlgOpen(false)}
            />
        </>
    );
}

export default withErrorAnnouncer(InstantLaunchButtonWrapper);
