// noinspection DuplicatedCode

import { Chart, Size, Testing } from 'cdk8s';
import { DEFAULT_ACTIVE_GATE_CPU_LIMIT, DEFAULT_ACTIVE_GATE_CPU_REQUEST, DEFAULT_ACTIVE_GATE_MEMORY_LIMIT, DEFAULT_ACTIVE_GATE_MEMORY_REQUEST, DeploymentOption, DynatraceMonitoring } from '../src';
import { toHaveNamespaceDeclaration, toManifestYaml, toMatchManifestFile } from './utils';
import { Capability } from '../src/capability';
import { Cpu } from 'cdk8s-plus-32';


expect.extend({
  toHaveNamespaceDeclaration,
  toMatchManifestFile,
});

const fixturesDir = `${__dirname}/__fixtures__`;

const defaultProps = {
  deploymentOption: DeploymentOption.PLATFORM,
  apiUrl: 'https://ENVIRONMENTID.live.dynatrace.com/api',
  tokens: {
    apiToken: '*** API TOKEN ***',
  },
};

describe('If the DynatraceMonitoring construct is configured with', () => {
  describe('.activeGate.capabilities', () => {
    const capabilities = [
      Capability.DYNATRACE_API,
      Capability.METRICS_INGEST,
    ];

    describe.each(capabilities)('(%s),', (capability: Capability) => {
      it('should generate a YAML with the capability enabled.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          activeGate: {
            capabilities: [capability],
          },
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[2].spec.activeGate.capabilities).toContain(capability);
      });
    });
  });
  describe('.activeGate.resources', () => {
    const cpuRequests: [string, Cpu | string | number, string | number][] = [
      ['0.1 (string)', '0.1', '0.1'],
      ['100m', '100m', '100m'],
      ['0.1 (number)', 0.1, 0.1],
      ['Cpu.millis(100)', Cpu.millis(100), '100m'],
    ];
    const memoryRequests: [string, Size | string | number, string | number][] = [
      ['268435456', '268435456', '268435456'],
      ['256Mi', '256Mi', '256Mi'],
      ['0.25Gi', '0.25Gi', '0.25Gi'],
      ['268435456 (number)', 268435456, 268435456],
      ['Size.mebibytes(256)', Size.mebibytes(256), '256Mi'],
    ];
    const cpuLimits: [string, Cpu | string | number, string | number][] = [
      ['0.75 (string)', '0.75', '0.75'],
      ['750m', '750m', '750m'],
      ['0.75 (number)', 0.75, 0.75],
      ['Cpu.millis(75)', Cpu.millis(75), '75m'],
    ];
    const memoryLimits: [string, Size | string | number, string | number][] = [
      ['1073741824', '1073741824', '1073741824'],
      ['1Gi', '1Gi', '1Gi'],
      ['0.25Gi', '0.25Gi', '0.25Gi'],
      ['1073741824 (number)', 1073741824, 1073741824],
      ['Size.mebibytes(256)', Size.mebibytes(256), '256Mi'],
    ];

    describe.each(cpuRequests)('.cpu.request (%s),', (_: string, cpuRequest: Cpu | string | number, expectedCpuRequest: string | number) => {
      it('should generate a YAML with the specified CPU request and with default values for the other resources.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          activeGate: {
            resources: {
              cpu: {
                request: cpuRequest,
              },
            },
          },
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[2].spec.activeGate.resources.requests.cpu).toBe(expectedCpuRequest);
        expect(manifest[2].spec.activeGate.resources.requests.memory).toBe(DEFAULT_ACTIVE_GATE_MEMORY_REQUEST);
        expect(manifest[2].spec.activeGate.resources.limits.cpu).toBe(DEFAULT_ACTIVE_GATE_CPU_LIMIT);
        expect(manifest[2].spec.activeGate.resources.limits.memory).toBe(DEFAULT_ACTIVE_GATE_MEMORY_LIMIT);
      });
    });
    describe.each(memoryRequests)('.memory.request (%s),', (_: string, memoryRequest: Size | string | number, expectedMemoryRequest: string | number) => {
      it('should generate a YAML with the specified memory request and with default values for the other resources.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          activeGate: {
            resources: {
              memory: {
                request: memoryRequest,
              },
            },
          },
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[2].spec.activeGate.resources.requests.cpu).toBe(DEFAULT_ACTIVE_GATE_CPU_REQUEST);
        expect(manifest[2].spec.activeGate.resources.requests.memory).toBe(expectedMemoryRequest);
        expect(manifest[2].spec.activeGate.resources.limits.cpu).toBe(DEFAULT_ACTIVE_GATE_CPU_LIMIT);
        expect(manifest[2].spec.activeGate.resources.limits.memory).toBe(DEFAULT_ACTIVE_GATE_MEMORY_LIMIT);
      });
    });
    describe.each(cpuLimits)('.cpu.limit (%s),', (_: string, cpuLimit: Cpu | string | number, expectedCpuLimit: string | number) => {
      it('should generate a YAML with the specified CPU limit and with default values for the other resources.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          activeGate: {
            resources: {
              cpu: {
                limit: cpuLimit,
              },
            },
          },
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[2].spec.activeGate.resources.requests.cpu).toBe(DEFAULT_ACTIVE_GATE_CPU_REQUEST);
        expect(manifest[2].spec.activeGate.resources.requests.memory).toBe(DEFAULT_ACTIVE_GATE_MEMORY_REQUEST);
        expect(manifest[2].spec.activeGate.resources.limits.cpu).toBe(expectedCpuLimit);
        expect(manifest[2].spec.activeGate.resources.limits.memory).toBe(DEFAULT_ACTIVE_GATE_MEMORY_LIMIT);
      });
    });
    describe.each(memoryLimits)('.memory.limit (%s),', (_: string, memoryLimit: Size | string | number, expectedMemoryLimit: string | number) => {
      it('should generate a YAML with the specified memory limit and with default values for the other resources.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          activeGate: {
            resources: {
              memory: {
                limit: memoryLimit,
              },
            },
          },
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[2].spec.activeGate.resources.requests.cpu).toBe(DEFAULT_ACTIVE_GATE_CPU_REQUEST);
        expect(manifest[2].spec.activeGate.resources.requests.memory).toBe(DEFAULT_ACTIVE_GATE_MEMORY_REQUEST);
        expect(manifest[2].spec.activeGate.resources.limits.cpu).toBe(DEFAULT_ACTIVE_GATE_CPU_LIMIT);
        expect(manifest[2].spec.activeGate.resources.limits.memory).toBe(expectedMemoryLimit);
      });
    });
  });
  describe('.apiUrl', () => {
    const apiUrls = [
      'https://custom.api.url',
    ];

    describe.each(apiUrls)('(%s),', (apiUrl: string) => {
      it('should generate a YAML with the specified apiUrl.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          apiUrl,
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[2].spec.apiUrl).toBe(apiUrl);
      });
    });
  });
  describe('.deploymentOption,', () => {
    const testCases = [
      ['PLATFORM', `${fixturesDir}/deployment-options.platform.yml`],
      ['APPLICATION', `${fixturesDir}/deployment-options.application.yml`],
      ['FULL_STACK', `${fixturesDir}/deployment-options.full-stack.yml`],
    ];

    describe.each(testCases)('(%s),', (deploymentOption: string, referenceFileName: string) => {
      it('it should generate a YAML that matches the manifest published in the Dynatrace documentation.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          deploymentOption: DeploymentOption[deploymentOption as keyof typeof DeploymentOption],
        });

        // Generate the manifest YAML
        const manifest = toManifestYaml(Testing.synth(chart));

        // Assert
        expect(manifest).toMatchManifestFile(referenceFileName);
      });
    });
  });
  describe('.hostGroup', () => {
    const testCases = [
      ['host-group', 'PLATFORM'],
      ['host-group', 'APPLICATION'],
      ['host-group', 'FULL_STACK'],
    ];

    describe.each(testCases)('(%s) and with .deploymentOption=%s,', (hostGroup: string, deploymentOption: string) => {
      it('should generate a YAML with the specified hostGroup.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          deploymentOption: DeploymentOption[deploymentOption as keyof typeof DeploymentOption],
          hostGroup,
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[2].spec.oneAgent.hostGroup).toBe(hostGroup);
      });
    });
  });
  describe('.name', () => {
    const names = [
      'custom-name',
    ];

    describe.each(names)('(%s)', (name: string) => {
      it('should generate a YAML with the specified name.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          name,
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[1].metadata.name).toBe(name); // Secret resource
        expect(manifest[2].metadata.name).toBe(name); // DynaKube resource
      });
    });
  });
  describe('.namespace.name', () => {
    const namespaceNames = [
      'custom-namespace',
    ];

    describe.each(namespaceNames)('(%s),', (name: string) => {
      it('should generate a YAML with the specified namespace.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          namespace: {
            name,
          },
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[0].metadata.name).toBe(name); // Namespace resource
        expect(manifest[1].metadata.namespace).toBe(name); // Secret resource
        expect(manifest[2].metadata.namespace).toBe(name); // DynaKube resource
      });

      describe('and with .skipNamespaceCreation=true,', () => {
        it('should generate a YAML without namespace creation, referencing to the specified namespace (assuming it is already exist).', () => {
          // Arrange
          const app = Testing.app();
          const chart = new Chart(app, 'test');

          // Act
          new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
            ...defaultProps,
            namespace: {
              name,
              skipNamespaceCreation: true,
            },
          });

          // Generate the manifest as JSON
          const manifest = Testing.synth(chart);

          // Assert
          expect(manifest).not.toHaveNamespaceDeclaration();
          expect(manifest[0].metadata.namespace).toBe(name); // Secret resource
          expect(manifest[1].metadata.namespace).toBe(name); // DynaKube resource
        });
      });
    });
  });
  describe('.namespace.metadata', () => {
    const metadataSets = [
      {annotations: {'dummy/annotation': 'value'}},
      {labels: {'dummy/label': 'value'}},
    ];

    describe.each(metadataSets)('(%s)', (metadata: any) => {
      it('should generate a YAML with the specified metadata in the namespace definition.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          namespace: {
            metadata,
          },
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[0].metadata).toMatchObject(metadata);
      });
    });
  });
  describe('.namespace.skipNamespaceCreation', () => {
    describe('(true),', () => {
      it('should generate a YAML without the namespace.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          namespace: {
            skipNamespaceCreation: true,
          },
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest).not.toHaveNamespaceDeclaration();
      });

      describe('and a .metadata specified,', () => {
        it('should log a warning that metadata will be ignored.', () => {
          // Parameters
          const expectedWarningMessage =
            'WARNING: Namespace creation is skipped. Custom namespace metadata will not be applied.';

          // Arrange
          const app = Testing.app();
          const chart = new Chart(app, 'test');

          const warn = jest.spyOn(console, 'warn').mockImplementation(() => {
          });

          // Act
          new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
            ...defaultProps,
            namespace: {
              skipNamespaceCreation: true,
              metadata: {},
            }
          });

          // Assert
          expect(warn).toHaveBeenCalledWith(expectedWarningMessage);
        });
      });

    });
  });
  describe('.oneAgent.resources', () => {
    const cpuRequests: [string, Cpu | string | number, string | number][] = [
      ['0.1 (string)', '0.1', '0.1'],
      ['100m', '100m', '100m'],
      ['0.1 (number)', 0.1, 0.1],
      ['Cpu.millis(100)', Cpu.millis(100), '100m'],
    ];
    const memoryRequests: [string, Size | string | number, string | number][] = [
      ['268435456', '268435456', '268435456'],
      ['256Mi', '256Mi', '256Mi'],
      ['0.25Gi', '0.25Gi', '0.25Gi'],
      ['268435456 (number)', 268435456, 268435456],
      ['Size.mebibytes(256)', Size.mebibytes(256), '256Mi'],
    ];
    const cpuLimits: [string, Cpu | string | number, string | number][] = [
      ['0.75 (string)', '0.75', '0.75'],
      ['750m', '750m', '750m'],
      ['0.75 (number)', 0.75, 0.75],
      ['Cpu.millis(75)', Cpu.millis(75), '75m'],
    ];
    const memoryLimits: [string, Size | string | number, string | number][] = [
      ['1073741824', '1073741824', '1073741824'],
      ['1Gi', '1Gi', '1Gi'],
      ['0.25Gi', '0.25Gi', '0.25Gi'],
      ['1073741824 (number)', 1073741824, 1073741824],
      ['Size.mebibytes(256)', Size.mebibytes(256), '256Mi'],
    ];

    describe.each(cpuRequests)('.cpu.request (%s),', (_: string, cpuRequest: Cpu | string | number, expectedCpuRequest: string | number) => {
      it('should generate a YAML with the specified CPU request.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          deploymentOption: DeploymentOption.FULL_STACK,
          oneAgent: {
            resources: {
              cpu: {
                request: cpuRequest,
              },
            },
          },
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.requests?.cpu).toBe(expectedCpuRequest);
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.requests?.memory).toBeUndefined();
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.limits?.cpu).toBeUndefined();
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.limits?.memory).toBeUndefined();
      });
    });
    describe.each(memoryRequests)('.memory.request (%s)', (_: string, memoryRequest: Size | string | number, expectedMemoryRequest: string | number) => {
      it('should generate a YAML with the specified memory request.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          deploymentOption: DeploymentOption.FULL_STACK,
          oneAgent: {
            resources: {
              memory: {
                request: memoryRequest,
              },
            },
          },
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.requests?.cpu).toBeUndefined();
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.requests?.memory).toBe(expectedMemoryRequest);
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.limits?.cpu).toBeUndefined();
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.limits?.memory).toBeUndefined();
      });
    });
    describe.each(cpuLimits)('.cpu.limit (%s),', (_: string, cpuLimit: Cpu | string | number, expectedCpuLimit: string | number) => {
      it('should generate a YAML with the specified CPU limit.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          deploymentOption: DeploymentOption.FULL_STACK,
          oneAgent: {
            resources: {
              cpu: {
                limit: cpuLimit,
              },
            },
          },
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.requests?.cpu).toBeUndefined();
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.requests?.memory).toBeUndefined();
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.limits?.cpu).toBe(expectedCpuLimit);
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.limits?.memory).toBeUndefined();
      });
    });
    describe.each(memoryLimits)('.memory.limit (%s)', (_: string, memoryLimit: Size | string | number, expectedMemoryLimit: string | number) => {
      it('should generate a YAML with the specified memory limit.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          deploymentOption: DeploymentOption.FULL_STACK,
          oneAgent: {
            resources: {
              memory: {
                limit: memoryLimit,
              },
            },
          },
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.requests?.cpu).toBeUndefined();
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.requests?.memory).toBeUndefined();
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.limits?.cpu).toBeUndefined();
        expect(manifest[2].spec.oneAgent?.cloudNativeFullStack?.oneAgentResources?.limits?.memory).toBe(expectedMemoryLimit);
      });
    });

    const notSupportedTestCases = [
      'PLATFORM',
      'APPLICATION',
    ];

    describe.each(notSupportedTestCases)('with a not supported .deploymentOption (%s),', (deploymentOption: string) => {
      it('should log a warning that OneAgent resources will be ignored.', () => {
        // Parameters
        const expectedWarningMessage =
          'WARNING: OneAgent resources are only applicable for FULL_STACK deployment option. They will be ignored.';

        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {
        });

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          deploymentOption: DeploymentOption[deploymentOption as keyof typeof DeploymentOption],
          oneAgent: {
            resources: {},
          },
        });

        // Assert
        expect(warn).toHaveBeenCalledWith(expectedWarningMessage);
      });
    });
  });
  describe('.skipCertCheck', () => {
    const values = [
      undefined,
      true,
      false,
    ];

    describe.each(values)('(%s),', (skipCertCheck?: boolean) => {
      it('should generate a YAML with the skipCertCheck property.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          skipCertCheck,
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[2].spec.skipCertCheck).toBe(skipCertCheck);
      });
    });

  });
  describe('.tokens.dataIngestToken', () => {
    const platformMonitoringTestCases = [
      ['*** DATA INGEST TOKEN ***', 'PLATFORM'],
    ];

    describe.each(platformMonitoringTestCases)('(%s) and with .deploymentOption=%s,', (dataIngestToken: string, deploymentOption: string) => {
      it('should log a warning that dataIngestToken will be ignored.', () => {
        // Parameters
        const expectedWarningMessage =
          'WARNING: Data ingest token is not supported for platform monitoring. It will be ignored.';

        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {
        });

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          deploymentOption: DeploymentOption[deploymentOption as keyof typeof DeploymentOption],
          tokens: {
            apiToken: '*** API TOKEN ***',
            dataIngestToken,
          },
        });

        // Assert
        expect(warn).toHaveBeenCalledWith(expectedWarningMessage);
      });
    });

    const advancedMonitoringTestCases = [
      ['*** DATA INGEST TOKEN ***', 'APPLICATION'],
      ['*** DATA INGEST TOKEN ***', 'FULL_STACK'],
    ];
    describe.each(advancedMonitoringTestCases)('(%s) and with .deploymentOption=%s,', (dataIngestToken: string, deploymentOption: string) => {
      it('should add the dataIngestToken to the Secret resource.', () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          ...defaultProps,
          deploymentOption: DeploymentOption[deploymentOption as keyof typeof DeploymentOption],
          tokens: {
            apiToken: '*** API TOKEN ***',
            dataIngestToken,
          },
        });

        // Generate the manifest as JSON
        const manifest = Testing.synth(chart);

        // Assert
        expect(manifest[1].stringData.dataIngestToken).toBe(dataIngestToken);
      });
    });
  });
  describe('the proper properties,', () => {
    it(
      'it should be able to generate a YAML that matches the manifest generated by the Dynatrace UI.' +
      '(Deploy Dynatrace → Install OneAgent → Kubernetes / OpenShift)',
      () => {
        // Arrange
        const app = Testing.app();
        const chart = new Chart(app, 'test');

        // Act
        new DynatraceMonitoring(chart, 'dynatrace-monitoring', {
          activeGate: {
            capabilities: [
              Capability.DYNATRACE_API,
            ],
          },
          apiUrl: 'https://ENVIRONMENTID.live.dynatrace.com/api',
          deploymentOption: DeploymentOption.FULL_STACK,
          hostGroup: 'dynatrace-group',
          name: 'kubernetes-cluster-in-dynatrace',
          skipCertCheck: false,
          tokens: {
            apiToken: '*** API TOKEN ***',
            dataIngestToken: '*** DATA INGEST TOKEN ***',
          },
        });

        // Generate the manifest YAML
        const manifest = toManifestYaml(Testing.synth(chart));

        // Assert
        expect(manifest).toMatchManifestFile(`${fixturesDir}/generated-by-dynatrace-ui.yml`);
      });
  });
});
