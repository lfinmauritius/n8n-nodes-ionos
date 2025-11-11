import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

const baseUrl = 'https://api.ionos.com/activitylog/v1';

export class IonosCloudActivityLog implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud Activity Log',
		name: 'ionosCloudActivityLog',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Retrieve audit logs and activity information from IONOS Cloud contracts. Developped with Love and AI by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud Activity Log',
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
			// Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get API Info',
						value: 'getInfo',
						description: 'Display API information',
						action: 'Get API information',
					},
					{
						name: 'Get Contracts',
						value: 'getContracts',
						description: 'List all accessible contracts',
						action: 'Get all accessible contracts',
					},
					{
						name: 'Get Activity Logs',
						value: 'getActivityLogs',
						description: 'Download activity log entries for a contract',
						action: 'Get activity log entries',
					},
				],
				default: 'getActivityLogs',
			},

			// ====================
			// Activity Logs Fields
			// ====================

			// Contract Number
			{
				displayName: 'Contract Number',
				name: 'contractNumber',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getActivityLogs'],
					},
				},
				default: '',
				placeholder: '12345678',
				description: 'Contract number whose activity log entries should be downloaded',
			},

			// Date Start
			{
				displayName: 'Date Start',
				name: 'dateStart',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getActivityLogs'],
					},
				},
				default: '',
				placeholder: '2024-01-01 or 2024-01-01T00:00:00Z',
				description: 'Start date for the Activity Log entries (inclusive). Format: YYYY-MM-DD or ISO 8601 (e.g., 2024-01-01T00:00:00Z)',
			},

			// Date End
			{
				displayName: 'Date End',
				name: 'dateEnd',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getActivityLogs'],
					},
				},
				default: '',
				placeholder: '2024-12-31 or 2024-12-31T23:59:59Z',
				description: 'End date for the Activity Log entries (exclusive). Format: YYYY-MM-DD or ISO 8601 (e.g., 2024-12-31T23:59:59Z)',
			},

			// Return All
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getActivityLogs'],
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
						operation: ['getActivityLogs'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				default: 20,
				description: 'Max number of results to return',
			},

			// Offset
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getActivityLogs'],
					},
				},
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Number of results to skip (page index)',
			},

			// Additional Filters
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				displayOptions: {
					show: {
						operation: ['getActivityLogs'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Filter by Action',
						name: 'filterAction',
						type: 'string',
						default: '',
						placeholder: 'sec.user.create',
						description: 'Filter logs by specific action type (e.g., sec.user.create, datacenters.create)',
					},
					{
						displayName: 'Filter by User',
						name: 'filterUser',
						type: 'string',
						default: '',
						placeholder: 'user@example.com',
						description: 'Filter logs by username',
					},
					{
						displayName: 'Filter by Resource Type',
						name: 'filterResourceType',
						type: 'string',
						default: '',
						placeholder: 'datacenter, server, volume',
						description: 'Filter logs by resource type',
					},
					{
						displayName: 'Filter by Event Type',
						name: 'filterEventType',
						type: 'string',
						default: '',
						placeholder: 'RequestAccepted, RequestFailed',
						description: 'Filter logs by event type (RequestAccepted, RequestFailed, etc.)',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				if (operation === 'getInfo') {
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'ionosCloud',
						{
							method: 'GET',
							url: baseUrl,
						},
					);
				} else if (operation === 'getContracts') {
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'ionosCloud',
						{
							method: 'GET',
							url: `${baseUrl}/contracts`,
						},
					);
				} else if (operation === 'getActivityLogs') {
					const contractNumber = this.getNodeParameter('contractNumber', i) as string;
					const dateStart = this.getNodeParameter('dateStart', i, '') as string;
					const dateEnd = this.getNodeParameter('dateEnd', i, '') as string;
					const returnAll = this.getNodeParameter('returnAll', i);
					const limit = this.getNodeParameter('limit', i, 20) as number;
					const offset = this.getNodeParameter('offset', i, 0) as number;
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

					const qs: IDataObject = {
						offset: offset.toString(),
					};

					if (dateStart) {
						qs.dateStart = dateStart;
					}

					if (dateEnd) {
						qs.dateEnd = dateEnd;
					}

					if (!returnAll) {
						qs.limit = limit.toString();
					}

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'ionosCloud',
						{
							method: 'GET',
							url: `${baseUrl}/contracts/${contractNumber}`,
							qs,
						},
					);

					// Extract the hits array from the response
					if (responseData && typeof responseData === 'object' && 'hits' in responseData) {
						const hitsData = responseData.hits as IDataObject;
						if (hitsData && typeof hitsData === 'object' && 'hits' in hitsData) {
							let activities = hitsData.hits as IDataObject[];

							// Apply client-side filters if specified
							if (additionalOptions.filterAction) {
								const filterAction = additionalOptions.filterAction as string;
								activities = activities.filter((activity: IDataObject) => {
									const source = activity._source as IDataObject;
									if (source && source.event) {
										const event = source.event as IDataObject;
										if (event.resources && Array.isArray(event.resources)) {
											return event.resources.some((resource: IDataObject) => {
												const actions = resource.action as string[];
												return actions && actions.includes(filterAction);
											});
										}
									}
									return false;
								});
							}

							if (additionalOptions.filterUser) {
								const filterUser = additionalOptions.filterUser as string;
								activities = activities.filter((activity: IDataObject) => {
									const source = activity._source as IDataObject;
									if (source && source.principal) {
										const principal = source.principal as IDataObject;
										if (principal.identity) {
											const identity = principal.identity as IDataObject;
											return identity.username === filterUser;
										}
									}
									return false;
								});
							}

							if (additionalOptions.filterResourceType) {
								const filterResourceType = additionalOptions.filterResourceType as string;
								activities = activities.filter((activity: IDataObject) => {
									const source = activity._source as IDataObject;
									if (source && source.event) {
										const event = source.event as IDataObject;
										if (event.resources && Array.isArray(event.resources)) {
											return event.resources.some((resource: IDataObject) => {
												return resource.type === filterResourceType;
											});
										}
									}
									return false;
								});
							}

							if (additionalOptions.filterEventType) {
								const filterEventType = additionalOptions.filterEventType as string;
								activities = activities.filter((activity: IDataObject) => {
									const source = activity._source as IDataObject;
									if (source && source.event) {
										const event = source.event as IDataObject;
										return event.type === filterEventType;
									}
									return false;
								});
							}

							// Return the filtered activities with metadata
							responseData = {
								total: hitsData.total,
								offset,
								limit: returnAll ? activities.length : limit,
								activities: activities.map((activity: IDataObject) => activity._source),
							};
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
