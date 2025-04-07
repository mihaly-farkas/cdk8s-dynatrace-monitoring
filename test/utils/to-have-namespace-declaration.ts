import type { MatcherFunction } from 'expect';

export const toHaveNamespaceDeclaration: MatcherFunction<[]> = function (this: jest.MatcherContext, actual: unknown): jest.CustomMatcherResult {
  let pass: boolean;
  let message: () => string;

  if (!Array.isArray(actual)) {
    pass = false;
    message = () => 'The actual value is not an array.';
  } else {
    pass = (actual as any[]).some(resource => resource?.kind === 'Namespace');
    message = pass
      ? () => 'The manifest contains a Namespace declaration.'
      : () => 'The manifest does not contain a Namespace declaration.';
  }

  return {pass, message};
};

declare global {
  namespace jest {
    // noinspection JSUnusedGlobalSymbols
    interface Matchers<R, T> {
      toHaveNamespaceDeclaration: (filename?: string) => void;
    }

    // noinspection JSUnusedGlobalSymbols
    interface Expect {
      toHaveNamespaceDeclaration: (filename?: string) => void;
    }
  }
}
