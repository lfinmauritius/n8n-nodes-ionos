# n8n-nodes-ionos

[![npm version](https://badge.fury.io/js/n8n-nodes-ionos.svg)](https://www.npmjs.com/package/n8n-nodes-ionos)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive n8n community package providing nodes for **IONOS Cloud** services integration. This package enables you to automate and orchestrate your IONOS infrastructure, domains, DNS, AI services, Kubernetes clusters, and more directly from n8n workflows.

**Developed by [Ascenzia](https://ascenzia.fr)** - Digital Innovation Agency

## Features

This package provides **24 powerful nodes** covering the entire IONOS ecosystem:

| Category | Nodes | Description |
|----------|-------|-------------|
| **DNS & Domains** | DNS, Domain, SSL | Manage DNS zones, records, domains, and SSL certificates |
| **AI/ML Services** | Cloud AI | Chat completions, embeddings, audio processing (OpenAI-compatible) |
| **Cloud Infrastructure** | Datacenter, Compute | Servers, volumes, images, snapshots |
| **Networking** | Network, Load Balancing | LANs, NICs, firewalls, NAT gateways, load balancers |
| **Kubernetes** | Kubernetes | Managed K8s clusters with auto-scaling node pools |
| **Storage** | Storage, Object Storage, NFS | S3-compatible storage, backup units, NFS file sharing |
| **Containers** | Container Registry | Docker/OCI registry with vulnerability scanning |
| **Databases** | DBaaS | Managed PostgreSQL, MariaDB, MongoDB, Redis |
| **CDN & Security** | CDN, Certificate Manager, VPN Gateway | Content delivery, SSL/TLS, WireGuard & IPSec VPN |
| **Observability** | Logging, Monitoring, Activity Log | Centralized logging, metrics, audit trails |
| **Billing** | Billing | Invoices, usage tracking, cost analysis |
| **Identity** | Identity | IAM password policies |
| **Auto-scaling** | VM Auto Scaling | Automatic VM scaling based on metrics |

## Installation

### Community Nodes (Recommended)

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-ionos`
4. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-ionos
```

For Docker installations:

```dockerfile
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-ionos
```

## Available Nodes

### DNS & Domain Management

| Node | Description | Key Operations |
|------|-------------|----------------|
| **IONOS DNS** | DNS zones and records management | Create, update, delete zones and records (A, AAAA, CNAME, MX, TXT, etc.) |
| **IONOS Domain** | Domain portfolio management | List domains, manage contacts, update nameservers |
| **IONOS SSL** | SSL/TLS certificates | Certificate lifecycle management |

### Cloud AI

| Node | Description | Key Operations |
|------|-------------|----------------|
| **IONOS Cloud AI** | AI Model Hub integration | Chat completions, embeddings, audio transcription (OpenAI-compatible API) |

### Cloud Infrastructure

| Node | Description | Key Operations |
|------|-------------|----------------|
| **IONOS Cloud Datacenter** | Datacenter management | Create, list, manage datacenters and locations |
| **IONOS Cloud Compute** | Servers and storage | Create/manage servers, volumes, snapshots, perform actions (start, stop, reboot) |
| **IONOS Cloud Network** | Networking | LANs, NICs, firewall rules, IP blocks, NAT gateways, flow logs |
| **IONOS Cloud Load Balancing** | Load balancers | Classic, Network (L4), Application (L7) load balancers, target groups |
| **IONOS Cloud Kubernetes** | Managed Kubernetes | Clusters, node pools, kubeconfig retrieval |
| **IONOS Cloud VM Auto Scaling** | Auto-scaling groups | Create scaling policies based on CPU, network, or custom metrics |

### Storage & Databases

| Node | Description | Key Operations |
|------|-------------|----------------|
| **IONOS Cloud Storage** | S3 keys and backups | Manage S3 access keys, backup units |
| **IONOS Cloud Object Storage** | S3-compatible storage | Access key management, region queries |
| **IONOS Cloud Network File Storage** | NFS storage | NFSv4.2 clusters and shares with access control |
| **IONOS Cloud Container Registry** | Container images | Docker/OCI registry, repositories, vulnerability scanning |
| **IONOS Cloud DBaaS** | Managed databases | PostgreSQL, MariaDB, MongoDB, Redis clusters |

### CDN & Security

| Node | Description | Key Operations |
|------|-------------|----------------|
| **IONOS Cloud CDN** | Content delivery | Distributions with routing rules, caching, WAF, geo-restrictions |
| **IONOS Cloud Certificate Manager** | SSL/TLS certificates | Import and manage certificates for cloud services |
| **IONOS Cloud DNS Service** | Managed DNS | Zones, records, secondary DNS configuration |
| **IONOS Cloud VPN Gateway** | VPN connectivity | WireGuard and IPSec gateways with tunnels and peers |
| **IONOS Cloud Identity** | IAM | Password policies for security compliance |

### Observability & Billing

| Node | Description | Key Operations |
|------|-------------|----------------|
| **IONOS Cloud Logging** | Centralized logging | Logging pipelines with Grafana Loki integration |
| **IONOS Cloud Monitoring** | Metrics collection | Monitoring pipelines with Prometheus compatibility |
| **IONOS Cloud Activity Log** | Audit logs | Query and filter activity logs for compliance |
| **IONOS Cloud Billing** | Cost management | Invoices, usage tracking, traffic analysis |

## Authentication

### IONOS API Credentials

For **DNS**, **Domain**, and **SSL** nodes.

1. Log into your [IONOS account](https://my.ionos.com)
2. Navigate to **Domains & SSL** > **DNS Settings**
3. Go to **API** section and generate a new API key

### IONOS Cloud Credentials

For all **Cloud** services (AI, Compute, Network, Kubernetes, etc.).

1. Access [IONOS Data Center Designer (DCD)](https://dcd.ionos.com)
2. Go to **Management** > **Token Manager**
3. Generate a new JWT token
4. Copy the token for use in n8n

## Example Workflows

### Dynamic DNS Update

```
Schedule Trigger → HTTP Request (Get IP) → IONOS DNS (Update A Record) → Slack Notification
```

### Auto-scaling Server Deployment

```
Webhook → IONOS Cloud Compute (Create Server) → IONOS Cloud Network (Configure NIC) → IONOS Cloud Load Balancing (Add to Target Group)
```

### Kubernetes Cluster Provisioning

```
Manual Trigger → IONOS Cloud Kubernetes (Create Cluster) → Wait → IONOS Cloud Kubernetes (Create Node Pool) → Get Kubeconfig → Save to Vault
```

### AI-Powered Document Processing

```
New Document → IONOS Cloud AI (Generate Embedding) → Store in Vector DB → IONOS Cloud AI (Generate Summary) → Send Email
```

### Automated Backup

```
Daily Schedule → IONOS Cloud Compute (List Volumes) → Loop: Create Snapshot → IONOS Cloud Storage (Update Backup) → Slack Notification
```

## Error Handling

All nodes support n8n's built-in error handling:

- **Continue on Fail**: Prevent workflow interruption
- **Retry on Fail**: Automatic retries for transient errors

Common HTTP status codes:

| Code | Description |
|------|-------------|
| `400` | Bad request - Invalid parameters |
| `401` | Authentication error |
| `403` | Insufficient permissions |
| `404` | Resource not found |
| `422` | Validation error |
| `429` | Rate limit exceeded |

## Development

### Prerequisites

- Node.js >= 18.10
- pnpm >= 9.1

### Build from Source

```bash
git clone https://github.com/lfinmauritius/n8n-nodes-ionos.git
cd n8n-nodes-ionos
pnpm install
npm run build
npm run lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/lfinmauritius/n8n-nodes-ionos/issues)
- **IONOS Documentation**: [docs.ionos.com](https://docs.ionos.com/)
- **n8n Community**: [community.n8n.io](https://community.n8n.io/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

---

## Acknowledgments

We would like to express our gratitude to:

- **[IONOS](https://www.ionos.com)** - For their excellent cloud platform and comprehensive API documentation that made this integration possible. Special thanks to the IONOS team for their support and assistance during the development of this package.

- **[n8n](https://n8n.io)** - For creating an amazing workflow automation platform and fostering a vibrant community.

---

<p align="center">
  <strong>Developed with passion by <a href="https://ascenzia.fr">Ascenzia</a></strong><br>
  Digital Innovation Agency - France
</p>

<p align="center">
  <a href="https://ascenzia.fr">Website</a> •
  <a href="mailto:contact@ascenzia.fr">Contact</a>
</p>

<p align="center">
  If you find this package useful, please consider:<br>
  ⭐ <strong>Starring the repository</strong> •
  📢 <strong>Sharing it with others</strong> •
  🤝 <strong>Contributing to the project</strong>
</p>
