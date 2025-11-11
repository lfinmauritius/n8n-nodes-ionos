import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class IonosCloudMonitoring implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud Monitoring',
		name: 'ionosCloudMonitoring',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"]}} - {{$parameter["operation"]}}',
		description: 'Manage monitoring pipelines and centralized metrics collection with IONOS Cloud Monitoring Service. Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud Monitoring',
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
						name: 'Birmingham (gb-bhx)',
						value: 'gb-bhx',
					},
					{
						name: 'London (gb-lhr)',
						value: 'gb-lhr',
					},
					{
						name: 'Paris (fr-par)',
						value: 'fr-par',
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
						name: 'Pipeline',
						value: 'pipeline',
						description: 'Monitoring pipeline',
					},
					{
						name: 'Key',
						value: 'key',
						description: 'Pipeline authentication key',
					},
					{
						name: 'Central Monitoring',
						value: 'centralMonitoring',
						description: 'Central monitoring configuration',
					},
				],
				default: 'pipeline',
			},

			// Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['pipeline', 'centralMonitoring'],
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
						description: 'Update a resource',
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

			// Key operation (only regenerate)
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['key'],
					},
				},
				options: [
					{
						name: 'Regenerate',
						value: 'regenerate',
						description: 'Generate a new key (invalidates the old one)',
						action: 'Regenerate key',
					},
				],
				default: 'regenerate',
			},

			// ====================
			// Pipeline Fields
			// ====================

			// Pipeline ID
			{
				displayName: 'Pipeline ID',
				name: 'pipelineId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['pipeline', 'key'],
						operation: ['get', 'update', 'delete', 'regenerate'],
					},
				},
				default: '',
				description: 'The ID (UUID) of the Pipeline',
			},

			// Pipeline Name
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['pipeline'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'MyMonitoringPipeline',
				description: 'The name of the monitoring pipeline (max 20 characters)',
			},

			// ====================
			// Central Monitoring Fields
			// ====================

			// Central Monitoring ID
			{
				displayName: 'Central Monitoring ID',
				name: 'centralId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['centralMonitoring'],
						operation: ['get', 'update'],
					},
				},
				default: '',
				description: 'The ID (UUID) of the Central Monitoring configuration',
			},

			// Central Monitoring Enabled
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				required: true,
				displayOptions: {
					show: {
						resource: ['centralMonitoring'],
						operation: ['update'],
					},
				},
				default: false,
				description: 'Whether central monitoring is enabled',
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

			// Order By (for pipelines)
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['pipeline'],
						operation: ['getMany'],
					},
				},
				options: [
					{
						name: 'Created Date (Newest First)',
						value: '-createdDate',
					},
					{
						name: 'Created Date (Oldest First)',
						value: 'createdDate',
					},
					{
						name: 'Last Modified Date (Newest First)',
						value: '-lastModifiedDate',
					},
					{
						name: 'Last Modified Date (Oldest First)',
						value: 'lastModifiedDate',
					},
					{
						name: 'Name (A-Z)',
						value: 'name',
					},
					{
						name: 'Name (Z-A)',
						value: '-name',
					},
				],
				default: '-createdDate',
				description: 'The field to order the results by',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const location = this.getNodeParameter('location', 0) as string;

		const baseUrl = `https://monitoring.${location}.ionos.com`;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ====================
				// Pipeline
				// ====================

				if (resource === 'pipeline') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;

						const body: IDataObject = {
							properties: {
								name,
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/pipelines`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const pipelineId = this.getNodeParameter('pipelineId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/pipelines/${pipelineId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 100) as number;
						const offset = this.getNodeParameter('offset', i, 0) as number;
						const orderBy = this.getNodeParameter('orderBy', i, '-createdDate') as string;

						const qs: IDataObject = {
							offset: offset.toString(),
							orderBy,
						};

						if (!returnAll) {
							qs.limit = limit.toString();
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/pipelines`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const pipelineId = this.getNodeParameter('pipelineId', i) as string;
						const name = this.getNodeParameter('name', i) as string;

						const body: IDataObject = {
							id: pipelineId,
							properties: {
								name,
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/pipelines/${pipelineId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const pipelineId = this.getNodeParameter('pipelineId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/pipelines/${pipelineId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Key
				// ====================

				else if (resource === 'key') {
					if (operation === 'regenerate') {
						const pipelineId = this.getNodeParameter('pipelineId', i) as string;

						const body: IDataObject = {};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/pipelines/${pipelineId}/key`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					}
				}

				// ====================
				// Central Monitoring
				// ====================

				else if (resource === 'centralMonitoring') {
					if (operation === 'get') {
						const centralId = this.getNodeParameter('centralId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/central/${centralId}`,
							},
						);
					} else if (operation === 'getMany') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/central`,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const centralId = this.getNodeParameter('centralId', i) as string;
						const enabled = this.getNodeParameter('enabled', i) as boolean;

						const body: IDataObject = {
							properties: {
								enabled,
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/central/${centralId}`,
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
