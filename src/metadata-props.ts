import { ApiObjectMetadata } from 'cdk8s';

/**
 * A subset of Kubernetes metadata, excluding the `name` and `namespace`.
 *
 * The `name` and `namespace` are determined by the construct itself based on custom logic.
 * This class was created to avoid any confusion due to this behavior.
 * All other metadata fields will be passed unchanged to the underlying resources.
 */
export type MetadataProps = Omit<ApiObjectMetadata, 'name' | 'namespace'>;
