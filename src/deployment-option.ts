/**
 * Specifies the deployment and observability options.
 *
 * The options have different capabilities, licensing, pricing, etc.
 *
 * For more information, see the Dynatrace documentation:
 * [Observability options](https://docs.dynatrace.com/docs/ingest-from/setup-on-k8s/deployment#observability-options)
 */
export enum DeploymentOption {

  /**
   * Kubernetes platform monitoring
   */
  PLATFORM = 'platform',

  /**
   * Kubernetes platform monitoring + Application observability
   */
  APPLICATION = 'application',
}
