import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

const baseUrl = 'https://s3.ionos.com';

export class IonosCloudObjectStorageManagement implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud Object Storage Management',
		name: 'ionosCloudObjectStorageManagement',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"]}} - {{$parameter["operation"]}}',
		description: 'Manage S3-compatible Object Storage access keys and regions with IONOS Cloud. Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud Object Storage Management',
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
						name: 'Access Key',
						value: 'accessKey',
						description: 'S3 access key management',
					},
					{
						name: 'Region',
						value: 'region',
						description: 'S3 regions information',
					},
				],
				default: 'accessKey',
			},

			// Operations for Access Key
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['accessKey'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new access key',
						action: 'Create an access key',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an access key',
						action: 'Get an access key',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many access keys',
						action: 'Get many access keys',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an access key',
						action: 'Delete an access key',
					},
					{
						name: 'Renew',
						value: 'renew',
						description: 'Renew access key secret',
						action: 'Renew access key secret',
					},
				],
				default: 'create',
			},

			// Operations for Region
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['region'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a region',
						action: 'Get a region',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many regions',
						action: 'Get many regions',
					},
				],
				default: 'getMany',
			},

			// ====================
			// Access Key Fields
			// ====================

			// Access Key ID
			{
				displayName: 'Access Key ID',
				name: 'accessKeyId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['accessKey'],
						operation: ['get', 'delete', 'renew'],
					},
				},
				default: '',
				description: 'The ID (UUID) of the Access Key',
			},

			// Description
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['accessKey'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'My S3 Access Key',
				description: 'Description of the Access Key',
			},

			// ====================
			// Region Fields
			// ====================

			// Region Name
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['region'],
						operation: ['get'],
					},
				},
				default: '',
				placeholder: 'eu-central-3',
				description: 'The region name (e.g., eu-central-3, us-central-1)',
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

			// Filter by Access Key ID (for getMany)
			{
				displayName: 'Filter by Access Key ID',
				name: 'filterAccessKeyId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['accessKey'],
						operation: ['getMany'],
					},
				},
				default: '',
				description: 'Filter results by specific Access Key ID',
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
				// Access Key
				// ====================

				if (resource === 'accessKey') {
					if (operation === 'create') {
						const description = this.getNodeParameter('description', i) as string;

						const body: IDataObject = {
							properties: {
								description,
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/accesskeys`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const accessKeyId = this.getNodeParameter('accessKeyId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/accesskeys/${accessKeyId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 100) as number;
						const offset = this.getNodeParameter('offset', i, 0) as number;
						const filterAccessKeyId = this.getNodeParameter('filterAccessKeyId', i, '') as string;

						const qs: IDataObject = {
							offset: offset.toString(),
						};

						if (!returnAll) {
							qs.limit = limit.toString();
						}

						if (filterAccessKeyId) {
							qs.accesskeyId = filterAccessKeyId;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/accesskeys`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'delete') {
						const accessKeyId = this.getNodeParameter('accessKeyId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/accesskeys/${accessKeyId}`,
							},
						);

						responseData = { success: true };
					} else if (operation === 'renew') {
						const accessKeyId = this.getNodeParameter('accessKeyId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/accesskeys/${accessKeyId}/renew`,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					}
				}

				// ====================
				// Region
				// ====================

				else if (resource === 'region') {
					if (operation === 'get') {
						const region = this.getNodeParameter('region', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/regions/${region}`,
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
								url: `${baseUrl}/regions`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
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
