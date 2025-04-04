import { Construct } from 'constructs';
import { ApiObjectMetadata } from 'cdk8s';
import { Namespace, Secret } from 'cdk8s-plus-32';
import { DynaKubeV1Beta3, DynaKubeV1Beta3SpecActiveGateResourcesRequests } from 'cdk8s-imports/dynatrace.com';
import { DEFAULT_DYNA_KUBE_NAME, DEFAULT_NAMESPACE, DEFAULT_SECRET_NAME } from './constants';
import { DeploymentOption } from './deployment-option';


/**
 * Namespace properties without the `name` and `namespace` fields.
 *
 * In this construct, we use a separate {@link DynatraceKubernetesMonitoringProps#namespaceName} property
 * for setting the namespace name. To ensure clarity and avoid handling precedence rules or a property combination mess,
 * we omit the `name` field.
 *
 * We also omit the `namespace` field, as it is not applicable in this context.
 */
type OmittedNamespaceProps = Omit<ApiObjectMetadata, 'name' | 'namespace'>

export interface DynatraceTokens {

  /**
   * The API token for Dynatrace monitoring.
   */
  readonly apiToken: string;

  readonly dataIngestToken?: string;
}


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
  readonly namespaceName?: string;

  /**
   * Properties for the namespace to be created.
   *
   * If {@link skipNamespaceCreation} is set to `true`, this property will be ignored.
   */
  readonly namespaceProps?: OmittedNamespaceProps;


  /**
   * Whether to skip the creation of the Dynatrace monitoring namespace.
   *
   * If set to `true`, the namespace will not be created automatically, and we assume that the user has already created
   * it.
   *
   * @default false
   */
  readonly skipNamespaceCreation?: boolean;

  readonly apiUrl: string;

  readonly tokens: DynatraceTokens;
}


/**
 * Sets up Dynatrace monitoring for a Kubernetes cluster.
 *
 * ...
 */
export class DynatraceKubernetesMonitoring extends Construct {

  public readonly namespaceName: string;

  public readonly secret: Secret;

  public readonly dynaKube: DynaKubeV1Beta3;

  /**
   * Instantiates a new Dynatrace Kubernetes monitoring instance.
   *
   * @param scope The scope in which this construct is defined.
   * @param id The id of the construct.
   * @param props The properties of the construct.
   */
  constructor(scope: Construct, id: string, props: DynatraceKubernetesMonitoringProps) {
    super(scope, id);

    this.namespaceName = this.getNamespaceName(props.namespaceName);

    if (props.skipNamespaceCreation !== true) {
      this.createNamespace(this.namespaceName, props.namespaceProps);
    } else if (props.namespaceProps) {
      console.warn('WARNING: Namespace creation is skipped. Custom namespace properties will not be applied.');
    }

    this.secret = this.createSecret(props.deploymentOption, this.namespaceName, props.tokens.apiToken, props.tokens.dataIngestToken);

    this.dynaKube = this.createDynaKube(props.deploymentOption, this.namespaceName, props.apiUrl);
  }

  private getNamespaceName(requestedNamespaceName?: string): string {
    return requestedNamespaceName ?? DEFAULT_NAMESPACE;
  }

  private createNamespace(name: string, namespaceProps?: OmittedNamespaceProps): Namespace {
    return new Namespace(this, 'Namespace', {
      metadata: {
        name,
        ...namespaceProps,
      },
    });
  }

  private createSecret(deploymentOption: DeploymentOption, namespace: string, apiToken: string, dataIngestToken?: string): Secret {
    if (deploymentOption === DeploymentOption.PLATFORM && dataIngestToken) {
      console.warn('WARNING: Data ingest token is not supported for platform monitoring. It will be ignored.');
    }

    return new Secret(this, 'Secret', {
      metadata: {
        name: DEFAULT_SECRET_NAME,
        namespace: namespace,
      },
      type: 'Opaque',
      stringData: {
        apiToken: apiToken,
        ...(deploymentOption !== DeploymentOption.PLATFORM ? {dataIngestToken: dataIngestToken} : {}),
      },
    });
  }

  private createDynaKube(deploymentOption: DeploymentOption, namespace: string, apiUrl: string): DynaKubeV1Beta3 {
    return new DynaKubeV1Beta3(this, 'DynaKube', {
      metadata: {
        name: DEFAULT_DYNA_KUBE_NAME,
        namespace: namespace,
        annotations: {
          'feature.dynatrace.com/k8s-app-enabled': 'true',
          ...(deploymentOption !== DeploymentOption.PLATFORM ? {
            'feature.dynatrace.com/injection-readonly-volume': 'true',
          } : {}),
        },
      },
      spec: {
        apiUrl,
        metadataEnrichment: {
          enabled: true,
        },
        activeGate: {
          capabilities: [
            'kubernetes-monitoring',
            ...(deploymentOption !== DeploymentOption.PLATFORM ? ['routing'] : []),
          ],
          resources: {
            requests: {
              cpu: DynaKubeV1Beta3SpecActiveGateResourcesRequests.fromString('500m'),
              memory: DynaKubeV1Beta3SpecActiveGateResourcesRequests.fromString('512Mi'),
            },
            limits: {
              cpu: DynaKubeV1Beta3SpecActiveGateResourcesRequests.fromString('1000m'),
              memory: DynaKubeV1Beta3SpecActiveGateResourcesRequests.fromString('1.5Gi'),
            },
          },
        },
        ...(deploymentOption === DeploymentOption.APPLICATION ? {
          oneAgent: {
            applicationMonitoring: {},
          },
        } : {}),
        ...(deploymentOption === DeploymentOption.FULL_STACK ? {
          oneAgent: {
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
          },
        } : {}),

      },
    });
  }
}
