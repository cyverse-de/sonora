import Box from "@material-ui/core/Box";
import React from "react";
import Rate from "components/rating/Rate";
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: "lib/Rate",
};
export function RatingTest({ readOnly }) {
    const onChange = (event, value) => console.log("new rating:" + value);
    return (
        <>
            <Box component="fieldset" mb={3} borderColor="transparent">
                <Rate
                    value={4.5}
                    total={9999}
                    readOnly={readOnly}
                    onDelete={() => console.log("delete rating")}
                    onChange={onChange}
                    name="Super Rating"
                />
            </Box>
            <Box component="fieldset" mb={3} borderColor="transparent">
                <Rate
                    value={0}
                    total={0}
                    readOnly={readOnly}
                    onChange={onChange}
                    name="No Rating"
                />
            </Box>
            <Box component="fieldset" mb={3} borderColor="transparent">
                <Rate
                    value={3}
                    total={999999}
                    readOnly={readOnly}
                    onChange={onChange}
                    name="Avg Rating"
                />
            </Box>
        </>
    );
}
