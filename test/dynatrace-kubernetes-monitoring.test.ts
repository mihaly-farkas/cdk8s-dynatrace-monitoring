import { Chart, Testing } from 'cdk8s';
import { DeploymentOption, DynatraceKubernetesMonitoring } from '../src';

describe('a Dynatrace Kubernetes monitoring instance', () => {

  test('defaults', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-monitoring', {
      deploymentOption: DeploymentOption.PLATFORM,
      tokens: {
        apiToken: '*** API TOKEN ***',
      },
    });

    // THEN
    expect(Testing.synth(chart)).toMatchSnapshot();
  });

  test('with custom namespace name', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-monitoring', {
      deploymentOption: DeploymentOption.PLATFORM,
      tokens: {
        apiToken: '*** API TOKEN ***',
      },
      namespace: 'custom-namespace',
    });

    // THEN
    expect(Testing.synth(chart)).toMatchSnapshot();
  });

  test('with custom namespace props', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-monitoring', {
      deploymentOption: DeploymentOption.PLATFORM,
      tokens: {
        apiToken: '*** API TOKEN ***',
      },
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
    expect(Testing.synth(chart)).toMatchSnapshot();
  });

  test('with skip namespace creation', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-monitoring', {
      deploymentOption: DeploymentOption.PLATFORM,
      tokens: {
        apiToken: '*** API TOKEN ***',
      },
      skipNamespaceCreation: true,
    });

    // THEN
    expect(Testing.synth(chart)).toMatchSnapshot();
  });

  test('with skip namespace creation and custom namespace name', () => {
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-monitoring', {
      deploymentOption: DeploymentOption.PLATFORM,
      tokens: {
        apiToken: '*** API TOKEN ***',
      },
      namespace: 'custom-namespace',
      skipNamespaceCreation: true,
    });

    // THEN
    expect(Testing.synth(chart)).toMatchSnapshot();
  });
});
