import * as yaml from 'js-yaml';

/**
 * Converts the synthesized output to a manifest YAML.
 *
 * @param synthesized The synthesized output from 'cdk8s'.
 */
export const toManifestYaml = (synthesized: any[]): string => synthesized
  .map((section: any) => yaml.dump(section))
  .join('---\n');

