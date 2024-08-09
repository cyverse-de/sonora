export const TimeLimitArgType = {
    timeLimit: {
        name: "Time Limit",
        // The time-limit endpoint can return the literal string "null".
        options: ["null", "3d", "3h", "30m", "30s"],
        control: {
            type: "select",
            labels: {
                "3d": "3 days",
                "3h": "3 hours",
                "30m": "30 minutes",
                "30s": "30 seconds",
            },
        },
    },
};

export const convertTimeLimitArgType = (timeLimit) => {
    switch (timeLimit) {
        case "3d":
            return new Date().getTime() / 1000 + 3 * 24 * 60 * 60;
        case "3h":
            return new Date().getTime() / 1000 + 3 * 60 * 60;
        case "30m":
            return new Date().getTime() / 1000 + 30 * 60;
        case "30s":
            return new Date().getTime() / 1000 + 30;
        default:
            return timeLimit;
    }
};
