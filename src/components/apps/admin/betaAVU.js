const BETA_ATTR = "n2t.net/ark:/99152/h1459";
export const betaAVU = {
    avus: [
        {
            attr: BETA_ATTR,
            unit: "",
            value: "beta",
            avus: [
                { attr: "rdfs:label", unit: "attr", value: "releaseStatus" },
            ],
        },
    ],
};

export const removeBetaAVU = (appAVUs) => {
    if (appAVUs && appAVUs.length > 0) {
        const updatedAVUs = appAVUs.filter((avu) => avu.attr !== BETA_ATTR);
        return updatedAVUs;
    }
};
