import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

const baseUrl = 'https://api.ionos.com/cloudapi/v6';

export class IonosCloudKubernetes implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud Kubernetes',
		name: 'ionosCloudKubernetes',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Manage IONOS Cloud Kubernetes clusters, node pools, and nodes. Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud Kubernetes',
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
						name: 'Cluster',
						value: 'cluster',
						description: 'Manage Kubernetes clusters',
					},
					{
						name: 'Node Pool',
						value: 'nodePool',
						description: 'Manage node pools within clusters',
					},
					{
						name: 'Node',
						value: 'node',
						description: 'Manage individual nodes within node pools',
					},
					{
						name: 'Version',
						value: 'version',
						description: 'Get available Kubernetes versions',
					},
				],
				default: 'cluster',
			},

			// Cluster Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['cluster'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a Kubernetes cluster',
						action: 'Create a cluster',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a Kubernetes cluster',
						action: 'Get a cluster',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many Kubernetes clusters',
						action: 'Get many clusters',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a Kubernetes cluster',
						action: 'Update a cluster',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a Kubernetes cluster',
						action: 'Delete a cluster',
					},
					{
						name: 'Get Kubeconfig',
						value: 'getKubeconfig',
						description: 'Get the kubeconfig file for a cluster',
						action: 'Get kubeconfig',
					},
				],
				default: 'create',
			},

			// Node Pool Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['nodePool'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a node pool',
						action: 'Create a node pool',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a node pool',
						action: 'Get a node pool',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many node pools',
						action: 'Get many node pools',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a node pool',
						action: 'Update a node pool',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a node pool',
						action: 'Delete a node pool',
					},
				],
				default: 'create',
			},

			// Node Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['node'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a node',
						action: 'Get a node',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many nodes',
						action: 'Get many nodes',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a node',
						action: 'Delete a node',
					},
					{
						name: 'Replace',
						value: 'replace',
						description: 'Replace a node',
						action: 'Replace a node',
					},
				],
				default: 'getMany',
			},

			// Version Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['version'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get all available Kubernetes versions',
						action: 'Get many versions',
					},
					{
						name: 'Get Default',
						value: 'getDefault',
						description: 'Get the default Kubernetes version',
						action: 'Get default version',
					},
				],
				default: 'getMany',
			},

			// ====================
			// Cluster Fields
			// ====================

			// Cluster ID (for Cluster operations)
			{
				displayName: 'Cluster ID',
				name: 'clusterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['get', 'update', 'delete', 'getKubeconfig'],
					},
				},
				default: '',
				description: 'The unique ID of the Kubernetes cluster',
			},

			// Cluster ID (for Node Pool operations - required for all operations)
			{
				displayName: 'Cluster ID',
				name: 'clusterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['nodePool'],
					},
				},
				default: '',
				description: 'The unique ID of the Kubernetes cluster',
			},

			// Cluster ID (for Node operations - required for all operations)
			{
				displayName: 'Cluster ID',
				name: 'clusterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['node'],
					},
				},
				default: '',
				description: 'The unique ID of the Kubernetes cluster',
			},

			// Cluster Name
			{
				displayName: 'Name',
				name: 'clusterName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the Kubernetes cluster',
			},

			// Cluster K8s Version
			{
				displayName: 'Kubernetes Version',
				name: 'k8sVersion',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The Kubernetes version (e.g., 1.28.2). Leave empty for default version.',
				placeholder: '1.28.2',
			},

			// Cluster Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'Public',
						name: 'public',
						type: 'boolean',
						default: true,
						description: 'Whether the cluster is public or private. When false, location and natGatewayIp become mandatory.',
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						placeholder: 'de/fra',
						description: 'Location where the cluster will be created (e.g., de/fra, de/txl). Mandatory if cluster is private, optional if public.',
					},
					{
						displayName: 'NAT Gateway IP',
						name: 'natGatewayIp',
						type: 'string',
						default: '',
						placeholder: '203.0.113.1',
						description: 'NAT gateway IP for private clusters. Must be a reserved IP in the same location. Mandatory if cluster is private.',
					},
					{
						displayName: 'Node Subnet',
						name: 'nodeSubnet',
						type: 'string',
						default: '',
						placeholder: '10.0.0.0/16',
						description: 'Node subnet for private clusters (IPv4 CIDR with /16 prefix). Optional and immutable.',
					},
					{
						displayName: 'Maintenance Window',
						name: 'maintenanceWindow',
						type: 'json',
						default: '{"dayOfTheWeek":"Sunday","time":"03:00:00Z"}',
						description: 'Maintenance window configuration with dayOfTheWeek and time',
					},
					{
						displayName: 'API Subnet Allow List',
						name: 'apiSubnetAllowList',
						type: 'string',
						default: '',
						description: 'Comma-separated list of CIDRs allowed to access the K8s API',
					},
					{
						displayName: 'S3 Buckets',
						name: 's3Buckets',
						type: 'json',
						default: '[]',
						description: 'Array of S3 bucket configurations for backup',
					},
				],
			},

			// ====================
			// Node Pool Fields
			// ====================

			// Node Pool ID (for Node Pool operations)
			{
				displayName: 'Node Pool ID',
				name: 'nodePoolId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the node pool',
			},

			// Node Pool ID (for Node operations - required for all operations)
			{
				displayName: 'Node Pool ID',
				name: 'nodePoolId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['node'],
					},
				},
				default: '',
				description: 'The unique ID of the node pool',
			},

			// Node Pool Name
			{
				displayName: 'Name',
				name: 'nodePoolName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the node pool',
			},

			// Node Pool Datacenter ID
			{
				displayName: 'Datacenter ID',
				name: 'datacenterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The datacenter ID where the node pool will be created',
			},

			// Node Pool Node Count
			{
				displayName: 'Node Count',
				name: 'nodeCount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create'],
					},
				},
				default: 2,
				description: 'The number of nodes in the node pool',
			},

			// Node Pool CPU Family
			{
				displayName: 'CPU Family',
				name: 'cpuFamily',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'AMD EPYC',
						value: 'AMD_OPTERON',
					},
					{
						name: 'Intel Xeon',
						value: 'INTEL_XEON',
					},
					{
						name: 'Intel Skylake',
						value: 'INTEL_SKYLAKE',
					},
				],
				default: 'AMD_OPTERON',
				description: 'The CPU family for the nodes',
			},

			// Node Pool Cores Count
			{
				displayName: 'Cores per Node',
				name: 'coresCount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create'],
					},
				},
				default: 2,
				description: 'The number of cores per node',
			},

			// Node Pool RAM Size
			{
				displayName: 'RAM per Node (MB)',
				name: 'ramSize',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create'],
					},
				},
				default: 2048,
				description: 'The RAM size per node in MB',
			},

			// Node Pool Storage Type
			{
				displayName: 'Storage Type',
				name: 'storageType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['nodePool'],
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
						name: 'SSD Standard',
						value: 'SSD Standard',
					},
					{
						name: 'SSD Premium',
						value: 'SSD Premium',
					},
				],
				default: 'SSD',
				description: 'The storage type for the nodes',
			},

			// Node Pool Storage Size
			{
				displayName: 'Storage Size (GB)',
				name: 'storageSize',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create'],
					},
				},
				default: 100,
				description: 'The storage size per node in GB',
			},

			// Node Pool Server Type
			{
				displayName: 'Server Type',
				name: 'serverType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Dedicated Core',
						value: 'DEDICATEDCORE',
					},
					{
						name: 'VCPU',
						value: 'VCPU',
					},
				],
				default: 'DEDICATEDCORE',
				description: 'The server type for the nodes (Dedicated Core or VCPU)',
			},

			// Node Pool K8s Version
			{
				displayName: 'Kubernetes Version',
				name: 'k8sVersion',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The Kubernetes version (e.g., 1.28.2). Leave empty for cluster default.',
				placeholder: '1.28.2',
			},

			// Node Pool Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'Node Count',
						name: 'nodeCount',
						type: 'number',
						default: 2,
						description: 'The number of nodes in the node pool (for update operation)',
					},
					{
						displayName: 'Kubernetes Version',
						name: 'k8sVersion',
						type: 'string',
						default: '',
						placeholder: '1.28.2',
						description: 'The Kubernetes version to upgrade to (for update operation)',
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
						],
						default: 'AUTO',
						description: 'The availability zone for the node pool',
					},
					{
						displayName: 'Public IPs',
						name: 'publicIps',
						type: 'string',
						default: '',
						description: 'Comma-separated list of public IPs',
					},
					{
						displayName: 'LAN IDs',
						name: 'lans',
						type: 'json',
						default: '[{"id":1,"dhcp":true,"routes":[]}]',
						description: 'Array of LAN configurations with id, dhcp, and routes (containing network and gatewayIp)',
					},
					{
						displayName: 'Labels',
						name: 'labels',
						type: 'json',
						default: '{}',
						description: 'Key-value pairs of labels',
					},
					{
						displayName: 'Annotations',
						name: 'annotations',
						type: 'json',
						default: '{}',
						description: 'Key-value pairs of annotations',
					},
					{
						displayName: 'Maintenance Window',
						name: 'maintenanceWindow',
						type: 'json',
						default: '{"dayOfTheWeek":"Sunday","time":"03:00:00Z"}',
						description: 'Maintenance window configuration',
					},
					{
						displayName: 'Auto Scaling',
						name: 'autoScaling',
						type: 'json',
						default: '{"minNodeCount":1,"maxNodeCount":5}',
						description: 'Auto-scaling configuration with min and max node counts',
					},
				],
			},

			// ====================
			// Node Fields
			// ====================

			// Node ID
			{
				displayName: 'Node ID',
				name: 'nodeId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['node'],
						operation: ['get', 'delete', 'replace'],
					},
				},
				default: '',
				description: 'The unique ID of the node',
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

			// Kubeconfig Format
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['getKubeconfig'],
					},
				},
				options: [
					{
						name: 'YAML',
						value: 'yaml',
					},
					{
						name: 'JSON',
						value: 'json',
					},
				],
				default: 'yaml',
				description: 'The format of the kubeconfig file',
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
				// Cluster Operations
				// ====================
				if (resource === 'cluster') {
					if (operation === 'create') {
						const name = this.getNodeParameter('clusterName', i) as string;
						const k8sVersion = this.getNodeParameter('k8sVersion', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								name,
								...(k8sVersion && { k8sVersion }),
						...(additionalFields.public !== undefined && { public: additionalFields.public }),
						...(additionalFields.location && { location: additionalFields.location }),
						...(additionalFields.natGatewayIp && { natGatewayIp: additionalFields.natGatewayIp }),
						...(additionalFields.nodeSubnet && { nodeSubnet: additionalFields.nodeSubnet }),
								...(additionalFields.maintenanceWindow && {
									maintenanceWindow: JSON.parse(additionalFields.maintenanceWindow as string),
								}),
								...(additionalFields.apiSubnetAllowList && {
									apiSubnetAllowList: (additionalFields.apiSubnetAllowList as string)
										.split(',')
										.map((cidr) => cidr.trim()),
								}),
								...(additionalFields.s3Buckets && {
									s3Buckets: JSON.parse(additionalFields.s3Buckets as string),
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/k8s`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const clusterId = this.getNodeParameter('clusterId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/k8s/${clusterId}`,
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
								url: `${baseUrl}/k8s`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const clusterId = this.getNodeParameter('clusterId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								...(additionalFields.maintenanceWindow && {
									maintenanceWindow: JSON.parse(additionalFields.maintenanceWindow as string),
								}),
								...(additionalFields.apiSubnetAllowList && {
									apiSubnetAllowList: (additionalFields.apiSubnetAllowList as string)
										.split(',')
										.map((cidr) => cidr.trim()),
								}),
								...(additionalFields.s3Buckets && {
									s3Buckets: JSON.parse(additionalFields.s3Buckets as string),
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/k8s/${clusterId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const clusterId = this.getNodeParameter('clusterId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/k8s/${clusterId}`,
							},
						);

						responseData = { success: true };
					} else if (operation === 'getKubeconfig') {
						const clusterId = this.getNodeParameter('clusterId', i) as string;
						const format = this.getNodeParameter('format', i) as string;

						const acceptHeader = format === 'json' ? 'application/json' : 'application/yaml';

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/k8s/${clusterId}/kubeconfig`,
								headers: { Accept: acceptHeader },
							},
						);

						// Wrap the response as kubeconfig content
						responseData = { kubeconfig: responseData, format };
					}
				}

				// ====================
				// Node Pool Operations
				// ====================
				else if (resource === 'nodePool') {
					const clusterId = this.getNodeParameter('clusterId', i) as string;

					if (operation === 'create') {
						const name = this.getNodeParameter('nodePoolName', i) as string;
						const datacenterId = this.getNodeParameter('datacenterId', i) as string;
						const nodeCount = this.getNodeParameter('nodeCount', i) as number;
						const cpuFamily = this.getNodeParameter('cpuFamily', i) as string;
						const coresCount = this.getNodeParameter('coresCount', i) as number;
						const ramSize = this.getNodeParameter('ramSize', i) as number;
						const storageType = this.getNodeParameter('storageType', i) as string;
						const storageSize = this.getNodeParameter('storageSize', i) as number;
						const serverType = this.getNodeParameter('serverType', i) as string;
						const k8sVersion = this.getNodeParameter('k8sVersion', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								name,
								datacenterId,
								nodeCount,
								cpuFamily,
								coresCount,
								ramSize,
								storageType,
								storageSize,
								serverType,
								...(k8sVersion && { k8sVersion }),
								...(additionalFields.availabilityZone && {
									availabilityZone: additionalFields.availabilityZone,
								}),
								...(additionalFields.publicIps && {
									publicIps: (additionalFields.publicIps as string)
										.split(',')
										.map((ip) => ip.trim()),
								}),
								...(additionalFields.lans && {
									lans: JSON.parse(additionalFields.lans as string),
								}),
								...(additionalFields.labels && {
									labels: JSON.parse(additionalFields.labels as string),
								}),
								...(additionalFields.annotations && {
									annotations: JSON.parse(additionalFields.annotations as string),
								}),
								...(additionalFields.maintenanceWindow && {
									maintenanceWindow: JSON.parse(additionalFields.maintenanceWindow as string),
								}),
								...(additionalFields.autoScaling && {
									autoScaling: JSON.parse(additionalFields.autoScaling as string),
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/k8s/${clusterId}/nodepools`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const nodePoolId = this.getNodeParameter('nodePoolId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/k8s/${clusterId}/nodepools/${nodePoolId}`,
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
								url: `${baseUrl}/k8s/${clusterId}/nodepools`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const nodePoolId = this.getNodeParameter('nodePoolId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								...(additionalFields.nodeCount !== undefined && {
									nodeCount: additionalFields.nodeCount,
								}),
								...(additionalFields.k8sVersion && {
									k8sVersion: additionalFields.k8sVersion,
								}),
								...(additionalFields.publicIps && {
									publicIps: (additionalFields.publicIps as string)
										.split(',')
										.map((ip) => ip.trim()),
								}),
								...(additionalFields.lans && {
									lans: JSON.parse(additionalFields.lans as string),
								}),
								...(additionalFields.labels && {
									labels: JSON.parse(additionalFields.labels as string),
								}),
								...(additionalFields.annotations && {
									annotations: JSON.parse(additionalFields.annotations as string),
								}),
								...(additionalFields.maintenanceWindow && {
									maintenanceWindow: JSON.parse(additionalFields.maintenanceWindow as string),
								}),
								...(additionalFields.autoScaling && {
									autoScaling: JSON.parse(additionalFields.autoScaling as string),
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/k8s/${clusterId}/nodepools/${nodePoolId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const nodePoolId = this.getNodeParameter('nodePoolId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/k8s/${clusterId}/nodepools/${nodePoolId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Node Operations
				// ====================
				else if (resource === 'node') {
					const clusterId = this.getNodeParameter('clusterId', i) as string;
					const nodePoolId = this.getNodeParameter('nodePoolId', i) as string;

					if (operation === 'get') {
						const nodeId = this.getNodeParameter('nodeId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/k8s/${clusterId}/nodepools/${nodePoolId}/nodes/${nodeId}`,
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
								url: `${baseUrl}/k8s/${clusterId}/nodepools/${nodePoolId}/nodes`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'delete') {
						const nodeId = this.getNodeParameter('nodeId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/k8s/${clusterId}/nodepools/${nodePoolId}/nodes/${nodeId}`,
							},
						);

						responseData = { success: true };
					} else if (operation === 'replace') {
						const nodeId = this.getNodeParameter('nodeId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/k8s/${clusterId}/nodepools/${nodePoolId}/nodes/${nodeId}/replace`,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					}
				}

				// ====================
				// Version Operations
				// ====================
				else if (resource === 'version') {
					if (operation === 'getMany') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/k8s/versions`,
							},
						);

						// Wrap array of versions in objects
						if (Array.isArray(responseData)) {
							responseData = (responseData as unknown as string[]).map((version) => ({ version }));
						}
					} else if (operation === 'getDefault') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/k8s/versions/default`,
							},
						);

						// Wrap string version in an object
						if (typeof responseData === 'string') {
							responseData = { version: responseData };
						}
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
