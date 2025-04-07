import { CpuResources } from './cpu-resources';
import { MemoryResources } from './memory-resources';

/**
 * CPU and memory resource configuration for the Dynatrace container.
 *
 * These configurations are optional, but can be customized for your deployment needs.
 */
export interface ContainerResources {

  /**
   * CPU configuration for the Dynatrace container.
   */
  readonly cpu?: CpuResources;

  /**
   * Memory configuration for the Dynatrace container.
   */
  readonly memory?: MemoryResources;
}
