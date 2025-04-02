import { Chart, Testing } from 'cdk8s';
import { DeploymentOption, DynatraceKubernetesMonitoring } from '../src';

const requiredProps = {
  deploymentOption: DeploymentOption.PLATFORM,
  apiUrl: 'https://ENVIRONMENTID.live.dynatrace.com/api2',
  tokens: {
    apiToken: '*** API TOKEN ***',
  },
};

describe('a Dynatrace Kubernetes monitoring instance', () => {

  test('required only', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-monitoring', {
      ...requiredProps,
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
      ...requiredProps,
      namespaceName: 'custom-namespace',
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
      ...requiredProps,
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
      ...requiredProps,
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
      ...requiredProps,
      namespaceName: 'custom-namespace',
      skipNamespaceCreation: true,
    });

    // THEN
    expect(Testing.synth(chart)).toMatchSnapshot();
  });
});
