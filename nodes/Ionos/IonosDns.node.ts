import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

export class IonosDns implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS DNS',
		name: 'ionosDns',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage DNS zones and records with IONOS',
		defaults: {
			name: 'IONOS DNS',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'ionosApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Zone',
						value: 'zone',
					},
					{
						name: 'Record',
						value: 'record',
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
						description: 'Create a new DNS zone',
						action: 'Create a zone',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a DNS zone',
						action: 'Delete a zone',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a DNS zone',
						action: 'Get a zone',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all DNS zones',
						action: 'Get many zones',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a DNS zone',
						action: 'Update a zone',
					},
				],
				default: 'getAll',
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
						description: 'Create a new DNS record',
						action: 'Create a record',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a DNS record',
						action: 'Delete a record',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a DNS record',
						action: 'Get a record',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all DNS records in a zone',
						action: 'Get many records',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a DNS record',
						action: 'Update a record',
					},
				],
				default: 'getAll',
			},

			// Zone: Create
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
				description: 'The name of the DNS zone to create',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['zone'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Native',
						value: 'NATIVE',
					},
					{
						name: 'Master',
						value: 'MASTER',
					},
					{
						name: 'Slave',
						value: 'SLAVE',
					},
				],
				default: 'NATIVE',
				description: 'The type of the DNS zone',
			},

			// Zone: Get, Update, Delete
			{
				displayName: 'Zone ID',
				name: 'zoneId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['zone'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID of the DNS zone',
			},

			// Zone: Update
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['zone'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Zone Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The new name of the DNS zone',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'Native',
								value: 'NATIVE',
							},
							{
								name: 'Master',
								value: 'MASTER',
							},
							{
								name: 'Slave',
								value: 'SLAVE',
							},
						],
						default: 'NATIVE',
						description: 'The type of the DNS zone',
					},
				],
			},

			// Zone: Get Many
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['zone'],
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
						resource: ['zone'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				description: 'Max number of results to return',
			},

			// Record: Zone ID (required for all record operations)
			{
				displayName: 'Zone ID',
				name: 'zoneId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
					},
				},
				default: '',
				description: 'The ID of the DNS zone',
			},

			// Record: Create
			{
				displayName: 'Record Name',
				name: 'recordName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'www',
				description: 'The name of the DNS record',
			},
			{
				displayName: 'Record Type',
				name: 'recordType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'A',
						value: 'A',
					},
					{
						name: 'AAAA',
						value: 'AAAA',
					},
					{
						name: 'CNAME',
						value: 'CNAME',
					},
					{
						name: 'MX',
						value: 'MX',
					},
					{
						name: 'TXT',
						value: 'TXT',
					},
					{
						name: 'SRV',
						value: 'SRV',
					},
					{
						name: 'NS',
						value: 'NS',
					},
					{
						name: 'CAA',
						value: 'CAA',
					},
				],
				default: 'A',
				description: 'The type of the DNS record',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '192.168.1.1',
				description: 'The content/value of the DNS record',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'TTL',
						name: 'ttl',
						type: 'number',
						default: 3600,
						description: 'Time to live in seconds',
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'number',
						default: 10,
						description: 'Priority of the record (for MX and SRV records)',
					},
					{
						displayName: 'Disabled',
						name: 'disabled',
						type: 'boolean',
						default: false,
						description: 'Whether the record is disabled',
					},
				],
			},

			// Record: Get, Update, Delete
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
				description: 'The ID of the DNS record',
			},

			// Record: Update
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Record Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The new name of the DNS record',
					},
					{
						displayName: 'Content',
						name: 'content',
						type: 'string',
						default: '',
						description: 'The new content/value of the DNS record',
					},
					{
						displayName: 'TTL',
						name: 'ttl',
						type: 'number',
						default: 3600,
						description: 'Time to live in seconds',
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'number',
						default: 10,
						description: 'Priority of the record',
					},
					{
						displayName: 'Disabled',
						name: 'disabled',
						type: 'boolean',
						default: false,
						description: 'Whether the record is disabled',
					},
				],
			},

			// Record: Get Many
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['record'],
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
						resource: ['record'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
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
				if (resource === 'zone') {
					if (operation === 'create') {
						const zoneName = this.getNodeParameter('zoneName', i) as string;
						const type = this.getNodeParameter('type', i) as string;

						const body: IDataObject = {
							name: zoneName,
							type,
						};

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: '/dns/v1/zones',
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'get') {
						const zoneId = this.getNodeParameter('zoneId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `/dns/v1/zones/${zoneId}`,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: '/dns/v1/zones',
							qs: {
								limit: returnAll ? 1000 : limit,
							},
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);

						const zones = (response as IDataObject).items as IDataObject[];
						zones.forEach((zone) => {
							returnData.push({ json: zone });
						});
					}

					if (operation === 'update') {
						const zoneId = this.getNodeParameter('zoneId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};
						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.type) body.type = updateFields.type;

						const options: IHttpRequestOptions = {
							method: 'PATCH',
							url: `/dns/v1/zones/${zoneId}`,
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'delete') {
						const zoneId = this.getNodeParameter('zoneId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'DELETE',
							url: `/dns/v1/zones/${zoneId}`,
						};

						await this.helpers.httpRequestWithAuthentication.call(this, 'ionosApi', options);
						returnData.push({ json: { success: true, zoneId } });
					}
				}

				if (resource === 'record') {
					const zoneId = this.getNodeParameter('zoneId', i) as string;

					if (operation === 'create') {
						const recordName = this.getNodeParameter('recordName', i) as string;
						const recordType = this.getNodeParameter('recordType', i) as string;
						const content = this.getNodeParameter('content', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							name: recordName,
							type: recordType,
							content,
							ttl: additionalFields.ttl || 3600,
						};

						if (additionalFields.priority !== undefined) {
							body.priority = additionalFields.priority;
						}
						if (additionalFields.disabled !== undefined) {
							body.disabled = additionalFields.disabled;
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `/dns/v1/zones/${zoneId}/records`,
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'get') {
						const recordId = this.getNodeParameter('recordId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `/dns/v1/zones/${zoneId}/records/${recordId}`,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `/dns/v1/zones/${zoneId}/records`,
							qs: {
								limit: returnAll ? 1000 : limit,
							},
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);

						const records = (response as IDataObject).items as IDataObject[];
						records.forEach((record) => {
							returnData.push({ json: record });
						});
					}

					if (operation === 'update') {
						const recordId = this.getNodeParameter('recordId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};
						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.content) body.content = updateFields.content;
						if (updateFields.ttl) body.ttl = updateFields.ttl;
						if (updateFields.priority !== undefined) body.priority = updateFields.priority;
						if (updateFields.disabled !== undefined) body.disabled = updateFields.disabled;

						const options: IHttpRequestOptions = {
							method: 'PATCH',
							url: `/dns/v1/zones/${zoneId}/records/${recordId}`,
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'delete') {
						const recordId = this.getNodeParameter('recordId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'DELETE',
							url: `/dns/v1/zones/${zoneId}/records/${recordId}`,
						};

						await this.helpers.httpRequestWithAuthentication.call(this, 'ionosApi', options);
						returnData.push({ json: { success: true, recordId } });
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
