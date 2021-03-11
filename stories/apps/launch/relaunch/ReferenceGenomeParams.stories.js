import React from "react";

import AppLaunchStoryBase from "../AppLaunchStoryBase";
import ReferenceGenomeApp from "../data/ReferenceGenomeApp";
import { initMockAxiosReferenceGenomeListing } from "../data/ReferenceGenomeListing";

export const ReferenceGenomeParamsRelaunch = () => {
    initMockAxiosReferenceGenomeListing();

    const [{ parameters, ...listGroup }] = ReferenceGenomeApp.groups;

    const cacaoValue = {
        created_by: "vaughn@iplantcollaborative.org",
        id: "b7d3e1b7-e1f8-42cb-86b2-4f85e329e42a",
        last_modified_by: "vaughn@iplantcollaborative.org",
        name: "Theobroma cacao [Cocoa bean] (Phytozome 9.0)",
        path:
            "/data2/collections/genomeservices/1.0.0/phytozome/9.0/Theobroma_cacao.Matina_1-6/de_support/",
        created_on: "1382790214000",
        last_modified_on: "1382790214000",
    };

    const dogValue = {
        created_by: "<public>",
        id: "e38b6fae-2e4b-4217-8c1f-6badea3ff7fc",
        last_modified_by: "vaughn@iplantcollaborative.org",
        name: "Canis lupus familiaris [Dog] (Ensembl 14_67)",
        path:
            "/data2/collections/genomeservices/1.0.0/14_67/Canis_lupus_familiaris.CanFam_2.0/de_support/",
        created_on: "1346948048000",
        last_modified_on: "1378823110000",
    };

    const catValue = {
        created_by: "<public>",
        id: "41149e71-4328-4391-b1d2-25fdbdca5a54",
        last_modified_by: "vaughn@iplantcollaborative.org",
        name: "Felis catus [Domestic cat] (Ensembl 14_67)",
        path:
            "/data2/collections/genomeservices/1.0.0/14_67/Felis_catus.CAT/de_support/",
        created_on: "1346948048000",
        last_modified_on: "1378823157000",
    };

    const app = {
        ...ReferenceGenomeApp,
        description:
            'This relaunch story should have the "[Cocoa bean]" preset for' +
            ' the "Reference Genome" field,' +
            ' "[Dog]" preset for the "Reference Sequence" field,' +
            ' and "[Domestic cat]" preset for the "Reference Annotation" field.',
        groups: [
            {
                ...listGroup,
                parameters: parameters.map((param) => {
                    if (param.label === "Reference Genome") {
                        return {
                            ...param,
                            value: cacaoValue,
                            defaultValue: cacaoValue,
                        };
                    }

                    if (param.label === "Reference Sequence") {
                        return {
                            ...param,
                            value: dogValue,
                            defaultValue: dogValue,
                        };
                    }

                    if (param.label === "Reference Annotation") {
                        return {
                            ...param,
                            value: catValue,
                            defaultValue: catValue,
                        };
                    }

                    return param;
                }),
            },
        ],
    };

    return <AppLaunchStoryBase app={app} />;
};
