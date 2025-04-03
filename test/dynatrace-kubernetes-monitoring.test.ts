import { describe } from '@jest/globals';
import { Chart, Testing } from 'cdk8s';
import { DeploymentOption, DynatraceKubernetesMonitoring, DynatraceKubernetesMonitoringProps } from '../src';
import * as yaml from 'js-yaml';

const deploymentOptions = [
  DeploymentOption.PLATFORM,
  DeploymentOption.APPLICATION,
];

const apiUrls = [
  'https://ENVIRONMENTID.live.dynatrace.com/api',
  'https://fd567567.live.dynatrace.com/api',
];

const apiTokens = [
  '*** API TOKEN 1 ***',
  '*** API TOKEN 2 ***',
];


const testConstruct = (props: DynatraceKubernetesMonitoringProps) => {
  it('should generate the expected template.', () => {
    {
      // GIVEN
      const app = Testing.app();
      const chart = new Chart(app, 'test');

      // WHEN
      new DynatraceKubernetesMonitoring(chart, 'dynatrace-kubernetes-monitoring', props);
      const manifest = yaml.dump(Testing.synth(chart));

      // THEN
      expect(manifest).toMatchSnapshot();
    }
  });
};


describe('The Dynatrace Kubernetes monitoring construct', () => {

  describe.each(deploymentOptions)('with "%s" deployment', (deploymentOption) => {

    describe.each(apiUrls)('and with the "%s" API URL', (apiUrl) => {

      describe.each(apiTokens)('and with "%s" API token', (apiToken) => {

        describe('and without any custom properties', () => {
          testConstruct({
            deploymentOption,
            apiUrl,
            tokens: {
              apiToken,
            },
          });
        });

        describe('and with custom namespace name', () => {
          testConstruct({
            deploymentOption,
            apiUrl,
            tokens: {
              apiToken,
            },
            namespaceName: 'custom-namespace',
          });
        });

        describe('and with custom namespace props', () => {
          testConstruct({
            deploymentOption,
            apiUrl,
            tokens: {
              apiToken,
            },
            namespaceName: 'custom-namespace',
            namespaceProps: {
              annotations: {
                'custom-annotation': 'value',
              },
              labels: {
                'custom-label': 'value',
              },
            },
          });
        });

        describe('and with skip namespace creation', () => {
          testConstruct({
            deploymentOption,
            apiUrl,
            tokens: {
              apiToken,
            },
            skipNamespaceCreation: true,
          });

          describe('and with custom namespace name', () => {
            testConstruct({
              deploymentOption,
              apiUrl,
              tokens: {
                apiToken,
              },
              namespaceName: 'custom-namespace',
              skipNamespaceCreation: true,
            });
          });

          describe('and with custom namespace props', () => {
            testConstruct({
              deploymentOption,
              apiUrl,
              tokens: {
                apiToken,
              },
              namespaceName: 'custom-namespace',
              skipNamespaceCreation: true,
              namespaceProps: {
                annotations: {
                  'custom-annotation': 'value',
                },
                labels: {
                  'custom-label': 'value',
                },
              },
            });
          });
        });
      });
    });
  });
});
