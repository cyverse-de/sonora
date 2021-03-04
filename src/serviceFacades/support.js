import callApi from "../common/callApi";

import { shareAnalyses } from "serviceFacades/sharing";

/**
 *
 * @param supportRequest
 * @return {Promise<*>}
 */
export const sendSupportEmail = ({ supportRequest }) => {
    return callApi({
        endpoint: "/api/support-email",
        method: "POST",
        body: supportRequest,
    });
};

export const submitAnalysisSupportRequest = ({
    analysisSharingRequest,
    supportRequest,
}) => {
    return Promise.all([
        shareAnalyses({ analysisSharingRequest }),
        sendSupportEmail({ supportRequest }),
    ]);
};

export const analysisSupportRequest = (
    from,
    email,
    subject,
    comment,
    {
        id: analysis_id,
        name,
        app_name: app,
        resultfolderid: output_folder,
        status,
        startdate,
        enddate,
    }
) => ({
    email,
    subject,
    fields: {
        from,
        analysis_id,
        name,
        app,
        output_folder,
        status,
        startdate,
        enddate,
        comment,
    },
});
