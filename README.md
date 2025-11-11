# n8n-nodes-ionos

[![npm version](https://badge.fury.io/js/n8n-nodes-ionos.svg)](https://www.npmjs.com/package/n8n-nodes-ionos)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive n8n community package providing nodes for **IONOS Cloud** services integration. This package enables you to automate and orchestrate your IONOS infrastructure, domains, DNS, AI services, Kubernetes clusters, and more directly from n8n workflows.

## Features

This package provides **22 powerful nodes** covering the entire IONOS ecosystem:

- 🌐 **DNS & Domain Management** - Manage DNS zones, records, domains, and SSL certificates
- 🤖 **AI/ML Services** - Integrate with IONOS Cloud AI for chat, embeddings, audio processing
- 🖥️ **Cloud Infrastructure** - Full control over datacenters, servers, volumes, and snapshots
- 🌐 **Networking** - Manage LANs, NICs, firewalls, NAT gateways, and IP blocks
- ⚖️ **Load Balancing** - Configure classic, network, and application load balancers
- ☸️ **Kubernetes** - Create and manage K8s clusters with auto-scaling node pools
- 💾 **Storage & Backup** - S3 object storage, backup units, and container registries
- 📈 **Auto-scaling** - VM auto-scaling groups with policies and metrics
- 🗄️ **Database as a Service** - Managed PostgreSQL, MariaDB, MongoDB, and Redis databases
- 🌍 **CDN & Edge** - Content delivery network with routing rules and certificates
- 🔐 **Security & Certificates** - SSL/TLS certificate management and VPN gateways
- 📊 **Monitoring & Logging** - Centralized logging pipelines and metrics collection
- 💰 **Billing & Activity** - Invoice management, usage tracking, and audit logs

## Installation

### Community Nodes (Recommended)

Install directly from n8n's Community Nodes interface:

1. Go to **Settings** → **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-ionos`
4. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-ionos
```

For Docker installations, add to your Dockerfile:

```dockerfile
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-ionos
```

## Available Nodes

### 1. IONOS DNS 🌐
Manage DNS zones and records.

**Resources:**
- **DNS Zone** - Create, get, update, and delete DNS zones
- **DNS Record** - Manage A, AAAA, CNAME, MX, TXT, and other DNS records

**Use Cases:**
- Automate DNS record updates
- Dynamic DNS configuration
- Domain verification automation
- Multi-zone management

### 2. IONOS Domain 🌍
Complete domain management including contacts and nameservers.

**Resources:**
- **Domain** - List and get domain information
- **Contact** - Manage domain contacts (owner, admin, tech, billing)
- **Nameserver** - Update domain nameservers

**Use Cases:**
- Domain portfolio management
- Automated contact updates
- Nameserver configuration
- Domain monitoring

### 3. IONOS SSL 🔒
SSL/TLS certificate management.

**Resources:**
- **Certificate** - Create, get, list, update, and delete SSL certificates

**Use Cases:**
- Certificate lifecycle management
- Automated certificate renewal workflows
- Multi-domain SSL deployment

### 4. IONOS Cloud AI 🤖
Integrate with IONOS AI Model Hub for LLM and AI services.

**Resources:**
- **Chat** - OpenAI-compatible chat completions
- **Embedding** - Generate text embeddings for semantic search
- **Audio** - Transcription and text-to-speech
- **Inference** - Custom model inference

**Use Cases:**
- Build AI-powered chatbots
- Semantic search implementation
- Audio transcription automation
- Custom ML model integration

### 5. IONOS Cloud VM Auto-scaling 📈
Automated VM scaling based on metrics.

**Resources:**
- **Auto-scaling Group** - Create and manage VM auto-scaling groups
- **Policy** - Configure scaling policies based on CPU, network, or custom metrics

**Use Cases:**
- Dynamic resource allocation
- Cost optimization through auto-scaling
- Load-based server provisioning

### 6. IONOS Cloud Datacenter 🏢
Datacenter and location management.

**Resources:**
- **Datacenter** - Create, get, update, and delete datacenters
- **Location** - List available locations and their features
- **Request** - Track async operations

**Use Cases:**
- Infrastructure provisioning
- Multi-datacenter orchestration
- Request status monitoring

### 7. IONOS Cloud Compute 💻
Complete server and volume management.

**Resources:**
- **Server** - Create, manage, and perform actions (start, stop, reboot)
- **Volume** - Manage storage volumes and snapshots
- **Image** - List available OS images
- **Snapshot** - Create and manage volume snapshots

**Use Cases:**
- Automated server provisioning
- Backup and snapshot workflows
- Server lifecycle management
- Volume management automation

### 8. IONOS Cloud Network 🌐
Advanced networking configuration.

**Resources:**
- **LAN** - Virtual network management
- **NIC** - Network interface configuration
- **Firewall Rule** - Security rules for NICs
- **IP Block** - Reserve and manage public IPs
- **NAT Gateway** - Configure NAT for private networks
- **NAT Gateway Rule** - Define NAT routing rules
- **Flow Log** - Network traffic logging

**Use Cases:**
- Network isolation and segmentation
- Firewall automation
- NAT configuration for hybrid setups
- Network monitoring and auditing

### 9. IONOS Cloud Load Balancing ⚖️
Layer 4 and Layer 7 load balancing.

**Resources:**
- **Load Balancer** (Classic) - Traditional load balancer with NIC balancing
- **Network Load Balancer** (Layer 4) - TCP/UDP load balancing
- **Application Load Balancer** (Layer 7) - HTTP/HTTPS load balancing
- **Target Group** - Define backend server groups
- **Forwarding Rule** - Configure traffic routing rules

**Use Cases:**
- High-availability application deployment
- Traffic distribution and routing
- Health check automation
- SSL/TLS termination

### 10. IONOS Cloud Kubernetes ☸️
Managed Kubernetes cluster orchestration.

**Resources:**
- **Cluster** - Create and manage K8s clusters
- **Node Pool** - Configure worker node groups with auto-scaling
- **Node** - Manage individual cluster nodes
- **Version** - Get available K8s versions

**Use Cases:**
- Automated K8s cluster provisioning
- Node pool scaling workflows
- Multi-cluster management
- Kubeconfig automation

### 11. IONOS Cloud Storage 💾
S3-compatible object storage and backup management.

**Resources:**
- **S3 Key** - Manage S3 access keys for users
- **Backup Unit** - Configure backup storage units

**Use Cases:**
- S3 credential rotation
- Backup automation
- Multi-user storage access management
- SSO URL generation for web access

### 12. IONOS Cloud Container Registry 📦
Docker and OCI-compatible container image registry.

**Resources:**
- **Registry** - Create and manage container registries
- **Token** - Generate access tokens for registry authentication
- **Repository** - Manage container image repositories
- **Artifact** - List and manage container artifacts
- **Vulnerability** - Scan images for security vulnerabilities

**Use Cases:**
- Private Docker registry hosting
- Container image lifecycle management
- CI/CD pipeline integration
- Security vulnerability scanning

### 13. IONOS Cloud DBaaS 🗄️
Managed database services (PostgreSQL, MariaDB, MongoDB, Redis).

**Resources:**
- **Cluster** - Create and manage database clusters
- **Database** - Database management within clusters
- **User** - Database user management
- **Backup** - Automated backup configuration
- **Log** - Access database logs

**Use Cases:**
- Managed database provisioning
- Database scaling automation
- Backup and restore workflows
- User and access management

### 14. IONOS Cloud CDN 🌍
Content Delivery Network for fast global content distribution.

**Resources:**
- **Distribution** - CDN distribution management
- **Routing Rule** - Configure routing and caching rules

**Use Cases:**
- Static asset acceleration
- Global content distribution
- Cache invalidation automation
- Custom routing configuration

### 15. IONOS Cloud Certificate Manager 🔐
SSL/TLS certificate lifecycle management.

**Resources:**
- **Certificate** - Import and manage SSL/TLS certificates

**Use Cases:**
- Certificate lifecycle automation
- Multi-domain certificate management
- Certificate renewal workflows
- Certificate deployment automation

### 16. IONOS Cloud DNS Service 🌐
Managed DNS service with advanced features.

**Resources:**
- **Zone** - DNS zone management
- **Record** - DNS record management (A, AAAA, CNAME, MX, TXT, etc.)
- **Secondary Zone** - Secondary DNS zone configuration

**Use Cases:**
- DNS zone provisioning
- Dynamic DNS updates
- Secondary DNS configuration
- DNS failover setup

### 17. IONOS Cloud VPN Gateway 🔒
Site-to-site VPN with WireGuard and IPsec support.

**Resources:**
- **WireGuard Gateway** - WireGuard VPN gateway management
- **WireGuard Peer** - Configure WireGuard peers
- **IPsec Gateway** - IPsec VPN gateway management
- **IPsec Tunnel** - IPsec tunnel configuration

**Use Cases:**
- Site-to-site VPN setup
- Secure datacenter connectivity
- Hybrid cloud networking
- Remote access automation

### 18. IONOS Cloud Activity Log 📋
Audit logging and activity tracking.

**Resources:**
- **Activity Log** - Query and filter activity logs

**Use Cases:**
- Security audit trails
- Compliance reporting
- Activity monitoring
- Resource change tracking

### 19. IONOS Cloud Billing 💰
Invoice and usage management.

**Resources:**
- **EVN** (Einzelverbrauchsnachweis) - Itemized usage data
- **Invoice** - Invoice management
- **Product** - Product catalog
- **Profile** - Billing profile information
- **Traffic** - Network traffic tracking
- **Usage** - Resource usage by contract or datacenter
- **Utilization** - Resource utilization metrics

**Use Cases:**
- Cost monitoring and analysis
- Invoice automation
- Usage tracking and reporting
- Chargeback and billing allocation

### 20. IONOS Cloud Logging 📊
Centralized log management with Grafana integration.

**Resources:**
- **Pipeline** - Create and manage logging pipelines
- **Key** - Pipeline authentication key management
- **Central Logging** - Enable/disable central logging

**Use Cases:**
- Centralized log collection
- Kubernetes log aggregation
- Docker container logging
- Grafana Loki integration

### 21. IONOS Cloud Monitoring 📈
Metrics collection and monitoring pipelines.

**Resources:**
- **Pipeline** - Create and manage monitoring pipelines
- **Key** - Pipeline authentication key management
- **Central Monitoring** - Enable/disable central monitoring

**Use Cases:**
- Centralized metrics collection
- Prometheus-compatible monitoring
- Grafana dashboards integration
- Performance monitoring automation

### 22. IONOS Cloud Object Storage Management 🗄️
S3-compatible object storage access key and region management.

**Resources:**
- **Access Key** - Create, manage, and renew S3 access keys
- **Region** - Query available S3 regions and capabilities

**Use Cases:**
- S3 credential generation and rotation
- Multi-region object storage setup
- Access key lifecycle management
- Integration with n8n's native S3 node

## Authentication

This package uses two credential types:

### IONOS API Credentials
For DNS, Domain, and SSL management.

**Required Fields:**
- API Key
- API Secret (optional for some operations)

**How to Get:**
1. Log into your IONOS account
2. Navigate to API settings
3. Generate a new API key

### IONOS Cloud Credentials
For all Cloud services (AI, Compute, Network, Kubernetes, Storage, etc.).

**Required Fields:**
- API Token (JWT Bearer Token)
- API Type (optional): AI Model Hub or Cloud API
- Region (optional): de, es, fr, us

**How to Get:**
1. Access IONOS Data Center Designer (DCD)
2. Navigate to Token Manager
3. Generate a new JWT token
4. Copy the token for use in n8n

## Example Workflows

### Automated DNS Update with IP Check

```
Trigger (Schedule)
  → HTTP Request (Get Public IP)
  → IONOS DNS (Update A Record)
  → Slack (Notification)
```

### Auto-scaling Server Deployment

```
Trigger (Webhook)
  → IONOS Cloud Datacenter (Get/Create DC)
  → IONOS Cloud Compute (Create Server)
  → IONOS Cloud Network (Attach NIC to LAN)
  → IONOS Cloud Load Balancing (Add to Target Group)
```

### Kubernetes Cluster Provisioning

```
Trigger (Manual/API)
  → IONOS Cloud Kubernetes (Create Cluster)
  → Wait (Cluster Ready)
  → IONOS Cloud Kubernetes (Create Node Pool)
  → IONOS Cloud Kubernetes (Get Kubeconfig)
  → Store (Save to Database/File)
```

### AI-Powered Content Processing

```
Trigger (New Document)
  → IONOS Cloud AI (Embedding - Create Vector)
  → Store in Vector DB
  → IONOS Cloud AI (Chat - Generate Summary)
  → Send via Email
```

### Backup Automation

```
Trigger (Schedule - Daily)
  → IONOS Cloud Compute (List Volumes)
  → For Each Volume:
    → IONOS Cloud Compute (Create Snapshot)
  → IONOS Cloud Storage (Update Backup Unit)
  → Slack (Success Notification)
```

## Supported Operations Summary

| Node | Resources | Operations | Total Ops |
|------|-----------|------------|-----------|
| IONOS DNS | 2 | Various | 13 |
| IONOS Domain | 3 | Various | 11 |
| IONOS SSL | 1 | CRUD | 5 |
| IONOS Cloud AI | 4 | Chat, Embed, Audio, Inference | 11 |
| IONOS Cloud VM Auto-scaling | 2 | CRUD + Policies | 10 |
| IONOS Cloud Datacenter | 3 | CRUD + Requests | 11 |
| IONOS Cloud Compute | 4 | CRUD + Actions | 25 |
| IONOS Cloud Network | 7 | CRUD + Advanced | 34 |
| IONOS Cloud Load Balancing | 5 | CRUD + Config | 28 |
| IONOS Cloud Kubernetes | 4 | CRUD + Kubeconfig | 17 |
| IONOS Cloud Storage | 2 | CRUD + SSO | 12 |
| IONOS Cloud Container Registry | 5 | CRUD + Scan | 23 |
| IONOS Cloud DBaaS | 5 | CRUD + Multi-DB | 29 |
| IONOS Cloud CDN | 2 | CRUD + Rules | 9 |
| IONOS Cloud Certificate Manager | 1 | CRUD | 5 |
| IONOS Cloud DNS Service | 3 | CRUD + Secondary | 14 |
| IONOS Cloud VPN Gateway | 4 | CRUD + Multi-Protocol | 20 |
| IONOS Cloud Activity Log | 1 | Query + Filter | 3 |
| IONOS Cloud Billing | 7 | Query + Reports | 15 |
| IONOS Cloud Logging | 3 | CRUD + Pipeline | 11 |
| IONOS Cloud Monitoring | 3 | CRUD + Pipeline | 11 |
| IONOS Cloud Object Storage Management | 2 | CRUD + Renew | 11 |
| **TOTAL** | **73** | - | **308** |

## API Rate Limits

IONOS APIs have rate limits to ensure fair usage:

- **Default Rate Limit**: Varies by endpoint
- **Burst Limit**: Concurrent request limit
- **Headers**: Check `X-RateLimit-Remaining`, `X-RateLimit-Limit`, `X-RateLimit-Burst`

The nodes automatically respect rate limits and return appropriate headers in responses.

## Error Handling

All nodes support n8n's built-in error handling:

- **Continue on Fail**: Enable to prevent workflow interruption
- **Retry on Fail**: Configure automatic retries for transient errors
- **Error Workflows**: Trigger separate workflows on errors

Common error codes:
- `400` - Bad request (invalid parameters)
- `401` - Authentication error (invalid credentials)
- `403` - Insufficient permissions
- `404` - Resource not found
- `422` - Validation error
- `429` - Rate limit exceeded
- `500` - Server error
- `503` - Service maintenance

## Development

### Prerequisites

- Node.js >= 18.10
- pnpm >= 9.1

### Setup

```bash
# Clone the repository
git clone https://github.com/lfinmauritius/n8n-nodes-ionos.git
cd n8n-nodes-ionos

# Install dependencies
pnpm install

# Build the package
npm run build

# Lint the code
npm run lint

# Fix linting issues
npm run lintfix
```

### Project Structure

```
n8n-nodes-ionos/
├── credentials/
│   ├── IonosApi.credentials.ts              # DNS/Domain/SSL auth
│   ├── IonosCloud.credentials.ts            # Cloud services auth
│   └── IonosCloudAiApi.credentials.ts       # AI services auth
├── nodes/
│   └── Ionos/
│       ├── IonosDns.node.ts                 # DNS management
│       ├── IonosDomain.node.ts              # Domain management
│       ├── IonosSsl.node.ts                 # SSL certificates
│       ├── IonosCloudAi.node.ts             # AI/ML services
│       ├── IonosCloudVMAutoScaling.node.ts  # VM auto-scaling
│       ├── IonosCloudDatacenter.node.ts     # Datacenter management
│       ├── IonosCloudCompute.node.ts        # Servers & volumes
│       ├── IonosCloudNetwork.node.ts        # Networking
│       ├── IonosCloudLoadBalancing.node.ts  # Load balancers
│       ├── IonosCloudKubernetes.node.ts     # K8s clusters
│       ├── IonosCloudStorage.node.ts        # Storage & backup
│       ├── IonosCloudContainerRegistry.node.ts  # Container registry
│       ├── IonosCloudDbaas.node.ts          # Database services
│       ├── IonosCloudCdn.node.ts            # CDN distribution
│       ├── IonosCloudCertificateManager.node.ts # Certificate manager
│       ├── IonosCloudDnsService.node.ts     # DNS service
│       ├── IonosCloudVpnGateway.node.ts     # VPN gateways
│       ├── IonosCloudActivityLog.node.ts    # Activity logs
│       ├── IonosCloudBilling.node.ts        # Billing & usage
│       ├── IonosCloudLogging.node.ts        # Centralized logging
│       ├── IonosCloudMonitoring.node.ts     # Monitoring pipelines
│       └── IonosCloudObjectStorageManagement.node.ts  # Object storage
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/lfinmauritius/n8n-nodes-ionos/issues)
- **Documentation**: [IONOS Cloud API Docs](https://docs.ionos.com/)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This is a community package and is not officially supported by IONOS. Use at your own risk.

## Acknowledgments

- Built for the [n8n](https://n8n.io) workflow automation platform
- Uses [IONOS Cloud API v6](https://api.ionos.com/cloudapi/v6/swagger.json)
- OpenAPI specifications provided by IONOS

## Roadmap

Future enhancements planned:
- [ ] Additional IONOS services integration
- [ ] Enhanced error messages and validation
- [ ] More workflow examples and templates
- [ ] Video tutorials and guides
- [ ] Advanced monitoring and logging features

---

**Developped with Love and AI by [Ascenzia](https://ascenzia.fr)**

**Made with ❤️ for the n8n community**

If you find this package useful, please consider:
- ⭐ Starring the repository
- 📢 Sharing it with others
- 🐛 Reporting bugs or requesting features
- 🤝 Contributing to the project
