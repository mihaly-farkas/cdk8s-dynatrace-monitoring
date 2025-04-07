import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import sortKeysRecursive from 'sort-keys-recursive';
import type { MatcherFunction } from 'expect';
import { toManifestYaml } from './to-manifest-yaml';

const parseYaml = (yamlString: string): any[] => {
  return yaml
    .loadAll(yamlString, undefined, {json: true})
    .filter((doc: unknown) => doc !== null);
};


export const toMatchManifestFile: MatcherFunction<[filePath: string]> = function (this: jest.MatcherContext, actual: unknown, filePath: string): jest.CustomMatcherResult {
  const fullPath = path.resolve(filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf8');

  const expectedJson = parseYaml(fileContent);
  const expectedJsonSorted = expectedJson.map(resource => {
    if (resource.metadata) {
      resource.metadata = sortKeysRecursive(resource.metadata);
    }
    if (resource.spec) {
      resource.spec = sortKeysRecursive(resource.spec);
    }
    return resource;
  });
  const expected = toManifestYaml(expectedJsonSorted);

  return {
    pass: this.equals(actual, expected),
    message: () => {
      const hint = this.utils.matcherHint('toMatchManifestFile', 'actual', 'filePath');
      const diff = this.utils.printDiffOrStringify(
        expected,
        actual,
        'Expected',
        'Received',
        this.expand ?? false,
      );
      return `${hint}\n\n${diff}`;
    },
  };
};

declare global {
  namespace jest {
    // noinspection JSUnusedGlobalSymbols
    interface Matchers<R, T> {
      toMatchManifestFile: (filename?: string) => void;
    }

    // noinspection JSUnusedGlobalSymbols
    interface Expect {
      toMatchManifestFile: (filename?: string) => void;
    }
  }
}
