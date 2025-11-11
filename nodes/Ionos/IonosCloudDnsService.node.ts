import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

const baseUrl = 'https://dns.de-fra.ionos.com';

export class IonosCloudDnsService implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud DNS Service',
		name: 'ionosCloudDnsService',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Manage IONOS Cloud DNS zones, records, DNSSEC, and reverse DNS. Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud DNS Service',
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
						name: 'Zone',
						value: 'zone',
						description: 'Manage DNS zones',
					},
					{
						name: 'Secondary Zone',
						value: 'secondaryZone',
						description: 'Manage secondary DNS zones',
					},
					{
						name: 'Record',
						value: 'record',
						description: 'Manage DNS records',
					},
					{
						name: 'Zone File',
						value: 'zoneFile',
						description: 'Import/Export zone files',
					},
					{
						name: 'DNSSEC Key',
						value: 'dnssecKey',
						description: 'Manage DNSSEC keys',
					},
					{
						name: 'Reverse Record',
						value: 'reverseRecord',
						description: 'Manage reverse DNS (PTR) records',
					},
					{
						name: 'Quota',
						value: 'quota',
						description: 'Get quota information',
					},
				],
				default: 'zone',
			},

			// Zone Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['zone'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a DNS zone',
						action: 'Create a DNS zone',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a DNS zone',
						action: 'Get a DNS zone',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many DNS zones',
						action: 'Get many DNS zones',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a DNS zone',
						action: 'Update a DNS zone',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a DNS zone',
						action: 'Delete a DNS zone',
					},
				],
				default: 'create',
			},

			// Secondary Zone Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['secondaryZone'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a secondary zone',
						action: 'Create a secondary zone',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a secondary zone',
						action: 'Get a secondary zone',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many secondary zones',
						action: 'Get many secondary zones',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a secondary zone',
						action: 'Update a secondary zone',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a secondary zone',
						action: 'Delete a secondary zone',
					},
					{
						name: 'Transfer',
						value: 'transfer',
						description: 'Trigger AXFR transfer',
						action: 'Trigger AXFR transfer',
					},
				],
				default: 'create',
			},

			// Record Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['record'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a DNS record',
						action: 'Create a DNS record',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a DNS record',
						action: 'Get a DNS record',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many DNS records',
						action: 'Get many DNS records',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a DNS record',
						action: 'Update a DNS record',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a DNS record',
						action: 'Delete a DNS record',
					},
				],
				default: 'create',
			},

			// Zone File Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['zoneFile'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Export zone file',
						action: 'Export zone file',
					},
					{
						name: 'Import',
						value: 'import',
						description: 'Import zone file',
						action: 'Import zone file',
					},
				],
				default: 'get',
			},

			// DNSSEC Key Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['dnssecKey'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create DNSSEC keys',
						action: 'Create DNSSEC keys',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get DNSSEC keys',
						action: 'Get DNSSEC keys',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete DNSSEC keys',
						action: 'Delete DNSSEC keys',
					},
				],
				default: 'getMany',
			},

			// Reverse Record Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['reverseRecord'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a reverse DNS record',
						action: 'Create a reverse DNS record',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a reverse DNS record',
						action: 'Get a reverse DNS record',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many reverse DNS records',
						action: 'Get many reverse DNS records',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a reverse DNS record',
						action: 'Update a reverse DNS record',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a reverse DNS record',
						action: 'Delete a reverse DNS record',
					},
				],
				default: 'create',
			},

			// Quota Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['quota'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get quota information',
						action: 'Get quota information',
					},
				],
				default: 'get',
			},

			// ====================
			// Zone Fields
			// ====================

			// Zone ID
			{
				displayName: 'Zone ID',
				name: 'zoneId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['zone', 'record', 'zoneFile', 'dnssecKey'],
						operation: ['get', 'update', 'delete', 'import'],
					},
				},
				default: '',
				description: 'The unique ID (UUID) of the zone',
			},

			// Zone Name (for create)
			{
				displayName: 'Zone Name',
				name: 'zoneName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['zone'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'example.com',
				description: 'The zone name (domain)',
			},

			// Description
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['zone'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'Description for the zone',
			},

			// Enabled
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['zone'],
						operation: ['create', 'update'],
					},
				},
				default: true,
				description: 'Whether the zone is enabled',
			},

			// ====================
			// Secondary Zone Fields
			// ====================

			// Secondary Zone ID
			{
				displayName: 'Secondary Zone ID',
				name: 'secondaryZoneId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['secondaryZone'],
						operation: ['get', 'update', 'delete', 'transfer'],
					},
				},
				default: '',
				description: 'The unique ID (UUID) of the secondary zone',
			},

			// Zone Name (for secondary zone create)
			{
				displayName: 'Zone Name',
				name: 'zoneName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['secondaryZone'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'secondary.example.com',
				description: 'The zone name for the secondary zone',
			},

			// Primary IPs
			{
				displayName: 'Primary IPs',
				name: 'primaryIps',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['secondaryZone'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: '192.0.2.1,192.0.2.2',
				description: 'Comma-separated list of primary server IPs',
			},

			// ====================
			// Record Fields
			// ====================

			// Record ID
			{
				displayName: 'Record ID',
				name: 'recordId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID (UUID) of the record',
			},

			// Record Name
			{
				displayName: 'Record Name',
				name: 'recordName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'www',
				description: 'The record name (subdomain, use empty string for root)',
			},

			// Record Type
			{
				displayName: 'Record Type',
				name: 'recordType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						name: 'A',
						value: 'A',
						description: 'IPv4 address',
					},
					{
						name: 'AAAA',
						value: 'AAAA',
						description: 'IPv6 address',
					},
					{
						name: 'CNAME',
						value: 'CNAME',
						description: 'Canonical name',
					},
					{
						name: 'MX',
						value: 'MX',
						description: 'Mail exchange',
					},
					{
						name: 'TXT',
						value: 'TXT',
						description: 'Text record',
					},
					{
						name: 'SRV',
						value: 'SRV',
						description: 'Service locator',
					},
					{
						name: 'NS',
						value: 'NS',
						description: 'Name server',
					},
					{
						name: 'CAA',
						value: 'CAA',
						description: 'Certification Authority Authorization',
					},
					{
						name: 'SSHFP',
						value: 'SSHFP',
						description: 'SSH fingerprint',
					},
					{
						name: 'TLSA',
						value: 'TLSA',
						description: 'TLS authentication',
					},
					{
						name: 'HTTPS',
						value: 'HTTPS',
						description: 'HTTPS binding',
					},
					{
						name: 'SVCB',
						value: 'SVCB',
						description: 'Service binding',
					},
				],
				default: 'A',
				description: 'The DNS record type',
			},

			// Record Content
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: '192.0.2.1',
				description: 'The record content/value',
			},

			// TTL
			{
				displayName: 'TTL',
				name: 'ttl',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create', 'update'],
					},
				},
				default: 3600,
				description: 'Time to live in seconds',
			},

			// Priority (for MX, SRV)
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create', 'update'],
						recordType: ['MX', 'SRV'],
					},
				},
				default: 10,
				description: 'Priority value for MX/SRV records',
			},

			// Record Enabled
			{
				displayName: 'Enabled',
				name: 'recordEnabled',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create', 'update'],
					},
				},
				default: true,
				description: 'Whether the record is enabled',
			},

			// ====================
			// Zone File Fields
			// ====================

			// Zone File Content
			{
				displayName: 'Zone File Content',
				name: 'zoneFileContent',
				type: 'string',
				typeOptions: {
					rows: 15,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['zoneFile'],
						operation: ['import'],
					},
				},
				default: '',
				placeholder: '$ORIGIN example.com.\n$TTL 3600\n@ IN SOA ns1.example.com. admin.example.com. (\n  2024010101 ; serial\n  3600       ; refresh\n  1800       ; retry\n  604800     ; expire\n  86400 )    ; minimum\n',
				description: 'The zone file content in BIND format',
			},

			// ====================
			// DNSSEC Fields
			// ====================

			// DNSSEC Algorithm
			{
				displayName: 'Algorithm',
				name: 'dnssecAlgorithm',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['dnssecKey'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'RSASHA256',
						value: 'RSASHA256',
					},
					{
						name: 'ECDSAP256SHA256',
						value: 'ECDSAP256SHA256',
					},
					{
						name: 'ECDSAP384SHA384',
						value: 'ECDSAP384SHA384',
					},
					{
						name: 'ED25519',
						value: 'ED25519',
					},
				],
				default: 'ECDSAP256SHA256',
				description: 'The DNSSEC signing algorithm',
			},

			// ====================
			// Reverse Record Fields
			// ====================

			// Reverse Record ID
			{
				displayName: 'Reverse Record ID',
				name: 'reverseRecordId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['reverseRecord'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the reverse record',
			},

			// IP Address
			{
				displayName: 'IP Address',
				name: 'ipAddress',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['reverseRecord'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '192.0.2.1 or 2001:db8::1',
				description: 'The IP address for reverse DNS',
			},

			// Reverse Record Name
			{
				displayName: 'Name',
				name: 'reverseName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['reverseRecord'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'host.example.com',
				description: 'The hostname for the reverse DNS record',
			},

			// Reverse Record Description
			{
				displayName: 'Description',
				name: 'reverseDescription',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['reverseRecord'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'Description for the reverse record',
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
				default: 100,
				description: 'Max number of results to return',
			},

			// Filters
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['zone'],
						operation: ['getMany'],
					},
				},
				options: [
					{
						displayName: 'State',
						name: 'state',
						type: 'options',
						options: [
							{
								name: 'Available',
								value: 'AVAILABLE',
							},
							{
								name: 'Provisioning',
								value: 'PROVISIONING',
							},
							{
								name: 'Failed',
								value: 'FAILED',
							},
						],
						default: 'AVAILABLE',
						description: 'Filter by zone state',
					},
					{
						displayName: 'Zone Name',
						name: 'zoneName',
						type: 'string',
						default: '',
						description: 'Filter by zone name',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ====================
				// Zone Operations
				// ====================
				if (resource === 'zone') {
					if (operation === 'create') {
						const zoneName = this.getNodeParameter('zoneName', i) as string;
						const description = this.getNodeParameter('description', i, '') as string;
						const enabled = this.getNodeParameter('enabled', i, true) as boolean;

						const body: IDataObject = {
							properties: {
								zoneName,
								enabled,
							},
						};

						if (description) {
							(body.properties as IDataObject).description = description;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/zones`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const zoneId = this.getNodeParameter('zoneId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/zones/${zoneId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 100) as number;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;

						const qs: IDataObject = {};
						if (!returnAll) {
							qs.limit = limit;
						}

						if (filters.state) {
							qs['filter.state'] = filters.state;
						}
						if (filters.zoneName) {
							qs['filter.zoneName'] = filters.zoneName;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/zones`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const zoneId = this.getNodeParameter('zoneId', i) as string;
						const description = this.getNodeParameter('description', i, '') as string;
						const enabled = this.getNodeParameter('enabled', i, true) as boolean;

						const body: IDataObject = {
							properties: {
								enabled,
							},
						};

						if (description) {
							(body.properties as IDataObject).description = description;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/zones/${zoneId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const zoneId = this.getNodeParameter('zoneId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/zones/${zoneId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Secondary Zone Operations
				// ====================
				else if (resource === 'secondaryZone') {
					if (operation === 'create') {
						const zoneName = this.getNodeParameter('zoneName', i) as string;
						const primaryIps = this.getNodeParameter('primaryIps', i) as string;

						const body: IDataObject = {
							properties: {
								zoneName,
								primaryIps: primaryIps.split(',').map((ip) => ip.trim()),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/secondaryzones`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const secondaryZoneId = this.getNodeParameter('secondaryZoneId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/secondaryzones/${secondaryZoneId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const qs: IDataObject = {};
						if (!returnAll) {
							qs.limit = limit;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/secondaryzones`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const secondaryZoneId = this.getNodeParameter('secondaryZoneId', i) as string;
						const primaryIps = this.getNodeParameter('primaryIps', i) as string;

						const body: IDataObject = {
							properties: {
								primaryIps: primaryIps.split(',').map((ip) => ip.trim()),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/secondaryzones/${secondaryZoneId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const secondaryZoneId = this.getNodeParameter('secondaryZoneId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/secondaryzones/${secondaryZoneId}`,
							},
						);

						responseData = { success: true };
					} else if (operation === 'transfer') {
						const secondaryZoneId = this.getNodeParameter('secondaryZoneId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/secondaryzones/${secondaryZoneId}/axfr`,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					}
				}

				// ====================
				// Record Operations
				// ====================
				else if (resource === 'record') {
					const zoneId = this.getNodeParameter('zoneId', i) as string;

					if (operation === 'create') {
						const recordName = this.getNodeParameter('recordName', i) as string;
						const recordType = this.getNodeParameter('recordType', i) as string;
						const content = this.getNodeParameter('content', i) as string;
						const ttl = this.getNodeParameter('ttl', i, 3600) as number;
						const recordEnabled = this.getNodeParameter('recordEnabled', i, true) as boolean;

						const body: IDataObject = {
							properties: {
								name: recordName,
								type: recordType,
								content,
								ttl,
								enabled: recordEnabled,
							},
						};

						if (recordType === 'MX' || recordType === 'SRV') {
							const priority = this.getNodeParameter('priority', i, 10) as number;
							(body.properties as IDataObject).priority = priority;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/zones/${zoneId}/records`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const recordId = this.getNodeParameter('recordId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/zones/${zoneId}/records/${recordId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const qs: IDataObject = {};
						if (!returnAll) {
							qs.limit = limit;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/zones/${zoneId}/records`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const recordId = this.getNodeParameter('recordId', i) as string;
						const recordName = this.getNodeParameter('recordName', i) as string;
						const recordType = this.getNodeParameter('recordType', i) as string;
						const content = this.getNodeParameter('content', i) as string;
						const ttl = this.getNodeParameter('ttl', i, 3600) as number;
						const recordEnabled = this.getNodeParameter('recordEnabled', i, true) as boolean;

						const body: IDataObject = {
							properties: {
								name: recordName,
								type: recordType,
								content,
								ttl,
								enabled: recordEnabled,
							},
						};

						if (recordType === 'MX' || recordType === 'SRV') {
							const priority = this.getNodeParameter('priority', i, 10) as number;
							(body.properties as IDataObject).priority = priority;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/zones/${zoneId}/records/${recordId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const recordId = this.getNodeParameter('recordId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/zones/${zoneId}/records/${recordId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Zone File Operations
				// ====================
				else if (resource === 'zoneFile') {
					const zoneId = this.getNodeParameter('zoneId', i) as string;

					if (operation === 'get') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/zones/${zoneId}/zonefile`,
							},
						);
					} else if (operation === 'import') {
						const zoneFileContent = this.getNodeParameter('zoneFileContent', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/zones/${zoneId}/zonefile`,
								body: zoneFileContent,
								headers: { 'Content-Type': 'text/plain' },
							},
						);
					}
				}

				// ====================
				// DNSSEC Key Operations
				// ====================
				else if (resource === 'dnssecKey') {
					const zoneId = this.getNodeParameter('zoneId', i) as string;

					if (operation === 'create') {
						const dnssecAlgorithm = this.getNodeParameter('dnssecAlgorithm', i, 'ECDSAP256SHA256') as string;

						const body: IDataObject = {
							properties: {
								keyParameters: [
									{
										algorithm: dnssecAlgorithm,
									},
								],
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/zones/${zoneId}/keys`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'getMany') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/zones/${zoneId}/keys`,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'delete') {
						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/zones/${zoneId}/keys`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Reverse Record Operations
				// ====================
				else if (resource === 'reverseRecord') {
					if (operation === 'create') {
						const ipAddress = this.getNodeParameter('ipAddress', i) as string;
						const reverseName = this.getNodeParameter('reverseName', i) as string;
						const reverseDescription = this.getNodeParameter('reverseDescription', i, '') as string;

						const body: IDataObject = {
							properties: {
								ip: ipAddress,
								name: reverseName,
							},
						};

						if (reverseDescription) {
							(body.properties as IDataObject).description = reverseDescription;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/reverserecords`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const reverseRecordId = this.getNodeParameter('reverseRecordId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/reverserecords/${reverseRecordId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const qs: IDataObject = {};
						if (!returnAll) {
							qs.limit = limit;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/reverserecords`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const reverseRecordId = this.getNodeParameter('reverseRecordId', i) as string;
						const reverseName = this.getNodeParameter('reverseName', i) as string;
						const reverseDescription = this.getNodeParameter('reverseDescription', i, '') as string;

						const body: IDataObject = {
							properties: {
								name: reverseName,
							},
						};

						if (reverseDescription) {
							(body.properties as IDataObject).description = reverseDescription;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/reverserecords/${reverseRecordId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const reverseRecordId = this.getNodeParameter('reverseRecordId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/reverserecords/${reverseRecordId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Quota Operations
				// ====================
				else if (resource === 'quota') {
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'ionosCloud',
						{
							method: 'GET',
							url: `${baseUrl}/quota`,
						},
					);
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
