import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class IonosCloudVpnGateway implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud VPN Gateway',
		name: 'ionosCloudVpnGateway',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"]}} - {{$parameter["operation"]}}',
		description: 'Manage IONOS Cloud VPN Gateways (WireGuard and IPSec). Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud VPN Gateway',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'ionosCloud',
				required: true,
			},
		],
		properties: [
			// Location
			{
				displayName: 'Location',
				name: 'location',
				type: 'options',
				options: [
					{
						name: 'Frankfurt (de-fra)',
						value: 'de-fra',
					},
					{
						name: 'Berlin (de-txl)',
						value: 'de-txl',
					},
					{
						name: 'Vitoria (es-vit)',
						value: 'es-vit',
					},
					{
						name: 'Birmingham (gb-bhx)',
						value: 'gb-bhx',
					},
					{
						name: 'London (gb-lhr)',
						value: 'gb-lhr',
					},
					{
						name: 'Newark (us-ewr)',
						value: 'us-ewr',
					},
					{
						name: 'Las Vegas (us-las)',
						value: 'us-las',
					},
					{
						name: 'Kansas City (us-mci)',
						value: 'us-mci',
					},
					{
						name: 'Paris (fr-par)',
						value: 'fr-par',
					},
				],
				default: 'de-fra',
				description: 'The IONOS Cloud location',
			},

			// Resource
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'WireGuard Gateway',
						value: 'wireguardGateway',
					},
					{
						name: 'WireGuard Peer',
						value: 'wireguardPeer',
					},
					{
						name: 'IPSec Gateway',
						value: 'ipsecGateway',
					},
					{
						name: 'IPSec Tunnel',
						value: 'ipsecTunnel',
					},
				],
				default: 'wireguardGateway',
			},

			// Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['wireguardGateway', 'wireguardPeer', 'ipsecGateway', 'ipsecTunnel'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new resource',
						action: 'Create a resource',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a resource',
						action: 'Get a resource',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many resources',
						action: 'Get many resources',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a resource',
						action: 'Update a resource',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a resource',
						action: 'Delete a resource',
					},
				],
				default: 'create',
			},

			// ====================
			// WireGuard Gateway Fields
			// ====================

			// Gateway ID for WireGuard
			{
				displayName: 'Gateway ID',
				name: 'gatewayId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['wireguardGateway'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID (UUID) of the WireGuard Gateway',
			},

			// Name (all resources)
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['wireguardGateway', 'wireguardPeer', 'ipsecGateway', 'ipsecTunnel'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'My VPN Gateway',
				description: 'The human readable name',
			},

			// Description (all resources)
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['wireguardGateway', 'wireguardPeer', 'ipsecGateway', 'ipsecTunnel'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'Human readable description',
			},

			// Gateway IP (WireGuard and IPSec Gateways)
			{
				displayName: 'Gateway IP',
				name: 'gatewayIP',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['wireguardGateway', 'ipsecGateway'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: '81.173.1.2',
				description: 'Public IP address to be assigned to the gateway',
			},

			// Interface IPv4 CIDR (WireGuard only)
			{
				displayName: 'Interface IPv4 CIDR',
				name: 'interfaceIPv4CIDR',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['wireguardGateway'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: '172.16.0.1/30',
				description: 'The IPv4 address (with CIDR mask) to be assigned to the WireGuard interface. Either IPv4 or IPv6 is required.',
			},

			// Interface IPv6 CIDR (WireGuard only)
			{
				displayName: 'Interface IPv6 CIDR',
				name: 'interfaceIPv6CIDR',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['wireguardGateway'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'fd00::2/128',
				description: 'The IPv6 address (with CIDR mask) to be assigned to the WireGuard interface. Either IPv4 or IPv6 is required.',
			},

			// Private Key (WireGuard Gateway)
			{
				displayName: 'Private Key',
				name: 'privateKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['wireguardGateway'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: '0HpE4BNwGHabeaC4aY/GFxB6fBSc0d49Db0qAzRVSVc=',
				description: 'Private key used for WireGuard Server',
			},

			// Listen Port (WireGuard Gateway)
			{
				displayName: 'Listen Port',
				name: 'listenPort',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['wireguardGateway'],
						operation: ['create', 'update'],
					},
				},
				typeOptions: {
					minValue: 0,
					maxValue: 65535,
				},
				default: 51820,
				description: 'Port that WireGuard Server will listen on',
			},

			// Connections (WireGuard and IPSec Gateways)
			{
				displayName: 'Connections',
				name: 'connections',
				type: 'fixedCollection',
				required: true,
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['wireguardGateway', 'ipsecGateway'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				description: 'The network connections for your gateway',
				options: [
					{
						name: 'connectionValues',
						displayName: 'Connection',
						values: [
							{
								displayName: 'Datacenter ID',
								name: 'datacenterId',
								type: 'string',
								default: '',
								description: 'The datacenter to connect your VPN Gateway to',
							},
							{
								displayName: 'LAN ID',
								name: 'lanId',
								type: 'string',
								default: '',
								description: 'The numeric LAN ID to connect your VPN Gateway to',
							},
							{
								displayName: 'IPv4 CIDR',
								name: 'ipv4CIDR',
								type: 'string',
								default: '',
								placeholder: '192.168.1.100/24',
								description: 'A LAN IPv4 address in CIDR notation that will be assigned to the VPN Gateway',
							},
							{
								displayName: 'IPv6 CIDR',
								name: 'ipv6CIDR',
								type: 'string',
								default: '',
								placeholder: 'fd28:5f8d:d9fe:08bd::/64',
								description: 'A LAN IPv6 address in CIDR notation that will be assigned to the VPN Gateway',
							},
						],
					},
				],
			},

			// Tier (WireGuard and IPSec Gateways)
			{
				displayName: 'Tier',
				name: 'tier',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['wireguardGateway', 'ipsecGateway'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						name: 'Standard',
						value: 'STANDARD',
					},
					{
						name: 'Standard HA',
						value: 'STANDARD_HA',
					},
					{
						name: 'Enhanced',
						value: 'ENHANCED',
					},
					{
						name: 'Enhanced HA',
						value: 'ENHANCED_HA',
					},
					{
						name: 'Premium',
						value: 'PREMIUM',
					},
					{
						name: 'Premium HA',
						value: 'PREMIUM_HA',
					},
				],
				default: 'STANDARD',
				description: 'Gateway performance tier',
			},

			// ====================
			// WireGuard Peer Fields
			// ====================

			// WireGuard Gateway ID for Peer operations
			{
				displayName: 'WireGuard Gateway ID',
				name: 'wireguardGatewayId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['wireguardPeer'],
					},
				},
				default: '',
				description: 'The ID (UUID) of the WireGuard Gateway',
			},

			// Peer ID
			{
				displayName: 'Peer ID',
				name: 'peerId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['wireguardPeer'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID (UUID) of the WireGuard Peer',
			},

			// Public Key (WireGuard Peer)
			{
				displayName: 'Public Key',
				name: 'publicKey',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['wireguardPeer'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'no8iaSEoqfbI6PVYsdEiUU5efYdtKX8VAhKity19MWI=',
				description: 'WireGuard public key of the connecting peer',
			},

			// Allowed IPs (WireGuard Peer)
			{
				displayName: 'Allowed IPs',
				name: 'allowedIPs',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['wireguardPeer'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: '1.2.3.4/32, 10.0.0.0/24',
				description: 'Comma-separated list of subnet CIDRs that are allowed to connect. Use 0.0.0.0/0 or ::/0 for all addresses.',
			},

			// Endpoint Host (WireGuard Peer)
			{
				displayName: 'Endpoint Host',
				name: 'endpointHost',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['wireguardPeer'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: '1.2.3.4',
				description: 'Hostname or IPv4 address that the WireGuard Server will connect to',
			},

			// Endpoint Port (WireGuard Peer)
			{
				displayName: 'Endpoint Port',
				name: 'endpointPort',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['wireguardPeer'],
						operation: ['create', 'update'],
					},
				},
				typeOptions: {
					minValue: 0,
					maxValue: 65535,
				},
				default: 51820,
				description: 'Port that the WireGuard Server will connect to',
			},

			// ====================
			// IPSec Gateway Fields
			// ====================

			// IPSec Gateway ID
			{
				displayName: 'Gateway ID',
				name: 'ipsecGatewayId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipsecGateway'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID (UUID) of the IPSec Gateway',
			},

			// IPSec Version (IPSec Gateway)
			{
				displayName: 'IKE Version',
				name: 'version',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['ipsecGateway'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						name: 'IKEv2',
						value: 'IKEv2',
					},
				],
				default: 'IKEv2',
				description: 'The IKE version that is permitted for the VPN tunnels',
			},

			// ====================
			// IPSec Tunnel Fields
			// ====================

			// IPSec Gateway ID for Tunnel operations
			{
				displayName: 'IPSec Gateway ID',
				name: 'ipsecGatewayIdForTunnel',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipsecTunnel'],
					},
				},
				default: '',
				description: 'The ID (UUID) of the IPSec Gateway',
			},

			// Tunnel ID
			{
				displayName: 'Tunnel ID',
				name: 'tunnelId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipsecTunnel'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID (UUID) of the IPSec Tunnel',
			},

			// Remote Host (IPSec Tunnel)
			{
				displayName: 'Remote Host',
				name: 'remoteHost',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipsecTunnel'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'vpn.mycompany.com',
				description: 'The remote peer host fully qualified domain name or IPv4 IP to connect to',
			},

			// PSK Key (IPSec Tunnel)
			{
				displayName: 'Pre-Shared Key (PSK)',
				name: 'pskKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['ipsecTunnel'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'X2wosbaw74M8hQGbK3jCCaEusR6CCFRa',
				description: 'The Pre-Shared Key used for IPSec Authentication',
			},

			// Cloud Network CIDRs (IPSec Tunnel)
			{
				displayName: 'Cloud Network CIDRs',
				name: 'cloudNetworkCIDRs',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipsecTunnel'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: '192.168.1.0/24, 10.0.0.0/16',
				description: 'Comma-separated list of network CIDRs within your IONOS Cloud LAN. Use 0.0.0.0/0 or ::/0 for all addresses.',
			},

			// Peer Network CIDRs (IPSec Tunnel)
			{
				displayName: 'Peer Network CIDRs',
				name: 'peerNetworkCIDRs',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipsecTunnel'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: '172.16.0.0/16',
				description: 'Comma-separated list of network CIDRs on the remote side. Use 0.0.0.0/0 or ::/0 for all addresses.',
			},

			// IKE Settings (IPSec Tunnel)
			{
				displayName: 'IKE Settings',
				name: 'ikeSettings',
				type: 'collection',
				placeholder: 'Add IKE Setting',
				displayOptions: {
					show: {
						resource: ['ipsecTunnel'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				description: 'Settings for the initial security exchange phase (IKE)',
				options: [
					{
						displayName: 'Diffie-Hellman Group',
						name: 'diffieHellmanGroup',
						type: 'options',
						options: [
							{ name: '15-MODP3072', value: '15-MODP3072' },
							{ name: '16-MODP4096', value: '16-MODP4096' },
							{ name: '19-ECP256', value: '19-ECP256' },
							{ name: '20-ECP384', value: '20-ECP384' },
							{ name: '21-ECP521', value: '21-ECP521' },
							{ name: '28-ECP256BP', value: '28-ECP256BP' },
							{ name: '29-ECP384BP', value: '29-ECP384BP' },
							{ name: '30-ECP512BP', value: '30-ECP512BP' },
						],
						default: '16-MODP4096',
						description: 'The Diffie-Hellman Group to use',
					},
					{
						displayName: 'Encryption Algorithm',
						name: 'encryptionAlgorithm',
						type: 'options',
						options: [
							{ name: 'AES128-CTR', value: 'AES128-CTR' },
							{ name: 'AES256-CTR', value: 'AES256-CTR' },
							{ name: 'AES128-GCM-16', value: 'AES128-GCM-16' },
							{ name: 'AES256-GCM-16', value: 'AES256-GCM-16' },
							{ name: 'AES128-GCM-12', value: 'AES128-GCM-12' },
							{ name: 'AES256-GCM-12', value: 'AES256-GCM-12' },
							{ name: 'AES128-CCM-12', value: 'AES128-CCM-12' },
							{ name: 'AES256-CCM-12', value: 'AES256-CCM-12' },
							{ name: 'AES128', value: 'AES128' },
							{ name: 'AES256', value: 'AES256' },
						],
						default: 'AES256',
						description: 'The encryption algorithm to use',
					},
					{
						displayName: 'Integrity Algorithm',
						name: 'integrityAlgorithm',
						type: 'options',
						options: [
							{ name: 'SHA256', value: 'SHA256' },
							{ name: 'SHA384', value: 'SHA384' },
							{ name: 'SHA512', value: 'SHA512' },
							{ name: 'AES-XCBC', value: 'AES-XCBC' },
						],
						default: 'SHA256',
						description: 'The integrity algorithm to use',
					},
					{
						displayName: 'Lifetime',
						name: 'lifetime',
						type: 'number',
						typeOptions: {
							minValue: 3600,
							maxValue: 86400,
						},
						default: 86400,
						description: 'The phase lifetime in seconds',
					},
				],
			},

			// ESP Settings (IPSec Tunnel)
			{
				displayName: 'ESP Settings',
				name: 'espSettings',
				type: 'collection',
				placeholder: 'Add ESP Setting',
				displayOptions: {
					show: {
						resource: ['ipsecTunnel'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				description: 'Settings for the IPSec SA (ESP) phase',
				options: [
					{
						displayName: 'Diffie-Hellman Group',
						name: 'diffieHellmanGroup',
						type: 'options',
						options: [
							{ name: '15-MODP3072', value: '15-MODP3072' },
							{ name: '16-MODP4096', value: '16-MODP4096' },
							{ name: '19-ECP256', value: '19-ECP256' },
							{ name: '20-ECP384', value: '20-ECP384' },
							{ name: '21-ECP521', value: '21-ECP521' },
							{ name: '28-ECP256BP', value: '28-ECP256BP' },
							{ name: '29-ECP384BP', value: '29-ECP384BP' },
							{ name: '30-ECP512BP', value: '30-ECP512BP' },
						],
						default: '16-MODP4096',
						description: 'The Diffie-Hellman Group to use',
					},
					{
						displayName: 'Encryption Algorithm',
						name: 'encryptionAlgorithm',
						type: 'options',
						options: [
							{ name: 'AES128-CTR', value: 'AES128-CTR' },
							{ name: 'AES256-CTR', value: 'AES256-CTR' },
							{ name: 'AES128-GCM-16', value: 'AES128-GCM-16' },
							{ name: 'AES256-GCM-16', value: 'AES256-GCM-16' },
							{ name: 'AES128-GCM-12', value: 'AES128-GCM-12' },
							{ name: 'AES256-GCM-12', value: 'AES256-GCM-12' },
							{ name: 'AES128-CCM-12', value: 'AES128-CCM-12' },
							{ name: 'AES256-CCM-12', value: 'AES256-CCM-12' },
							{ name: 'AES128', value: 'AES128' },
							{ name: 'AES256', value: 'AES256' },
						],
						default: 'AES256',
						description: 'The encryption algorithm to use',
					},
					{
						displayName: 'Integrity Algorithm',
						name: 'integrityAlgorithm',
						type: 'options',
						options: [
							{ name: 'SHA256', value: 'SHA256' },
							{ name: 'SHA384', value: 'SHA384' },
							{ name: 'SHA512', value: 'SHA512' },
							{ name: 'AES-XCBC', value: 'AES-XCBC' },
						],
						default: 'SHA256',
						description: 'The integrity algorithm to use',
					},
					{
						displayName: 'Lifetime',
						name: 'lifetime',
						type: 'number',
						typeOptions: {
							minValue: 600,
							maxValue: 14400,
						},
						default: 3600,
						description: 'The phase lifetime in seconds',
					},
				],
			},

			// ====================
			// Common Fields
			// ====================

			// Return All
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getMany'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},

			// Limit
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getMany'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				default: 50,
				description: 'Max number of results to return',
			},

			// Offset
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getMany'],
					},
				},
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Number of results to skip',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const location = this.getNodeParameter('location', 0) as string;

		const baseUrl = `https://vpn.${location}.ionos.com`;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ====================
				// WireGuard Gateway
				// ====================

				if (resource === 'wireguardGateway') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i, '') as string;
						const gatewayIP = this.getNodeParameter('gatewayIP', i) as string;
						const interfaceIPv4CIDR = this.getNodeParameter('interfaceIPv4CIDR', i, '') as string;
						const interfaceIPv6CIDR = this.getNodeParameter('interfaceIPv6CIDR', i, '') as string;
						const privateKey = this.getNodeParameter('privateKey', i) as string;
						const listenPort = this.getNodeParameter('listenPort', i, 51820) as number;
						const tier = this.getNodeParameter('tier', i, 'STANDARD') as string;
						const connections = this.getNodeParameter('connections', i) as IDataObject;

						const properties: IDataObject = {
							name,
							gatewayIP,
							privateKey,
							listenPort,
							tier,
							connections: (connections.connectionValues as IDataObject[] || []).map((conn) => ({
								datacenterId: conn.datacenterId,
								lanId: conn.lanId,
								ipv4CIDR: conn.ipv4CIDR,
								...(conn.ipv6CIDR ? { ipv6CIDR: conn.ipv6CIDR } : {}),
							})),
						};

						if (description) properties.description = description;
						if (interfaceIPv4CIDR) properties.interfaceIPv4CIDR = interfaceIPv4CIDR;
						if (interfaceIPv6CIDR) properties.interfaceIPv6CIDR = interfaceIPv6CIDR;

						const body: IDataObject = { properties };

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/wireguardgateways`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const gatewayId = this.getNodeParameter('gatewayId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/wireguardgateways/${gatewayId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const offset = this.getNodeParameter('offset', i, 0) as number;

						const qs: IDataObject = { offset: offset.toString() };
						if (!returnAll) {
							qs.limit = limit.toString();
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/wireguardgateways`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const gatewayId = this.getNodeParameter('gatewayId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i, '') as string;
						const gatewayIP = this.getNodeParameter('gatewayIP', i) as string;
						const interfaceIPv4CIDR = this.getNodeParameter('interfaceIPv4CIDR', i, '') as string;
						const interfaceIPv6CIDR = this.getNodeParameter('interfaceIPv6CIDR', i, '') as string;
						const privateKey = this.getNodeParameter('privateKey', i) as string;
						const listenPort = this.getNodeParameter('listenPort', i, 51820) as number;
						const tier = this.getNodeParameter('tier', i, 'STANDARD') as string;
						const connections = this.getNodeParameter('connections', i) as IDataObject;

						const properties: IDataObject = {
							name,
							gatewayIP,
							privateKey,
							listenPort,
							tier,
							connections: (connections.connectionValues as IDataObject[] || []).map((conn) => ({
								datacenterId: conn.datacenterId,
								lanId: conn.lanId,
								ipv4CIDR: conn.ipv4CIDR,
								...(conn.ipv6CIDR ? { ipv6CIDR: conn.ipv6CIDR } : {}),
							})),
						};

						if (description) properties.description = description;
						if (interfaceIPv4CIDR) properties.interfaceIPv4CIDR = interfaceIPv4CIDR;
						if (interfaceIPv6CIDR) properties.interfaceIPv6CIDR = interfaceIPv6CIDR;

						const body: IDataObject = {
							id: gatewayId,
							properties,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/wireguardgateways/${gatewayId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const gatewayId = this.getNodeParameter('gatewayId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/wireguardgateways/${gatewayId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// WireGuard Peer
				// ====================

				else if (resource === 'wireguardPeer') {
					const wireguardGatewayId = this.getNodeParameter('wireguardGatewayId', i) as string;

					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i, '') as string;
						const publicKey = this.getNodeParameter('publicKey', i) as string;
						const allowedIPsStr = this.getNodeParameter('allowedIPs', i) as string;
						const endpointHost = this.getNodeParameter('endpointHost', i, '') as string;
						const endpointPort = this.getNodeParameter('endpointPort', i, 51820) as number;

						const allowedIPs = allowedIPsStr.split(',').map((ip) => ip.trim()).filter((ip) => ip);

						const properties: IDataObject = {
							name,
							publicKey,
							allowedIPs,
						};

						if (description) properties.description = description;
						if (endpointHost) {
							properties.endpoint = {
								host: endpointHost,
								port: endpointPort,
							};
						}

						const body: IDataObject = { properties };

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/wireguardgateways/${wireguardGatewayId}/peers`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const peerId = this.getNodeParameter('peerId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/wireguardgateways/${wireguardGatewayId}/peers/${peerId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const offset = this.getNodeParameter('offset', i, 0) as number;

						const qs: IDataObject = { offset: offset.toString() };
						if (!returnAll) {
							qs.limit = limit.toString();
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/wireguardgateways/${wireguardGatewayId}/peers`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const peerId = this.getNodeParameter('peerId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i, '') as string;
						const publicKey = this.getNodeParameter('publicKey', i) as string;
						const allowedIPsStr = this.getNodeParameter('allowedIPs', i) as string;
						const endpointHost = this.getNodeParameter('endpointHost', i, '') as string;
						const endpointPort = this.getNodeParameter('endpointPort', i, 51820) as number;

						const allowedIPs = allowedIPsStr.split(',').map((ip) => ip.trim()).filter((ip) => ip);

						const properties: IDataObject = {
							name,
							publicKey,
							allowedIPs,
						};

						if (description) properties.description = description;
						if (endpointHost) {
							properties.endpoint = {
								host: endpointHost,
								port: endpointPort,
							};
						}

						const body: IDataObject = {
							id: peerId,
							properties,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/wireguardgateways/${wireguardGatewayId}/peers/${peerId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const peerId = this.getNodeParameter('peerId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/wireguardgateways/${wireguardGatewayId}/peers/${peerId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// IPSec Gateway
				// ====================

				else if (resource === 'ipsecGateway') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i, '') as string;
						const gatewayIP = this.getNodeParameter('gatewayIP', i) as string;
						const version = this.getNodeParameter('version', i, 'IKEv2') as string;
						const tier = this.getNodeParameter('tier', i, 'STANDARD') as string;
						const connections = this.getNodeParameter('connections', i) as IDataObject;

						const properties: IDataObject = {
							name,
							gatewayIP,
							version,
							tier,
							connections: (connections.connectionValues as IDataObject[] || []).map((conn) => ({
								datacenterId: conn.datacenterId,
								lanId: conn.lanId,
								ipv4CIDR: conn.ipv4CIDR,
								...(conn.ipv6CIDR ? { ipv6CIDR: conn.ipv6CIDR } : {}),
							})),
						};

						if (description) properties.description = description;

						const body: IDataObject = { properties };

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/ipsecgateways`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const ipsecGatewayId = this.getNodeParameter('ipsecGatewayId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/ipsecgateways/${ipsecGatewayId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const offset = this.getNodeParameter('offset', i, 0) as number;

						const qs: IDataObject = { offset: offset.toString() };
						if (!returnAll) {
							qs.limit = limit.toString();
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/ipsecgateways`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const ipsecGatewayId = this.getNodeParameter('ipsecGatewayId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i, '') as string;
						const gatewayIP = this.getNodeParameter('gatewayIP', i) as string;
						const version = this.getNodeParameter('version', i, 'IKEv2') as string;
						const tier = this.getNodeParameter('tier', i, 'STANDARD') as string;
						const connections = this.getNodeParameter('connections', i) as IDataObject;

						const properties: IDataObject = {
							name,
							gatewayIP,
							version,
							tier,
							connections: (connections.connectionValues as IDataObject[] || []).map((conn) => ({
								datacenterId: conn.datacenterId,
								lanId: conn.lanId,
								ipv4CIDR: conn.ipv4CIDR,
								...(conn.ipv6CIDR ? { ipv6CIDR: conn.ipv6CIDR } : {}),
							})),
						};

						if (description) properties.description = description;

						const body: IDataObject = {
							id: ipsecGatewayId,
							properties,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/ipsecgateways/${ipsecGatewayId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const ipsecGatewayId = this.getNodeParameter('ipsecGatewayId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/ipsecgateways/${ipsecGatewayId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// IPSec Tunnel
				// ====================

				else if (resource === 'ipsecTunnel') {
					const ipsecGatewayIdForTunnel = this.getNodeParameter('ipsecGatewayIdForTunnel', i) as string;

					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i, '') as string;
						const remoteHost = this.getNodeParameter('remoteHost', i) as string;
						const pskKey = this.getNodeParameter('pskKey', i) as string;
						const cloudNetworkCIDRsStr = this.getNodeParameter('cloudNetworkCIDRs', i) as string;
						const peerNetworkCIDRsStr = this.getNodeParameter('peerNetworkCIDRs', i) as string;
						const ikeSettings = this.getNodeParameter('ikeSettings', i, {}) as IDataObject;
						const espSettings = this.getNodeParameter('espSettings', i, {}) as IDataObject;

						const cloudNetworkCIDRs = cloudNetworkCIDRsStr.split(',').map((cidr) => cidr.trim()).filter((cidr) => cidr);
						const peerNetworkCIDRs = peerNetworkCIDRsStr.split(',').map((cidr) => cidr.trim()).filter((cidr) => cidr);

						const properties: IDataObject = {
							name,
							remoteHost,
							auth: {
								method: 'PSK',
								psk: {
									key: pskKey,
								},
							},
							cloudNetworkCIDRs,
							peerNetworkCIDRs,
							ike: {
								diffieHellmanGroup: ikeSettings.diffieHellmanGroup || '16-MODP4096',
								encryptionAlgorithm: ikeSettings.encryptionAlgorithm || 'AES256',
								integrityAlgorithm: ikeSettings.integrityAlgorithm || 'SHA256',
								lifetime: ikeSettings.lifetime || 86400,
							},
							esp: {
								diffieHellmanGroup: espSettings.diffieHellmanGroup || '16-MODP4096',
								encryptionAlgorithm: espSettings.encryptionAlgorithm || 'AES256',
								integrityAlgorithm: espSettings.integrityAlgorithm || 'SHA256',
								lifetime: espSettings.lifetime || 3600,
							},
						};

						if (description) properties.description = description;

						const body: IDataObject = { properties };

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/ipsecgateways/${ipsecGatewayIdForTunnel}/tunnels`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const tunnelId = this.getNodeParameter('tunnelId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/ipsecgateways/${ipsecGatewayIdForTunnel}/tunnels/${tunnelId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const offset = this.getNodeParameter('offset', i, 0) as number;

						const qs: IDataObject = { offset: offset.toString() };
						if (!returnAll) {
							qs.limit = limit.toString();
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/ipsecgateways/${ipsecGatewayIdForTunnel}/tunnels`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const tunnelId = this.getNodeParameter('tunnelId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i, '') as string;
						const remoteHost = this.getNodeParameter('remoteHost', i) as string;
						const pskKey = this.getNodeParameter('pskKey', i) as string;
						const cloudNetworkCIDRsStr = this.getNodeParameter('cloudNetworkCIDRs', i) as string;
						const peerNetworkCIDRsStr = this.getNodeParameter('peerNetworkCIDRs', i) as string;
						const ikeSettings = this.getNodeParameter('ikeSettings', i, {}) as IDataObject;
						const espSettings = this.getNodeParameter('espSettings', i, {}) as IDataObject;

						const cloudNetworkCIDRs = cloudNetworkCIDRsStr.split(',').map((cidr) => cidr.trim()).filter((cidr) => cidr);
						const peerNetworkCIDRs = peerNetworkCIDRsStr.split(',').map((cidr) => cidr.trim()).filter((cidr) => cidr);

						const properties: IDataObject = {
							name,
							remoteHost,
							auth: {
								method: 'PSK',
								psk: {
									key: pskKey,
								},
							},
							cloudNetworkCIDRs,
							peerNetworkCIDRs,
							ike: {
								diffieHellmanGroup: ikeSettings.diffieHellmanGroup || '16-MODP4096',
								encryptionAlgorithm: ikeSettings.encryptionAlgorithm || 'AES256',
								integrityAlgorithm: ikeSettings.integrityAlgorithm || 'SHA256',
								lifetime: ikeSettings.lifetime || 86400,
							},
							esp: {
								diffieHellmanGroup: espSettings.diffieHellmanGroup || '16-MODP4096',
								encryptionAlgorithm: espSettings.encryptionAlgorithm || 'AES256',
								integrityAlgorithm: espSettings.integrityAlgorithm || 'SHA256',
								lifetime: espSettings.lifetime || 3600,
							},
						};

						if (description) properties.description = description;

						const body: IDataObject = {
							id: tunnelId,
							properties,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/ipsecgateways/${ipsecGatewayIdForTunnel}/tunnels/${tunnelId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const tunnelId = this.getNodeParameter('tunnelId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/ipsecgateways/${ipsecGatewayIdForTunnel}/tunnels/${tunnelId}`,
							},
						);

						responseData = { success: true };
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
