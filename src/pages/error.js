/**
 * @author sriram
 *
 * A page that display error to the user.
 *
 *
 */
import React from "react";
import { useRouter } from "next/router";
import ErrorHandler from "../components/error/ErrorHandler";

export default function Error() {
    const router = useRouter();
    const errorInfo = router.query?.errorInfo;
    const errorObj = errorInfo ? JSON.parse(errorInfo) : null;
    return <ErrorHandler errorObject={errorObj} baseId="error" />;
}
