import { Trans } from "react-i18next";

export function getSteps(t) {
    return [
        {
            content: (
                <Trans
                    t={t}
                    i18nKey="dashboard"
                    components={{ ul: <ul />, li: <li /> }}
                />
            ),
            target: ".dashboard-intro",
            placement: "right",
            disableBeacon: true,
            title: t("dashboardTitle"),
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
                    i18nKey="preferences"
                    components={{ ul: <ul />, li: <li /> }}
                />
            ),
            target: ".preferences-intro",
            placement: "right",
            disableBeacon: true,
            title: t("preferencesTitle"),
        },
        {
            content: (
                <Trans
                    t={t}
                    i18nKey="search"
                    components={{ ul: <ul />, li: <li /> }}
                />
            ),
            target: ".search-intro",
            placement: "right",
            disableBeacon: true,
            title: t("searchTitle"),
        },
        {
            content: (
                <Trans
                    t={t}
                    i18nKey="notifications"
                    components={{ ul: <ul />, li: <li /> }}
                />
            ),
            target: ".notifications-intro",
            placement: "bottom",
            disableBeacon: true,
            title: t("notificationTitle"),
        },
        {
            content: (
                <Trans
                    t={t}
                    i18nKey="bag"
                    components={{ ul: <ul />, li: <li /> }}
                />
            ),
            target: ".bag-intro",
            placement: "bottom",
            disableBeacon: true,
            title: t("bagTitle"),
        },
        {
            content: (
                <Trans
                    t={t}
                    i18nKey="support"
                    components={{ ul: <ul />, li: <li /> }}
                />
            ),
            target: ".support-intro",
            placement: "bottom",
            disableBeacon: true,
            title: t("supportTitle"),
        },
    ];
}
