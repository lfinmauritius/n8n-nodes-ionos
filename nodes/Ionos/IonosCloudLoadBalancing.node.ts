import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

const baseUrl = 'https://api.ionos.com/cloudapi/v6';

export class IonosCloudLoadBalancing implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud Load Balancing',
		name: 'ionosCloudLoadBalancing',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Manage IONOS Cloud Load Balancers (Classic, Network, Application, Target Groups). Developped with Love and AI by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud Load Balancing',
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
						name: 'Load Balancer',
						value: 'loadBalancer',
						description: 'Manage classic Load Balancers',
					},
					{
						name: 'Network Load Balancer',
						value: 'networkLoadBalancer',
						description: 'Manage Network Load Balancers (Layer 4)',
					},
					{
						name: 'Application Load Balancer',
						value: 'applicationLoadBalancer',
						description: 'Manage Application Load Balancers (Layer 7)',
					},
					{
						name: 'Target Group',
						value: 'targetGroup',
						description: 'Manage Target Groups for load balancers',
					},
					{
						name: 'Forwarding Rule',
						value: 'forwardingRule',
						description: 'Manage forwarding rules for load balancers',
					},
				],
				default: 'loadBalancer',
			},

			// Load Balancer Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['loadBalancer'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a load balancer',
						action: 'Create a load balancer',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a load balancer',
						action: 'Get a load balancer',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many load balancers',
						action: 'Get many load balancers',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a load balancer',
						action: 'Update a load balancer',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a load balancer',
						action: 'Delete a load balancer',
					},
					{
						name: 'Attach NIC',
						value: 'attachNic',
						description: 'Attach a NIC to the load balancer',
						action: 'Attach a NIC',
					},
					{
						name: 'Detach NIC',
						value: 'detachNic',
						description: 'Detach a NIC from the load balancer',
						action: 'Detach a NIC',
					},
					{
						name: 'List NICs',
						value: 'listNics',
						description: 'List NICs attached to the load balancer',
						action: 'List NICs',
					},
				],
				default: 'create',
			},

			// Network Load Balancer Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['networkLoadBalancer'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a network load balancer',
						action: 'Create a network load balancer',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a network load balancer',
						action: 'Get a network load balancer',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many network load balancers',
						action: 'Get many network load balancers',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a network load balancer',
						action: 'Update a network load balancer',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a network load balancer',
						action: 'Delete a network load balancer',
					},
				],
				default: 'create',
			},

			// Application Load Balancer Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['applicationLoadBalancer'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an application load balancer',
						action: 'Create an application load balancer',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an application load balancer',
						action: 'Get an application load balancer',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many application load balancers',
						action: 'Get many application load balancers',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an application load balancer',
						action: 'Update an application load balancer',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an application load balancer',
						action: 'Delete an application load balancer',
					},
				],
				default: 'create',
			},

			// Target Group Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['targetGroup'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a target group',
						action: 'Create a target group',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a target group',
						action: 'Get a target group',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many target groups',
						action: 'Get many target groups',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a target group',
						action: 'Update a target group',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a target group',
						action: 'Delete a target group',
					},
				],
				default: 'create',
			},

			// Forwarding Rule Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['forwardingRule'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a forwarding rule',
						action: 'Create a forwarding rule',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a forwarding rule',
						action: 'Get a forwarding rule',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many forwarding rules',
						action: 'Get many forwarding rules',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a forwarding rule',
						action: 'Update a forwarding rule',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a forwarding rule',
						action: 'Delete a forwarding rule',
					},
				],
				default: 'create',
			},

			// ====================
			// Load Balancer Fields
			// ====================

			// Datacenter ID (for Load Balancer)
			{
				displayName: 'Datacenter ID',
				name: 'datacenterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['loadBalancer', 'networkLoadBalancer', 'applicationLoadBalancer', 'forwardingRule'],
					},
				},
				default: '',
				description: 'The unique ID of the datacenter',
			},

			// Load Balancer Type (for Forwarding Rule)
			{
				displayName: 'Load Balancer Type',
				name: 'loadBalancerType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['forwardingRule'],
					},
				},
				options: [
					{
						name: 'Network Load Balancer',
						value: 'network',
					},
					{
						name: 'Application Load Balancer',
						value: 'application',
					},
				],
				default: 'network',
				description: 'The type of load balancer for the forwarding rule',
			},

			// Load Balancer ID
			{
				displayName: 'Load Balancer ID',
				name: 'loadBalancerId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['loadBalancer'],
						operation: ['get', 'update', 'delete', 'attachNic', 'detachNic', 'listNics'],
					},
				},
				default: '',
				description: 'The unique ID of the load balancer',
			},

			// Network Load Balancer ID
			{
				displayName: 'Network Load Balancer ID',
				name: 'networkLoadBalancerId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['networkLoadBalancer', 'forwardingRule'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the network load balancer',
			},

			// Network Load Balancer ID (for Forwarding Rule creation)
			{
				displayName: 'Network Load Balancer ID',
				name: 'networkLoadBalancerId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['forwardingRule'],
						loadBalancerType: ['network'],
						operation: ['create', 'getMany'],
					},
				},
				default: '',
				description: 'The unique ID of the network load balancer',
			},

			// Application Load Balancer ID
			{
				displayName: 'Application Load Balancer ID',
				name: 'applicationLoadBalancerId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['applicationLoadBalancer'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the application load balancer',
			},

			// Application Load Balancer ID (for Forwarding Rule)
			{
				displayName: 'Application Load Balancer ID',
				name: 'applicationLoadBalancerId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['forwardingRule'],
						loadBalancerType: ['application'],
						operation: ['create', 'getMany'],
					},
				},
				default: '',
				description: 'The unique ID of the application load balancer',
			},

			// Load Balancer Name
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['loadBalancer', 'networkLoadBalancer', 'applicationLoadBalancer'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the load balancer',
			},

			// Load Balancer Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['loadBalancer'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'DHCP',
						name: 'dhcp',
						type: 'boolean',
						default: true,
						description: 'Whether the load balancer uses DHCP',
					},
					{
						displayName: 'IP',
						name: 'ip',
						type: 'string',
						default: '',
						description: 'The IP address of the load balancer',
					},
				],
			},

			// Network Load Balancer Listener LAN
			{
				displayName: 'Listener LAN',
				name: 'listenerLan',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['networkLoadBalancer'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The LAN ID for the listener',
			},

			// Network Load Balancer Target LAN
			{
				displayName: 'Target LAN',
				name: 'targetLan',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['networkLoadBalancer'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The LAN ID for the targets',
			},

			// Network Load Balancer IPs
			{
				displayName: 'IPs',
				name: 'ips',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['networkLoadBalancer'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Comma-separated list of IPs for the load balancer',
			},

			// Network Load Balancer Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['networkLoadBalancer'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'LB Private IPs',
						name: 'lbPrivateIps',
						type: 'string',
						default: '',
						description: 'Comma-separated list of private IPs',
					},
				],
			},

			// Application Load Balancer Listener LAN
			{
				displayName: 'Listener LAN',
				name: 'listenerLan',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['applicationLoadBalancer'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The LAN ID for the listener',
			},

			// Application Load Balancer Target LAN
			{
				displayName: 'Target LAN',
				name: 'targetLan',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['applicationLoadBalancer'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The LAN ID for the targets',
			},

			// Application Load Balancer IPs
			{
				displayName: 'IPs',
				name: 'ips',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['applicationLoadBalancer'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Comma-separated list of IPs for the load balancer',
			},

			// Application Load Balancer Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['applicationLoadBalancer'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'LB Private IPs',
						name: 'lbPrivateIps',
						type: 'string',
						default: '',
						description: 'Comma-separated list of private IPs',
					},
				],
			},

			// NIC ID (for attach/detach operations)
			{
				displayName: 'NIC ID',
				name: 'nicId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['loadBalancer'],
						operation: ['attachNic', 'detachNic'],
					},
				},
				default: '',
				description: 'The ID of the NIC to attach/detach',
			},

			// ====================
			// Target Group Fields
			// ====================

			// Target Group ID
			{
				displayName: 'Target Group ID',
				name: 'targetGroupId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['targetGroup'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the target group',
			},

			// Target Group Name
			{
				displayName: 'Name',
				name: 'targetGroupName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['targetGroup'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the target group',
			},

			// Target Group Algorithm
			{
				displayName: 'Algorithm',
				name: 'algorithm',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['targetGroup'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Round Robin',
						value: 'ROUND_ROBIN',
					},
					{
						name: 'Least Connection',
						value: 'LEAST_CONNECTION',
					},
					{
						name: 'Random',
						value: 'RANDOM',
					},
					{
						name: 'Source IP',
						value: 'SOURCE_IP',
					},
				],
				default: 'ROUND_ROBIN',
				description: 'The load balancing algorithm',
			},

			// Target Group Protocol
			{
				displayName: 'Protocol',
				name: 'protocol',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['targetGroup'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'HTTP',
						value: 'HTTP',
					},
					{
						name: 'HTTPS',
						value: 'HTTPS',
					},
				],
				default: 'HTTP',
				description: 'The protocol for the target group',
			},

			// Target Group Targets
			{
				displayName: 'Targets',
				name: 'targets',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['targetGroup'],
						operation: ['create'],
					},
				},
				default: '[{"ip":"10.0.0.1","port":80,"weight":100,"healthCheckEnabled":true,"maintenanceEnabled":false}]',
				description: 'Array of targets with ip, port, weight, healthCheckEnabled, and maintenanceEnabled properties',
			},

			// Target Group Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['targetGroup'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'Health Check',
						name: 'healthCheck',
						type: 'json',
						default: '{"checkTimeout":2000,"checkInterval":10000,"retries":3}',
						description: 'Health check configuration with checkTimeout, checkInterval, and retries',
					},
					{
						displayName: 'HTTP Health Check',
						name: 'httpHealthCheck',
						type: 'json',
						default: '{"path":"/","method":"GET","matchType":"STATUS_CODE","response":"200"}',
						description: 'HTTP health check configuration',
					},
				],
			},

			// ====================
			// Forwarding Rule Fields
			// ====================

			// Forwarding Rule ID
			{
				displayName: 'Forwarding Rule ID',
				name: 'forwardingRuleId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['forwardingRule'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the forwarding rule',
			},

			// Forwarding Rule Name
			{
				displayName: 'Name',
				name: 'forwardingRuleName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['forwardingRule'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the forwarding rule',
			},

			// Forwarding Rule Protocol
			{
				displayName: 'Protocol',
				name: 'protocol',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['forwardingRule'],
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
						name: 'HTTP',
						value: 'HTTP',
					},
					{
						name: 'HTTPS',
						value: 'HTTPS',
					},
				],
				default: 'TCP',
				description: 'The protocol for the forwarding rule',
			},

			// Forwarding Rule Listener IP
			{
				displayName: 'Listener IP',
				name: 'listenerIp',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['forwardingRule'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The IP address on which the load balancer listens',
			},

			// Forwarding Rule Listener Port
			{
				displayName: 'Listener Port',
				name: 'listenerPort',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['forwardingRule'],
						operation: ['create'],
					},
				},
				default: 80,
				description: 'The port on which the load balancer listens',
			},

			// Forwarding Rule Targets (for Network LB)
			{
				displayName: 'Targets',
				name: 'targets',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['forwardingRule'],
						loadBalancerType: ['network'],
						operation: ['create'],
					},
				},
				default: '[{"ip":"10.0.0.1","port":8080,"weight":100,"healthCheckEnabled":true}]',
				description: 'Array of targets with ip, port, weight, and healthCheckEnabled properties',
			},

			// Forwarding Rule Target Group (for Application LB)
			{
				displayName: 'Target Group ID',
				name: 'targetGroupId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['forwardingRule'],
						loadBalancerType: ['application'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The ID of the target group',
			},

			// Forwarding Rule Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['forwardingRule'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'Health Check',
						name: 'healthCheck',
						type: 'json',
						default: '{"clientTimeout":50000,"connectTimeout":5000,"targetTimeout":50000,"retries":3}',
						description: 'Health check configuration (for Network LB)',
					},
					{
						displayName: 'Server Certificates',
						name: 'serverCertificates',
						type: 'string',
						default: '',
						description: 'Comma-separated list of certificate IDs (for Application LB HTTPS)',
					},
					{
						displayName: 'HTTP Rules',
						name: 'httpRules',
						type: 'json',
						default: '[]',
						description: 'Array of HTTP routing rules (for Application LB)',
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
						operation: ['getMany', 'listNics'],
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
						operation: ['getMany', 'listNics'],
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
				// Load Balancer Operations
				// ====================
				if (resource === 'loadBalancer') {
					const datacenterId = this.getNodeParameter('datacenterId', i) as string;

					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								name,
								...(additionalFields.dhcp !== undefined && { dhcp: additionalFields.dhcp }),
								...(additionalFields.ip && { ip: additionalFields.ip }),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/datacenters/${datacenterId}/loadbalancers`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const loadBalancerId = this.getNodeParameter('loadBalancerId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/datacenters/${datacenterId}/loadbalancers/${loadBalancerId}`,
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
								url: `${baseUrl}/datacenters/${datacenterId}/loadbalancers`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const loadBalancerId = this.getNodeParameter('loadBalancerId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								...(additionalFields.dhcp !== undefined && { dhcp: additionalFields.dhcp }),
								...(additionalFields.ip && { ip: additionalFields.ip }),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PATCH',
								url: `${baseUrl}/datacenters/${datacenterId}/loadbalancers/${loadBalancerId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const loadBalancerId = this.getNodeParameter('loadBalancerId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/datacenters/${datacenterId}/loadbalancers/${loadBalancerId}`,
							},
						);

						responseData = { success: true };
					} else if (operation === 'attachNic') {
						const loadBalancerId = this.getNodeParameter('loadBalancerId', i) as string;
						const nicId = this.getNodeParameter('nicId', i) as string;

						const body: IDataObject = {
							id: nicId,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/datacenters/${datacenterId}/loadbalancers/${loadBalancerId}/balancednics`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'detachNic') {
						const loadBalancerId = this.getNodeParameter('loadBalancerId', i) as string;
						const nicId = this.getNodeParameter('nicId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/datacenters/${datacenterId}/loadbalancers/${loadBalancerId}/balancednics/${nicId}`,
							},
						);

						responseData = { success: true };
					} else if (operation === 'listNics') {
						const loadBalancerId = this.getNodeParameter('loadBalancerId', i) as string;
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
								url: `${baseUrl}/datacenters/${datacenterId}/loadbalancers/${loadBalancerId}/balancednics`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					}
				}

				// ====================
				// Network Load Balancer Operations
				// ====================
				else if (resource === 'networkLoadBalancer') {
					const datacenterId = this.getNodeParameter('datacenterId', i) as string;

					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const listenerLan = this.getNodeParameter('listenerLan', i) as string;
						const targetLan = this.getNodeParameter('targetLan', i) as string;
						const ipsString = this.getNodeParameter('ips', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const ips = ipsString.split(',').map((ip) => ip.trim());

						const body: IDataObject = {
							properties: {
								name,
								listenerLan: parseInt(listenerLan, 10),
								targetLan: parseInt(targetLan, 10),
								ips,
								...(additionalFields.lbPrivateIps && {
									lbPrivateIps: (additionalFields.lbPrivateIps as string).split(',').map((ip) => ip.trim()),
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/datacenters/${datacenterId}/networkloadbalancers`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const networkLoadBalancerId = this.getNodeParameter('networkLoadBalancerId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/datacenters/${datacenterId}/networkloadbalancers/${networkLoadBalancerId}`,
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
								url: `${baseUrl}/datacenters/${datacenterId}/networkloadbalancers`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const networkLoadBalancerId = this.getNodeParameter('networkLoadBalancerId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								...(additionalFields.lbPrivateIps && {
									lbPrivateIps: (additionalFields.lbPrivateIps as string).split(',').map((ip) => ip.trim()),
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PATCH',
								url: `${baseUrl}/datacenters/${datacenterId}/networkloadbalancers/${networkLoadBalancerId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const networkLoadBalancerId = this.getNodeParameter('networkLoadBalancerId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/datacenters/${datacenterId}/networkloadbalancers/${networkLoadBalancerId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Application Load Balancer Operations
				// ====================
				else if (resource === 'applicationLoadBalancer') {
					const datacenterId = this.getNodeParameter('datacenterId', i) as string;

					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const listenerLan = this.getNodeParameter('listenerLan', i) as string;
						const targetLan = this.getNodeParameter('targetLan', i) as string;
						const ipsString = this.getNodeParameter('ips', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const ips = ipsString.split(',').map((ip) => ip.trim());

						const body: IDataObject = {
							properties: {
								name,
								listenerLan: parseInt(listenerLan, 10),
								targetLan: parseInt(targetLan, 10),
								ips,
								...(additionalFields.lbPrivateIps && {
									lbPrivateIps: (additionalFields.lbPrivateIps as string).split(',').map((ip) => ip.trim()),
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/datacenters/${datacenterId}/applicationloadbalancers`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const applicationLoadBalancerId = this.getNodeParameter('applicationLoadBalancerId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/datacenters/${datacenterId}/applicationloadbalancers/${applicationLoadBalancerId}`,
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
								url: `${baseUrl}/datacenters/${datacenterId}/applicationloadbalancers`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const applicationLoadBalancerId = this.getNodeParameter('applicationLoadBalancerId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								...(additionalFields.lbPrivateIps && {
									lbPrivateIps: (additionalFields.lbPrivateIps as string).split(',').map((ip) => ip.trim()),
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PATCH',
								url: `${baseUrl}/datacenters/${datacenterId}/applicationloadbalancers/${applicationLoadBalancerId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const applicationLoadBalancerId = this.getNodeParameter('applicationLoadBalancerId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/datacenters/${datacenterId}/applicationloadbalancers/${applicationLoadBalancerId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Target Group Operations
				// ====================
				else if (resource === 'targetGroup') {
					if (operation === 'create') {
						const name = this.getNodeParameter('targetGroupName', i) as string;
						const algorithm = this.getNodeParameter('algorithm', i) as string;
						const protocol = this.getNodeParameter('protocol', i) as string;
						const targetsJson = this.getNodeParameter('targets', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const targets = JSON.parse(targetsJson);

						const body: IDataObject = {
							properties: {
								name,
								algorithm,
								protocol,
								targets,
								...(additionalFields.healthCheck && {
									healthCheck: JSON.parse(additionalFields.healthCheck as string),
								}),
								...(additionalFields.httpHealthCheck && {
									httpHealthCheck: JSON.parse(additionalFields.httpHealthCheck as string),
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/targetgroups`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const targetGroupId = this.getNodeParameter('targetGroupId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/targetgroups/${targetGroupId}`,
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
								url: `${baseUrl}/targetgroups`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const targetGroupId = this.getNodeParameter('targetGroupId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								...(additionalFields.healthCheck && {
									healthCheck: JSON.parse(additionalFields.healthCheck as string),
								}),
								...(additionalFields.httpHealthCheck && {
									httpHealthCheck: JSON.parse(additionalFields.httpHealthCheck as string),
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PATCH',
								url: `${baseUrl}/targetgroups/${targetGroupId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const targetGroupId = this.getNodeParameter('targetGroupId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/targetgroups/${targetGroupId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Forwarding Rule Operations
				// ====================
				else if (resource === 'forwardingRule') {
					const datacenterId = this.getNodeParameter('datacenterId', i) as string;
					const loadBalancerType = this.getNodeParameter('loadBalancerType', i) as string;

					let baseEndpoint = '';
					let loadBalancerId = '';

					if (loadBalancerType === 'network') {
						loadBalancerId = this.getNodeParameter('networkLoadBalancerId', i) as string;
						baseEndpoint = `${baseUrl}/datacenters/${datacenterId}/networkloadbalancers/${loadBalancerId}/forwardingrules`;
					} else if (loadBalancerType === 'application') {
						loadBalancerId = this.getNodeParameter('applicationLoadBalancerId', i) as string;
						baseEndpoint = `${baseUrl}/datacenters/${datacenterId}/applicationloadbalancers/${loadBalancerId}/forwardingrules`;
					}

					if (operation === 'create') {
						const name = this.getNodeParameter('forwardingRuleName', i) as string;
						const protocol = this.getNodeParameter('protocol', i) as string;
						const listenerIp = this.getNodeParameter('listenerIp', i) as string;
						const listenerPort = this.getNodeParameter('listenerPort', i) as number;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								name,
								protocol,
								listenerIp,
								listenerPort,
							},
						};

						if (loadBalancerType === 'network') {
							const targetsJson = this.getNodeParameter('targets', i) as string;
							const targets = JSON.parse(targetsJson);
							(body.properties as IDataObject).targets = targets;

							if (additionalFields.healthCheck) {
								(body.properties as IDataObject).healthCheck = JSON.parse(additionalFields.healthCheck as string);
							}
						} else if (loadBalancerType === 'application') {
							const targetGroupId = this.getNodeParameter('targetGroupId', i) as string;
							(body.properties as IDataObject).targets = [{ targetGroup: { id: targetGroupId } }];

							if (additionalFields.serverCertificates) {
								(body.properties as IDataObject).serverCertificates = (additionalFields.serverCertificates as string).split(',').map((cert) => cert.trim());
							}

							if (additionalFields.httpRules) {
								(body.properties as IDataObject).httpRules = JSON.parse(additionalFields.httpRules as string);
							}
						}

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
						const forwardingRuleId = this.getNodeParameter('forwardingRuleId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseEndpoint}/${forwardingRuleId}`,
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
						const forwardingRuleId = this.getNodeParameter('forwardingRuleId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {},
						};

						if (loadBalancerType === 'network' && additionalFields.healthCheck) {
							(body.properties as IDataObject).healthCheck = JSON.parse(additionalFields.healthCheck as string);
						} else if (loadBalancerType === 'application') {
							if (additionalFields.serverCertificates) {
								(body.properties as IDataObject).serverCertificates = (additionalFields.serverCertificates as string).split(',').map((cert) => cert.trim());
							}
							if (additionalFields.httpRules) {
								(body.properties as IDataObject).httpRules = JSON.parse(additionalFields.httpRules as string);
							}
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PATCH',
								url: `${baseEndpoint}/${forwardingRuleId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const forwardingRuleId = this.getNodeParameter('forwardingRuleId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseEndpoint}/${forwardingRuleId}`,
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
