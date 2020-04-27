import React, { useState } from "react";

import AnalysesFilter from "../../../src/components/vice/admin/filter";

export default {
    title: "VICE/admin/AnalysesFilter",
};

export const AnalysesFilterTest = () => {
    const [filters, setFilters] = useState([]);

    const addToFilters = (key, value) =>
        setFilters([...filters, { key, value }]);

    const deleteFromFilters = (filter) =>
        setFilters(
            filters.filter(
                (f) => f.key !== filter.key && f.value !== filter.value
            )
        );

    return (
        <AnalysesFilter
            filters={filters}
            addToFilters={addToFilters}
            deleteFromFilters={deleteFromFilters}
        />
    );
};
