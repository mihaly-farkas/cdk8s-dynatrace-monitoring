/**
 * @fileoverview This module defines a CDK8s construct for deploying Dynatrace monitoring resources to a Kubernetes
 * cluster.
 *
 * @module cdk8s-dynatrace-monitoring
 */

import { ApiObjectMetadata, Size } from 'cdk8s';
import { Cpu, Namespace, Secret } from 'cdk8s-plus-32';
import { DynaKubeV1Beta3, DynaKubeV1Beta3SpecActiveGateResourcesRequests } from 'cdk8s-imports/dynatrace.com';
import { Construct } from 'constructs';
import {
  DEFAULT_ACTIVE_GATE_CPU_LIMIT,
  DEFAULT_ACTIVE_GATE_CPU_REQUEST,
  DEFAULT_ACTIVE_GATE_MEMORY_LIMIT,
  DEFAULT_ACTIVE_GATE_MEMORY_REQUEST,
  DEFAULT_DYNA_KUBE_NAME,
  DEFAULT_NAMESPACE,
} from './constants';

/**
 * A subset of Kubernetes metadata, excluding the `name` and `namespace`.
 *
 * The `name` and `namespace` are determined by the construct itself based on custom logic.
 * This class was created to avoid any confusion due to this behavior.
 * All other metadata fields will be passed unchanged to the underlying resources.
 */
export type MetadataProps = Omit<ApiObjectMetadata, 'name' | 'namespace'>;

/**
 * Dynatrace authentication tokens.
 */
export interface DynatraceTokens {

  /**
   * Dynatrace API token (required).
   *
   * The API token is required for the Dynatrace operator to communicate with the Dynatrace platform.
   * Ensure that the following scopes are enabled for your API token:
   * - _Read settings_
   * - _Write settings_
   * - _Read entities_
   * - _Installer download_
   * - _Access problem and event feed, metrics, and topology_
   * - _Create ActiveGate tokens_
   *
   * To create an API token, use the _Access Tokens_ page in the Dynatrace UI.
   */
  readonly apiToken: string;

  /**
   * Optional data ingest token for metrics, logs, and OpenTelemetry traces.
   *
   * This token is used for ingesting metrics, logs, and OpenTelemetry traces from pods
   * outside the Dynatrace namespace.
   * It is only applicable if you are using advanced deployment options (APPLICATION/FULL_STACK).
   * Ensure that the following scopes are enabled for your data ingest token:
   *
   * - _Ingest metrics_
   * - _Ingest logs_
   * - _Ingest OpenTelemetry traces_
   *
   * To create a data ingest token, use the _Access Tokens_ page in the Dynatrace UI.
   */
  readonly dataIngestToken?: string;
}

/**
 * CPU resource configuration for Dynatrace monitoring.
 *
 * For valid values and units of measurement, refer to the corresponding
 * [Memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)
 * documentation.
 */
export interface DynatraceCpuResources {

  /**
   * CPU limit value.
   */
  readonly limit?: Cpu | string | number;

  /**
   * CPU request value.
   */
  readonly request?: Cpu | string | number;
}

/**
 * Memory resource configuration.
 *
 * For valid values and units of measurement, refer to the corresponding
 * [CPU resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)
 * documentation.
 */
export interface DynatraceMemoryResources {

  /**
   * Memory limit value.
   */
  readonly limit?: Size | string | number;

  /**
   * Memory request value.
   */
  readonly request?: Size | string | number;
}

/**
 * CPU and memory resource configuration for the Dynatrace container.
 *
 * These configurations are optional, but can be customized for your deployment needs.
 */
export interface DynatraceContainerResources {

  /**
   * CPU configuration for the Dynatrace container.
   */
  readonly cpu?: DynatraceCpuResources;

  /**
   * Memory configuration for the Dynatrace container.
   */
  readonly memory?: DynatraceMemoryResources;
}

/**
 * Represents optional ActiveGate capabilities that can be enabled for Dynatrace monitoring.
 *
 * These capabilities enhance monitoring functionality by enabling specific ActiveGate features.
 *
 * Note that core capabilities like `kubernetes-monitoring` and `routing` are added automatically
 * by the construct based on the selected deployment option.
 */
export enum DynatraceCapability {

  /**
   * Enables the Dynatrace API endpoint on ActiveGate, allowing Kubernetes pods to interact with the Dynatrace API.
   *
   * This is required for scenarios where agents or services within the cluster need to push
   * or query data via the Dynatrace API through the ActiveGate.
   */
  DYNATRACE_API = 'dynatrace-api',

  /**
   * Enables the metrics ingest endpoint on ActiveGate and configures pods to redirect metrics to it.
   *
   * This capability is required for collecting Prometheus metrics or custom metrics from pods
   * outside the Dynatrace namespace.
   */
  METRICS_INGEST = 'metrics-ingest',
}

/**
 * Properties related to ActiveGate configuration in Dynatrace.
 */
export interface ActiveGateProps {

  /**
   * Optional list of additional ActiveGate capabilities to enable.
   *
   * These capabilities extend the functionality of the ActiveGate component.
   * The construct automatically includes essential capabilities like `kubernetes-monitoring`
   * and `routing` based on the selected deployment option, so they do not need to be specified here.
   *
   * Use this property to explicitly enable additional features such as `metrics-ingest` or `dynatrace-api`.
   */
  capabilities?: DynatraceCapability[];

  /**
   * CPU and memory resource configurations for the ActiveGate pod(s).
   *
   * Resource limits and requests help control how much compute and memory is allocated to ActiveGate.
   * Adjust these values based on your expected load and cluster resource availability.
   *
   * @default Uses predefined default values suitable for most workloads.
   */
  resources?: DynatraceContainerResources;
}

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
   * Kubernetes platform monitoring.
   */
  PLATFORM = 'platform',

  /**
   * Kubernetes platform monitoring + Application observability.
   */
  APPLICATION = 'application',

  /**
   * Kubernetes platform monitoring + Full-stack observability.
   */
  FULL_STACK = 'full-stack',
}

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
  readonly tokens: DynatraceTokens;
}

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
          capabilities: Array.from(new Set([
            'kubernetes-monitoring',
            ...(this.isAdvancedDeployment() && ['routing'] || []),
            ...(this.props.activeGate?.capabilities?.map(enumValue => enumValue.toString()) || []),
          ])),
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
          tolerations: [
            {
              key: 'node-role.kubernetes.io/master',
              operator: 'Exists',
              effect: 'NoSchedule',
            },
          ],
        },
        apiUrl: this.props.apiUrl,
        metadataEnrichment: {
          enabled: true,
        },
        ...(this.isAdvancedDeployment() && {
          oneAgent: {
            ...(this.props.deploymentOption === DeploymentOption.APPLICATION && {
              applicationMonitoring: {},
            }),
            ...(this.props.deploymentOption === DeploymentOption.FULL_STACK && {
              cloudNativeFullStack: {
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
  private parseResourceRequest(key: string, value: Cpu | Size | string | number | undefined, defaultValue?: string): Record<string, DynaKubeV1Beta3SpecActiveGateResourcesRequests> {
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
