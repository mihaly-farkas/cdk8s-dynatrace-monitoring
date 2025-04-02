import { Construct } from 'constructs';

/**
 * Properties for configuring Dynatrace Kubernetes monitoring.
 */
export interface DynatraceKubernetesMonitoringProps {
}

/**
 * Sets up Dynatrace monitoring for a Kubernetes cluster.
 *
 * ...
 */
export class DynatraceKubernetesMonitoring extends Construct {

  /**
   * Instantiates a new Dynatrace Kubernetes monitoring instance.
   *
   * @param scope The scope in which this construct is defined.
   * @param id The id of the construct.
   * @param props
   */
  constructor(scope: Construct, id: string, props: DynatraceKubernetesMonitoringProps = {}) {
    super(scope, id);

    // TODO: Remove this. It is only here to prevent the "unused variable" error.
    console.log(props);
  }
}
