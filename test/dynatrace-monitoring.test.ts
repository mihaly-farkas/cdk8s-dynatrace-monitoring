import { describe } from '@jest/globals';
import { Chart, Size, Testing } from 'cdk8s';
import { DeploymentOption, DynatraceCapability, DynatraceContainerResources, DynatraceMonitoring, DynatraceMonitoringProps, MetadataProps } from '../src';
import * as yaml from 'js-yaml';
import { toMatchFile } from 'jest-file-snapshot';
import { Cpu } from 'cdk8s-plus-32/lib/container';

expect.extend({toMatchFile});


const snapshotsDir = `${__dirname}/__snapshots__`;

// Default values for the test cases
const defaultDeploymentOption = DeploymentOption.PLATFORM;
const defaultApiUrl = 'https://ENVIRONMENTID.live.dynatrace.com/api';
const defaultApiToken = '*** API TOKEN 1 ***';

const mockWarn = () => jest.spyOn(console, 'warn').mockImplementation(() => {
});

const testDynatraceMonitoring = (props: { constructProps: DynatraceMonitoringProps, snapshotFileComment?: string }): string => {
  // Arrange
  const app = Testing.app();
  const chart = new Chart(app, 'test');

  // Act
  new DynatraceMonitoring(chart, 'dynatrace-monitoring', props.constructProps);

  const yamlCommentLines = props?.snapshotFileComment
                                ?.trim()
                                ?.split(/\r?\n/)
                                ?.map((commentLine) => commentLine.trim())
                                ?.filter((commentLine) => commentLine.length > 0)
                                ?.map(line => `# ${line}\n`)
                                ?.join('') || '';

  const yamlContent = Testing.synth(chart)
                             .map((section: any) => yaml.dump(section))
                             .join('---\n');


  return `${yamlCommentLines}${yamlContent}`;
};


describe('The Dynatrace Kubernetes monitoring construct,', () => {

  describe.each([
    ['example-01', 'custom-namespace-1'],
    ['example-02', 'custom-namespace-2'],
  ])('when configured with a custom namespace name (%s)', (dataSetName: string, namespaceName: string) => {

    it('must produce a manifest with the given value.', () => {
      const warn = mockWarn();

      const manifest = testDynatraceMonitoring({
        constructProps: {
          deploymentOption: defaultDeploymentOption,
          apiUrl: defaultApiUrl,
          tokens: {
            apiToken: defaultApiToken,
          },
          namespaceName,
        },
        snapshotFileComment: 'The value of the namespace names must match the specified one.',
      });

      // Assert
      expect(manifest).toMatchFile(`${snapshotsDir}/custom-namespace.${dataSetName}.yaml`);
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe.each([
    ['example-01', {annotations: {'custom-annotation-1': 'annotation-value-1'}, labels: {'custom-label-1': 'label-value-1'}}],
    ['example-02', {annotations: {'custom-annotation-2': 'annotation-value-2'}, labels: {'custom-label-2': 'label-value-2'}}],
  ])('when configured with a custom namespace props (%s)', (dataSetName: string, namespaceProps: MetadataProps) => {

    it('must produce a manifest with the given value.', () => {
      const warn = mockWarn();

      const manifest = testDynatraceMonitoring({
        constructProps: {
          deploymentOption: defaultDeploymentOption,
          apiUrl: defaultApiUrl,
          tokens: {
            apiToken: defaultApiToken,
          },
          namespaceProps,
        },
      });

      // Assert
      expect(manifest).toMatchFile(`${snapshotsDir}/custom-namespace-props.${dataSetName}.yaml`);
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe.each([
    ['example-01', DeploymentOption.PLATFORM, '*** DATA INGEST TOKEN 1 ***', 'WARNING: Data ingest token is not supported for platform monitoring. It will be ignored.'],
    ['example-02', DeploymentOption.PLATFORM, '*** DATA INGEST TOKEN 2 ***', 'WARNING: Data ingest token is not supported for platform monitoring. It will be ignored.'],
    ['example-03', DeploymentOption.APPLICATION, '*** DATA INGEST TOKEN  1 ***'],
    ['example-04', DeploymentOption.APPLICATION, '*** DATA INGEST TOKEN  2 ***'],
    ['example-05', DeploymentOption.FULL_STACK, '*** DATA INGEST TOKEN  1 ***'],
    ['example-06', DeploymentOption.FULL_STACK, '*** DATA INGEST TOKEN  2 ***'],
  ])('when configured with a data ingest token (%s)', (dataSetName: string, deploymentOption: DeploymentOption, dataIngestToken: string, expectedWarning?: string) => {

    it('must produce a manifest with the given value.', () => {
      const warn = mockWarn();

      const manifest = testDynatraceMonitoring({
        constructProps: {
          deploymentOption: deploymentOption,
          apiUrl: defaultApiUrl,
          tokens: {
            apiToken: defaultApiToken,
            dataIngestToken,
          },
        },
      });

      // Assert
      expect(manifest).toMatchFile(`${snapshotsDir}/data-ingest-token.${dataSetName}.${deploymentOption}.yaml`);
      if (expectedWarning) {
        expect(warn).toBeCalledWith(expectedWarning);
      } else {
        expect(warn).not.toHaveBeenCalled();
      }
    });
  });

  describe.each([
    ['example-01', DeploymentOption.PLATFORM, 'custom-host-group'],
    ['example-02', DeploymentOption.APPLICATION, 'custom-host-group'],
    ['example-03', DeploymentOption.FULL_STACK, 'custom-host-group'],
  ])('when configured with a host group (%s)', (dataSetName: string, deploymentOption: DeploymentOption, hostGroup: string) => {

    it('must produce a manifest with the given value.', () => {
      const warn = mockWarn();

      const manifest = testDynatraceMonitoring({
        constructProps: {
          deploymentOption: deploymentOption,
          apiUrl: defaultApiUrl,
          tokens: {
            apiToken: defaultApiToken,
          },
          hostGroup: hostGroup,
        },
      });

      // Assert
      expect(manifest).toMatchFile(`${snapshotsDir}/host-group.${dataSetName}.yaml`);
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe.each([
    ['example-01', defaultApiToken],
    ['example-02', '*** API TOKEN 2 ***'],
  ])('when configured with an API token (%s)', (dataSetName: string, apiToken: string) => {

    it('must produce a manifest with the given value.', () => {
      const warn = mockWarn();

      const manifest = testDynatraceMonitoring({
        constructProps: {
          deploymentOption: defaultDeploymentOption,
          apiUrl: defaultApiUrl,
          tokens: {
            apiToken: apiToken,
          },
        },
        snapshotFileComment: 'The value of the API token must match the specified one.',
      });

      // Assert
      expect(manifest).toMatchFile(`${snapshotsDir}/api-token.${dataSetName}.yaml`);
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe.each([
    ['example-01', defaultApiUrl],
    ['example-02', 'https://fd567567.live.dynatrace.com/api'],
  ])('when configured with an API URL (%s)', (dataSetName: string, apiUrl: string) => {

    it('must produce a manifest with the given value.', () => {
      const warn = mockWarn();

      const manifest = testDynatraceMonitoring({
        constructProps: {
          deploymentOption: defaultDeploymentOption,
          apiUrl: apiUrl,
          tokens: {
            apiToken: defaultApiToken,
          },
        },
        snapshotFileComment: 'The value of the API URL must match the specified one.',
      });

      // Assert
      expect(manifest).toMatchFile(`${snapshotsDir}/api-url.${dataSetName}.yaml`);
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe.each([
    ['example-01', {cpu: {request: Cpu.millis(100)}}],
    ['example-02', {cpu: {request: Cpu.millis(100), limit: Cpu.millis(200)}}],
    ['example-03', {cpu: {request: Cpu.millis(100), limit: Cpu.millis(200)}, memory: {request: Size.mebibytes(256)}}],
    ['example-04', {cpu: {request: Cpu.millis(100), limit: Cpu.millis(200)}, memory: {request: Size.mebibytes(256), limit: Size.gibibytes(1)}}],
    ['example-05', {cpu: {request: 0.1, limit: '200m'}}],
    ['example-06', {cpu: {request: 0.5, limit: 1}}],
    ['example-07', {cpu: {request: 1.5, limit: 1.9}}],
    ['example-08', {memory: {request: 1024, limit: '1Gi'}}],
  ])('when configured with custom ActiveGate resources (%s)', (dataSetName: string, resources: DynatraceContainerResources) => {

    it('must produce a manifest with the given value.', () => {
      const warn = mockWarn();

      const manifest = testDynatraceMonitoring({
        constructProps: {
          deploymentOption: defaultDeploymentOption,
          apiUrl: defaultApiUrl,
          tokens: {
            apiToken: defaultApiToken,
          },
          activeGate: {
            resources,
          },
        },
        snapshotFileComment: 'The values in the ActiveGate resources must match the specified ones.',
      });

      // Assert
      expect(manifest).toMatchFile(`${snapshotsDir}/custom-active-gate-resources.${dataSetName}.yaml`);
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe.each([
    ['example-01', [DynatraceCapability.DYNATRACE_API]],
    ['example-02', [DynatraceCapability.DYNATRACE_API, DynatraceCapability.METRICS_INGEST]],
    ['example-03', [DynatraceCapability.DYNATRACE_API, DynatraceCapability.DYNATRACE_API, DynatraceCapability.METRICS_INGEST, DynatraceCapability.METRICS_INGEST]],
  ])('when configured with custom capabilities (%s)', (dataSetName: string, capabilities: DynatraceCapability[]) => {

    it('must produce a manifest with the given values.', () => {
      const warn = mockWarn();

      const manifest = testDynatraceMonitoring({
        constructProps: {
          deploymentOption: defaultDeploymentOption,
          apiUrl: defaultApiUrl,
          tokens: {
            apiToken: defaultApiToken,
          },
          activeGate: {
            capabilities,
          },
        },
        snapshotFileComment: 'The values in the active gate capabilities must contain the specified ones.',
      });

      // Assert
      expect(manifest).toMatchFile(`${snapshotsDir}/custom-active-gate-capabilities.${dataSetName}.yaml`);
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe.each([
    ['example-01', DeploymentOption.PLATFORM, {cpu: {request: Cpu.millis(100)}}, 'WARNING: OneAgent resources are only applicable for FULL_STACK deployment option. They will be ignored.'],
    ['example-02', DeploymentOption.APPLICATION, {cpu: {request: Cpu.millis(100)}}, 'WARNING: OneAgent resources are only applicable for FULL_STACK deployment option. They will be ignored.'],
    ['example-03', DeploymentOption.FULL_STACK, {cpu: {request: Cpu.millis(100)}}],
    ['example-04', DeploymentOption.FULL_STACK, {cpu: {request: Cpu.millis(100), limit: Cpu.millis(200)}}],
    ['example-05', DeploymentOption.FULL_STACK, {cpu: {request: Cpu.millis(100), limit: Cpu.millis(200)}, memory: {request: Size.mebibytes(256)}}],
    ['example-06', DeploymentOption.FULL_STACK, {cpu: {request: Cpu.millis(100), limit: Cpu.millis(200)}, memory: {request: Size.mebibytes(256), limit: Size.gibibytes(1)}}],
    ['example-07', DeploymentOption.FULL_STACK, {cpu: {request: 0.1, limit: '200m'}}],
    ['example-08', DeploymentOption.FULL_STACK, {cpu: {request: 0.5, limit: 1}}],
    ['example-09', DeploymentOption.FULL_STACK, {cpu: {request: 1.5, limit: 1.9}}],
    ['example-10', DeploymentOption.FULL_STACK, {memory: {request: 1024, limit: '1Gi'}}],
  ])('when configured with custom OneAgent resources (%s)', (dataSetName: string, deploymentOption: DeploymentOption, resources: DynatraceContainerResources, expectedWarning?: string) => {

    it('must produce a manifest with the given value.', () => {
      const warn = mockWarn();

      const manifest = testDynatraceMonitoring({
        constructProps: {
          deploymentOption: deploymentOption,
          apiUrl: defaultApiUrl,
          tokens: {
            apiToken: defaultApiToken,
          },
          oneAgent: {
            resources,
          },
        },
      });

      // Assert
      expect(manifest).toMatchFile(`${snapshotsDir}/custom-one-agent-resources.${dataSetName}.yaml`);
      if (expectedWarning) {
        expect(warn).toBeCalledWith(expectedWarning);
      } else {
        expect(warn).not.toHaveBeenCalled();
      }
    });
  });

  describe.each([
    ['example-01', false],
    ['example-02', true],
  ])('when configured with skip cert check (%s)', (dataSetName: string, skipCertCheck: boolean) => {

    it('must produce a manifest with the given values.', () => {
      const warn = mockWarn();

      const manifest = testDynatraceMonitoring({
        constructProps: {
          deploymentOption: defaultDeploymentOption,
          apiUrl: defaultApiUrl,
          tokens: {
            apiToken: defaultApiToken,
          },
          skipCertCheck,
        },
      });

      // Assert
      expect(manifest).toMatchFile(`${snapshotsDir}/skip-cert-check.${dataSetName}.yaml`);
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe.each([
    ['example-01', undefined],
    ['example-02', false],
    ['example-03', true],
    ['example-04', true, 'custom-namespace-name'],
    ['example-05', true, undefined, {}, 'WARNING: Namespace creation is skipped. Custom namespace properties will not be applied.'],
  ])('when configured with skip namespace creation', (dataSetName: string, skipNamespaceCreation?: boolean, namespaceName?: string, namespaceProps?: MetadataProps, expectedWaring?: string) => {

    it('must produce the manifest based on the given value.', () => {
      const warn = mockWarn();

      const manifest = testDynatraceMonitoring({
        constructProps: {
          deploymentOption: defaultDeploymentOption,
          apiUrl: defaultApiUrl,
          tokens: {
            apiToken: defaultApiToken,
          },
          skipNamespaceCreation: skipNamespaceCreation,
          namespaceName: namespaceName,
          namespaceProps: namespaceProps,
        },
      });

      // Assert
      expect(manifest).toMatchFile(`${snapshotsDir}/skip-namespace-creation.${dataSetName}.yaml`);
      if (expectedWaring) {
        expect(warn).toBeCalledWith(expectedWaring);
      } else {
        expect(warn).not.toHaveBeenCalled();
      }
    });
  });

  describe.each([
    ['platform-observability', DeploymentOption.PLATFORM],
    ['application-observability', DeploymentOption.APPLICATION],
    ['full-stack-observability', DeploymentOption.FULL_STACK],
  ])('when configured with the %s deployment option', (dataSetName: string, deploymentOption: DeploymentOption) => {

    it('must produce a manifest same as the one published in Dynatrace docs.', () => {
      const warn = mockWarn();

      const manifest = testDynatraceMonitoring({
        constructProps: {
          deploymentOption: deploymentOption,
          apiUrl: defaultApiUrl,
          tokens: {
            apiToken: defaultApiToken,
          },
        },
        snapshotFileComment:
          'Must match the manifest published in Dynatrace docs.\n' +
          `https://docs.dynatrace.com/docs/ingest-from/setup-on-k8s/deployment/${dataSetName}#helm`,
      });

      // Assert
      expect(manifest).toMatchFile(`${snapshotsDir}/default.${dataSetName}.yaml`);
      expect(warn).not.toHaveBeenCalled();
    });
  });
});
