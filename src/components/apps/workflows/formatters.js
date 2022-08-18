/**
 * Formatting and init functions for Workflow forms and submissions.
 *
 * @author psarando
 */
import { groupBy } from "common/functions";

/**
 * Formats the incoming workflow JSON for use in the form.
 *
 * @param {Object} appDescription The workflow JSON fetched from the service.
 * @param {Object[]} appDescription.steps The workflow app steps.
 * @param {Object[]} appDescription.tasks The app tasks associated with each step.
 * @param {Object[]} appDescription.mappings The input/output mappings.
 *
 * @returns A workflow with steps formatted for use in the form.
 */
export const initWorkflowValues = (appDescription) => {
    const { steps, tasks, mappings, version, version_id } =
        appDescription || {};

    // First format each task by adding a source step key to each output.
    let formattedTasks = tasks?.map((task) => ({
        ...task,
        outputs: task?.outputs?.map((output) => ({
            ...output,
            step: steps?.findIndex((step) => task.id === step.task_id),
        })),
    }));

    // Create a reference of all outputs for use in formatting input mappings.
    const availableOutputs = formattedTasks
        ?.map(({ outputs }) => outputs)
        .flat();

    // Format each input by adding an output key,
    // looking up the output with the input/output mappings.
    formattedTasks = formattedTasks?.map((task) => ({
        ...task,
        inputs: task.inputs?.map((input) => ({
            ...input,
            output:
                availableOutputs?.find((output) =>
                    mappings?.find(
                        (ioMap) =>
                            ioMap.source_step === output.step &&
                            ioMap.map[input.id] === output.id
                    )
                ) || "",
        })),
    }));

    // Finally associate the formatted task with the appropriate step,
    // so the form will only need to use the formatted information in each step.
    return {
        // The workflowSteps array is only required for preserving touched state
        // after onSubmit:
        // https://github.com/formium/formik/issues/445#issuecomment-366952762
        workflowSteps: [null, null, null, null],

        ...appDescription,

        // If the version_id is empty, then keep the version label empty as well,
        // to force the user to enter a new version label.
        version: version_id ? version : "",

        steps:
            steps?.map((step) => ({
                ...step,
                task: formattedTasks?.find((task) => task.id === step.task_id),
            })) || [],
    };
};

/**
 * Formats the workflow values from the form for submission to the service.
 *
 * @param {Object} workflow The workflow values from the form.
 * @returns A workflow JSON formatted for submission to the service.
 */
export const formatWorkflowSubmission = (workflow) => {
    const { id, name, version, version_id, description, steps } = workflow;

    // Build the mappings array from the formatted task inputs in each step.
    const mappings = steps
        .map((step, target_step) => {
            // First group each input (that has a mapped output)
            // by its output's source step number.
            const srcMap = groupBy(
                step.task?.inputs?.filter(({ output }) => output),
                ({ output }) => output.step
            );

            // Format the grouped inputs into the array of mapping objects
            // accepted by the service.
            // [{source_step, target_step, map: {"input_id": "output_id"}}]
            return Object.keys(srcMap).map((source_step) => ({
                // The groupBy function turns source_step keys into strings.
                source_step: parseInt(source_step, 10),
                target_step,
                map: srcMap[source_step].reduce((map, { id, output }) => {
                    map[id] = output.id;
                    return map;
                }, {}),
            }));
        })
        .flat();

    // Return only the fields required in the submission.
    return {
        id,
        name,
        version,
        version_id,
        description,
        mappings,
        steps: steps.map(
            ({ name, description, system_id, task_id, app_type }) => ({
                name,
                description,
                system_id,
                task_id,
                app_type,
            })
        ),
    };
};
