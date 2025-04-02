import { Secret } from 'cdk8s-plus-32';
import { Construct } from 'constructs';
import { ResourceProps } from 'cdk8s-plus-32/lib/base';
import { DEFAULT_SECRET_NAME } from './constants';


export interface DynatraceSecretProps extends ResourceProps {
  readonly apiToken: string;
}

export class DynatraceSecret extends Secret {

  constructor(scope: Construct, id: string, props: DynatraceSecretProps) {
    super(scope, id, {
      metadata: {
        ...props.metadata,
        ...(!props.metadata?.name && {name: DEFAULT_SECRET_NAME}),
      },
      type: 'Opaque',
      stringData: {
        apiToken: props.apiToken,
      },
    });
  }
}
