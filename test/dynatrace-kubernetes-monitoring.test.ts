import { Chart, Testing } from 'cdk8s';
import { DeploymentOption, DynatraceKubernetesMonitoring } from '../src';
import * as yaml from 'js-yaml';


describe('a Dynatrace Kubernetes monitoring instance', () => {

  test('required properties only', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-kubernetes-monitoring', {
      deploymentOption: DeploymentOption.PLATFORM,
      apiUrl: 'https://ENVIRONMENTID.live.dynatrace.com/api',
      tokens: {
        apiToken: '*** API TOKEN ***',
      },
    });
    const manifest = yaml.dump(Testing.synth(chart));

    // THEN
    expect(manifest).toMatchSnapshot();
  });

  test('with custom namespace name', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-kubernetes-monitoring', {
      deploymentOption: DeploymentOption.PLATFORM,
      apiUrl: 'https://ENVIRONMENTID.live.dynatrace.com/api',
      tokens: {
        apiToken: '*** API TOKEN ***',
      },
      namespaceName: 'custom-namespace',
    });
    const manifest = yaml.dump(Testing.synth(chart));

    // THEN
    expect(manifest).toMatchSnapshot();
  });

  test('with custom namespace props', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-kubernetes-monitoring', {
      deploymentOption: DeploymentOption.PLATFORM,
      apiUrl: 'https://ENVIRONMENTID.live.dynatrace.com/api',
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
    const manifest = yaml.dump(Testing.synth(chart));

    // THEN
    expect(manifest).toMatchSnapshot();
  });

  test('with skip namespace creation', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-kubernetes-monitoring', {
      deploymentOption: DeploymentOption.PLATFORM,
      apiUrl: 'https://ENVIRONMENTID.live.dynatrace.com/api',
      tokens: {
        apiToken: '*** API TOKEN ***',
      },
      skipNamespaceCreation: true,
    });
    const manifest = yaml.dump(Testing.synth(chart));

    // THEN
    expect(manifest).toMatchSnapshot();
  });

  test('with skip namespace creation and custom namespace name', () => {
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-kubernetes-monitoring', {
      deploymentOption: DeploymentOption.PLATFORM,
      apiUrl: 'https://ENVIRONMENTID.live.dynatrace.com/api',
      tokens: {
        apiToken: '*** API TOKEN ***',
      },
      namespaceName: 'custom-namespace',
      skipNamespaceCreation: true,
    });
    const manifest = yaml.dump(Testing.synth(chart));

    // THEN
    expect(manifest).toMatchSnapshot();
  });

  test('with skip namespace creation and custom namespace properties', () => {
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    jest.spyOn(console, 'warn').mockImplementation(() => {
    });

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-kubernetes-monitoring', {
      deploymentOption: DeploymentOption.PLATFORM,
      apiUrl: 'https://ENVIRONMENTID.live.dynatrace.com/api',
      tokens: {
        apiToken: '*** API TOKEN ***',
      },
      namespaceName: 'custom-namespace',
      skipNamespaceCreation: true,
      namespaceProps: {
        annotations: {
          'custom-annotation': 'value',
        },
      },
    });
    const manifest = yaml.dump(Testing.synth(chart));

    // THEN
    expect(manifest).toMatchSnapshot();
    expect(console.warn).toHaveBeenCalledWith(
      'WARNING: Namespace properties will be ignored as skip namespace creation is set to true.',
    );
  });
});
