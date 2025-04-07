import { Construct } from 'constructs';
import { Size } from 'cdk8s';
import { Cpu, Namespace, Secret } from 'cdk8s-plus-32';
import { DynaKubeV1Beta3, DynaKubeV1Beta3SpecActiveGateResourcesRequests } from 'cdk8s-imports/dynatrace.com';
import { DeploymentOption } from './deployment-option';
import { DynatraceMonitoringProps } from './dynatrace-monitoring-props';
import {
  DEFAULT_ACTIVE_GATE_CPU_LIMIT,
  DEFAULT_ACTIVE_GATE_CPU_REQUEST,
  DEFAULT_ACTIVE_GATE_MEMORY_LIMIT,
  DEFAULT_ACTIVE_GATE_MEMORY_REQUEST,
  DEFAULT_DYNA_KUBE_NAME,
  DEFAULT_NAMESPACE,
} from './constants';
import sortKeysRecursive from 'sort-keys-recursive';


/**
 * CDK8s construct for deploying Dynatrace monitoring to a Kubernetes cluster.
 *
 * It provides configuration options for integrating Dynatrace with Kubernetes, including the setup of monitoring
 * agents, ActiveGate configurations, and namespace management.
 * The Dynatrace Kubernetes monitoring setup is highly customizable, allowing users to configure CPU, memory resources,
 * and authentication tokens for communication with the Dynatrace platform.
 *
 * Key functionalities:
 * - Setting up Dynatrace monitoring with configurable CPU and memory resources.
 * - Optionally creating and configuring a Kubernetes namespace for Dynatrace resources.
 * - Managing Dynatrace API and data ingest tokens.
 * - Defining deployment options (e.g., platform monitoring, application observability, full-stack observability).
 * - Providing a scalable and flexible solution for monitoring Kubernetes clusters with Dynatrace.
 */
export class DynatraceMonitoring extends Construct {

  /**
   * The Kubernetes namespace where the Dynatrace resources will be deployed, if this construct is responsible for
   * creating the namespace.
   *
   * If the skipNamespaceCreation property is set to true, this property will be undefined.
   */
  public readonly namespace?: Namespace;

  /**
   * Secret containing Dynatrace tokens.
   */
  public readonly secret: Secret;

  /**
   * Dynatrace Kubernetes monitoring instance.
   */
  public readonly dynaKube: DynaKubeV1Beta3;

  private readonly props: DynatraceMonitoringProps;

  /**
   * Creates a new Dynatrace monitoring setup.
   *
   * @param scope Scope in which this construct is defined.
   * @param id Unique ID of the construct.
   * @param props Configuration options.
   */
  constructor(scope: Construct, id: string, props: DynatraceMonitoringProps) {
    super(scope, id);

    this.props = props;

    if (!props.skipNamespaceCreation) {
      this.namespace = this.createNamespace();
    } else if (props.namespaceProps) {
      console.warn('WARNING: Namespace creation is skipped. Custom namespace properties will not be applied.');
    }

    this.secret = this.createSecret();
    this.dynaKube = this.createDynaKube();
  }

  /**
   * The name of the Kubernetes namespace.
   */
  public get namespaceName(): string {
    return this.props.namespaceName ?? DEFAULT_NAMESPACE;
  }

  /**
   * Creates a new Kubernetes namespace for Dynatrace resources.
   *
   * @returns The created namespace.
   */
  private createNamespace(): Namespace {
    return new Namespace(this, 'Namespace', {
      metadata: {
        name: this.namespaceName,
        ...this.props.namespaceProps,
      },
    });
  }

  /**
   * Creates a new secret containing Dynatrace API and optional data ingest tokens.
   *
   * @returns The created secret.
   */
  private createSecret(): Secret {
    return new Secret(this, 'Secret', {
      metadata: {
        ...this.getNameAndNamespaceMetadata(),
      },
      type: 'Opaque',
      stringData: this.createSecretData(),
    });
  }

  /**
   * Creates the secret data, which includes the API token and optionally the data ingest token.
   *
   * @returns The secret data.
   */
  private createSecretData(): Record<string, string> {
    const stringData: Record<string, string> = {
      apiToken: this.props.tokens.apiToken,
    };

    if (this.isAdvancedDeployment() && this.props.tokens.dataIngestToken) {
      stringData.dataIngestToken = this.props.tokens.dataIngestToken;
    } else if (this.props.tokens.dataIngestToken) {
      console.warn('WARNING: Data ingest token is not supported for platform monitoring. It will be ignored.');
    }

    return stringData;
  }

  /**
   * Creates the Dynatrace Kubernetes monitoring configuration instance (`DynaKube`).
   *
   * @returns The created `DynaKube` instance.
   */
  private createDynaKube(): DynaKubeV1Beta3 {
    const activeGateCpu = this.props.activeGate?.resources?.cpu;
    const activeGateMemory = this.props.activeGate?.resources?.memory;

    if (this.props.oneAgent?.resources && this.props.deploymentOption !== DeploymentOption.FULL_STACK) {
      console.warn('WARNING: OneAgent resources are only applicable for FULL_STACK deployment option. They will be ignored.');
    }

    const oneAgentCpu = this.props.oneAgent?.resources?.cpu;
    const oneAgentMemory = this.props.oneAgent?.resources?.memory;

    return new DynaKubeV1Beta3(this, 'DynaKube', {
      metadata: {
        ...this.getNameAndNamespaceMetadata(),
        annotations: {
          'feature.dynatrace.com/k8s-app-enabled': 'true',
          ...(this.isAdvancedDeployment() && {'feature.dynatrace.com/injection-readonly-volume': 'true'}),
        },
      },
      spec: {
        activeGate: {
          capabilities: sortKeysRecursive(Array.from(new Set([
            'kubernetes-monitoring',
            ...(this.isAdvancedDeployment() && ['routing'] || []),
            ...(this.props.activeGate?.capabilities?.map(enumValue => enumValue.toString()) || []),
          ]))),
          resources: {
            requests: {
              ...this.parseResourceRequest('cpu', activeGateCpu?.request, DEFAULT_ACTIVE_GATE_CPU_REQUEST),
              ...this.parseResourceRequest('memory', activeGateMemory?.request, DEFAULT_ACTIVE_GATE_MEMORY_REQUEST),
            },
            limits: {
              ...this.parseResourceRequest('cpu', activeGateCpu?.limit, DEFAULT_ACTIVE_GATE_CPU_LIMIT),
              ...this.parseResourceRequest('memory', activeGateMemory?.limit, DEFAULT_ACTIVE_GATE_MEMORY_LIMIT),
            },
          },
          //tolerations: [
          //  {
          //    key: 'node-role.kubernetes.io/master',
          //    operator: 'Exists',
          //    effect: 'NoSchedule',
          //  },
          //],
        },
        apiUrl: this.props.apiUrl,
        metadataEnrichment: {
          enabled: true,
        },
        ...((this.isAdvancedDeployment() || this.props.hostGroup) && {
          oneAgent: {
            ...(this.props.deploymentOption === DeploymentOption.APPLICATION && {
              applicationMonitoring: {},
            }),
            ...(this.props.deploymentOption === DeploymentOption.FULL_STACK && {
              cloudNativeFullStack: {
                ...((oneAgentCpu || oneAgentMemory) && {
                  oneAgentResources: {
                    requests: {
                      ...this.parseResourceRequest('cpu', oneAgentCpu?.request),
                      ...this.parseResourceRequest('memory', oneAgentMemory?.request),
                    },
                    limits: {
                      ...this.parseResourceRequest('cpu', oneAgentCpu?.limit),
                      ...this.parseResourceRequest('memory', oneAgentMemory?.limit),
                    },
                  },
                }),
                tolerations: [
                  {
                    key: 'node-role.kubernetes.io/master',
                    operator: 'Exists',
                    effect: 'NoSchedule',
                  },
                  {
                    key: 'node-role.kubernetes.io/control-plane',
                    operator: 'Exists',
                    effect: 'NoSchedule',
                  },
                ],
              },
            }),
            hostGroup: this.props.hostGroup,
          },
        }),
        skipCertCheck: this.props.skipCertCheck,
      },
    });
  }

  /**
   * Returns the metadata for the `name` and `namespace` of the Dynatrace resources.
   *
   * @returns The metadata object containing `name` and `namespace`.
   */
  private getNameAndNamespaceMetadata(): { name: string; namespace?: string } {
    return {
      name: DEFAULT_DYNA_KUBE_NAME,
      namespace: this.namespaceName,
    };
  }

  /**
   * Parses a resource request value for CPU or memory.
   *
   * Converts the value to a Dynatrace `ActiveGateResourcesRequests` object.
   * If no value is provided, and the default value is provided, it falls back to the default, otherwise returns an
   * empty object.
   *
   * @param key The resource type (e.g., 'cpu', 'memory').
   * @param value The value to parse (could be a string, number, or instance of `Cpu`/`Size`).
   * @param defaultValue Optional default value used when the value is undefined.
   * @returns An object with the parsed resource request for the given key.
   */
  private parseResourceRequest(key: string, value?: Cpu | Size | string | number, defaultValue?: string): Record<string, DynaKubeV1Beta3SpecActiveGateResourcesRequests> {
    let outputValue: DynaKubeV1Beta3SpecActiveGateResourcesRequests | undefined = undefined;

    // The actual parsing of the primitive types is done by the imported class of the Dynatrace operator
    if (value instanceof Cpu) outputValue = DynaKubeV1Beta3SpecActiveGateResourcesRequests.fromString(value.amount);
    if (value instanceof Size) outputValue = DynaKubeV1Beta3SpecActiveGateResourcesRequests.fromString(value.asString());
    if (typeof value === 'string') outputValue = DynaKubeV1Beta3SpecActiveGateResourcesRequests.fromString(value);
    if (typeof value === 'number') outputValue = DynaKubeV1Beta3SpecActiveGateResourcesRequests.fromNumber(value);
    if (!outputValue && defaultValue) outputValue = DynaKubeV1Beta3SpecActiveGateResourcesRequests.fromString(defaultValue);

    return outputValue && {[key]: outputValue} || {};
  }

  /**
   * Determines whether the deployment option is advanced (i.e., APPLICATION or FULL_STACK).
   *
   * @returns `true` if the deployment option is one of the advanced ones, `false` otherwise.
   */
  private isAdvancedDeployment(): boolean {
    const advancedOptions = new Set([
      DeploymentOption.FULL_STACK,
      DeploymentOption.APPLICATION,
    ]);
    return advancedOptions.has(this.props.deploymentOption);
  }
}
