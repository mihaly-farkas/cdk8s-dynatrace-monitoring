import { Chart, Testing } from 'cdk8s';
import { DynatraceKubernetesMonitoring } from '../src';

describe('a Dynatrace Kubernetes monitoring instance', () => {

  test('defaults', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    const monitoring = new DynatraceKubernetesMonitoring(chart, 'dynatrace-monitoring');

    // THEN
    expect(monitoring.namespace).toBeDefined();
    expect(monitoring.namespaceName).toBe('dynatrace');
    expect(Testing.synth(chart)).toMatchSnapshot();
  });

  test('with custom namespace name', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    const monitoring = new DynatraceKubernetesMonitoring(chart, 'dynatrace-monitoring', {
      namespace: 'custom-namespace',
    });

    // THEN
    expect(monitoring.namespace).toBeDefined();
    expect(monitoring.namespaceName).toBe('custom-namespace');
    expect(Testing.synth(chart)).toMatchSnapshot();
  });

  test('with custom namespace props', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    const monitoring = new DynatraceKubernetesMonitoring(chart, 'dynatrace-monitoring', {
      namespaceProps: {
        annotations: {
          'custom-annotation': 'value',
        },
        labels: {
          'custom-label': 'value',
        },
      },
    });

    // THEN
    expect(monitoring.namespace).toBeDefined();
    expect(monitoring.namespaceName).toBe('dynatrace');
    expect(Testing.synth(chart)).toMatchSnapshot();
  });

  test('with skip namespace creation', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    const monitoring = new DynatraceKubernetesMonitoring(chart, 'dynatrace-monitoring', {
      skipNamespaceCreation: true,
    });

    // THEN
    expect(monitoring.namespace).toBeUndefined();
    expect(monitoring.namespaceName).toBe('dynatrace');
    expect(Testing.synth(chart)).toMatchSnapshot();
  });

  test('with skip namespace creation and custom namespace name', () => {
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    const monitoring = new DynatraceKubernetesMonitoring(chart, 'dynatrace-monitoring', {
      namespace: 'custom-namespace',
      skipNamespaceCreation: true,
    });

    // THEN
    expect(monitoring.namespace).toBeUndefined();
    expect(monitoring.namespaceName).toBe('custom-namespace');
    expect(Testing.synth(chart)).toMatchSnapshot();
  });
});
