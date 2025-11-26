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
		description: 'Manage IONOS Cloud servers, volumes, images, and snapshots. Developped with Love by Ascenzia (ascenzia.fr)',
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
					{
						name: 'Attach Volume',
						value: 'attachVolume',
						description: 'Attach an existing volume to a server',
						action: 'Attach volume to server',
					},
					{
						name: 'Detach Volume',
						value: 'detachVolume',
						description: 'Detach a volume from a server',
						action: 'Detach volume from server',
					},
					{
						name: 'List Attached Volumes',
						value: 'listVolumes',
						description: 'List all volumes attached to a server',
						action: 'List attached volumes',
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

			// Server: Create - Volumes to attach
			{
				displayName: 'Volumes',
				name: 'volumes',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Volume',
				default: {},
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['create'],
					},
				},
				description: 'Volumes to create and attach to the server',
				options: [
					{
						name: 'volumeValues',
						displayName: 'Volume',
						values: [
							{
								displayName: 'Use as Boot Volume',
								name: 'isBootVolume',
								type: 'boolean',
								default: false,
								description: 'Whether this volume should be used as the boot volume for the server. Only one volume can be the boot volume.',
							},
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								required: true,
								default: '',
								placeholder: 'boot-volume',
								description: 'The name of the volume',
							},
							{
								displayName: 'Size (GB)',
								name: 'size',
								type: 'number',
								required: true,
								typeOptions: {
									minValue: 1,
								},
								default: 20,
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
								description: 'The storage type',
							},
							{
								displayName: 'Image Source',
								name: 'imageSource',
								type: 'options',
								options: [
									{
										name: 'Image ID',
										value: 'imageId',
									},
									{
										name: 'Image Alias',
										value: 'imageAlias',
									},
									{
										name: 'Licence Type (Empty Volume)',
										value: 'licenceType',
									},
								],
								default: 'imageAlias',
								description: 'How to specify the image for this volume',
							},
							{
								displayName: 'Image ID',
								name: 'image',
								type: 'string',
								default: '',
								placeholder: '01234567-89ab-cdef-0123-456789abcdef',
								description: 'The image UUID to use for the volume',
							},
							{
								displayName: 'Image Alias',
								name: 'imageAlias',
								type: 'string',
								default: '',
								placeholder: 'ubuntu:latest',
								description: 'Image alias (e.g., ubuntu:latest, debian:latest)',
							},
							{
								displayName: 'Licence Type',
								name: 'licenceType',
								type: 'options',
								options: [
									{
										name: 'Linux',
										value: 'LINUX',
									},
									{
										name: 'Windows',
										value: 'WINDOWS',
									},
									{
										name: 'Windows 2016',
										value: 'WINDOWS2016',
									},
									{
										name: 'Other',
										value: 'OTHER',
									},
									{
										name: 'Unknown',
										value: 'UNKNOWN',
									},
								],
								default: 'LINUX',
								description: 'Licence type for empty volumes (no image)',
							},
							{
								displayName: 'Image Password',
								name: 'imagePassword',
								type: 'string',
								typeOptions: { password: true },
								default: '',
								description: 'Password for the image (required for public images if no SSH keys)',
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
								description: 'SSH public keys (one per line, required for public images if no password)',
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
						],
					},
				],
			},

			// Server: Create - NICs (Network Interfaces)
			{
				displayName: 'Network Interfaces (NICs)',
				name: 'nics',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Network Interface',
				default: {},
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['create'],
					},
				},
				description: 'Network interfaces to create and attach to the server',
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
								placeholder: 'nic-1',
								description: 'The name of the NIC',
							},
							{
								displayName: 'LAN ID',
								name: 'lan',
								type: 'number',
								required: true,
								typeOptions: {
									minValue: 1,
								},
								default: 1,
								description: 'The LAN ID the NIC will be on',
							},
							{
								displayName: 'DHCP',
								name: 'dhcp',
								type: 'boolean',
								default: true,
								description: 'Whether the NIC should get an IP address using DHCP',
							},
							{
								displayName: 'IPs',
								name: 'ips',
								type: 'string',
								default: '',
								placeholder: '192.168.1.10, 192.168.1.11',
								description: 'Static IPs for the NIC (comma-separated)',
							},
							{
								displayName: 'Firewall Active',
								name: 'firewallActive',
								type: 'boolean',
								default: false,
								description: 'Whether the firewall is active on this NIC',
							},
							{
								displayName: 'Firewall Type',
								name: 'firewallType',
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
									{
										name: 'Bidirectional',
										value: 'BIDIRECTIONAL',
									},
								],
								default: 'INGRESS',
								description: 'The type of firewall rules that will be allowed on the NIC',
							},
						],
					},
				],
			},

			// Server: Create - CD-ROM
			{
				displayName: 'CD-ROM Image ID',
				name: 'cdromImageId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '01234567-89ab-cdef-0123-456789abcdef',
				description: 'The ID of a CD-ROM/ISO image to attach to the server',
			},

			// Server: Get, Update, Delete, Action, Volume operations
			{
				displayName: 'Server ID',
				name: 'serverId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['get', 'update', 'delete', 'action', 'attachVolume', 'detachVolume', 'listVolumes'],
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

			// Server: Attach/Detach Volume - Volume ID
			{
				displayName: 'Volume ID',
				name: 'attachVolumeId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['attachVolume', 'detachVolume'],
					},
				},
				default: '',
				placeholder: '15f67991-0f51-4efc-a8ad-ef1fb31a480c',
				description: 'The ID of the volume to attach/detach',
			},

			// Server: Get Many
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['getAll', 'listVolumes'],
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
						operation: ['getAll', 'listVolumes'],
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
			// Volume: Image Source selector
			{
				displayName: 'Image Source',
				name: 'volumeImageSource',
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
						name: 'Image ID',
						value: 'imageId',
					},
					{
						name: 'Image Alias',
						value: 'imageAlias',
					},
					{
						name: 'Licence Type (Empty Volume)',
						value: 'licenceType',
					},
				],
				default: 'imageAlias',
				description: 'How to specify the image for this volume',
			},
			{
				displayName: 'Image ID',
				name: 'volumeImage',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['create'],
						volumeImageSource: ['imageId'],
					},
				},
				default: '',
				placeholder: '01234567-89ab-cdef-0123-456789abcdef',
				description: 'The image UUID to use for the volume',
			},
			{
				displayName: 'Image Alias',
				name: 'volumeImageAlias',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['create'],
						volumeImageSource: ['imageAlias'],
					},
				},
				default: '',
				placeholder: 'ubuntu:latest',
				description: 'Image alias (e.g., ubuntu:latest, debian:latest)',
			},
			{
				displayName: 'Licence Type',
				name: 'volumeLicenceType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['create'],
						volumeImageSource: ['licenceType'],
					},
				},
				options: [
					{
						name: 'Linux',
						value: 'LINUX',
					},
					{
						name: 'Windows',
						value: 'WINDOWS',
					},
					{
						name: 'Windows 2016',
						value: 'WINDOWS2016',
					},
					{
						name: 'Other',
						value: 'OTHER',
					},
					{
						name: 'Unknown',
						value: 'UNKNOWN',
					},
				],
				default: 'LINUX',
				description: 'Licence type for empty volumes (no image)',
			},
			{
				displayName: 'Image Password',
				name: 'volumeImagePassword',
				type: 'string',
				typeOptions: { password: true },
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['create'],
						volumeImageSource: ['imageId', 'imageAlias'],
					},
				},
				default: '',
				description: 'Password for the image (required for public images if no SSH keys)',
			},
			{
				displayName: 'SSH Keys',
				name: 'volumeSshKeys',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				displayOptions: {
					show: {
						resource: ['volume'],
						operation: ['create'],
						volumeImageSource: ['imageId', 'imageAlias'],
					},
				},
				default: '',
				placeholder: 'ssh-rsa AAAA...',
				description: 'SSH public keys (one per line, required for public images if no password)',
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
						operation: ['get', 'getAll', 'listVolumes'],
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
						const volumesData = this.getNodeParameter('volumes', i) as IDataObject;
						const nicsData = this.getNodeParameter('nics', i) as IDataObject;
						const cdromImageId = this.getNodeParameter('cdromImageId', i, '') as string;

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

						// Add volumes to create with the server
						if (volumesData && volumesData.volumeValues && Array.isArray(volumesData.volumeValues) && volumesData.volumeValues.length > 0) {
							const volumeItems: IDataObject[] = [];
							let bootVolumeIndex = -1;

							for (let volIndex = 0; volIndex < volumesData.volumeValues.length; volIndex++) {
								const vol = volumesData.volumeValues[volIndex] as IDataObject;
								const volumeProperties: IDataObject = {
									name: vol.name,
									size: vol.size,
									type: vol.type,
								};

								// Track which volume should be the boot volume
								if (vol.isBootVolume === true) {
									bootVolumeIndex = volIndex;
								}

								// Handle image source based on selection
								const imageSource = vol.imageSource as string || 'imageAlias';
								if (imageSource === 'imageId') {
									if (vol.image) {
										volumeProperties.image = vol.image;
									} else {
										throw new NodeOperationError(this.getNode(), 'Image ID is required when "Image ID" is selected as Image Source', { itemIndex: i });
									}
								} else if (imageSource === 'imageAlias') {
									if (vol.imageAlias) {
										volumeProperties.imageAlias = vol.imageAlias;
									} else {
										throw new NodeOperationError(this.getNode(), 'Image Alias is required when "Image Alias" is selected as Image Source', { itemIndex: i });
									}
								} else if (imageSource === 'licenceType') {
									volumeProperties.licenceType = vol.licenceType || 'LINUX';
								}

								// Only add password/ssh keys if using an image (not licenceType)
								if (imageSource !== 'licenceType') {
									if (vol.imagePassword) volumeProperties.imagePassword = vol.imagePassword;
									if (vol.sshKeys) {
										const sshKeysString = vol.sshKeys as string;
										const sshKeysArray = sshKeysString.split('\n').filter((key: string) => key.trim());
										if (sshKeysArray.length > 0) {
											volumeProperties.sshKeys = sshKeysArray;
										}
									}
								}

								if (vol.bus) volumeProperties.bus = vol.bus;
								if (vol.availabilityZone) volumeProperties.availabilityZone = vol.availabilityZone;

								volumeItems.push({
									properties: volumeProperties,
								});
							}

							// Reorder volumes so boot volume is first (IONOS uses first volume as boot by default)
							if (bootVolumeIndex > 0) {
								const bootVolume = volumeItems.splice(bootVolumeIndex, 1)[0];
								volumeItems.unshift(bootVolume);
							}

							if (!body.entities) {
								body.entities = {};
							}
							(body.entities as IDataObject).volumes = {
								items: volumeItems,
							};
						}

						// Add NICs to create with the server
						if (nicsData && nicsData.nicValues && Array.isArray(nicsData.nicValues) && nicsData.nicValues.length > 0) {
							const nicItems: IDataObject[] = [];

							for (const nic of nicsData.nicValues as IDataObject[]) {
								const nicProperties: IDataObject = {
									lan: nic.lan,
								};

								if (nic.name) nicProperties.name = nic.name;
								if (nic.dhcp !== undefined) nicProperties.dhcp = nic.dhcp;
								if (nic.firewallActive !== undefined) nicProperties.firewallActive = nic.firewallActive;
								if (nic.firewallType) nicProperties.firewallType = nic.firewallType;

								if (nic.ips) {
									const ipsString = nic.ips as string;
									const ipsArray = ipsString.split(',').map((ip: string) => ip.trim()).filter((ip: string) => ip);
									if (ipsArray.length > 0) {
										nicProperties.ips = ipsArray;
									}
								}

								nicItems.push({
									properties: nicProperties,
								});
							}

							if (!body.entities) {
								body.entities = {};
							}
							(body.entities as IDataObject).nics = {
								items: nicItems,
							};
						}

						// Add CD-ROM to create with the server
						if (cdromImageId) {
							if (!body.entities) {
								body.entities = {};
							}
							(body.entities as IDataObject).cdroms = {
								items: [
									{
										id: cdromImageId,
									},
								],
							};
						}

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

					if (operation === 'attachVolume') {
						const serverId = this.getNodeParameter('serverId', i) as string;
						const volumeId = this.getNodeParameter('attachVolumeId', i) as string;

						const body: IDataObject = {
							id: volumeId,
						};

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseURL}/datacenters/${datacenterId}/servers/${serverId}/volumes`,
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

					if (operation === 'detachVolume') {
						const serverId = this.getNodeParameter('serverId', i) as string;
						const volumeId = this.getNodeParameter('attachVolumeId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'DELETE',
							url: `${baseURL}/datacenters/${datacenterId}/servers/${serverId}/volumes/${volumeId}`,
							headers: {
								Accept: 'application/json',
							},
						};

						await this.helpers.httpRequestWithAuthentication.call(this, 'ionosCloud', options);
						returnData.push({ json: { success: true, serverId, volumeId, action: 'detached' } });
					}

					if (operation === 'listVolumes') {
						const serverId = this.getNodeParameter('serverId', i) as string;
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
							url: `${baseURL}/datacenters/${datacenterId}/servers/${serverId}/volumes`,
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
						const imageSource = this.getNodeParameter('volumeImageSource', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const properties: IDataObject = {
							name: volumeName,
							size,
							type: volumeType,
						};

						// Handle image source based on selection
						if (imageSource === 'imageId') {
							const image = this.getNodeParameter('volumeImage', i) as string;
							if (!image) {
								throw new NodeOperationError(this.getNode(), 'Image ID is required when "Image ID" is selected', { itemIndex: i });
							}
							properties.image = image;
						} else if (imageSource === 'imageAlias') {
							const imageAlias = this.getNodeParameter('volumeImageAlias', i) as string;
							if (!imageAlias) {
								throw new NodeOperationError(this.getNode(), 'Image Alias is required when "Image Alias" is selected', { itemIndex: i });
							}
							properties.imageAlias = imageAlias;
						} else if (imageSource === 'licenceType') {
							const licenceType = this.getNodeParameter('volumeLicenceType', i) as string;
							properties.licenceType = licenceType;
						}

						// Only add password/ssh keys if using an image (not licenceType)
						if (imageSource !== 'licenceType') {
							const imagePassword = this.getNodeParameter('volumeImagePassword', i, '') as string;
							const sshKeys = this.getNodeParameter('volumeSshKeys', i, '') as string;

							if (imagePassword) {
								properties.imagePassword = imagePassword;
							}
							if (sshKeys) {
								const sshKeysArray = sshKeys.split('\n').filter((key) => key.trim());
								if (sshKeysArray.length > 0) {
									properties.sshKeys = sshKeysArray;
								}
							}
						}

						// Add additional fields
						if (additionalFields.availabilityZone) {
							properties.availabilityZone = additionalFields.availabilityZone;
						}
						if (additionalFields.bus) {
							properties.bus = additionalFields.bus;
						}

						const body: IDataObject = { properties };

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
				// Extract detailed error message from API response
				const err = error as Error & { cause?: { error?: { message?: string; messages?: Array<{ message?: string }> } }; response?: { body?: { message?: string; messages?: Array<{ message?: string }> } } };
				let errorMessage = err.message;

				// Try to get more details from the error
				if (err.cause?.error?.message) {
					errorMessage = err.cause.error.message;
				} else if (err.cause?.error?.messages && err.cause.error.messages.length > 0) {
					errorMessage = err.cause.error.messages.map(m => m.message).join(', ');
				} else if (err.response?.body?.message) {
					errorMessage = err.response.body.message;
				} else if (err.response?.body?.messages && err.response.body.messages.length > 0) {
					errorMessage = err.response.body.messages.map(m => m.message).join(', ');
				}

				throw new NodeOperationError(this.getNode(), errorMessage, {
					itemIndex: i,
					description: JSON.stringify(error, null, 2),
				});
			}
		}

		return [returnData];
	}
}
