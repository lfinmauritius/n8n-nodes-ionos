import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

export class IonosCloudDatacenter implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud Datacenter',
		name: 'ionosCloudDatacenter',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage IONOS Cloud datacenters, locations, and requests. Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud Datacenter',
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
						name: 'Datacenter',
						value: 'datacenter',
					},
					{
						name: 'Location',
						value: 'location',
					},
					{
						name: 'Request',
						value: 'request',
					},
				],
				default: 'datacenter',
			},

			// ===================================
			// Datacenter Operations
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['datacenter'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new datacenter',
						action: 'Create a datacenter',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a datacenter',
						action: 'Delete a datacenter',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a datacenter',
						action: 'Get a datacenter',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all datacenters',
						action: 'Get many datacenters',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a datacenter',
						action: 'Update a datacenter',
					},
				],
				default: 'getAll',
			},

			// Datacenter: Create
			{
				displayName: 'Name',
				name: 'datacenterName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['datacenter'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'My Datacenter',
				description: 'The name of the datacenter',
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['datacenter'],
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
					{
						name: 'London (gb/lhr)',
						value: 'gb/lhr',
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
				default: 'de/txl',
				description: 'The physical location where the datacenter will be created',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['datacenter'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description of the datacenter',
					},
					{
						displayName: 'Security Group Active',
						name: 'secGroupActive',
						type: 'boolean',
						default: false,
						description: 'Whether to activate the security group',
					},
				],
			},

			// Datacenter: Get, Update, Delete
			{
				displayName: 'Datacenter ID',
				name: 'datacenterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['datacenter'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				placeholder: '15f67991-0f51-4efc-a8ad-ef1fb31a480c',
				description: 'The ID of the datacenter',
			},

			// Datacenter: Update
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['datacenter'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The new name of the datacenter',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'The new description of the datacenter',
					},
				],
			},

			// Datacenter: Get Many
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['datacenter'],
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
						resource: ['datacenter'],
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
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['datacenter'],
						operation: ['getAll', 'get'],
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

			// ===================================
			// Location Operations
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['location'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a specific location',
						action: 'Get a location',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all locations',
						action: 'Get many locations',
					},
					{
						name: 'Get Many by Region',
						value: 'getAllByRegion',
						description: 'Get all locations in a region',
						action: 'Get locations by region',
					},
				],
				default: 'getAll',
			},

			// Location: Get by Region
			{
				displayName: 'Region ID',
				name: 'regionId',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['location'],
						operation: ['getAllByRegion', 'get'],
					},
				},
				options: [
					{
						name: 'Austria (at)',
						value: 'at',
					},
					{
						name: 'France (fr)',
						value: 'fr',
					},
					{
						name: 'Germany (de)',
						value: 'de',
					},
					{
						name: 'Great Britain (gb)',
						value: 'gb',
					},
					{
						name: 'Spain (es)',
						value: 'es',
					},
					{
						name: 'United States (us)',
						value: 'us',
					},
				],
				default: 'de',
				description: 'The region (country) code',
			},

			// Location: Get specific
			{
				displayName: 'Location ID',
				name: 'locationId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['location'],
						operation: ['get'],
					},
				},
				default: '',
				placeholder: 'txl',
				description: 'The location code (usually IATA airport code)',
			},

			// Location: Options
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['location'],
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

			// ===================================
			// Request Operations
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['request'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a request',
						action: 'Get a request',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all requests',
						action: 'Get many requests',
					},
					{
						name: 'Get Status',
						value: 'getStatus',
						description: 'Get request status',
						action: 'Get request status',
					},
				],
				default: 'getAll',
			},

			// Request: Get, Get Status
			{
				displayName: 'Request ID',
				name: 'requestId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['request'],
						operation: ['get', 'getStatus'],
					},
				},
				default: '',
				placeholder: '15f67991-0f51-4efc-a8ad-ef1fb31a480c',
				description: 'The ID of the request',
			},

			// Request: Get Many - Filters
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['request'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Queued',
								value: 'QUEUED',
							},
							{
								name: 'Running',
								value: 'RUNNING',
							},
							{
								name: 'Done',
								value: 'DONE',
							},
							{
								name: 'Failed',
								value: 'FAILED',
							},
						],
						default: '',
						description: 'Filter by request status',
					},
					{
						displayName: 'Created After',
						name: 'createdAfter',
						type: 'dateTime',
						default: '',
						description: 'Filter requests created after this date',
					},
					{
						displayName: 'Created Before',
						name: 'createdBefore',
						type: 'dateTime',
						default: '',
						description: 'Filter requests created before this date',
					},
				],
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['request'],
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
				// Datacenters
				// ===================================
				if (resource === 'datacenter') {
					if (operation === 'create') {
						const datacenterName = this.getNodeParameter('datacenterName', i) as string;
						const location = this.getNodeParameter('location', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								name: datacenterName,
								location,
								...(additionalFields.description && { description: additionalFields.description }),
								...(additionalFields.secGroupActive !== undefined && {
									secGroupActive: additionalFields.secGroupActive,
								}),
							},
						};

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseURL}/datacenters`,
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
						const datacenterId = this.getNodeParameter('datacenterId', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const qs: IDataObject = {};
						if (additionalOptions.depth !== undefined) qs.depth = additionalOptions.depth;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/datacenters/${datacenterId}`,
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
							url: `${baseURL}/datacenters`,
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

						const datacenters = (response as IDataObject).items as IDataObject[];
						if (datacenters && datacenters.length > 0) {
							datacenters.forEach((datacenter) => {
								returnData.push({ json: datacenter });
							});
						} else {
							returnData.push({ json: response as IDataObject });
						}
					}

					if (operation === 'update') {
						const datacenterId = this.getNodeParameter('datacenterId', i) as string;
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
							method: 'PUT',
							url: `${baseURL}/datacenters/${datacenterId}`,
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
						const datacenterId = this.getNodeParameter('datacenterId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'DELETE',
							url: `${baseURL}/datacenters/${datacenterId}`,
							headers: {
								Accept: 'application/json',
							},
						};

						await this.helpers.httpRequestWithAuthentication.call(this, 'ionosCloud', options);
						returnData.push({ json: { success: true, datacenterId } });
					}
				}

				// ===================================
				// Locations
				// ===================================
				if (resource === 'location') {
					const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;
					const qs: IDataObject = {};
					if (additionalOptions.depth !== undefined) qs.depth = additionalOptions.depth;

					if (operation === 'getAll') {
						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/locations`,
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

						const locations = (response as IDataObject).items as IDataObject[];
						if (locations && locations.length > 0) {
							locations.forEach((location) => {
								returnData.push({ json: location });
							});
						} else {
							returnData.push({ json: response as IDataObject });
						}
					}

					if (operation === 'getAllByRegion') {
						const regionId = this.getNodeParameter('regionId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/locations/${regionId}`,
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

						const locations = (response as IDataObject).items as IDataObject[];
						if (locations && locations.length > 0) {
							locations.forEach((location) => {
								returnData.push({ json: location });
							});
						} else {
							returnData.push({ json: response as IDataObject });
						}
					}

					if (operation === 'get') {
						const regionId = this.getNodeParameter('regionId', i) as string;
						const locationId = this.getNodeParameter('locationId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/locations/${regionId}/${locationId}`,
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
				}

				// ===================================
				// Requests
				// ===================================
				if (resource === 'request') {
					const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;
					const qs: IDataObject = {};
					if (additionalOptions.depth !== undefined) qs.depth = additionalOptions.depth;

					if (operation === 'get') {
						const requestId = this.getNodeParameter('requestId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/requests/${requestId}`,
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

					if (operation === 'getStatus') {
						const requestId = this.getNodeParameter('requestId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/requests/${requestId}/status`,
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
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						if (filters.status) qs['filter.status'] = filters.status;
						if (filters.createdAfter) {
							// Format: yyyy-MM-dd HH:mm:ss
							const date = new Date(filters.createdAfter as string);
							qs['filter.createdAfter'] = date
								.toISOString()
								.replace('T', ' ')
								.replace(/\.\d+Z$/, '');
						}
						if (filters.createdBefore) {
							const date = new Date(filters.createdBefore as string);
							qs['filter.createdBefore'] = date
								.toISOString()
								.replace('T', ' ')
								.replace(/\.\d+Z$/, '');
						}

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/requests`,
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

						const requests = (response as IDataObject).items as IDataObject[];
						if (requests && requests.length > 0) {
							requests.forEach((request) => {
								returnData.push({ json: request });
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
