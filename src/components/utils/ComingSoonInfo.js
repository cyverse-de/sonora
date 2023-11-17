/**
 * A "Coming Soon" info display that directs users to the old DE.
 *
 * @author psarando
 */
import React from "react";

import { Trans, useTranslation } from "i18n";
import constants from "../../constants";
import ExternalLink from "components/utils/ExternalLink";

import { Card, CardContent, CardHeader } from "@mui/material";
import Info from "@mui/icons-material/Info";

const ComingSoonInfo = (props) => {
    const { subtitle, children } = props;

    const { t } = useTranslation("common");

    return (
        <Card>
            <CardHeader
                avatar={<Info color="primary" />}
                title={t("comingSoon")}
                subheader={subtitle}
            />
            <CardContent>{children}</CardContent>
            <CardContent>
                {
                    <Trans
                        t={t}
                        i18nKey="useOldDEForThisFeature"
                        components={{
                            oldDELink: (
                                <ExternalLink href={constants.OLD_DE_LINK} />
                            ),
                        }}
                    />
                }
            </CardContent>
        </Card>
    );
};

export default ComingSoonInfo;
