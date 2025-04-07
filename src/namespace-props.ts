import { MetadataProps } from './metadata-props';

export interface NamespaceProps {

  /**
   * The name of the Kubernetes namespace the Dynatrace resources to deploy to.
   *
   * @default 'dynatrace'
   */
  readonly name?: string;

  /**
   * Additional metadata properties for the Kubernetes namespace.
   *
   * Ignored if `skipNamespaceCreation` is true.
   */
  readonly metadata?: MetadataProps;


  /**
   * Whether to skip the creation of the Kubernetes namespace.
   *
   * If true, `namespaceProps` will not be used as the namespace name and assuming that the namespace already exists.
   *
   * @default false
   */
  readonly skipNamespaceCreation?: boolean;
}
