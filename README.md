# n8n-nodes-ionos

> **⚠️ BETA VERSION - Work in Progress**
> This node is currently in beta and under active development. Features may change and some functionality may not be fully tested. Use with caution in production environments.

This is an n8n community node for managing DNS records, zones, domains, and SSL certificates using the IONOS API.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### IONOS DNS Node

#### DNS Zone
- Create a new DNS zone
- Get zone details
- Update a zone
- Delete a zone
- List all zones

#### DNS Record
- Create a new DNS record (A, AAAA, CNAME, MX, TXT, SRV, NS, CAA)
- Get record details
- Update a record
- Delete a record
- List all records in a zone

### IONOS Domain Node

#### Domain Management
- Check domain availability
- Register a new domain
- Get domain details
- Update domain settings (nameservers, auto-renew, transfer lock, privacy)
- Renew a domain
- Transfer a domain to IONOS
- List all domains

#### Contact Management
- Create a contact (Person or Organization)
- Get contact details
- Update contact information
- Delete a contact
- List all contacts

### IONOS SSL Node

#### SSL Certificate Management
- Upload a new SSL certificate (with private key and certificate chain)
- Get certificate details
- Delete a certificate
- List all SSL certificates

## Credentials

You'll need an IONOS API key or prefix/secret combination. You can generate these in your IONOS account settings.

Authentication methods supported:
- API Key (Bearer Token)
- API Prefix + Secret (Basic Auth)

## Compatibility

This node has been tested with n8n version 1.0.0 and above.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [IONOS DNS API Documentation](https://api.ionos.com/docs/dns/v1/)
- [IONOS Domains API Documentation](https://developer.hosting.ionos.com/docs/domains)
- [IONOS SSL API Documentation](https://developer.hosting.ionos.com/docs/ssl)
- [IONOS Developer Portal](https://developer.hosting.ionos.com/)

## License

[MIT](LICENSE.md)
