import { Capability } from './capability';
import { ContainerResources } from './container-resources';

/**
 * Properties related to ActiveGate configuration in Dynatrace.
 */
export interface ActiveGateProps {

  /**
   * Optional list of additional ActiveGate capabilities to enable.
   *
   * These capabilities extend the functionality of the ActiveGate component.
   * The construct automatically includes essential capabilities like `kubernetes-monitoring`
   * and `routing` based on the selected deployment option, so they do not need to be specified here.
   *
   * Use this property to explicitly enable additional features such as `metrics-ingest` or `dynatrace-api`.
   */
  capabilities?: Capability[];

  /**
   * CPU and memory resource configurations for the ActiveGate pod(s).
   *
   * Resource limits and requests help control how much compute and memory is allocated to ActiveGate.
   * Adjust these values based on your expected load and cluster resource availability.
   *
   * @default Uses predefined default values suitable for most workloads.
   */
  resources?: ContainerResources;
}
