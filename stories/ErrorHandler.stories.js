import React from "react";
import ErrorHandler from "../src/components/utils/error/ErrorHandler";

const errorResponse = {
    data: {
        error_code: "ERR_ILLEGAL_ARGUMENT",
        reason: {
            sortfield: "disallowed-key",
        },
    },
    status: 400,
    statusText: "Bad Request",
    headers: {
        connection: "keep-alive",
        "content-length": "77",
        "content-type": "application/json; charset=utf-8",
        date: "Tue, 21 Apr 2020 08:51:22 GMT",
        etag: 'W/"4d-DGj9xs+ftEbvtNhFlVhDEbAXxQo"',
        "x-powered-by": "Express",
    },
    config: {
        url:
            '/api/analyses?limit=25&sortfield=startdate&sort-dir=DESC&offset=0&filter=[{"field":"parent_id","value":""},{"field":"ownership","value":"all"}]',
        method: "get",
        headers: {
            Accept: "application/json, text/plain, *!/!*",
        },
        transformRequest: [null],
        transformResponse: [null],
        timeout: 20000,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        maxContentLength: -1,
        credentials: "include",
    },
    request: {},
};

const errorObject = {
    message: "Request failed with status code 400",
    name: "Error",
    stack:
        "Error: Request failed with status code 400\n    at createError (http://localhost:3000/_next/static/development/pages/analyses.js?ts=1587458580850:203736:15)\n    at settle (http://localhost:3000/_next/static/development/pages/analyses.js?ts=1587458580850:203997:12)\n    at XMLHttpRequest.handleLoad (http://localhost:3000/_next/static/development/pages/analyses.js?ts=1587458580850:203205:7)",
    config: {
        url:
            '/api/analyses?limit=25&sortfield=startdate&sort-dir=DESC&offset=0&filter=[{"field":"parent_id","value":""},{"field":"ownership","value":"all"}]',
        method: "get",
        headers: {
            Accept: "application/json, text/plain, *!/!*",
        },
        transformRequest: [null],
        transformResponse: [null],
        timeout: 20000,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        maxContentLength: -1,
        credentials: "include",
    },
    response: errorResponse,
};

const loginErrorResponse = {
    data: {
        error_code: "ERR_NOT_AUTHORIZED",
        reason: "No authentication information found in request.",
    },
    status: 401,
    statusText: "Internal Server Error",
    headers: {
        connection: "keep-alive",
        "content-length": "94",
        "content-type": "application/json; charset=utf-8",
        date: "Tue, 21 Apr 2020 14:05:44 GMT",
        etag: 'W/"5e-9SP9RtM3QQRwZ3UNFelGCk5ZHaI"',
        "x-powered-by": "Express",
    },
    config: {
        url: "/api/apps/categories?public=false",
        method: "get",
        headers: { Accept: "application/json, text/plain, */*" },
        transformRequest: [null],
        transformResponse: [null],
        timeout: 20000,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        maxContentLength: -1,
        credentials: "include",
    },
    request: {},
};

const loginErrorObject = {
    message: "Request failed with status code 401",
    name: "Error",
    stack:
        "Error: Request failed with status code 401\n    at createError (http://localhost:3000/_next/static/development/pages/_app.js?ts=1587477886272:196870:15)\n    at settle (http://localhost:3000/_next/static/development/pages/_app.js?ts=1587477886272:197131:12)\n    at XMLHttpRequest.handleLoad (http://localhost:3000/_next/static/development/pages/_app.js?ts=1587477886272:196339:7)",
    config: {
        url: "/api/apps/categories?public=false",
        method: "get",
        headers: { Accept: "application/json, text/plain, */*" },
        transformRequest: [null],
        transformResponse: [null],
        timeout: 20000,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        maxContentLength: -1,
        credentials: "include",
    },
    response: loginErrorResponse,
};
const errorCodes = ["empty", "401", "500"];
export default {
    title: "Error Handler",
    component: ErrorHandler,
    argTypes: {
        errorCode: {
            control: {
                type: "select",
                options: errorCodes,
            },
        },
    },
};

export function ErrorHandlerTest({ errorCode }) {
    const value = errorCodes.find((e) => e === errorCode);
    let errObj = null;
    if (value === "401") {
        errObj = loginErrorObject;
    } else if (value === "500") {
        errObj = errorObject;
    }

    return <ErrorHandler errorObject={errObj} baseId="errorBase" />;
}
