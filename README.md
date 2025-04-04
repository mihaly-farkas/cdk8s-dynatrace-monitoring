[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cdk8s-dynatrace-monitoring&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cdk8s-dynatrace-monitoring)

# cdk8s-dynatrace-monitoring

**cdk8s-dynatrace-monitoring** is a high-level library that simplifies the integration of
[Dynatrace Kubernetes monitoring](https://www.dynatrace.com/monitoring/technologies/kubernetes-monitoring/) into your
[Kubernetes](https://kubernetes.io/) clusters.
It streamlines the setup process by automating the creation of the necessary monitoring resources, enabling quick and
efficient observability and performance monitoring.

## Getting Started

### Usage

> :construction: This project is currently under active development and not ready for production use.

### Development Setup

If you'd like to contribute or work with the source code, follow the steps below to set up the project.

#### Prerequisites

Make sure you have the following tools installed:

- **[Git](https://git-scm.com/)** – For managing your code with version control.
- **[Node.js](https://nodejs.org/)** (v14 or later) – A JavaScript runtime for building and running your application.
- **[Dynatrace Account](https://www.dynatrace.com/signup/)** – A Dynatrace account is required for setting up monitoring.

#### Setup Instructions

1. **Fork the Repository**<br><br>

   Fork the repository to your own GitHub account to begin working on it.<br><br>

2. **Clone the Repository**

   ```bash
   git clone git@github.com:your-name/cdk8s-dynatrace-monitoring.git
   cd dk8s-dynatrace-monitoring
   ```
   
3. **Install dependencies**<br><br>

   Run the following command to install the project dependencies:

   ```bash
   npm install
   ```

#### Running Tests

Clean the project and run tests with:

```bash
npm run clean && npm test
```

## License

This project is licensed under the [Apache-2.0 License](LICENSE).
