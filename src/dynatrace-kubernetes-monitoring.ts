import { Construct } from 'constructs';
import { Namespace } from 'cdk8s-plus-32';
import { ApiObjectMetadata } from 'cdk8s';

const DEFAULT_NAMESPACE = 'dynatrace';

/**
 * Properties for configuring Dynatrace Kubernetes monitoring.
 */
export interface DynatraceKubernetesMonitoringProps {

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
  readonly namespaceProps?: Omit<ApiObjectMetadata, 'name' | 'namespace'>;


  /**
   * Whether to skip the creation of the Dynatrace monitoring namespace.
   *
   * If set to `true`, the namespace will not be created automatically, and we assume that the user has already created
   * it.
   *
   * @default false
   */
  readonly skipNamespaceCreation?: boolean;
}

/**
 * Sets up Dynatrace monitoring for a Kubernetes cluster.
 *
 * ...
 */
export class DynatraceKubernetesMonitoring extends Construct {

  public readonly namespace?: Namespace;

  private readonly props: DynatraceKubernetesMonitoringProps;

  /**
   * Instantiates a new Dynatrace Kubernetes monitoring instance.
   *
   * @param scope The scope in which this construct is defined.
   * @param id The id of the construct.
   * @param props The properties of the construct.
   */
  constructor(scope: Construct, id: string, props: DynatraceKubernetesMonitoringProps = {}) {
    super(scope, id);

    this.props = props;

    this.namespace = this.createNamespace(props);
  }

  public get namespaceName() {
    return this.namespace?.name ?? this.props.namespace ?? DEFAULT_NAMESPACE;
  }

  /**
   * Creates the namespace for Dynatrace monitoring if required.
   *
   * If {@link skipNamespaceCreation} is set to `false` or not provided, the namespace is created with the default name
   * (see: {@link DEFAULT_NAMESPACE}).
   * If {@link skipNamespaceCreation} is `true`, no namespace is created.
   *
   * @param props - The properties of the construct.
   * @returns The created Namespace, or `undefined` if namespace creation is skipped.
   */
  private createNamespace(props: DynatraceKubernetesMonitoringProps): Namespace | undefined {
    let namespace = undefined;

    if (props.skipNamespaceCreation !== true) {
      namespace = new Namespace(this, 'Namespace', {
        metadata: {
          name: this.namespaceName,
          ...props.namespaceProps,
        },
      });
    }

    return namespace;
  }
}
