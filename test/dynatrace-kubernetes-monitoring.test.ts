import { Chart, Testing } from 'cdk8s';
import { DeploymentOption, DynatraceKubernetesMonitoring } from '../src';
import * as yaml from 'js-yaml';
import * as fs from 'node:fs';


const fixtures_dir = `${__dirname}/__fixtures__`;
const platformMonitoringReferenceYaml = yaml.load(
  fs.readFileSync(`${fixtures_dir}/platform-monitoring.yml`, 'utf8'),
);

// Indexes of the manifests in the synthesized output
const DYNA_KUBE = 2;

const requiredProps = {
  deploymentOption: DeploymentOption.PLATFORM,
  apiUrl: 'https://ENVIRONMENTID.live.dynatrace.com/api',
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
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-kubernetes-monitoring', {
      ...requiredProps,
    });
    const manifest = Testing.synth(chart);

    // THEN
    const dynakubeManifest = manifest[DYNA_KUBE];
    expect(dynakubeManifest).toStrictEqual(platformMonitoringReferenceYaml);
    expect(manifest).toMatchSnapshot();
  });

  test('with custom namespace name', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-kubernetes-monitoring', {
      ...requiredProps,
      namespaceName: 'custom-namespace',
    });
    const manifest = Testing.synth(chart);

    // THEN
    expect(manifest).toMatchSnapshot();
  });

  test('with custom namespace props', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-kubernetes-monitoring', {
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
    const manifest = Testing.synth(chart);

    // THEN
    const dynakubeManifest = manifest[DYNA_KUBE];
    expect(dynakubeManifest).toStrictEqual(platformMonitoringReferenceYaml);
    expect(manifest).toMatchSnapshot();
  });

  test('with skip namespace creation', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-kubernetes-monitoring', {
      ...requiredProps,
      skipNamespaceCreation: true,
    });
    const manifest = Testing.synth(chart);

    // THEN
    expect(manifest).toMatchSnapshot();
  });

  test('with skip namespace creation and custom namespace name', () => {
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new DynatraceKubernetesMonitoring(chart, 'dynatrace-kubernetes-monitoring', {
      ...requiredProps,
      namespaceName: 'custom-namespace',
      skipNamespaceCreation: true,
    });
    const manifest = Testing.synth(chart);

    // THEN
    expect(manifest).toMatchSnapshot();
  });
});
