/**
 * @author psarando
 */

import React from "react";

import { Trans } from "i18n";
import constants from "../../constants";

import { WARNING } from "components/announcer/AnnouncerConstants";
import { announce } from "components/announcer/CyVerseAnnouncer";
import ExternalLink from "components/utils/ExternalLink";

/**
 * An announcer to display a message when a subscription does not allow sharing.
 *
 * @param t - The i18n translation function returned by `useTranslation`.
 *            The `common` namespace is required.
 */
const announcePlanCannotShare = (t) =>
    announce({
        text: (
            <Trans
                t={t}
                i18nKey="common:sharingNotAvailable"
                components={{
                    subscriptionLink: (
                        <ExternalLink href={constants.SUBSCRIBE_URL} />
                    ),
                }}
            />
        ),
        variant: WARNING,
    });

export default announcePlanCannotShare;
