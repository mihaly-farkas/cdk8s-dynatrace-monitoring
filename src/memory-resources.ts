import { Size } from 'cdk8s';

/**
 * Memory resource configuration.
 *
 * For valid values and units of measurement, refer to the corresponding
 * [Memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)
 * documentation.
 */
export interface MemoryResources {

  /**
   * Memory limit value.
   */
  readonly limit?: Size | string | number;

  /**
   * Memory request value.
   */
  readonly request?: Size | string | number;
}
