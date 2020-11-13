import { Trans } from "react-i18next";

export function getSteps(t) {
    return [
        {
            content: (
                <Trans
                    t={t}
                    i18nKey="analyses"
                    components={{ ul: <ul />, li: <li /> }}
                />
            ),
            target: ".analyses-intro",
            placement: "right",
            disableBeacon: true,
            title: t("analysesTitle"),
        },
        {
            content: (
                <Trans
                    t={t}
                    i18nKey="apps"
                    components={{ ul: <ul />, li: <li /> }}
                />
            ),
            target: ".apps-intro",
            placement: "right",
            disableBeacon: true,
            title: t("appsTitle"),
        },
        {
            content: (
                <Trans
                    t={t}
                    i18nKey="data"
                    components={{ ul: <ul />, li: <li /> }}
                />
            ),
            target: ".data-intro",
            placement: "right",
            disableBeacon: true,
            title: t("dataTitle"),
        },
    ];
}
