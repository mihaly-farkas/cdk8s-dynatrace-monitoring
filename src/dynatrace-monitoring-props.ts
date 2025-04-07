import { ActiveGateProps } from './active-gate-props';
import { DeploymentOption } from './deployment-option';
import { MetadataProps } from './metadata-props';
import { OneAgentProps } from './one-agent-props';
import { Tokens } from './tokens';

/**
 * Configuration options for setting up Dynatrace monitoring on Kubernetes.
 */
export interface DynatraceMonitoringProps {

  /**
   * Optional ActiveGate configuration.
   */
  readonly activeGate?: ActiveGateProps;

  /**
   * Dynatrace API endpoint URL.
   */
  readonly apiUrl: string;

  /**
   * Deployment mode for Dynatrace monitoring.
   */
  readonly deploymentOption: DeploymentOption;

  /**
   * Optional host group name to assign to monitored hosts.
   *
   * Host groups are used in Dynatrace to logically group and manage hosts for easier configuration and monitoring.
   * This is especially useful for applying targeted settings, such as naming rules, management zones, etc.
   *
   * If specified, the value will be passed to the Dynatrace operator to tag the hosts accordingly.
   *
   * For more details, refer to the Dynatrace documentation:
   * [Organize your environment using host groups](https://docs.dynatrace.com/docs/observe/infrastructure-monitoring/hosts/configuration/organize-your-environment-using-host-groups)
   *
   * @default undefined
   */
  readonly hostGroup?: string;

  /**
   * The name of the Kubernetes namespace the Dynatrace resources to deploy to.
   *
   * @default 'dynatrace'
   */
  readonly namespaceName?: string;

  /**
   * Additional metadata properties for the Kubernetes namespace.
   *
   * Ignored if `skipNamespaceCreation` is true.
   */
  readonly namespaceProps?: MetadataProps;

  /**
   * Optional resource settings for OneAgent in full-stack mode.
   */
  readonly oneAgent?: OneAgentProps;

  /**
   * Whether to skip SSL certificate validation for the Dynatrace API endpoint.
   *
   * This can be useful for testing or when using self-signed certificates, but is not recommended in production
   * environments due to security concerns.
   *
   * @default false
   */
  readonly skipCertCheck?: boolean;

  /**
   * Whether to skip the creation of the Kubernetes namespace.
   *
   * If true, `namespaceProps` will not be used as the namespace name and assuming that the namespace already exists.
   *
   * @default false
   */
  readonly skipNamespaceCreation?: boolean;

  /**
   * Dynatrace access tokens for authentication.
   */
  readonly tokens: Tokens;
}
