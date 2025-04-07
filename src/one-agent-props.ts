import { ContainerResources } from './container-resources';

/**
 * Properties related to OneAgent configuration in Dynatrace.
 */
export interface OneAgentProps {

  /**
   * CPU and memory resource configurations for the OneAgent pod(s).
   *
   * Resource limits and requests help control how much compute and memory is allocated to OneAgent.
   * Adjust these values based on your expected load and cluster resource availability.
   *
   * @default Uses predefined default values suitable for most workloads.
   */
  resources?: ContainerResources;
}
