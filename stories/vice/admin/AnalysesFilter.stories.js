import React, { useState } from "react";

import RowFilter from "../../../src/components/vice/admin/filter";

export default {
    title: "VICE/admin/RowFilter",
};

export const RowFilterTest = () => {
    const [filters, setFilters] = useState({});

    const addToFilters = (key, value) =>
        setFilters({ ...filters, [key]: value });

    const deleteFromFilters = (key) => {
        const { [key]: _, ...deletedFrom } = filters;
        setFilters(deletedFrom);
    };
    return (
        <RowFilter
            filters={filters}
            addToFilters={addToFilters}
            deleteFromFilters={deleteFromFilters}
        />
    );
};
