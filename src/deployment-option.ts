/**
 * Specifies the deployment and observability options.
 *
 * The options have different capabilities, licensing, pricing, etc.
 *
 * For more information, see the Dynatrace documentation:
 * [Kubernetes Deployment](https://docs.dynatrace.com/docs/ingest-from/setup-on-k8s/deployment)
 */
export enum DeploymentOption {

  /**
   * Kubernetes platform monitoring
   */
  PLATFORM,

  /**
   * Kubernetes platform monitoring + Application observability
   */
  APPLICATION,

  /**
   * Kubernetes platform monitoring + Application observability + Full-stack observability
   */
  FULL_STACK,
}
