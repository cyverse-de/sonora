import React from "react";
import DEPagination from "../src/components/utils/DEPagination";

export default { title: "Pagination" };

export function PaginationTest() {
    return (
        <DEPagination
            page={10}
            totalPages={50}
            pageSize={100}
            onChange={(event, newPage) => console.log("new page=>" + newPage)}
            onPageSizeChange={(newPageSize) =>
                console.log("new page size=>" + newPageSize)
            }
        />
    );
}
