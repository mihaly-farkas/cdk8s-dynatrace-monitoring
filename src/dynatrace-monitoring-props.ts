import { ActiveGateProps } from './active-gate-props';
import { DeploymentOption } from './deployment-option';
import { OneAgentProps } from './one-agent-props';
import { Tokens } from './tokens';
import { NamespaceProps } from './namespace-props';

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
   * The name of the Kubernetes cluster in Dynatrace.
   *
   * This is used to identify the cluster in the Dynatrace UI. It means also that the DynaKube and Secret resources
   * will be created with this name.
   *
   * @default 'kubernetes-cluster'
   */
  readonly name?: string;

  /**
   * Optional namespace properties.
   */
  readonly namespace?: NamespaceProps;

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
   * Dynatrace access tokens for authentication.
   */
  readonly tokens: Tokens;
}
