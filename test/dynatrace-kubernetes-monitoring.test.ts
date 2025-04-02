import { Chart, Testing } from 'cdk8s';
import { DynatraceKubernetesMonitoring } from '../src';

describe('a Dynatrace Kubernetes monitoring instance', () => {

  test('defaults', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-monitoring');

    // THEN
    expect(Testing.synth(chart)).toMatchSnapshot();
  });
});
