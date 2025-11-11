import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class IonosCloudNetworkFileStorage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud Network File Storage',
		name: 'ionosCloudNetworkFileStorage',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"]}} - {{$parameter["operation"]}}',
		description: 'Manage NFSv4.2 network file storage clusters and shares with IONOS Cloud. Developped with Love and AI by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud Network File Storage',
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
						name: 'Paris (fr-par)',
						value: 'fr-par',
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
						name: 'Cluster',
						value: 'cluster',
						description: 'Network File Storage cluster',
					},
					{
						name: 'Share',
						value: 'share',
						description: 'Directory on a NFS cluster with quotas',
					},
				],
				default: 'cluster',
			},

			// Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['cluster', 'share'],
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
						description: 'Update a resource (ensure - create or modify)',
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
			// Cluster Fields
			// ====================

			// Cluster ID
			{
				displayName: 'Cluster ID',
				name: 'clusterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID (UUID) of the Cluster',
			},

			// Cluster ID (for shares)
			{
				displayName: 'Cluster ID',
				name: 'clusterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['share'],
					},
				},
				default: '',
				description: 'The ID (UUID) of the Cluster containing the share',
			},

			// Cluster Name
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'MyNFSCluster',
				description: 'The name of the NFS cluster',
			},

			// Datacenter ID
			{
				displayName: 'Datacenter ID',
				name: 'datacenterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'The ID (UUID) of the datacenter where the cluster is located',
			},

			// LAN
			{
				displayName: 'LAN',
				name: 'lan',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['create', 'update'],
					},
				},
				default: '1',
				description: 'The LAN to which the Network File Storage cluster must be connected',
			},

			// IP Address
			{
				displayName: 'IP Address',
				name: 'ipAddress',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: '10.254.64.1/24',
				description: 'The IP address and prefix in CIDR notation (IPv4 or IPv6)',
			},

			// Size
			{
				displayName: 'Size (TiB)',
				name: 'size',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['create', 'update'],
					},
				},
				typeOptions: {
					minValue: 2,
					maxValue: 42,
				},
				default: 2,
				description: 'The size of the cluster in TiB (affects billing, cannot be reduced after provisioning)',
			},

			// Filter by Datacenter ID (for getMany)
			{
				displayName: 'Filter by Datacenter ID',
				name: 'filterDatacenterId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['getMany'],
					},
				},
				default: '',
				description: 'Filter clusters by datacenter ID',
			},

			// ====================
			// Share Fields
			// ====================

			// Share ID
			{
				displayName: 'Share ID',
				name: 'shareId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['share'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID (UUID) of the Share',
			},

			// Share Name
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['share'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'MyNFSShare',
				description: 'The name of the NFS share',
			},

			// Quota
			{
				displayName: 'Quota (MiB)',
				name: 'quota',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['share'],
						operation: ['create', 'update'],
					},
				},
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'The quota for the share in MiB (0 = unlimited)',
			},

			// UID
			{
				displayName: 'User ID (UID)',
				name: 'uid',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['share'],
						operation: ['create', 'update'],
					},
				},
				typeOptions: {
					minValue: 0,
					maxValue: 65534,
				},
				default: 65534,
				description: 'The user ID that will own the exported directory',
			},

			// GID
			{
				displayName: 'Group ID (GID)',
				name: 'gid',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['share'],
						operation: ['create', 'update'],
					},
				},
				typeOptions: {
					minValue: 0,
					maxValue: 65534,
				},
				default: 65534,
				description: 'The group ID that will own the exported directory',
			},

			// Client Groups
			{
				displayName: 'Client Groups',
				name: 'clientGroups',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['share'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				placeholder: 'Add Client Group',
				description: 'Virtual machines connecting to the NFS cluster',
				options: [
					{
						name: 'clientGroup',
						displayName: 'Client Group',
						values: [
							{
								displayName: 'Description',
								name: 'description',
								type: 'string',
								default: '',
								description: 'Optional description for the client group',
							},
							{
								displayName: 'IP Networks',
								name: 'ipNetworks',
								type: 'string',
								typeOptions: {
									multipleValues: true,
								},
								default: [],
								placeholder: '10.234.50.0/24',
								description: 'Allowed networks in CIDR notation (supersedes hosts)',
							},
							{
								displayName: 'Hosts',
								name: 'hosts',
								type: 'string',
								typeOptions: {
									multipleValues: true,
								},
								default: [],
								placeholder: '10.234.62.123',
								description: 'Individual hosts allowed to connect (IPv4 or IPv6)',
							},
							{
								displayName: 'NFS Squash Mode',
								name: 'squash',
								type: 'options',
								options: [
									{
										name: 'None (No Mapping)',
										value: 'none',
									},
									{
										name: 'Root Anonymous (Map Root to Anonymous)',
										value: 'root-anonymous',
									},
									{
										name: 'All Anonymous (Map All Users to Anonymous)',
										value: 'all-anonymous',
									},
								],
								default: 'none',
								description: 'The NFS squash mode for permission mapping',
							},
						],
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
				default: 100,
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

		const baseUrl = `https://nfs.${location}.ionos.com`;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ====================
				// Cluster
				// ====================

				if (resource === 'cluster') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const datacenterId = this.getNodeParameter('datacenterId', i) as string;
						const lan = this.getNodeParameter('lan', i) as string;
						const ipAddress = this.getNodeParameter('ipAddress', i) as string;
						const size = this.getNodeParameter('size', i, 2) as number;

						const body: IDataObject = {
							properties: {
								name,
								connections: [
									{
										datacenterId,
										lan,
										ipAddress,
									},
								],
								nfs: {
									minVersion: '4.2',
								},
								size,
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/clusters`,
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
								url: `${baseUrl}/clusters/${clusterId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 100) as number;
						const offset = this.getNodeParameter('offset', i, 0) as number;
						const filterDatacenterId = this.getNodeParameter('filterDatacenterId', i, '') as string;

						const qs: IDataObject = {
							offset: offset.toString(),
						};

						if (!returnAll) {
							qs.limit = limit.toString();
						}

						if (filterDatacenterId) {
							qs['filter.datacenterId'] = filterDatacenterId;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/clusters`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const clusterId = this.getNodeParameter('clusterId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const datacenterId = this.getNodeParameter('datacenterId', i) as string;
						const lan = this.getNodeParameter('lan', i) as string;
						const ipAddress = this.getNodeParameter('ipAddress', i) as string;
						const size = this.getNodeParameter('size', i, 2) as number;

						const body: IDataObject = {
							id: clusterId,
							properties: {
								name,
								connections: [
									{
										datacenterId,
										lan,
										ipAddress,
									},
								],
								nfs: {
									minVersion: '4.2',
								},
								size,
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/clusters/${clusterId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const clusterId = this.getNodeParameter('clusterId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/clusters/${clusterId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Share
				// ====================

				else if (resource === 'share') {
					const clusterId = this.getNodeParameter('clusterId', i) as string;

					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const quota = this.getNodeParameter('quota', i, 0) as number;
						const uid = this.getNodeParameter('uid', i, 65534) as number;
						const gid = this.getNodeParameter('gid', i, 65534) as number;
						const clientGroups = this.getNodeParameter('clientGroups', i) as IDataObject;

						const clientGroupsArray = (clientGroups.clientGroup as IDataObject[]) || [];
						const formattedClientGroups = clientGroupsArray.map((group: IDataObject) => {
							const formattedGroup: IDataObject = {};

							if (group.description) {
								formattedGroup.description = group.description;
							}
							if (group.ipNetworks) {
								formattedGroup.ipNetworks = group.ipNetworks;
							}
							if (group.hosts) {
								formattedGroup.hosts = group.hosts;
							}
							if (group.squash) {
								formattedGroup.nfs = {
									squash: group.squash,
								};
							}

							return formattedGroup;
						});

						const body: IDataObject = {
							properties: {
								name,
								quota,
								uid,
								gid,
								clientGroups: formattedClientGroups,
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/clusters/${clusterId}/shares`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const shareId = this.getNodeParameter('shareId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/clusters/${clusterId}/shares/${shareId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 100) as number;
						const offset = this.getNodeParameter('offset', i, 0) as number;

						const qs: IDataObject = {
							offset: offset.toString(),
						};

						if (!returnAll) {
							qs.limit = limit.toString();
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/clusters/${clusterId}/shares`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const shareId = this.getNodeParameter('shareId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const quota = this.getNodeParameter('quota', i, 0) as number;
						const uid = this.getNodeParameter('uid', i, 65534) as number;
						const gid = this.getNodeParameter('gid', i, 65534) as number;
						const clientGroups = this.getNodeParameter('clientGroups', i) as IDataObject;

						const clientGroupsArray = (clientGroups.clientGroup as IDataObject[]) || [];
						const formattedClientGroups = clientGroupsArray.map((group: IDataObject) => {
							const formattedGroup: IDataObject = {};

							if (group.description) {
								formattedGroup.description = group.description;
							}
							if (group.ipNetworks) {
								formattedGroup.ipNetworks = group.ipNetworks;
							}
							if (group.hosts) {
								formattedGroup.hosts = group.hosts;
							}
							if (group.squash) {
								formattedGroup.nfs = {
									squash: group.squash,
								};
							}

							return formattedGroup;
						});

						const body: IDataObject = {
							id: shareId,
							properties: {
								name,
								quota,
								uid,
								gid,
								clientGroups: formattedClientGroups,
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/clusters/${clusterId}/shares/${shareId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const shareId = this.getNodeParameter('shareId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/clusters/${clusterId}/shares/${shareId}`,
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
