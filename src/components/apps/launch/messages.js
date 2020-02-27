const helpMsgResourceRequirements = `These Resource Requirements may be adjusted so that the analysis is submitted with requests for larger minimum resources.
Note that this may cause the analysis to wait longer in the submission queue until a node that matches those minimum requirements becomes available.
So generally it is advisable to leave the resource requests set to the defaults that the tool or app integrator has set.`;

export default {
    locales: "en-us",
    messages: {
        analysisInfo: "Analysis Info",
        analysisName: "Analysis Name",
        analysisParameters: "Analysis Parameters",
        back: "Back",
        comments: "Comments",
        helpMsgResourceRequirements,
        launchAnalysis: "Launch Analysis",
        launchOrSaveAsQL: "Launch or Save as Quick Launch",
        minDiskSpace: "Minimum Disk Space",
        minCPUCores: "Minimum CPU Cores",
        minMemory: "Minimum Memory",
        newAnalysisName: "{appName} analysis1",
        next: "Next",
        outputFolder: "Output Folder",
        parameters: "Parameters",
        required: "Required",
        resourceRequirements: "Resource Requirements",
        resourceRequirementsForStep: "Resource Requirements for Step {step}",
        retainInputsLabel:
            "Retain inputs? Enabling this flag will copy all the input files into the analysis result folder.",
        reviewAndLaunch: "Review and Launch",
        stepLabel: "Step {step}: {label}",
    },
};
