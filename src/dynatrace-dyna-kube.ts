import { Construct } from 'constructs';
import { ResourceProps } from 'cdk8s-plus-32/lib/base';
import { DynaKubeV1Beta3, DynaKubeV1Beta3SpecActiveGateResourcesRequests } from 'cdk8s-imports/dynatrace.com';
import { DEFAULT_DYNA_KUBE_NAME } from './constants';


export interface DynatraceDynaKubeProps extends ResourceProps {
  readonly apiUrl: string;
}

export class DynatraceDynaKube extends DynaKubeV1Beta3 {

  constructor(scope: Construct, id: string, props: DynatraceDynaKubeProps) {
    super(scope, id, {
      metadata: {
        ...props.metadata,
        ...(!props.metadata?.name && {name: DEFAULT_DYNA_KUBE_NAME}),
      },
      spec: {
        apiUrl: props.apiUrl,
        metadataEnrichment: {
          enabled: true,
        },
        activeGate: {
          capabilities: [
            'kubernetes-monitoring',
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
      },
    });
  }
}
