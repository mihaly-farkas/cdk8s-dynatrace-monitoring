import { Construct } from 'constructs';
import { Namespace, Secret } from 'cdk8s-plus-32';
import { ApiObjectMetadata } from 'cdk8s';
import { DeploymentOption } from './deployment-option';
import { DynatraceSecret } from './dynatrace-kubernetes-monitoring-constructs';

const DEFAULT_NAMESPACE = 'dynatrace';

type NamespaceProps = Omit<ApiObjectMetadata, 'name' | 'namespace'>;

/**
 * Properties for configuring Dynatrace Kubernetes monitoring.
 */
export interface DynatraceKubernetesMonitoringProps {

  /**
   * The deployment option for Dynatrace monitoring.
   */
  readonly deploymentOption: DeploymentOption;

  /**
   * The name of the namespace.
   *
   * If not specified, the `dynatrace` name will be used.
   *
   * @default - The `dynatrace` namespace will be used.
   */
  readonly namespace?: string;

  /**
   * Properties for the namespace to be created.
   *
   * If {@link skipNamespaceCreation} is set to `true`, this property will be ignored.
   */
  readonly namespaceProps?: NamespaceProps;


  /**
   * Whether to skip the creation of the Dynatrace monitoring namespace.
   *
   * If set to `true`, the namespace will not be created automatically, and we assume that the user has already created
   * it.
   *
   * @default false
   */
  readonly skipNamespaceCreation?: boolean;

  readonly tokens: {

    /**
     * The API token for Dynatrace monitoring.
     */
    readonly apiToken: string;
  };
}

/**
 * Sets up Dynatrace monitoring for a Kubernetes cluster.
 *
 * ...
 */
export class DynatraceKubernetesMonitoring extends Construct {

  public readonly namespace?: Namespace;

  public readonly namespaceName: string;

  public readonly secret: Secret;

  /**
   * Instantiates a new Dynatrace Kubernetes monitoring instance.
   *
   * @param scope The scope in which this construct is defined.
   * @param id The id of the construct.
   * @param props The properties of the construct.
   */
  constructor(scope: Construct, id: string, props: DynatraceKubernetesMonitoringProps) {
    super(scope, id);

    this.namespaceName = props.namespace ?? DEFAULT_NAMESPACE;

    this.namespace = props.skipNamespaceCreation !== true
      ? this.createNamespace(this.namespaceName, props.namespaceProps)
      : undefined;

    this.secret = this.createSecret(this.namespaceName, props.tokens.apiToken);
  }


  /**
   * Creates the namespace for Dynatrace monitoring if required.
   *
   * If {@link skipNamespaceCreation} is set to `false` or not provided, the namespace is created with the default name
   * (see: {@link DEFAULT_NAMESPACE}).
   * If {@link skipNamespaceCreation} is `true`, no namespace is created.
   *
   * @param name The name of the namespace to create.
   * @param namespaceProps The properties for the namespace to be created.
   * @returns The created Namespace.
   */
  private createNamespace(name: string, namespaceProps?: NamespaceProps): Namespace {
    return new Namespace(this, 'Namespace', {
      metadata: {
        name,
        ...namespaceProps,
      },
    });
  }

  private createSecret(namespace: string, apiToken: string): Secret {
    return new DynatraceSecret(this, 'Secret', {
      apiToken,
      metadata: {
        namespace: namespace,
      },
    });
  }
}
