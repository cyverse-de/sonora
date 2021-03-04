/**
 * @typedef {object} ContainerStateWaiting
 * @property {string} reason - brief reason the container is not running
 */

/**
 * @typedef {object} ContainerStateTerminated
 * @property {string} reason - brief reason the container terminated
 */

/**
 * @typedef {object} ContainerStateRunning
 * @property {string} startedAt - time the container was last restarted
 */

/**
 * @typedef {object} ContainerStatus
 * @property {ContainerStateWaiting|ContainerStateRunning|ContainerStateTerminated} state
 * @property {string} name - name of the pod or init container
 * @property {int} restartCount - number of times the pod or init container restarted
 * @property {string} image - Docker image
 */

/**
 * @typedef {object} Pod
 * @property {ContainerStatus[]} containerStatuses - pod ContainerStatus objects
 * @property {ContainerStatus[]} initContainerStatuses - init container ContainerStatus objects
 */

/**
 * Container states as determined by the k8s.io library used in app-exposer.
 * The states are the same for init containers and pods.  We use this information
 * to determine whether an init container or pod has an error that
 * we should report to the user.
 *
 * See https://pkg.go.dev/k8s.io/api/core/v1#ContainerState
 */
const ContainerStates = {
    WAITING: "waiting",
    RUNNING: "running",
    TERMINATED: "terminated",
};

/**
 * A list of known error strings that can be returned in the `reason` key of a
 * container state object
 *
 * See https://v1-17.docs.kubernetes.io/docs/tasks/debug-application-cluster/debug-init-containers/
 */
const ContainerErrorReasons = ["CrashLoopBackOff", "Error"];

/**
 * Since the ContainerStates don't directly inform whether the init container
 * or pod has encountered an error, we're creating our own statuses to
 * distinguish the current state
 * @type {{DONE: string, ERROR: string, PENDING: string}}
 */
export const DEContainerStatus = {
    PENDING: "pending",
    DONE: "done",
    ERROR: "error",
};

/**
 * Finds the ContainerStatus object with the containerName.
 * Returns an array with the ContainerStatus and whether it is an init container
 * @param {Pod} pod
 * @param {string} containerName
 * @return {[ContainerStatus, boolean]}
 */
export const findContainerStatus = (pod, containerName) => {
    const podContainerStatus = pod?.containerStatuses?.find(
        (pod) => pod.name === containerName
    );
    if (podContainerStatus) {
        return [podContainerStatus, false];
    }

    const initContainerStatus = pod?.initContainerStatuses?.find(
        (pod) => pod.name === containerName
    );
    if (initContainerStatus) {
        return [initContainerStatus, true];
    }

    return [];
};

/**
 * Helper function to search for a container by name and return the container's
 * status, restart count, and image
 *
 * @param {Pod[]} pods
 * @param {string} containerName - the name of a pod or init container
 * @return {{restartCount, status: (string) DEContainerStatus, image: (string)}}
 */
export function getContainerDetails(pods, containerName) {
    const pod = pods?.[0];
    const [containerStatus, isInitContainer] = findContainerStatus(
        pod,
        containerName
    );
    const containerState = containerStatus?.state || {};
    const keys = Object.keys(containerState);
    const stateKey = keys?.[0];

    const reason = containerState?.[stateKey]?.["reason"];

    let deContainerStatus;

    switch (stateKey) {
        case ContainerStates.RUNNING: {
            deContainerStatus = isInitContainer
                ? DEContainerStatus.PENDING
                : DEContainerStatus.DONE;
            break;
        }

        case ContainerStates.WAITING: {
            deContainerStatus = ContainerErrorReasons.includes(reason)
                ? DEContainerStatus.ERROR
                : DEContainerStatus.PENDING;
            break;
        }

        case ContainerStates.TERMINATED: {
            deContainerStatus = ContainerErrorReasons.includes(reason)
                ? DEContainerStatus.ERROR
                : DEContainerStatus.DONE;
            break;
        }

        default: {
            deContainerStatus = DEContainerStatus.PENDING;
        }
    }

    return {
        status: deContainerStatus,
        restartCount: containerStatus?.restartCount,
        image: containerStatus?.image,
    };
}
