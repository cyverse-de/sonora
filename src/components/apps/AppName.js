/**
 * A component that displays app's name.
 *
 * @author sriram
 */
import React from "react";
import { useTranslation } from "i18n";
import PropTypes from "prop-types";

import Link from "next/link";
import NameLink from "components/utils/NameLink";
import { Highlighter } from "@cyverse-de/ui-lib";
import { useAppLaunchLink } from "./utils";

function AppName(props) {
    const {
        baseDebugId,
        isDisabled,
        name,
        appId,
        systemId,
        searchTerm,
    } = props;
    const { t } = useTranslation("apps");
    let title = "";
    if (isDisabled) {
        title = t("disabledAppTooltip");
    } else {
        title = t("useAppTooltip");
    }
    const [href, as] = useAppLaunchLink(systemId, appId);
    if (!isDisabled) {
        return (
            <Link href={href} as={as} passHref>
                <NameLink
                    name={name}
                    id={baseDebugId}
                    title={title}
                    searchTerm={searchTerm}
                />
            </Link>
        );
    } else {
        return (
            <div tabIndex="0" role="button" id={baseDebugId} title={title}>
                <Highlighter search={searchTerm}>{name}</Highlighter>
            </div>
        );
    }
}
AppName.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onAppNameClicked: PropTypes.func,
    searchText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(RegExp),
    ]),
};
export default AppName;
