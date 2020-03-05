import callApi from "../common/callApi";

function getDataRoots(key) {
    return callApi({ endpoint: `/api/filesystem/root` });
}

//${path}&limit=${rowsPerPage}&sort-col=${orderBy}&sort-dir=${order}&offset=${rowsPerPage *
//                     page}
function getDataListing(key, { path, rowsPerPage, orderBy, order, page }) {
    return callApi({
        endpoint: `/api/filesystem/paged-directory?path=${path}&limit=${rowsPerPage}&sort-col=${orderBy}&sort-dir=${order}&offset=${rowsPerPage *
            page}`,
    });
}

export { getDataRoots, getDataListing };
