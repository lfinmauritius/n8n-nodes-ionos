import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

const baseUrl = 'https://api.ionos.com/cloudapi/v6';

export class IonosCloudNetwork implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud Network',
		name: 'ionosCloudNetwork',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Manage IONOS Cloud Network resources (LANs, NICs, IP Blocks, NAT Gateways, Firewall Rules, Flow Logs). Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud Network',
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
			// Resource Selection
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'LAN',
						value: 'lan',
						description: 'Manage Local Area Networks',
					},
					{
						name: 'NIC',
						value: 'nic',
						description: 'Manage Network Interface Cards',
					},
					{
						name: 'Firewall Rule',
						value: 'firewallRule',
						description: 'Manage firewall rules on NICs',
					},
					{
						name: 'IP Block',
						value: 'ipBlock',
						description: 'Manage reserved IP blocks',
					},
					{
						name: 'NAT Gateway',
						value: 'natGateway',
						description: 'Manage NAT Gateways',
					},
					{
						name: 'NAT Gateway Rule',
						value: 'natGatewayRule',
						description: 'Manage NAT Gateway rules',
					},
					{
						name: 'Flow Log',
						value: 'flowLog',
						description: 'Manage flow logs for network monitoring',
					},
				],
				default: 'lan',
			},

			// LAN Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['lan'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a LAN',
						action: 'Create a LAN',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a LAN',
						action: 'Get a LAN',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many LANs',
						action: 'Get many LANs',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a LAN',
						action: 'Update a LAN',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a LAN',
						action: 'Delete a LAN',
					},
				],
				default: 'create',
			},

			// NIC Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['nic'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a NIC',
						action: 'Create a NIC',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a NIC',
						action: 'Get a NIC',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many NICs',
						action: 'Get many NICs',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a NIC',
						action: 'Update a NIC',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a NIC',
						action: 'Delete a NIC',
					},
				],
				default: 'create',
			},

			// Firewall Rule Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['firewallRule'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a firewall rule',
						action: 'Create a firewall rule',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a firewall rule',
						action: 'Get a firewall rule',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many firewall rules',
						action: 'Get many firewall rules',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a firewall rule',
						action: 'Update a firewall rule',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a firewall rule',
						action: 'Delete a firewall rule',
					},
				],
				default: 'create',
			},

			// IP Block Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ipBlock'],
					},
				},
				options: [
					{
						name: 'Reserve',
						value: 'reserve',
						description: 'Reserve an IP block',
						action: 'Reserve an IP block',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an IP block',
						action: 'Get an IP block',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many IP blocks',
						action: 'Get many IP blocks',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an IP block',
						action: 'Delete an IP block',
					},
				],
				default: 'reserve',
			},

			// NAT Gateway Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['natGateway'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a NAT gateway',
						action: 'Create a NAT gateway',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a NAT gateway',
						action: 'Get a NAT gateway',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many NAT gateways',
						action: 'Get many NAT gateways',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a NAT gateway',
						action: 'Update a NAT gateway',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a NAT gateway',
						action: 'Delete a NAT gateway',
					},
				],
				default: 'create',
			},

			// NAT Gateway Rule Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['natGatewayRule'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a NAT gateway rule',
						action: 'Create a NAT gateway rule',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a NAT gateway rule',
						action: 'Get a NAT gateway rule',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many NAT gateway rules',
						action: 'Get many NAT gateway rules',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a NAT gateway rule',
						action: 'Update a NAT gateway rule',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a NAT gateway rule',
						action: 'Delete a NAT gateway rule',
					},
				],
				default: 'create',
			},

			// Flow Log Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['flowLog'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a flow log',
						action: 'Create a flow log',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a flow log',
						action: 'Get a flow log',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many flow logs',
						action: 'Get many flow logs',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a flow log',
						action: 'Update a flow log',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a flow log',
						action: 'Delete a flow log',
					},
				],
				default: 'create',
			},

			// ====================
			// LAN Fields
			// ====================

			// Datacenter ID (for LAN)
			{
				displayName: 'Datacenter ID',
				name: 'datacenterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['lan'],
					},
				},
				default: '',
				description: 'The unique ID of the datacenter',
			},

			// LAN ID
			{
				displayName: 'LAN ID',
				name: 'lanId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['lan'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the LAN',
			},

			// LAN Name
			{
				displayName: 'Name',
				name: 'lanName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['lan'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the LAN',
			},

			// LAN Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['lan'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'Public',
						name: 'public',
						type: 'boolean',
						default: false,
						description: 'Whether the LAN has public internet access',
					},
					{
						displayName: 'PCC ID',
						name: 'pcc',
						type: 'string',
						default: '',
						description: 'The ID of the Private Cross-Connect (PCC) to connect this LAN to',
					},
				{
					displayName: 'IPv4 CIDR Block',
					name: 'ipv4CidrBlock',
					type: 'string',
					default: '',
					placeholder: '10.0.0.0/24',
					description: 'The IPv4 CIDR block for the LAN (e.g., 10.0.0.0/24, 192.168.1.0/24). Note: This field is only available during creation and is read-only after creation.',
				},
				{
					displayName: 'IPv6 CIDR Block',
					name: 'ipv6CidrBlock',
					type: 'string',
					default: '',
					placeholder: '2001:db8::/64',
					description: 'The IPv6 CIDR block for the LAN (e.g., 2001:db8::/64). Note: This field is only available during creation and is read-only after creation.',
				},
				],
			},

			// ====================
			// NIC Fields
			// ====================

			// Datacenter ID (for NIC)
			{
				displayName: 'Datacenter ID',
				name: 'datacenterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['nic', 'firewallRule'],
					},
				},
				default: '',
				description: 'The unique ID of the datacenter',
			},

			// Server ID (for NIC)
			{
				displayName: 'Server ID',
				name: 'serverId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['nic', 'firewallRule'],
					},
				},
				default: '',
				description: 'The unique ID of the server',
			},

			// NIC ID
			{
				displayName: 'NIC ID',
				name: 'nicId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['nic', 'firewallRule'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the NIC',
			},

			// NIC Name
			{
				displayName: 'Name',
				name: 'nicName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['nic'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the NIC',
			},

			// NIC LAN
			{
				displayName: 'LAN ID',
				name: 'lan',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['nic'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The LAN to connect the NIC to',
			},

			// NIC Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['nic'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'DHCP',
						name: 'dhcp',
						type: 'boolean',
						default: true,
						description: 'Whether the NIC should use DHCP',
					},
					{
						displayName: 'Firewall Active',
						name: 'firewallActive',
						type: 'boolean',
						default: true,
						description: 'Whether the firewall is active on this NIC',
					},
					{
						displayName: 'Firewall Type',
						name: 'firewallType',
						type: 'options',
						options: [
							{
								name: 'Bidirectional',
								value: 'BIDIRECTIONAL',
							},
							{
								name: 'Ingress',
								value: 'INGRESS',
							},
							{
								name: 'Egress',
								value: 'EGRESS',
							},
						],
						default: 'BIDIRECTIONAL',
						description: 'The type of firewall rules to apply',
					},
					{
						displayName: 'IPs',
						name: 'ips',
						type: 'string',
						default: '',
						description: 'Comma-separated list of IPs assigned to the NIC',
					},
					{
						displayName: 'IPv6 CIDR Block',
						name: 'ipv6CidrBlock',
						type: 'string',
						default: '',
						description: 'The IPv6 CIDR block for the NIC',
					},
					{
						displayName: 'IPv6 IPs',
						name: 'ipv6Ips',
						type: 'string',
						default: '',
						description: 'Comma-separated list of IPv6 IPs assigned to the NIC',
					},
				],
			},

			// ====================
			// Firewall Rule Fields
			// ====================

			// Firewall Rule ID
			{
				displayName: 'Firewall Rule ID',
				name: 'firewallRuleId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['firewallRule'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the firewall rule',
			},

			// Firewall Rule Name
			{
				displayName: 'Name',
				name: 'firewallRuleName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['firewallRule'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the firewall rule',
			},

			// Firewall Rule Protocol
			{
				displayName: 'Protocol',
				name: 'protocol',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['firewallRule'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'TCP',
						value: 'TCP',
					},
					{
						name: 'UDP',
						value: 'UDP',
					},
					{
						name: 'ICMP',
						value: 'ICMP',
					},
					{
						name: 'Any',
						value: 'ANY',
					},
				],
				default: 'TCP',
				description: 'The protocol for the firewall rule',
			},

			// Firewall Rule Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['firewallRule'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'Source MAC',
						name: 'sourceMac',
						type: 'string',
						default: '',
						description: 'Source MAC address',
					},
					{
						displayName: 'Source IP',
						name: 'sourceIp',
						type: 'string',
						default: '',
						description: 'Source IP address',
					},
					{
						displayName: 'Target IP',
						name: 'targetIp',
						type: 'string',
						default: '',
						description: 'Target IP address',
					},
					{
						displayName: 'Port Range Start',
						name: 'portRangeStart',
						type: 'number',
						default: 1,
						description: 'The starting port of the range',
					},
					{
						displayName: 'Port Range End',
						name: 'portRangeEnd',
						type: 'number',
						default: 65535,
						description: 'The ending port of the range',
					},
					{
						displayName: 'ICMP Type',
						name: 'icmpType',
						type: 'number',
						default: undefined,
						description: 'The ICMP type',
					},
					{
						displayName: 'ICMP Code',
						name: 'icmpCode',
						type: 'number',
						default: undefined,
						description: 'The ICMP code',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'Ingress',
								value: 'INGRESS',
							},
							{
								name: 'Egress',
								value: 'EGRESS',
							},
						],
						default: 'INGRESS',
						description: 'The type of traffic to filter',
					},
				],
			},

			// ====================
			// IP Block Fields
			// ====================

			// IP Block ID
			{
				displayName: 'IP Block ID',
				name: 'ipBlockId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipBlock'],
						operation: ['get', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the IP block',
			},

			// IP Block Location
			{
				displayName: 'Location',
				name: 'location',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipBlock'],
						operation: ['reserve'],
					},
				},
				options: [
					{
						name: 'Berlin (de/ber)',
						value: 'de/ber',
					},
					{
						name: 'Frankfurt (de/fra)',
						value: 'de/fra',
					},
					{
						name: 'Karlsruhe (de/txl)',
						value: 'de/txl',
					},
					{
						name: 'Las Vegas (us/las)',
						value: 'us/las',
					},
					{
						name: 'Logrono (es/vit)',
						value: 'es/vit',
					},
					{
						name: 'Paris (fr/par)',
						value: 'fr/par',
					},
					{
						name: 'Vienna (at/vie)',
						value: 'at/vie',
					},
				],
				default: 'de/fra',
				description: 'The location where to reserve the IP block',
			},

			// IP Block Size
			{
				displayName: 'Size',
				name: 'size',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipBlock'],
						operation: ['reserve'],
					},
				},
				default: 1,
				description: 'The number of IP addresses to reserve',
			},

			// IP Block Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['ipBlock'],
						operation: ['reserve'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The name of the IP block',
					},
				],
			},

			// ====================
			// NAT Gateway Fields
			// ====================

			// Datacenter ID (for NAT Gateway)
			{
				displayName: 'Datacenter ID',
				name: 'datacenterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['natGateway', 'natGatewayRule'],
					},
				},
				default: '',
				description: 'The unique ID of the datacenter',
			},

			// NAT Gateway ID
			{
				displayName: 'NAT Gateway ID',
				name: 'natGatewayId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['natGateway', 'natGatewayRule'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the NAT gateway',
			},

			// NAT Gateway Name
			{
				displayName: 'Name',
				name: 'natGatewayName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['natGateway'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the NAT gateway',
			},

			// NAT Gateway Public IPs
			{
				displayName: 'Public IPs',
				name: 'publicIps',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['natGateway'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Comma-separated list of public IPs for the NAT gateway',
			},

			// NAT Gateway LANs
			{
				displayName: 'LAN IDs',
				name: 'lans',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['natGateway'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Comma-separated list of LAN IDs to connect to the NAT gateway',
			},

			// NAT Gateway Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['natGateway'],
						operation: ['create', 'update'],
					},
				},
				options: [],
			},

			// ====================
			// NAT Gateway Rule Fields
			// ====================

			// NAT Gateway Rule ID
			{
				displayName: 'NAT Gateway Rule ID',
				name: 'natGatewayRuleId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['natGatewayRule'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the NAT gateway rule',
			},

			// NAT Gateway Rule Name
			{
				displayName: 'Name',
				name: 'natGatewayRuleName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['natGatewayRule'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the NAT gateway rule',
			},

			// NAT Gateway Rule Source Subnet
			{
				displayName: 'Source Subnet',
				name: 'sourceSubnet',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['natGatewayRule'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The source subnet in CIDR notation (e.g., 10.0.0.0/24)',
			},

			// NAT Gateway Rule Public IP
			{
				displayName: 'Public IP',
				name: 'publicIp',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['natGatewayRule'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The public IP to use for NAT',
			},

			// NAT Gateway Rule Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['natGatewayRule'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'Protocol',
						name: 'protocol',
						type: 'options',
						options: [
							{
								name: 'TCP',
								value: 'TCP',
							},
							{
								name: 'UDP',
								value: 'UDP',
							},
							{
								name: 'ICMP',
								value: 'ICMP',
							},
							{
								name: 'All',
								value: 'ALL',
							},
						],
						default: 'ALL',
						description: 'The protocol for the rule',
					},
					{
						displayName: 'Target Subnet',
						name: 'targetSubnet',
						type: 'string',
						default: '',
						description: 'The target subnet in CIDR notation',
					},
					{
						displayName: 'Target Port Range Start',
						name: 'targetPortRangeStart',
						type: 'number',
						default: undefined,
						description: 'The starting port of the target range',
					},
					{
						displayName: 'Target Port Range End',
						name: 'targetPortRangeEnd',
						type: 'number',
						default: undefined,
						description: 'The ending port of the target range',
					},
				],
			},

			// ====================
			// Flow Log Fields
			// ====================

			// Flow Log Parent Resource
			{
				displayName: 'Parent Resource',
				name: 'flowLogParent',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['flowLog'],
					},
				},
				options: [
					{
						name: 'NIC',
						value: 'nic',
						description: 'Flow log for a network interface',
					},
					{
						name: 'NAT Gateway',
						value: 'natGateway',
						description: 'Flow log for a NAT gateway',
					},
				],
				default: 'nic',
				description: 'The type of resource the flow log is attached to',
			},

			// Datacenter ID (for Flow Log)
			{
				displayName: 'Datacenter ID',
				name: 'datacenterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['flowLog'],
					},
				},
				default: '',
				description: 'The unique ID of the datacenter',
			},

			// Server ID (for Flow Log on NIC)
			{
				displayName: 'Server ID',
				name: 'serverId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['flowLog'],
						flowLogParent: ['nic'],
					},
				},
				default: '',
				description: 'The unique ID of the server',
			},

			// NIC ID (for Flow Log on NIC)
			{
				displayName: 'NIC ID',
				name: 'nicId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['flowLog'],
						flowLogParent: ['nic'],
						operation: ['create', 'get', 'getMany', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the NIC',
			},

			// NAT Gateway ID (for Flow Log on NAT Gateway)
			{
				displayName: 'NAT Gateway ID',
				name: 'natGatewayId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['flowLog'],
						flowLogParent: ['natGateway'],
						operation: ['create', 'get', 'getMany', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the NAT gateway',
			},

			// Flow Log ID
			{
				displayName: 'Flow Log ID',
				name: 'flowLogId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['flowLog'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the flow log',
			},

			// Flow Log Name
			{
				displayName: 'Name',
				name: 'flowLogName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['flowLog'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the flow log',
			},

			// Flow Log Action
			{
				displayName: 'Action',
				name: 'action',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['flowLog'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Accepted',
						value: 'ACCEPTED',
					},
					{
						name: 'Rejected',
						value: 'REJECTED',
					},
					{
						name: 'All',
						value: 'ALL',
					},
				],
				default: 'ALL',
				description: 'The traffic action to log',
			},

			// Flow Log Direction
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['flowLog'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Ingress',
						value: 'INGRESS',
					},
					{
						name: 'Egress',
						value: 'EGRESS',
					},
					{
						name: 'Bidirectional',
						value: 'BIDIRECTIONAL',
					},
				],
				default: 'BIDIRECTIONAL',
				description: 'The traffic direction to log',
			},

			// Flow Log Bucket
			{
				displayName: 'S3 Bucket Name',
				name: 'bucket',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['flowLog'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The S3 bucket name where logs will be stored',
			},

			// Flow Log Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['flowLog'],
						operation: ['create', 'update'],
					},
				},
				options: [],
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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ====================
				// LAN Operations
				// ====================
				if (resource === 'lan') {
					const datacenterId = this.getNodeParameter('datacenterId', i) as string;

					if (operation === 'create') {
						const name = this.getNodeParameter('lanName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								name,
								...(additionalFields.public !== undefined && { public: additionalFields.public }),
								...(additionalFields.pcc && { pcc: additionalFields.pcc }),
							...(additionalFields.ipv4CidrBlock && {
								ipv4CidrBlock: additionalFields.ipv4CidrBlock,
							}),
								...(additionalFields.ipv6CidrBlock && {
									ipv6CidrBlock: additionalFields.ipv6CidrBlock,
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/datacenters/${datacenterId}/lans`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const lanId = this.getNodeParameter('lanId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/datacenters/${datacenterId}/lans/${lanId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const qs: IDataObject = {
							depth: 1,
						};

						if (!returnAll) {
							qs.limit = limit;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/datacenters/${datacenterId}/lans`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const lanId = this.getNodeParameter('lanId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							...(additionalFields.public !== undefined && { public: additionalFields.public }),
							...(additionalFields.pcc && { pcc: additionalFields.pcc }),
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PATCH',
								url: `${baseUrl}/datacenters/${datacenterId}/lans/${lanId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const lanId = this.getNodeParameter('lanId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/datacenters/${datacenterId}/lans/${lanId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// NIC Operations
				// ====================
				else if (resource === 'nic') {
					const datacenterId = this.getNodeParameter('datacenterId', i) as string;
					const serverId = this.getNodeParameter('serverId', i) as string;

					if (operation === 'create') {
						const name = this.getNodeParameter('nicName', i) as string;
						const lan = this.getNodeParameter('lan', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								name,
								lan: parseInt(lan, 10),
								...(additionalFields.dhcp !== undefined && { dhcp: additionalFields.dhcp }),
								...(additionalFields.firewallActive !== undefined && {
									firewallActive: additionalFields.firewallActive,
								}),
								...(additionalFields.firewallType && {
									firewallType: additionalFields.firewallType,
								}),
								...(additionalFields.ips && {
									ips: (additionalFields.ips as string).split(',').map((ip) => ip.trim()),
								}),
								...(additionalFields.ipv6CidrBlock && {
									ipv6CidrBlock: additionalFields.ipv6CidrBlock,
								}),
								...(additionalFields.ipv6Ips && {
									ipv6Ips: (additionalFields.ipv6Ips as string).split(',').map((ip) => ip.trim()),
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/datacenters/${datacenterId}/servers/${serverId}/nics`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const nicId = this.getNodeParameter('nicId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/datacenters/${datacenterId}/servers/${serverId}/nics/${nicId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const qs: IDataObject = {
							depth: 1,
						};

						if (!returnAll) {
							qs.limit = limit;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/datacenters/${datacenterId}/servers/${serverId}/nics`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const nicId = this.getNodeParameter('nicId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								...(additionalFields.dhcp !== undefined && { dhcp: additionalFields.dhcp }),
								...(additionalFields.firewallActive !== undefined && {
									firewallActive: additionalFields.firewallActive,
								}),
								...(additionalFields.firewallType && {
									firewallType: additionalFields.firewallType,
								}),
								...(additionalFields.ips && {
									ips: (additionalFields.ips as string).split(',').map((ip) => ip.trim()),
								}),
								...(additionalFields.ipv6CidrBlock && {
									ipv6CidrBlock: additionalFields.ipv6CidrBlock,
								}),
								...(additionalFields.ipv6Ips && {
									ipv6Ips: (additionalFields.ipv6Ips as string).split(',').map((ip) => ip.trim()),
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PATCH',
								url: `${baseUrl}/datacenters/${datacenterId}/servers/${serverId}/nics/${nicId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const nicId = this.getNodeParameter('nicId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/datacenters/${datacenterId}/servers/${serverId}/nics/${nicId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Firewall Rule Operations
				// ====================
				else if (resource === 'firewallRule') {
					const datacenterId = this.getNodeParameter('datacenterId', i) as string;
					const serverId = this.getNodeParameter('serverId', i) as string;
					const nicId = this.getNodeParameter('nicId', i) as string;

					if (operation === 'create') {
						const name = this.getNodeParameter('firewallRuleName', i) as string;
						const protocol = this.getNodeParameter('protocol', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								name,
								protocol,
								...(additionalFields.sourceMac && { sourceMac: additionalFields.sourceMac }),
								...(additionalFields.sourceIp && { sourceIp: additionalFields.sourceIp }),
								...(additionalFields.targetIp && { targetIp: additionalFields.targetIp }),
								...(additionalFields.portRangeStart && {
									portRangeStart: additionalFields.portRangeStart,
								}),
								...(additionalFields.portRangeEnd && {
									portRangeEnd: additionalFields.portRangeEnd,
								}),
								...(additionalFields.icmpType !== undefined && {
									icmpType: additionalFields.icmpType,
								}),
								...(additionalFields.icmpCode !== undefined && {
									icmpCode: additionalFields.icmpCode,
								}),
								...(additionalFields.type && { type: additionalFields.type }),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/datacenters/${datacenterId}/servers/${serverId}/nics/${nicId}/firewallrules`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const firewallRuleId = this.getNodeParameter('firewallRuleId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/datacenters/${datacenterId}/servers/${serverId}/nics/${nicId}/firewallrules/${firewallRuleId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const qs: IDataObject = {
							depth: 1,
						};

						if (!returnAll) {
							qs.limit = limit;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/datacenters/${datacenterId}/servers/${serverId}/nics/${nicId}/firewallrules`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const firewallRuleId = this.getNodeParameter('firewallRuleId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								...(additionalFields.sourceMac && { sourceMac: additionalFields.sourceMac }),
								...(additionalFields.sourceIp && { sourceIp: additionalFields.sourceIp }),
								...(additionalFields.targetIp && { targetIp: additionalFields.targetIp }),
								...(additionalFields.portRangeStart && {
									portRangeStart: additionalFields.portRangeStart,
								}),
								...(additionalFields.portRangeEnd && {
									portRangeEnd: additionalFields.portRangeEnd,
								}),
								...(additionalFields.icmpType !== undefined && {
									icmpType: additionalFields.icmpType,
								}),
								...(additionalFields.icmpCode !== undefined && {
									icmpCode: additionalFields.icmpCode,
								}),
								...(additionalFields.type && { type: additionalFields.type }),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PATCH',
								url: `${baseUrl}/datacenters/${datacenterId}/servers/${serverId}/nics/${nicId}/firewallrules/${firewallRuleId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const firewallRuleId = this.getNodeParameter('firewallRuleId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/datacenters/${datacenterId}/servers/${serverId}/nics/${nicId}/firewallrules/${firewallRuleId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// IP Block Operations
				// ====================
				else if (resource === 'ipBlock') {
					if (operation === 'reserve') {
						const location = this.getNodeParameter('location', i) as string;
						const size = this.getNodeParameter('size', i) as number;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								location,
								size,
								...(additionalFields.name && { name: additionalFields.name }),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/ipblocks`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const ipBlockId = this.getNodeParameter('ipBlockId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/ipblocks/${ipBlockId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const qs: IDataObject = {
							depth: 1,
						};

						if (!returnAll) {
							qs.limit = limit;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/ipblocks`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'delete') {
						const ipBlockId = this.getNodeParameter('ipBlockId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/ipblocks/${ipBlockId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// NAT Gateway Operations
				// ====================
				else if (resource === 'natGateway') {
					const datacenterId = this.getNodeParameter('datacenterId', i) as string;

					if (operation === 'create') {
						const name = this.getNodeParameter('natGatewayName', i) as string;
						const publicIpsString = this.getNodeParameter('publicIps', i) as string;
						const lansString = this.getNodeParameter('lans', i) as string;

						const publicIps = publicIpsString.split(',').map((ip) => ip.trim());
						const lansArray = lansString.split(',').map((lanId) => ({ id: parseInt(lanId.trim(), 10) }));

						const body: IDataObject = {
							properties: {
								name,
								publicIps,
								lans: lansArray,
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/datacenters/${datacenterId}/natgateways`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const natGatewayId = this.getNodeParameter('natGatewayId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/datacenters/${datacenterId}/natgateways/${natGatewayId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const qs: IDataObject = {
							depth: 1,
						};

						if (!returnAll) {
							qs.limit = limit;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/datacenters/${datacenterId}/natgateways`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const natGatewayId = this.getNodeParameter('natGatewayId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: additionalFields,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PATCH',
								url: `${baseUrl}/datacenters/${datacenterId}/natgateways/${natGatewayId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const natGatewayId = this.getNodeParameter('natGatewayId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/datacenters/${datacenterId}/natgateways/${natGatewayId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// NAT Gateway Rule Operations
				// ====================
				else if (resource === 'natGatewayRule') {
					const datacenterId = this.getNodeParameter('datacenterId', i) as string;
					const natGatewayId = this.getNodeParameter('natGatewayId', i) as string;

					if (operation === 'create') {
						const name = this.getNodeParameter('natGatewayRuleName', i) as string;
						const sourceSubnet = this.getNodeParameter('sourceSubnet', i) as string;
						const publicIp = this.getNodeParameter('publicIp', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								name,
								sourceSubnet,
								publicIp,
								...(additionalFields.protocol && { protocol: additionalFields.protocol }),
								...(additionalFields.targetSubnet && { targetSubnet: additionalFields.targetSubnet }),
								...(additionalFields.targetPortRangeStart && {
									targetPortRange: {
										start: additionalFields.targetPortRangeStart,
										...(additionalFields.targetPortRangeEnd && {
											end: additionalFields.targetPortRangeEnd,
										}),
									},
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/datacenters/${datacenterId}/natgateways/${natGatewayId}/rules`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const natGatewayRuleId = this.getNodeParameter('natGatewayRuleId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/datacenters/${datacenterId}/natgateways/${natGatewayId}/rules/${natGatewayRuleId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const qs: IDataObject = {
							depth: 1,
						};

						if (!returnAll) {
							qs.limit = limit;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/datacenters/${datacenterId}/natgateways/${natGatewayId}/rules`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const natGatewayRuleId = this.getNodeParameter('natGatewayRuleId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								...(additionalFields.protocol && { protocol: additionalFields.protocol }),
								...(additionalFields.targetSubnet && { targetSubnet: additionalFields.targetSubnet }),
								...(additionalFields.targetPortRangeStart && {
									targetPortRange: {
										start: additionalFields.targetPortRangeStart,
										...(additionalFields.targetPortRangeEnd && {
											end: additionalFields.targetPortRangeEnd,
										}),
									},
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PATCH',
								url: `${baseUrl}/datacenters/${datacenterId}/natgateways/${natGatewayId}/rules/${natGatewayRuleId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const natGatewayRuleId = this.getNodeParameter('natGatewayRuleId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/datacenters/${datacenterId}/natgateways/${natGatewayId}/rules/${natGatewayRuleId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Flow Log Operations
				// ====================
				else if (resource === 'flowLog') {
					const datacenterId = this.getNodeParameter('datacenterId', i) as string;
					const flowLogParent = this.getNodeParameter('flowLogParent', i) as string;

					let baseEndpoint = '';
					if (flowLogParent === 'nic') {
						const serverId = this.getNodeParameter('serverId', i) as string;
						const nicId = this.getNodeParameter('nicId', i) as string;
						baseEndpoint = `${baseUrl}/datacenters/${datacenterId}/servers/${serverId}/nics/${nicId}/flowlogs`;
					} else if (flowLogParent === 'natGateway') {
						const natGatewayId = this.getNodeParameter('natGatewayId', i) as string;
						baseEndpoint = `${baseUrl}/datacenters/${datacenterId}/natgateways/${natGatewayId}/flowlogs`;
					}

					if (operation === 'create') {
						const name = this.getNodeParameter('flowLogName', i) as string;
						const action = this.getNodeParameter('action', i) as string;
						const direction = this.getNodeParameter('direction', i) as string;
						const bucket = this.getNodeParameter('bucket', i) as string;

						const body: IDataObject = {
							properties: {
								name,
								action,
								direction,
								bucket,
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: baseEndpoint,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const flowLogId = this.getNodeParameter('flowLogId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseEndpoint}/${flowLogId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const qs: IDataObject = {
							depth: 1,
						};

						if (!returnAll) {
							qs.limit = limit;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: baseEndpoint,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const flowLogId = this.getNodeParameter('flowLogId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: additionalFields,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PATCH',
								url: `${baseEndpoint}/${flowLogId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const flowLogId = this.getNodeParameter('flowLogId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseEndpoint}/${flowLogId}`,
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
