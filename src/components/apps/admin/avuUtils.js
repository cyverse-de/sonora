const BETA_ATTR = "n2t.net/ark:/99152/h1459";
const BLESSED_ATTR = "cyverse-blessed";

export const betaAVU = {
    avus: [
        {
            attr: BETA_ATTR,
            value: "beta",
            unit: "",
            avus: [
                { attr: "rdfs:label", value: "releaseStatus", unit: "attr" },
            ],
        },
    ],
};

export const removeBetaAVU = (appAVUs) => {
    if (appAVUs && appAVUs.length > 0) {
        const updatedAVUs = appAVUs.filter((avu) => avu.attr !== BETA_ATTR);
        return updatedAVUs;
    }
    return appAVUs;
};

export const findBlessedAVU = (appAVUs) => {
    let blessedAVU = null;
    if (appAVUs && appAVUs.length > 0) {
        blessedAVU = appAVUs.find((avu) => avu.attr === BLESSED_ATTR);
    }
    return blessedAVU;
};

export const getBlessedAVU = (id, isBlessed) => {
    if (id) {
        return {
            avus: [{ id, attr: BLESSED_ATTR, value: `${isBlessed}`, unit: "" }],
        };
    } else {
        return {
            avus: [
                {
                    attr: BLESSED_ATTR,
                    value: `${isBlessed}`,
                    unit: "",
                },
            ],
        };
    }
};
