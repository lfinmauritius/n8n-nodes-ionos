import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

export class IonosCloudCompute implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud Compute',
		name: 'ionosCloudCompute',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage IONOS Cloud servers, volumes, images, and snapshots',
		defaults: {
			name: 'IONOS Cloud Compute',
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
						name: 'Server',
						value: 'server',
					},
					{
						name: 'Volume',
						value: 'volume',
					},
					{
						name: 'Image',
						value: 'image',
					},
					{
						name: 'Snapshot',
						value: 'snapshot',
					},
				],
				default: 'server',
			},

			// Common: Datacenter ID (required for server and volume operations)
			{
				displayName: 'Datacenter ID',
				name: 'datacenterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['server', 'volume'],
					},
				},
				default: '',
				placeholder: '15f67991-0f51-4efc-a8ad-ef1fb31a480c',
				description: 'The ID of the datacenter',
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
						name: 'Create',
						value: 'create',
						description: 'Create a new server',
						action: 'Create a server',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a server',
						action: 'Delete a server',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a server',
						action: 'Get a server',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all servers',
						action: 'Get many servers',
					},
					{
						name: 'Perform Action',
						value: 'action',
						description: 'Perform an action on a server (start, stop, reboot, etc.)',
						action: 'Perform server action',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a server',
						action: 'Update a server',
					},
				],
				default: 'getAll',
			},

			// Server: Create - Basic Config
			{
				displayName: 'Server Name',
				name: 'serverName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'my-server',
				description: 'The name of the server',
			},
			{
				displayName: 'Cores',
				name: 'cores',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['create'],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 2,
				description: 'Number of CPU cores',
			},
			{
				displayName: 'RAM (MB)',
				name: 'ram',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['create'],
					},
				},
				typeOptions: {
					minValue: 256,
				},
				default: 2048,
				description: 'Amount of RAM in MB (multiples of 256)',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Availability Zone',
						name: 'availabilityZone',
						type: 'options',
						options: [
							{
								name: 'Auto',
								value: 'AUTO',
							},
							{
								name: 'Zone 1',
								value: 'ZONE_1',
							},
							{
								name: 'Zone 2',
								value: 'ZONE_2',
							},
							{
								name: 'Zone 3',
								value: 'ZONE_3',
							},
						],
						default: 'AUTO',
						description: 'The availability zone',
					},
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
						description: 'The CPU family',
					},
					{
						displayName: 'Boot Volume ID',
						name: 'bootVolume',
						type: 'string',
						default: '',
						description: 'The ID of the boot volume',
					},
					{
						displayName: 'Boot CD-ROM ID',
						name: 'bootCdrom',
						type: 'string',
						default: '',
						description: 'The ID of the boot CD-ROM (image)',
					},
				],
			},

			// Server: Get, Update, Delete, Action
			{
				displayName: 'Server ID',
				name: 'serverId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['get', 'update', 'delete', 'action'],
					},
				},
				default: '',
				placeholder: '15f67991-0f51-4efc-a8ad-ef1fb31a480c',
				description: 'The ID of the server',
			},

			// Server: Action Type
			{
				displayName: 'Action',
				name: 'serverAction',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['action'],
					},
				},
				options: [
					{
						name: 'Start',
						value: 'start',
						description: 'Start the server',
					},
					{
						name: 'Stop',
						value: 'stop',
						description: 'Stop the server',
					},
					{
						name: 'Reboot',
						value: 'reboot',
						description: 'Reboot the server',
					},
					{
						name: 'Suspend',
						value: 'suspend',
						description: 'Suspend the server (to disk)',
					},
					{
						name: 'Resume',
						value: 'resume',
						description: 'Resume a suspended server',
					},
				],
				default: 'start',
				description: 'The action to perform',
			},

			// Server: Update
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The new name of the server',
					},
					{
						displayName: 'Cores',
						name: 'cores',
						type: 'number',
						default: 2,
						description: 'Number of CPU cores',
					},
					{
						displayName: 'RAM (MB)',
						name: 'ram',
						type: 'number',
						default: 2048,
						description: 'Amount of RAM in MB',
					},
					{
						displayName: 'Boot Volume ID',
						name: 'bootVolume',
						type: 'string',
						default: '',
						description: 'The ID of the boot volume',
					},
				],
			},

			// Server: Get Many
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 10000,
				},
				default: 100,
				description: 'Max number of results to return',
			},

			// ===================================
			// Volume Operations
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['volume'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new volume',
						action: 'Create a volume',
					},
					{
						name: 'Create Snapshot',
						value: 'createSnapshot',
						description: 'Create a snapshot of a volume',
						action: 'Create snapshot',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a volume',
						action: 'Delete a volume',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a volume',
						action: 'Get a volume',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all volumes',
						action: 'Get many volumes',
					},
					{
						name: 'Restore Snapshot',
						value: 'restoreSnapshot',
						description: 'Restore a volume from a snapshot',
						action: 'Restore snapshot',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a volume',
						action: 'Update a volume',
					},
				],
				default: 'getAll',
			},

			// Volume: Create
			{
				displayName: 'Volume Name',
				name: 'volumeName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'my-volume',
				description: 'The name of the volume',
			},
			{
				displayName: 'Size (GB)',
				name: 'size',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['create'],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 10,
				description: 'Size of the volume in GB',
			},
			{
				displayName: 'Type',
				name: 'volumeType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['create'],
					},
				},
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
				description: 'The storage type',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Availability Zone',
						name: 'availabilityZone',
						type: 'options',
						options: [
							{
								name: 'Auto',
								value: 'AUTO',
							},
							{
								name: 'Zone 1',
								value: 'ZONE_1',
							},
							{
								name: 'Zone 2',
								value: 'ZONE_2',
							},
							{
								name: 'Zone 3',
								value: 'ZONE_3',
							},
						],
						default: 'AUTO',
						description: 'The availability zone',
					},
					{
						displayName: 'Image ID',
						name: 'image',
						type: 'string',
						default: '',
						description: 'The image UUID to use for the volume',
					},
					{
						displayName: 'Image Alias',
						name: 'imageAlias',
						type: 'string',
						default: '',
						placeholder: 'ubuntu:latest',
						description: 'Image alias (alternative to Image ID)',
					},
					{
						displayName: 'Image Password',
						name: 'imagePassword',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						description: 'Password for the image',
					},
					{
						displayName: 'SSH Keys',
						name: 'sshKeys',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						placeholder: 'ssh-rsa AAAA...',
						description: 'SSH public keys (one per line)',
					},
					{
						displayName: 'Bus',
						name: 'bus',
						type: 'options',
						options: [
							{
								name: 'VIRTIO',
								value: 'VIRTIO',
							},
							{
								name: 'IDE',
								value: 'IDE',
							},
						],
						default: 'VIRTIO',
						description: 'The bus type',
					},
				],
			},

			// Volume: Get, Update, Delete, Snapshot Operations
			{
				displayName: 'Volume ID',
				name: 'volumeId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['get', 'update', 'delete', 'createSnapshot', 'restoreSnapshot'],
					},
				},
				default: '',
				placeholder: '15f67991-0f51-4efc-a8ad-ef1fb31a480c',
				description: 'The ID of the volume',
			},

			// Volume: Snapshot Operations
			{
				displayName: 'Snapshot Name',
				name: 'snapshotName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['createSnapshot'],
					},
				},
				default: '',
				placeholder: 'my-snapshot',
				description: 'Name for the snapshot (optional)',
			},
			{
				displayName: 'Snapshot Description',
				name: 'snapshotDescription',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['createSnapshot'],
					},
				},
				default: '',
				description: 'Description for the snapshot (optional)',
			},
			{
				displayName: 'Snapshot ID',
				name: 'snapshotId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['restoreSnapshot'],
					},
				},
				default: '',
				placeholder: '15f67991-0f51-4efc-a8ad-ef1fb31a480c',
				description: 'The ID of the snapshot to restore',
			},

			// Volume: Update
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The new name of the volume',
					},
					{
						displayName: 'Size (GB)',
						name: 'size',
						type: 'number',
						default: 10,
						description: 'New size in GB (can only be increased)',
					},
				],
			},

			// Volume: Get Many
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 10000,
				},
				default: 100,
				description: 'Max number of results to return',
			},

			// ===================================
			// Image Operations (Read-Only)
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['image'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an image',
						action: 'Get an image',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all images',
						action: 'Get many images',
					},
				],
				default: 'getAll',
			},

			// Image: Get
			{
				displayName: 'Image ID',
				name: 'imageId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['get'],
					},
				},
				default: '',
				placeholder: '15f67991-0f51-4efc-a8ad-ef1fb31a480c',
				description: 'The ID of the image',
			},

			// Image: Get Many
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 10000,
				},
				default: 100,
				description: 'Max number of results to return',
			},

			// ===================================
			// Snapshot Operations
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['snapshot'],
					},
				},
				options: [
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a snapshot',
						action: 'Delete a snapshot',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a snapshot',
						action: 'Get a snapshot',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all snapshots',
						action: 'Get many snapshots',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a snapshot',
						action: 'Update a snapshot',
					},
				],
				default: 'getAll',
			},

			// Snapshot: Get, Update, Delete
			{
				displayName: 'Snapshot ID',
				name: 'snapshotId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['snapshot'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				placeholder: '15f67991-0f51-4efc-a8ad-ef1fb31a480c',
				description: 'The ID of the snapshot',
			},

			// Snapshot: Update
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['snapshot'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The new name of the snapshot',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'The new description of the snapshot',
					},
				],
			},

			// Snapshot: Get Many
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['snapshot'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['snapshot'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 10000,
				},
				default: 100,
				description: 'Max number of results to return',
			},

			// Common Options for all resources
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['get', 'getAll'],
					},
				},
				options: [
					{
						displayName: 'Depth',
						name: 'depth',
						type: 'number',
						default: 0,
						typeOptions: {
							minValue: 0,
							maxValue: 10,
						},
						description: 'Controls the detail depth of the response (0-10)',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);
		const baseURL = 'https://api.ionos.com/cloudapi/v6';

		for (let i = 0; i < items.length; i++) {
			try {
				// ===================================
				// Servers
				// ===================================
				if (resource === 'server') {
					const datacenterId = this.getNodeParameter('datacenterId', i) as string;

					if (operation === 'create') {
						const serverName = this.getNodeParameter('serverName', i) as string;
						const cores = this.getNodeParameter('cores', i) as number;
						const ram = this.getNodeParameter('ram', i) as number;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								name: serverName,
								cores,
								ram,
								...(additionalFields.availabilityZone && {
									availabilityZone: additionalFields.availabilityZone,
								}),
								...(additionalFields.cpuFamily && { cpuFamily: additionalFields.cpuFamily }),
								...(additionalFields.bootVolume && {
									bootVolume: { id: additionalFields.bootVolume },
								}),
								...(additionalFields.bootCdrom && {
									bootCdrom: { id: additionalFields.bootCdrom },
								}),
							},
						};

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseURL}/datacenters/${datacenterId}/servers`,
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
						const serverId = this.getNodeParameter('serverId', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const qs: IDataObject = {};
						if (additionalOptions.depth !== undefined) qs.depth = additionalOptions.depth;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/datacenters/${datacenterId}/servers/${serverId}`,
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
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const qs: IDataObject = {};
						if (additionalOptions.depth !== undefined) qs.depth = additionalOptions.depth;

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
						}

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/datacenters/${datacenterId}/servers`,
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

						const servers = (response as IDataObject).items as IDataObject[];
						if (servers && servers.length > 0) {
							servers.forEach((server) => {
								returnData.push({ json: server });
							});
						} else {
							returnData.push({ json: response as IDataObject });
						}
					}

					if (operation === 'update') {
						const serverId = this.getNodeParameter('serverId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {},
						};

						if (updateFields.name) {
							(body.properties as IDataObject).name = updateFields.name;
						}
						if (updateFields.cores) {
							(body.properties as IDataObject).cores = updateFields.cores;
						}
						if (updateFields.ram) {
							(body.properties as IDataObject).ram = updateFields.ram;
						}
						if (updateFields.bootVolume) {
							(body.properties as IDataObject).bootVolume = { id: updateFields.bootVolume };
						}

						const options: IHttpRequestOptions = {
							method: 'PATCH',
							url: `${baseURL}/datacenters/${datacenterId}/servers/${serverId}`,
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
						const serverId = this.getNodeParameter('serverId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'DELETE',
							url: `${baseURL}/datacenters/${datacenterId}/servers/${serverId}`,
							headers: {
								Accept: 'application/json',
							},
						};

						await this.helpers.httpRequestWithAuthentication.call(this, 'ionosCloud', options);
						returnData.push({ json: { success: true, serverId } });
					}

					if (operation === 'action') {
						const serverId = this.getNodeParameter('serverId', i) as string;
						const serverAction = this.getNodeParameter('serverAction', i) as string;

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseURL}/datacenters/${datacenterId}/servers/${serverId}/${serverAction}`,
							headers: {
								Accept: 'application/json',
							},
						};

						await this.helpers.httpRequestWithAuthentication.call(this, 'ionosCloud', options);
						returnData.push({ json: { success: true, serverId, action: serverAction } });
					}
				}

				// ===================================
				// Volumes
				// ===================================
				if (resource === 'volume') {
					const datacenterId = this.getNodeParameter('datacenterId', i) as string;

					if (operation === 'create') {
						const volumeName = this.getNodeParameter('volumeName', i) as string;
						const size = this.getNodeParameter('size', i) as number;
						const volumeType = this.getNodeParameter('volumeType', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								name: volumeName,
								size,
								type: volumeType,
								...(additionalFields.availabilityZone && {
									availabilityZone: additionalFields.availabilityZone,
								}),
								...(additionalFields.image && { image: additionalFields.image }),
								...(additionalFields.imageAlias && { imageAlias: additionalFields.imageAlias }),
								...(additionalFields.imagePassword && {
									imagePassword: additionalFields.imagePassword,
								}),
								...(additionalFields.bus && { bus: additionalFields.bus }),
							},
						};

						if (additionalFields.sshKeys) {
							const sshKeysString = additionalFields.sshKeys as string;
							const sshKeysArray = sshKeysString.split('\n').filter((key) => key.trim());
							(body.properties as IDataObject).sshKeys = sshKeysArray;
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseURL}/datacenters/${datacenterId}/volumes`,
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
						const volumeId = this.getNodeParameter('volumeId', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const qs: IDataObject = {};
						if (additionalOptions.depth !== undefined) qs.depth = additionalOptions.depth;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/datacenters/${datacenterId}/volumes/${volumeId}`,
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
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const qs: IDataObject = {};
						if (additionalOptions.depth !== undefined) qs.depth = additionalOptions.depth;

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
						}

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/datacenters/${datacenterId}/volumes`,
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

						const volumes = (response as IDataObject).items as IDataObject[];
						if (volumes && volumes.length > 0) {
							volumes.forEach((volume) => {
								returnData.push({ json: volume });
							});
						} else {
							returnData.push({ json: response as IDataObject });
						}
					}

					if (operation === 'update') {
						const volumeId = this.getNodeParameter('volumeId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {},
						};

						if (updateFields.name) {
							(body.properties as IDataObject).name = updateFields.name;
						}
						if (updateFields.size) {
							(body.properties as IDataObject).size = updateFields.size;
						}

						const options: IHttpRequestOptions = {
							method: 'PATCH',
							url: `${baseURL}/datacenters/${datacenterId}/volumes/${volumeId}`,
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
						const volumeId = this.getNodeParameter('volumeId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'DELETE',
							url: `${baseURL}/datacenters/${datacenterId}/volumes/${volumeId}`,
							headers: {
								Accept: 'application/json',
							},
						};

						await this.helpers.httpRequestWithAuthentication.call(this, 'ionosCloud', options);
						returnData.push({ json: { success: true, volumeId } });
					}

					if (operation === 'createSnapshot') {
						const volumeId = this.getNodeParameter('volumeId', i) as string;
						const snapshotName = this.getNodeParameter('snapshotName', i) as string;
						const snapshotDescription = this.getNodeParameter(
							'snapshotDescription',
							i,
						) as string;

						const body: IDataObject = {};
						if (snapshotName) body.name = snapshotName;
						if (snapshotDescription) body.description = snapshotDescription;

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseURL}/datacenters/${datacenterId}/volumes/${volumeId}/create-snapshot`,
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

					if (operation === 'restoreSnapshot') {
						const volumeId = this.getNodeParameter('volumeId', i) as string;
						const snapshotId = this.getNodeParameter('snapshotId', i) as string;

						const body = {
							snapshotId,
						};

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseURL}/datacenters/${datacenterId}/volumes/${volumeId}/restore-snapshot`,
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
							},
							body,
						};

						await this.helpers.httpRequestWithAuthentication.call(this, 'ionosCloud', options);
						returnData.push({ json: { success: true, volumeId, snapshotId } });
					}
				}

				// ===================================
				// Images
				// ===================================
				if (resource === 'image') {
					if (operation === 'get') {
						const imageId = this.getNodeParameter('imageId', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const qs: IDataObject = {};
						if (additionalOptions.depth !== undefined) qs.depth = additionalOptions.depth;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/images/${imageId}`,
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
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const qs: IDataObject = {};
						if (additionalOptions.depth !== undefined) qs.depth = additionalOptions.depth;

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
						}

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/images`,
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

						const images = (response as IDataObject).items as IDataObject[];
						if (images && images.length > 0) {
							images.forEach((image) => {
								returnData.push({ json: image });
							});
						} else {
							returnData.push({ json: response as IDataObject });
						}
					}
				}

				// ===================================
				// Snapshots
				// ===================================
				if (resource === 'snapshot') {
					if (operation === 'get') {
						const snapshotId = this.getNodeParameter('snapshotId', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const qs: IDataObject = {};
						if (additionalOptions.depth !== undefined) qs.depth = additionalOptions.depth;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/snapshots/${snapshotId}`,
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
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const qs: IDataObject = {};
						if (additionalOptions.depth !== undefined) qs.depth = additionalOptions.depth;

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
						}

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/snapshots`,
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

						const snapshots = (response as IDataObject).items as IDataObject[];
						if (snapshots && snapshots.length > 0) {
							snapshots.forEach((snapshot) => {
								returnData.push({ json: snapshot });
							});
						} else {
							returnData.push({ json: response as IDataObject });
						}
					}

					if (operation === 'update') {
						const snapshotId = this.getNodeParameter('snapshotId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {},
						};

						if (updateFields.name) {
							(body.properties as IDataObject).name = updateFields.name;
						}
						if (updateFields.description) {
							(body.properties as IDataObject).description = updateFields.description;
						}

						const options: IHttpRequestOptions = {
							method: 'PATCH',
							url: `${baseURL}/snapshots/${snapshotId}`,
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
						const snapshotId = this.getNodeParameter('snapshotId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'DELETE',
							url: `${baseURL}/snapshots/${snapshotId}`,
							headers: {
								Accept: 'application/json',
							},
						};

						await this.helpers.httpRequestWithAuthentication.call(this, 'ionosCloud', options);
						returnData.push({ json: { success: true, snapshotId } });
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
