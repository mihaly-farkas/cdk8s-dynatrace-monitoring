/**
 * Dynatrace authentication tokens.
 */
export interface Tokens {

  /**
   * Dynatrace API token (required).
   *
   * The API token is required for the Dynatrace operator to communicate with the Dynatrace platform.
   * Ensure that the following scopes are enabled for your API token:
   * - _Read settings_
   * - _Write settings_
   * - _Read entities_
   * - _Installer download_
   * - _Access problem and event feed, metrics, and topology_
   * - _Create ActiveGate tokens_
   *
   * To create an API token, use the _Access Tokens_ page in the Dynatrace UI.
   */
  readonly apiToken: string;

  /**
   * Optional data ingest token for metrics, logs, and OpenTelemetry traces.
   *
   * This token is used for ingesting metrics, logs, and OpenTelemetry traces from pods
   * outside the Dynatrace namespace.
   * It is only applicable if you are using advanced deployment options (APPLICATION/FULL_STACK).
   * Ensure that the following scopes are enabled for your data ingest token:
   *
   * - _Ingest metrics_
   * - _Ingest logs_
   * - _Ingest OpenTelemetry traces_
   *
   * To create a data ingest token, use the _Access Tokens_ page in the Dynatrace UI.
   */
  readonly dataIngestToken?: string;
}
