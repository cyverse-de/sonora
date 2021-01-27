const BETA_ATTR = "n2t.net/ark:/99152/h1459";
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
};
