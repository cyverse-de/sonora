export const TimeLimitArgType = {
    timeLimit: {
        name: "Time Limit",
        // The time-limit endpoint can return the literal string "null".
        options: ["null", "6d", "3d", "3h", "30m", "2m"],
        control: {
            type: "select",
            labels: {
                "6d": "6 days",
                "3d": "3 days",
                "3h": "3 hours",
                "30m": "30 minutes",
                "2m": "2 minutes",
            },
        },
    },
};

export const convertTimeLimitArgType = (timeLimit) => {
    switch (timeLimit) {
        case "6d":
            return new Date().getTime() / 1000 + 6 * 24 * 60 * 60;
        case "3d":
            return new Date().getTime() / 1000 + 3 * 24 * 60 * 60;
        case "3h":
            return new Date().getTime() / 1000 + 3 * 60 * 60;
        case "30m":
            return new Date().getTime() / 1000 + 30 * 60;
        case "2m":
            return new Date().getTime() / 1000 + 2 * 60;
        default:
            return timeLimit;
    }
};
