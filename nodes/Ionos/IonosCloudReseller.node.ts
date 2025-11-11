import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

const baseUrl = 'https://api.ionos.com/reseller/v2';

export class IonosCloudReseller implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud Reseller',
		name: 'ionosCloudReseller',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"]}} - {{$parameter["operation"]}}',
		description: 'Manage customer contracts and admin users for IONOS reseller partners. Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud Reseller',
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
			// Resource
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Admin',
						value: 'admin',
						description: 'Admin users for contracts',
					},
					{
						name: 'Contract',
						value: 'contract',
						description: 'Customer contracts',
					},
				],
				default: 'contract',
			},

			// Operations for Admin
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['admin'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new admin user',
						action: 'Create an admin user',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an admin user',
						action: 'Get an admin user',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many admin users',
						action: 'Get many admin users',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an admin user',
						action: 'Update an admin user',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an admin user',
						action: 'Delete an admin user',
					},
				],
				default: 'getMany',
			},

			// Operations for Contract
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contract'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new contract',
						action: 'Create a contract',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a contract',
						action: 'Get a contract',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many contracts',
						action: 'Get many contracts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a contract',
						action: 'Update a contract',
					},
					{
						name: 'Update Name',
						value: 'updateName',
						description: 'Update contract name only',
						action: 'Update contract name',
					},
					{
						name: 'Update Resource Limits',
						value: 'updateResourceLimits',
						description: 'Update resource limits only',
						action: 'Update resource limits',
					},
				],
				default: 'getMany',
			},

			// ====================
			// Admin Fields
			// ====================

			// Contract Number (for admins)
			{
				displayName: 'Contract Number',
				name: 'contractNumber',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['admin'],
					},
				},
				default: 0,
				description: 'The contract number (integer)',
			},

			// Admin ID
			{
				displayName: 'Admin ID',
				name: 'adminId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['admin'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: 0,
				description: 'The admin user ID (integer)',
			},

			// First Name
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['admin'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'First name of the admin user',
			},

			// Last Name
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['admin'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'Last name of the admin user',
			},

			// Email
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['admin'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'admin@example.com',
				description: 'Email address of the admin user',
			},

			// Password
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['admin'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Password for the admin user (required for creation only)',
			},

			// ====================
			// Contract Fields
			// ====================

			// Contract Number
			{
				displayName: 'Contract Number',
				name: 'contractNumber',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['get', 'update', 'updateName', 'updateResourceLimits'],
					},
				},
				default: 0,
				description: 'The contract number (integer)',
			},

			// Contract Name
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['create', 'update', 'updateName'],
					},
				},
				default: '',
				placeholder: 'Customer Contract',
				description: 'The name of the contract',
			},

			// Reseller Reference
			{
				displayName: 'Reseller Reference',
				name: 'resellerReference',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'Optional reseller reference identifier',
			},

			// Resource Limits
			{
				displayName: 'Resource Limits',
				name: 'resourceLimits',
				type: 'collection',
				placeholder: 'Add Resource Limit',
				required: true,
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['create', 'update', 'updateResourceLimits'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Max RAM per Server (MB)',
						name: 'ramServerMax',
						type: 'number',
						default: 256000,
						description: 'Maximum RAM per virtual machine in MB',
					},
					{
						displayName: 'Max CPU per Server',
						name: 'cpuServerMax',
						type: 'number',
						default: 32,
						description: 'Maximum number of CPUs per virtual machine',
					},
					{
						displayName: 'Max HDD Volume Size (GB)',
						name: 'hddVolumeMaxSize',
						type: 'number',
						default: 10240,
						description: 'Maximum HDD volume size in GB',
					},
					{
						displayName: 'Max SSD Volume Size (GB)',
						name: 'ssdVolumeMaxSize',
						type: 'number',
						default: 10240,
						description: 'Maximum SSD volume size in GB',
					},
					{
						displayName: 'Max RAM per Contract (MB)',
						name: 'ramContractMax',
						type: 'number',
						default: 1024000,
						description: 'Maximum total RAM per contract in MB',
					},
					{
						displayName: 'Max CPU per Contract',
						name: 'cpuContractMax',
						type: 'number',
						default: 128,
						description: 'Maximum total CPUs per contract',
					},
					{
						displayName: 'Max HDD per Contract (GB)',
						name: 'hddVolumeContractMaxSize',
						type: 'number',
						default: 51200,
						description: 'Maximum total HDD storage per contract in GB',
					},
					{
						displayName: 'Max SSD per Contract (GB)',
						name: 'ssdVolumeContractMaxSize',
						type: 'number',
						default: 51200,
						description: 'Maximum total SSD storage per contract in GB',
					},
					{
						displayName: 'Max IPs per Contract',
						name: 'ips',
						type: 'number',
						default: 100,
						description: 'Maximum number of IP addresses per contract',
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
					maxValue: 5000,
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

			// Status Filter
			{
				displayName: 'Filter by Status',
				name: 'filterStatus',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['getMany'],
					},
				},
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Billable',
						value: 'BILLABLE',
					},
					{
						name: 'Ceased',
						value: 'CEASED',
					},
					{
						name: 'Rejected',
						value: 'REJECTED',
					},
				],
				default: '',
				description: 'Filter contracts by status',
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
				// Admin
				// ====================

				if (resource === 'admin') {
					const contractNumber = this.getNodeParameter('contractNumber', i) as number;

					if (operation === 'create') {
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const password = this.getNodeParameter('password', i) as string;

						const body: IDataObject = {
							firstName,
							lastName,
							email,
							password,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/contracts/${contractNumber}/admins`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const adminId = this.getNodeParameter('adminId', i) as number;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/contracts/${contractNumber}/admins/${adminId}`,
							},
						);
					} else if (operation === 'getMany') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/contracts/${contractNumber}/admins`,
							},
						);
					} else if (operation === 'update') {
						const adminId = this.getNodeParameter('adminId', i) as number;
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const email = this.getNodeParameter('email', i) as string;

						const body: IDataObject = {
							firstName,
							lastName,
							email,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PATCH',
								url: `${baseUrl}/contracts/${contractNumber}/admins/${adminId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const adminId = this.getNodeParameter('adminId', i) as number;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/contracts/${contractNumber}/admins/${adminId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Contract
				// ====================

				else if (resource === 'contract') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const resellerReference = this.getNodeParameter('resellerReference', i, '') as string;
						const resourceLimits = this.getNodeParameter('resourceLimits', i) as IDataObject;

						const body: IDataObject = {
							name,
							resourceLimits: {
								ramServerMax: resourceLimits.ramServerMax || 256000,
								cpuServerMax: resourceLimits.cpuServerMax || 32,
								hddVolumeMaxSize: resourceLimits.hddVolumeMaxSize || 10240,
								ssdVolumeMaxSize: resourceLimits.ssdVolumeMaxSize || 10240,
								ramContractMax: resourceLimits.ramContractMax || 1024000,
								cpuContractMax: resourceLimits.cpuContractMax || 128,
								hddVolumeContractMaxSize: resourceLimits.hddVolumeContractMaxSize || 51200,
								ssdVolumeContractMaxSize: resourceLimits.ssdVolumeContractMaxSize || 51200,
								ips: resourceLimits.ips || 100,
							},
						};

						if (resellerReference) {
							body.resellerReference = resellerReference;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/contracts`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const contractNumber = this.getNodeParameter('contractNumber', i) as number;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/contracts/${contractNumber}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const offset = this.getNodeParameter('offset', i, 0) as number;
						const filterStatus = this.getNodeParameter('filterStatus', i, '') as string;

						const qs: IDataObject = {
							offset,
						};

						if (!returnAll) {
							qs.limit = limit;
						}

						if (filterStatus) {
							qs['filter.status'] = filterStatus;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/contracts`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const contractNumber = this.getNodeParameter('contractNumber', i) as number;
						const name = this.getNodeParameter('name', i) as string;
						const resellerReference = this.getNodeParameter('resellerReference', i, '') as string;
						const resourceLimits = this.getNodeParameter('resourceLimits', i) as IDataObject;

						const body: IDataObject = {
							name,
							resourceLimits: {
								ramServerMax: resourceLimits.ramServerMax || 256000,
								cpuServerMax: resourceLimits.cpuServerMax || 32,
								hddVolumeMaxSize: resourceLimits.hddVolumeMaxSize || 10240,
								ssdVolumeMaxSize: resourceLimits.ssdVolumeMaxSize || 10240,
								ramContractMax: resourceLimits.ramContractMax || 1024000,
								cpuContractMax: resourceLimits.cpuContractMax || 128,
								hddVolumeContractMaxSize: resourceLimits.hddVolumeContractMaxSize || 51200,
								ssdVolumeContractMaxSize: resourceLimits.ssdVolumeContractMaxSize || 51200,
								ips: resourceLimits.ips || 100,
							},
						};

						if (resellerReference) {
							body.resellerReference = resellerReference;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/contracts/${contractNumber}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'updateName') {
						const contractNumber = this.getNodeParameter('contractNumber', i) as number;
						const name = this.getNodeParameter('name', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/contracts/${contractNumber}/name`,
								body: name,
								headers: { 'Content-Type': 'text/plain' },
							},
						);
					} else if (operation === 'updateResourceLimits') {
						const contractNumber = this.getNodeParameter('contractNumber', i) as number;
						const resourceLimits = this.getNodeParameter('resourceLimits', i) as IDataObject;

						const body: IDataObject = {
							ramServerMax: resourceLimits.ramServerMax || 256000,
							cpuServerMax: resourceLimits.cpuServerMax || 32,
							hddVolumeMaxSize: resourceLimits.hddVolumeMaxSize || 10240,
							ssdVolumeMaxSize: resourceLimits.ssdVolumeMaxSize || 10240,
							ramContractMax: resourceLimits.ramContractMax || 1024000,
							cpuContractMax: resourceLimits.cpuContractMax || 128,
							hddVolumeContractMaxSize: resourceLimits.hddVolumeContractMaxSize || 51200,
							ssdVolumeContractMaxSize: resourceLimits.ssdVolumeContractMaxSize || 51200,
							ips: resourceLimits.ips || 100,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/contracts/${contractNumber}/resourcelimits`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
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
