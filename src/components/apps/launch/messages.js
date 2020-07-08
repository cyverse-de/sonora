import DataI18N from "../../data/messages";

const {
    validationEmptyDiskResourceName,
    validationDiskResourceName,
    validationInvalidCharacters,
} = DataI18N.messages;

const helpMsgResourceRequirements = `Resource Requirements may be adjusted so that the analysis is submitted with requests for larger minimum resources.
Note that this may cause the analysis to wait longer in the submission queue until a node that matches those minimum requirements becomes available.
So generally it is advisable to leave the resource requests set to the defaults that the tool or app integrator has set.`;

const hpcAppWaitTimes = `<p>
This application runs on XSEDE, the U.S. National Supercomputing Network.
Analyses run on this system enter a queue that includes many non-CyVerse users.
Wait times for your analyses (jobs) to submit and run may be up to several days for large-memory applications.
Please do not resubmit your analysis.
If the status of your analysis has not changed from Submitted to Running after several days,
<support>contact support</support>.
To learn more about HPC apps, see
<hpc>Using HPC Apps in the DE</hpc>.
</p>
<p>
Apply for your own XSEDE allocation to gain access to additional resources at
<xsede>XRAS - Submit Allocation Request</xsede>.
Access to this powerful system is made available to CyVerse users at no cost through a grant from the National Science Foundation.
</p>`;

export default {
    locales: "en-us",
    messages: {
        advancedSettings: "Advanced Settings (optional)",
        analysisInfo: "Analysis Info",
        analysisName: "Analysis Name",
        analysisParameters: "Analysis Parameters",
        appDeprecated:
            "This application has been deprecated." +
            " If you need access to it, please" +
            " <support>contact support</support>.",
        appLoadingError: "Unable to load App. Please try again later.",
        appParamsDeprecated:
            "This application uses 1 or more parameters that have been deprecated." +
            " If you still need access to this application, please" +
            " <support>contact support</support>.",
        appUnavailable: "This app is temporarily unavailable.",
        back: "Back",
        browse: "Browse",
        clearInput: "Clear Input",
        comments: "Comments",
        delete: "Delete",
        errorLoadingReferenceGenomes: "Error loading Reference Genomes",
        helpMsgResourceRequirements,
        hpcAppWaitTimes,
        launchAnalysis: "Launch Analysis",
        launchOrSaveAsQL: "Launch or Save as Quick Launch",
        minDiskSpace: "Minimum Disk Space",
        minCPUCores: "Minimum CPU Cores",
        minMemory: "Minimum Memory",
        multiInputEmptyLabel: 'Select the "Browse" button to add inputs.',
        newAnalysisName: "{appName} analysis1",
        name: "Name",
        next: "Next",
        outputFolder: "Output Folder",
        parameters: "Parameters",
        required: "Required",
        resourceRequirements: "Resource Requirements",
        resourceRequirementsForStep: "Resource Requirements for Step {step}",
        retainInputsLabel:
            "Retain inputs? Enabling this flag will copy all the input files into the analysis result folder.",
        reviewAndLaunch: "Review and Launch",
        saveAsQuickLaunch: "Save as Quick Launch",
        showAllParameters: "Show All Parameters",
        showAllParametersHelpText:
            "Turn off to hide parameters without values entered or selected.",
        stepLabel: "Step {step}: {label}",
        validationAbove: "Must be greater than {min}",
        validationBelow: "Must be less than {max}",
        validationRange: "Must be between {min} and {max}",
        validationCharLimit: "Cannot exceed {limit} characters",
        validationRegex: "Does not match the expression {regexPattern}",
        validationDiskResourceName,
        validationEmptyDiskResourceName,
        validationInvalidCharacters,
        validationUnixGlob:
            'Can not start with a slash ("/") and can not contain a parent directory pattern ("../")',
    },
};
