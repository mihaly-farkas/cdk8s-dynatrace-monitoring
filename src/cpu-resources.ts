import { Cpu } from 'cdk8s-plus-32';

/**
 * CPU resource configuration for Dynatrace monitoring.
 *
 * For valid values and units of measurement, refer to the corresponding
 * [Memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)
 * documentation.
 */
export interface CpuResources {

  /**
   * CPU limit value.
   */
  readonly limit?: Cpu | string | number;

  /**
   * CPU request value.
   */
  readonly request?: Cpu | string | number;
}
