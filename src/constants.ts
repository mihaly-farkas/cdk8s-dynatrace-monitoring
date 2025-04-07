/**
 * The default name of the Kubernetes cluster in Dynatrace.
 */
export const DEFAULT_NAME = 'kubernetes-cluster';

/**
 * The default CPU limit for the ActiveGate resource in Dynatrace monitoring.
 *
 * This value represents the maximum amount of CPU the ActiveGate container can consume.
 * The value is in millicores (m), where '1000m' equals 1 CPU core.
 */
export const DEFAULT_ACTIVE_GATE_CPU_LIMIT = '1000m';

/**
 * The default CPU request for the ActiveGate resource in Dynatrace monitoring.
 *
 * This value represents the amount of CPU the ActiveGate container is guaranteed to have at startup.
 * The value is in millicores (m), where '500m' equals 0.5 of a CPU core.
 */
export const DEFAULT_ACTIVE_GATE_CPU_REQUEST = '500m';

/**
 * The default memory limit for the ActiveGate resource in Dynatrace monitoring.
 *
 * This value specifies the maximum amount of memory the ActiveGate container can use.
 * The value is in GiB (Gibibytes), where '1.5Gi' equals 1.5 GiB.
 */
export const DEFAULT_ACTIVE_GATE_MEMORY_LIMIT = '1.5Gi';

/**
 * The default memory request for the ActiveGate resource in Dynatrace monitoring.
 *
 * This value represents the amount of memory the ActiveGate container is guaranteed to have at startup.
 * The value is in MiB (Mebibytes), where '512Mi' equals 512 MiB.
 */
export const DEFAULT_ACTIVE_GATE_MEMORY_REQUEST = '512Mi';

/**
 * The default CPU request for the OneAgent container in Dynatrace monitoring.
 *
 * This value represents the amount of CPU the OneAgent container is guaranteed to have at startup.
 */
export const DEFAULT_ONE_AGENT_CPU_REQUEST = '100m';

/**
 * The default memory request for the OneAgent container in Dynatrace monitoring.
 *
 * This value represents the amount of memory the OneAgent container is guaranteed to have at startup.
 */
export const DEFAULT_ONE_AGENT_MEMORY_REQUEST = '512Mi';

/**
 * The default CPU limit for the OneAgent container in Dynatrace monitoring.
 *
 * This value represents the maximum amount of CPU the OneAgent container can consume.
 */
export const DEFAULT_ONE_AGENT_CPU_LIMIT = '300m';

/**
 * The default memory limit for the OneAgent container in Dynatrace monitoring.
 *
 * This value represents the maximum amount of memory the OneAgent container can use.
 */
export const DEFAULT_ONE_AGENT_MEMORY_LIMIT = '1.5Gi';


/**
 * The default namespace in Kubernetes for deploying Dynatrace components.
 *
 * This namespace is used by the Dynatrace operator and other related resources unless a custom namespace is specified.
 */
export const DEFAULT_NAMESPACE = 'dynatrace';
