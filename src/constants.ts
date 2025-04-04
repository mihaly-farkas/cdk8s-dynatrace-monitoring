/**
 * @fileoverview This file contains constants necessary for Dynatrace Kubernetes monitoring.
 *
 * @module cdk8s-dynatrace-kubernetes-monitoring
 */

/**
 * The default name for the DynaKube custom resource.
 *
 * DynaKube is the primary resource for configuring and managing Dynatrace monitoring on Kubernetes clusters.
 */
export const DEFAULT_DYNA_KUBE_NAME = 'dynakube';

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
 * The default namespace in Kubernetes for deploying Dynatrace components.
 *
 * This namespace is used by the Dynatrace operator and other related resources unless a custom namespace is specified.
 */
export const DEFAULT_NAMESPACE = 'dynatrace';
