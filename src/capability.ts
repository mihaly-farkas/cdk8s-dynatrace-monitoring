/**
 * Represents optional ActiveGate capabilities that can be enabled for Dynatrace monitoring.
 *
 * These capabilities enhance monitoring functionality by enabling specific ActiveGate features.
 *
 * Note that core capabilities like `kubernetes-monitoring` and `routing` are added automatically
 * by the construct based on the selected deployment option.
 */
export enum Capability {

  /**
   * Enables the Dynatrace API endpoint on ActiveGate, allowing Kubernetes pods to interact with the Dynatrace API.
   *
   * This is required for scenarios where agents or services within the cluster need to push
   * or query data via the Dynatrace API through the ActiveGate.
   */
  DYNATRACE_API = 'dynatrace-api',

  /**
   * Enables the metrics ingest endpoint on ActiveGate and configures pods to redirect metrics to it.
   *
   * This capability is required for collecting Prometheus metrics or custom metrics from pods
   * outside the Dynatrace namespace.
   */
  METRICS_INGEST = 'metrics-ingest',
}
