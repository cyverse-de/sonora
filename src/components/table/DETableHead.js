/**
 * @author sriram
 *
 * Custom table header
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import EnhancedTableHead from "components/table/EnhancedTableHead";
export default function DETableHead(props) {
    const { t } = useTranslation("common");
    return (
        <EnhancedTableHead
            selectAllLabel={t("selectAllLabel")}
            sortLabel={t("sortLabel")}
            {...props}
        />
    );
}
