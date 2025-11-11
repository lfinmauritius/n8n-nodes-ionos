import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

export class IonosCloudVMAutoScaling implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud VM Auto Scaling',
		name: 'ionosCloudVMAutoScaling',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage VM Auto Scaling Groups with IONOS Cloud. Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS VM Auto Scaling',
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
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Group',
						value: 'group',
					},
					{
						name: 'Action',
						value: 'action',
					},
					{
						name: 'Server',
						value: 'server',
					},
				],
				default: 'group',
			},

			// ===================================
			// Group Operations
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['group'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new VM Auto Scaling Group',
						action: 'Create a group',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a VM Auto Scaling Group',
						action: 'Delete a group',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a VM Auto Scaling Group',
						action: 'Get a group',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all VM Auto Scaling Groups',
						action: 'Get many groups',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a VM Auto Scaling Group',
						action: 'Update a group',
					},
				],
				default: 'getAll',
			},

			// Group: Create - Basic Info
			{
				displayName: 'Datacenter ID',
				name: 'datacenterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '09043280-aafc-49f7-a048-d61673f52024',
				description: 'The ID of the datacenter where VMs will be created',
			},
			{
				displayName: 'Group Name',
				name: 'groupName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'My Auto Scaling Group',
				description: 'The name of the VM Auto Scaling Group',
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Berlin (de/txl)',
						value: 'de/txl',
					},
					{
						name: 'Frankfurt (de/fra)',
						value: 'de/fra',
					},
					{
						name: 'Logrono (es/vit)',
						value: 'es/vit',
					},
				],
				default: 'de/txl',
				description: 'The datacenter location',
			},
			{
				displayName: 'Min Replica Count',
				name: 'minReplicaCount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				typeOptions: {
					minValue: 0,
					maxValue: 200,
				},
				default: 1,
				description: 'Minimum number of VM replicas (0-200)',
			},
			{
				displayName: 'Max Replica Count',
				name: 'maxReplicaCount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				typeOptions: {
					minValue: 0,
					maxValue: 200,
				},
				default: 5,
				description: 'Maximum number of VM replicas (0-200)',
			},

			// Group: Create - Replica Configuration
			{
				displayName: 'Cores',
				name: 'cores',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 2,
				description: 'Total number of cores for the VMs',
			},
			{
				displayName: 'RAM (MB)',
				name: 'ram',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				typeOptions: {
					minValue: 256,
				},
				default: 2048,
				description: 'Size of memory in MB (multiples of 256, min 256)',
			},

			// Group: Create - Policy
			{
				displayName: 'Metric',
				name: 'metric',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'CPU Utilization Average',
						value: 'INSTANCE_CPU_UTILIZATION_AVERAGE',
					},
					{
						name: 'Network In Bytes',
						value: 'INSTANCE_NETWORK_IN_BYTES',
					},
					{
						name: 'Network In Packets',
						value: 'INSTANCE_NETWORK_IN_PACKETS',
					},
					{
						name: 'Network Out Bytes',
						value: 'INSTANCE_NETWORK_OUT_BYTES',
					},
					{
						name: 'Network Out Packets',
						value: 'INSTANCE_NETWORK_OUT_PACKETS',
					},
				],
				default: 'INSTANCE_CPU_UTILIZATION_AVERAGE',
				description: 'The metric that triggers scaling actions',
			},
			{
				displayName: 'Scale Out Threshold',
				name: 'scaleOutThreshold',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				default: 75,
				description: 'Upper threshold for scale-out action',
			},
			{
				displayName: 'Scale In Threshold',
				name: 'scaleInThreshold',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				default: 25,
				description: 'Lower threshold for scale-in action',
			},
			{
				displayName: 'Scale Out Amount',
				name: 'scaleOutAmount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				default: 1,
				description: 'Number/percentage of VMs to add when scaling out',
			},
			{
				displayName: 'Scale In Amount',
				name: 'scaleInAmount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				default: 1,
				description: 'Number/percentage of VMs to remove when scaling in',
			},
			{
				displayName: 'Delete Volumes on Scale In',
				name: 'deleteVolumes',
				type: 'boolean',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				default: true,
				description: 'Whether to delete volumes when scaling in',
			},

			// Group: Create - Advanced Options
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'CPU Family',
						name: 'cpuFamily',
						type: 'options',
						options: [
							{
								name: 'Intel Sierra Forest',
								value: 'INTEL_SIERRAFOREST',
							},
							{
								name: 'Intel Ice Lake',
								value: 'INTEL_ICELAKE',
							},
							{
								name: 'AMD Opteron',
								value: 'AMD_OPTERON',
							},
							{
								name: 'Intel Skylake',
								value: 'INTEL_SKYLAKE',
							},
							{
								name: 'Intel Xeon',
								value: 'INTEL_XEON',
							},
						],
						default: 'INTEL_ICELAKE',
						description: 'The CPU family for the VMs',
					},
					{
						displayName: 'Amount Type',
						name: 'amountType',
						type: 'options',
						options: [
							{
								name: 'Absolute',
								value: 'ABSOLUTE',
							},
							{
								name: 'Percentage',
								value: 'PERCENTAGE',
							},
						],
						default: 'ABSOLUTE',
						description: 'Whether amount is absolute number or percentage',
					},
					{
						displayName: 'Policy Unit',
						name: 'policyUnit',
						type: 'options',
						options: [
							{
								name: 'Per Hour',
								value: 'PER_HOUR',
							},
							{
								name: 'Per Minute',
								value: 'PER_MINUTE',
							},
							{
								name: 'Per Second',
								value: 'PER_SECOND',
							},
							{
								name: 'Total',
								value: 'TOTAL',
							},
						],
						default: 'TOTAL',
						description: 'Units of the applied metric',
					},
					{
						displayName: 'Termination Policy',
						name: 'terminationPolicy',
						type: 'options',
						options: [
							{
								name: 'Oldest Server First',
								value: 'OLDEST_SERVER_FIRST',
							},
							{
								name: 'Newest Server First',
								value: 'NEWEST_SERVER_FIRST',
							},
							{
								name: 'Random',
								value: 'RANDOM',
							},
						],
						default: 'OLDEST_SERVER_FIRST',
						description: 'Policy for which VM to terminate first',
					},
					{
						displayName: 'Scale Out Cooldown Period',
						name: 'scaleOutCooldown',
						type: 'string',
						default: '5m',
						placeholder: '5m',
						description: 'Minimum time between scale-out actions (e.g., "5m", "2h")',
					},
					{
						displayName: 'Scale In Cooldown Period',
						name: 'scaleInCooldown',
						type: 'string',
						default: '5m',
						placeholder: '5m',
						description: 'Minimum time between scale-in actions (e.g., "5m", "2h")',
					},
					{
						displayName: 'Range',
						name: 'range',
						type: 'string',
						default: '120s',
						placeholder: '120s',
						description: 'Time range for sample aggregation (min 120s)',
					},
				],
			},

			// Group: Create - Volume Configuration
			{
				displayName: 'Volumes',
				name: 'volumes',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				default: {},
				placeholder: 'Add Volume',
				options: [
					{
						name: 'volumeValues',
						displayName: 'Volume',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								required: true,
								description: 'Volume name',
							},
							{
								displayName: 'Size (GB)',
								name: 'size',
								type: 'number',
								default: 10,
								required: true,
								typeOptions: {
									minValue: 1,
								},
								description: 'Size of the volume in GB',
							},
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{
										name: 'HDD',
										value: 'HDD',
									},
									{
										name: 'SSD',
										value: 'SSD',
									},
									{
										name: 'SSD Premium',
										value: 'SSD_PREMIUM',
									},
									{
										name: 'SSD Standard',
										value: 'SSD_STANDARD',
									},
								],
								default: 'SSD',
								required: true,
								description: 'Storage type',
							},
							{
								displayName: 'Boot Order',
								name: 'bootOrder',
								type: 'options',
								options: [
									{
										name: 'Auto',
										value: 'AUTO',
									},
									{
										name: 'Primary',
										value: 'PRIMARY',
									},
									{
										name: 'None',
										value: 'NONE',
									},
								],
								default: 'AUTO',
								required: true,
								description: 'Boot order for the volume',
							},
							{
								displayName: 'Image',
								name: 'image',
								type: 'string',
								default: '',
								placeholder: '6e928bd0-3a8e-4821-a20a-54984b0c2d21',
								description: 'Image UUID (mutually exclusive with Image Alias)',
							},
							{
								displayName: 'Image Alias',
								name: 'imageAlias',
								type: 'string',
								default: '',
								placeholder: 'ubuntu:latest',
								description: 'Image alias (mutually exclusive with Image)',
							},
						],
					},
				],
			},

			// Group: Create - NIC Configuration
			{
				displayName: 'NICs',
				name: 'nics',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create'],
					},
				},
				default: {},
				placeholder: 'Add NIC',
				options: [
					{
						name: 'nicValues',
						displayName: 'NIC',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								required: true,
								description: 'NIC name',
							},
							{
								displayName: 'LAN',
								name: 'lan',
								type: 'number',
								default: 1,
								required: true,
								typeOptions: {
									minValue: 1,
								},
								description: 'LAN ID',
							},
							{
								displayName: 'DHCP',
								name: 'dhcp',
								type: 'boolean',
								default: true,
								description: 'Enable DHCP',
							},
						],
					},
				],
			},

			// Group: Get, Update, Delete
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				placeholder: '1d67ca27-d4c0-419d-9a64-9ea42dfdd036',
				description: 'The ID of the VM Auto Scaling Group',
			},

			// Group: Update
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Group Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The new name of the group',
					},
					{
						displayName: 'Min Replica Count',
						name: 'minReplicaCount',
						type: 'number',
						typeOptions: {
							minValue: 0,
							maxValue: 200,
						},
						default: 1,
						description: 'New minimum number of replicas',
					},
					{
						displayName: 'Max Replica Count',
						name: 'maxReplicaCount',
						type: 'number',
						typeOptions: {
							minValue: 0,
							maxValue: 200,
						},
						default: 5,
						description: 'New maximum number of replicas',
					},
				],
			},

			// Group: Get Many
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Depth',
						name: 'depth',
						type: 'number',
						default: 0,
						description: 'Controls the detail level of the response (0-3)',
					},
					{
						displayName: 'Order By',
						name: 'orderBy',
						type: 'options',
						options: [
							{
								name: 'Created Date',
								value: 'createdDate',
							},
							{
								name: 'Last Modified Date',
								value: 'lastModifiedDate',
							},
						],
						default: 'createdDate',
						description: 'Sort by field',
					},
				],
			},

			// ===================================
			// Action Operations
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['action'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a scaling action by ID',
						action: 'Get an action',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all scaling actions for a group',
						action: 'Get many actions',
					},
				],
				default: 'getAll',
			},

			// Action: Group ID (required for all operations)
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['action'],
					},
				},
				default: '',
				placeholder: '1d67ca27-d4c0-419d-9a64-9ea42dfdd036',
				description: 'The ID of the VM Auto Scaling Group',
			},

			// Action: Get
			{
				displayName: 'Action ID',
				name: 'actionId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['action'],
						operation: ['get'],
					},
				},
				default: '',
				placeholder: '2ab638d4-b4b4-4a1a-9a33-553059364fc8',
				description: 'The ID of the scaling action',
			},

			// ===================================
			// Server Operations
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['server'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a server by ID',
						action: 'Get a server',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all servers for a group',
						action: 'Get many servers',
					},
				],
				default: 'getAll',
			},

			// Server: Group ID (required for all operations)
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['server'],
					},
				},
				default: '',
				placeholder: '1d67ca27-d4c0-419d-9a64-9ea42dfdd036',
				description: 'The ID of the VM Auto Scaling Group',
			},

			// Server: Get
			{
				displayName: 'Server ID',
				name: 'serverId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['get'],
					},
				},
				default: '',
				placeholder: '20fd2b30-be53-4253-9d8e-96af69e24d57',
				description: 'The ID of the server',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);
		const baseURL = 'https://api.ionos.com/autoscaling';

		for (let i = 0; i < items.length; i++) {
			try {
				// ===================================
				// Groups
				// ===================================
				if (resource === 'group') {
					if (operation === 'create') {
						const datacenterId = this.getNodeParameter('datacenterId', i) as string;
						const groupName = this.getNodeParameter('groupName', i) as string;
						const location = this.getNodeParameter('location', i) as string;
						const minReplicaCount = this.getNodeParameter('minReplicaCount', i) as number;
						const maxReplicaCount = this.getNodeParameter('maxReplicaCount', i) as number;
						const cores = this.getNodeParameter('cores', i) as number;
						const ram = this.getNodeParameter('ram', i) as number;
						const metric = this.getNodeParameter('metric', i) as string;
						const scaleOutThreshold = this.getNodeParameter('scaleOutThreshold', i) as number;
						const scaleInThreshold = this.getNodeParameter('scaleInThreshold', i) as number;
						const scaleOutAmount = this.getNodeParameter('scaleOutAmount', i) as number;
						const scaleInAmount = this.getNodeParameter('scaleInAmount', i) as number;
						const deleteVolumes = this.getNodeParameter('deleteVolumes', i) as boolean;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;
						const volumes = this.getNodeParameter('volumes', i) as IDataObject;
						const nics = this.getNodeParameter('nics', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								datacenter: {
									id: datacenterId,
								},
								location,
								name: groupName,
								maxReplicaCount,
								minReplicaCount,
								policy: {
									metric,
									scaleOutThreshold,
									scaleInThreshold,
									unit: additionalOptions.policyUnit || 'TOTAL',
									scaleOutAction: {
										amount: scaleOutAmount,
										amountType: additionalOptions.amountType || 'ABSOLUTE',
										cooldownPeriod: additionalOptions.scaleOutCooldown || '5m',
									},
									scaleInAction: {
										amount: scaleInAmount,
										amountType: additionalOptions.amountType || 'ABSOLUTE',
										cooldownPeriod: additionalOptions.scaleInCooldown || '5m',
										terminationPolicy: additionalOptions.terminationPolicy || 'OLDEST_SERVER_FIRST',
										deleteVolumes,
									},
								},
								replicaConfiguration: {
									cores,
									ram,
									...(additionalOptions.cpuFamily && { cpuFamily: additionalOptions.cpuFamily }),
								},
							},
						};

						if (additionalOptions.range) {
							((body.properties as IDataObject).policy as IDataObject).range = additionalOptions.range;
						}

						// Add volumes
						if (volumes.volumeValues) {
							const volumeValues = volumes.volumeValues as IDataObject[];
							((body.properties as IDataObject).replicaConfiguration as IDataObject).volumes = volumeValues.map(
								(vol) => {
									const volume: IDataObject = {
										name: vol.name,
										size: vol.size,
										type: vol.type,
										bootOrder: vol.bootOrder,
									};
									if (vol.image) volume.image = vol.image;
									if (vol.imageAlias) volume.imageAlias = vol.imageAlias;
									return volume;
								},
							);
						}

						// Add NICs
						if (nics.nicValues) {
							const nicValues = nics.nicValues as IDataObject[];
							((body.properties as IDataObject).replicaConfiguration as IDataObject).nics = nicValues.map((nic) => ({
								name: nic.name,
								lan: nic.lan,
								dhcp: nic.dhcp !== undefined ? nic.dhcp : true,
							}));
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseURL}/groups`,
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
							},
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'get') {
						const groupId = this.getNodeParameter('groupId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/groups/${groupId}`,
							headers: {
								Accept: 'application/json',
							},
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'getAll') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const qs: IDataObject = {};
						if (additionalOptions.depth !== undefined) qs.depth = additionalOptions.depth;
						if (additionalOptions.orderBy) qs.orderBy = additionalOptions.orderBy;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/groups`,
							headers: {
								Accept: 'application/json',
							},
							qs,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);

						const groups = (response as IDataObject).items as IDataObject[];
						if (groups && groups.length > 0) {
							groups.forEach((group) => {
								returnData.push({ json: group });
							});
						} else {
							returnData.push({ json: response as IDataObject });
						}
					}

					if (operation === 'update') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						// For update, we need to provide all required fields
						// This is a simplified version - in production you'd want to get current values first
						const body: IDataObject = {
							properties: {},
						};

						if (updateFields.name) {
							(body.properties as IDataObject).name = updateFields.name;
						}
						if (updateFields.minReplicaCount !== undefined) {
							(body.properties as IDataObject).minReplicaCount = updateFields.minReplicaCount;
						}
						if (updateFields.maxReplicaCount !== undefined) {
							(body.properties as IDataObject).maxReplicaCount = updateFields.maxReplicaCount;
						}

						const options: IHttpRequestOptions = {
							method: 'PUT',
							url: `${baseURL}/groups/${groupId}`,
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
							},
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'delete') {
						const groupId = this.getNodeParameter('groupId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'DELETE',
							url: `${baseURL}/groups/${groupId}`,
							headers: {
								Accept: 'application/json',
							},
						};

						await this.helpers.httpRequestWithAuthentication.call(this, 'ionosCloud', options);
						returnData.push({ json: { success: true, groupId } });
					}
				}

				// ===================================
				// Actions
				// ===================================
				if (resource === 'action') {
					const groupId = this.getNodeParameter('groupId', i) as string;

					if (operation === 'get') {
						const actionId = this.getNodeParameter('actionId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/groups/${groupId}/actions/${actionId}`,
							headers: {
								Accept: 'application/json',
							},
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'getAll') {
						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/groups/${groupId}/actions`,
							headers: {
								Accept: 'application/json',
							},
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);

						const actions = (response as IDataObject).items as IDataObject[];
						if (actions && actions.length > 0) {
							actions.forEach((action) => {
								returnData.push({ json: action });
							});
						} else {
							returnData.push({ json: response as IDataObject });
						}
					}
				}

				// ===================================
				// Servers
				// ===================================
				if (resource === 'server') {
					const groupId = this.getNodeParameter('groupId', i) as string;

					if (operation === 'get') {
						const serverId = this.getNodeParameter('serverId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/groups/${groupId}/servers/${serverId}`,
							headers: {
								Accept: 'application/json',
							},
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'getAll') {
						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/groups/${groupId}/servers`,
							headers: {
								Accept: 'application/json',
							},
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);

						const servers = (response as IDataObject).items as IDataObject[];
						if (servers && servers.length > 0) {
							servers.forEach((server) => {
								returnData.push({ json: server });
							});
						} else {
							returnData.push({ json: response as IDataObject });
						}
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					returnData.push({ json: { error: errorMessage } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
