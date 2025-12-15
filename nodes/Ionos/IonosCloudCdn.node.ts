import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

const baseUrl = 'https://cdn.de-fra.ionos.com';

export class IonosCloudCdn implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud CDN',
		name: 'ionosCloudCdn',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Manage IONOS Cloud CDN distributions and edge server IPs. Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud CDN',
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
						name: 'Distribution',
						value: 'distribution',
						description: 'Manage CDN distributions',
					},
					{
						name: 'Edge Server IP',
						value: 'edgeServerIp',
						description: 'Get CDN edge server IP information',
					},
				],
				default: 'distribution',
			},

			// Distribution Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['distribution'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a CDN distribution',
						action: 'Create a CDN distribution',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a CDN distribution',
						action: 'Get a CDN distribution',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many CDN distributions',
						action: 'Get many CDN distributions',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a CDN distribution',
						action: 'Update a CDN distribution',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a CDN distribution',
						action: 'Delete a CDN distribution',
					},
				],
				default: 'create',
			},

			// Edge Server IP Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['edgeServerIp'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get edge server IP information',
						action: 'Get edge server IP information',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many edge server IPs',
						action: 'Get many edge server IPs',
					},
				],
				default: 'getMany',
			},

			// ====================
			// Distribution Fields
			// ====================

			// Distribution ID
			{
				displayName: 'Distribution ID',
				name: 'distributionId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['distribution'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID (UUID) of the distribution',
			},

			// Domain
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['distribution'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'example.com',
				description: 'The domain for the CDN distribution',
			},

			// Certificate ID
			{
				displayName: 'Certificate ID',
				name: 'certificateId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['distribution'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'The ID of the SSL certificate to use (optional)',
			},

			// Routing Rules
			{
				displayName: 'Routing Rules',
				name: 'routingRules',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['distribution'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				placeholder: 'Add Routing Rule',
				description: 'Routing rules for the distribution (minimum 1, maximum 25)',
				options: [
					{
						displayName: 'Rule',
						name: 'ruleValues',
						values: [
							{
								displayName: 'Scheme',
								name: 'scheme',
								type: 'options',
								options: [
									{
										name: 'HTTP',
										value: 'http',
									},
									{
										name: 'HTTPS',
										value: 'https',
									},
									{
										name: 'HTTP/HTTPS',
										value: 'http/https',
									},
								],
								default: 'http/https',
								description: 'The protocol scheme for this routing rule',
							},
							{
								displayName: 'Prefix',
								name: 'prefix',
								type: 'string',
								default: '/',
								placeholder: '/api',
								description: 'The URL path prefix to match (e.g., /, /api, /static)',
							},
							{
								displayName: 'Upstream Host',
								name: 'upstreamHost',
								type: 'string',
								default: '',
								placeholder: 'origin.example.com',
								description: 'The upstream/origin server hostname',
							},
							{
								displayName: 'Upstream Geo Restrictions',
								name: 'upstreamGeoRestrictions',
								type: 'fixedCollection',
								typeOptions: {
									multipleValues: false,
								},
								default: {},
								placeholder: 'Add Geo Restrictions',
								options: [
									{
										displayName: 'Restrictions',
										name: 'restrictionValues',
										values: [
											{
												displayName: 'Allow List',
												name: 'allowList',
												type: 'string',
												default: '',
												placeholder: 'US,GB,DE',
												description: 'Comma-separated list of allowed country codes (ISO 3166-1 alpha-2)',
											},
											{
												displayName: 'Block List',
												name: 'blockList',
												type: 'string',
												default: '',
												placeholder: 'CN,RU',
												description: 'Comma-separated list of blocked country codes (ISO 3166-1 alpha-2)',
											},
										],
									},
								],
							},
						],
					},
				],
			},

			// ====================
			// Edge Server IP Fields
			// ====================

			// IP ID
			{
				displayName: 'IP ID',
				name: 'ipId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['edgeServerIp'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The unique ID (UUID) of the edge server IP',
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

			// Filters for Distribution Get Many
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['distribution'],
						operation: ['getMany'],
					},
				},
				options: [
					{
						displayName: 'Domain',
						name: 'domain',
						type: 'string',
						default: '',
						description: 'Filter by domain',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'options',
						options: [
							{
								name: 'Available',
								value: 'AVAILABLE',
							},
							{
								name: 'Busy',
								value: 'BUSY',
							},
							{
								name: 'Updating',
								value: 'UPDATING',
							},
							{
								name: 'Failed',
								value: 'FAILED',
							},
							{
								name: 'Destroying',
								value: 'DESTROYING',
							},
						],
						default: 'AVAILABLE',
						description: 'Filter by state',
					},
				],
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
				// Distribution Operations
				// ====================
				if (resource === 'distribution') {
					if (operation === 'create') {
						const domain = this.getNodeParameter('domain', i) as string;
						const certificateId = this.getNodeParameter('certificateId', i) as string;
						const routingRules = this.getNodeParameter('routingRules', i) as IDataObject;

						const rules: IDataObject[] = [];
						if (routingRules.ruleValues && Array.isArray(routingRules.ruleValues)) {
							for (const rule of routingRules.ruleValues as IDataObject[]) {
								const routingRule: IDataObject = {
									scheme: rule.scheme,
									prefix: rule.prefix,
									upstream: {
										host: rule.upstreamHost,
									},
								};

								// Add geo restrictions if provided (allowList OR blockList, not both - API uses oneOf)
								if (rule.upstreamGeoRestrictions) {
									const geoRestrictions = rule.upstreamGeoRestrictions as IDataObject;
									if (geoRestrictions.restrictionValues) {
										const restrictions = geoRestrictions.restrictionValues as IDataObject;

										// Parse and filter allowList
										const allowListRaw = restrictions.allowList as string | undefined;
										const allowListValues = allowListRaw && allowListRaw.trim()
											? allowListRaw.split(',').map((c) => c.trim()).filter((c) => c.length > 0)
											: [];

										// Parse and filter blockList
										const blockListRaw = restrictions.blockList as string | undefined;
										const blockListValues = blockListRaw && blockListRaw.trim()
											? blockListRaw.split(',').map((c) => c.trim()).filter((c) => c.length > 0)
											: [];

										// API requires oneOf: either allowList OR blockList, not both
										// Priority: allowList takes precedence if both are provided
										if (allowListValues.length > 0) {
											(routingRule.upstream as IDataObject).geoRestrictions = {
												allowList: allowListValues,
											};
										} else if (blockListValues.length > 0) {
											(routingRule.upstream as IDataObject).geoRestrictions = {
												blockList: blockListValues,
											};
										}
										// If both are empty, don't add geoRestrictions at all
									}
								}

								rules.push(routingRule);
							}
						}

						const body: IDataObject = {
							properties: {
								domain,
								routingRules: rules,
							},
						};

						if (certificateId) {
							(body.properties as IDataObject).certificateId = certificateId;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/distributions`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const distributionId = this.getNodeParameter('distributionId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/distributions/${distributionId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;

						const qs: IDataObject = {};
						if (!returnAll) {
							qs.limit = limit;
						}

						if (filters.domain) {
							qs.domain = filters.domain;
						}
						if (filters.state) {
							qs.state = filters.state;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/distributions`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const distributionId = this.getNodeParameter('distributionId', i) as string;
						const domain = this.getNodeParameter('domain', i) as string;
						const certificateId = this.getNodeParameter('certificateId', i) as string;
						const routingRules = this.getNodeParameter('routingRules', i) as IDataObject;

						const rules: IDataObject[] = [];
						if (routingRules.ruleValues && Array.isArray(routingRules.ruleValues)) {
							for (const rule of routingRules.ruleValues as IDataObject[]) {
								const routingRule: IDataObject = {
									scheme: rule.scheme,
									prefix: rule.prefix,
									upstream: {
										host: rule.upstreamHost,
									},
								};

								// Add geo restrictions if provided (allowList OR blockList, not both - API uses oneOf)
								if (rule.upstreamGeoRestrictions) {
									const geoRestrictions = rule.upstreamGeoRestrictions as IDataObject;
									if (geoRestrictions.restrictionValues) {
										const restrictions = geoRestrictions.restrictionValues as IDataObject;

										// Parse and filter allowList
										const allowListRaw = restrictions.allowList as string | undefined;
										const allowListValues = allowListRaw && allowListRaw.trim()
											? allowListRaw.split(',').map((c) => c.trim()).filter((c) => c.length > 0)
											: [];

										// Parse and filter blockList
										const blockListRaw = restrictions.blockList as string | undefined;
										const blockListValues = blockListRaw && blockListRaw.trim()
											? blockListRaw.split(',').map((c) => c.trim()).filter((c) => c.length > 0)
											: [];

										// API requires oneOf: either allowList OR blockList, not both
										// Priority: allowList takes precedence if both are provided
										if (allowListValues.length > 0) {
											(routingRule.upstream as IDataObject).geoRestrictions = {
												allowList: allowListValues,
											};
										} else if (blockListValues.length > 0) {
											(routingRule.upstream as IDataObject).geoRestrictions = {
												blockList: blockListValues,
											};
										}
										// If both are empty, don't add geoRestrictions at all
									}
								}

								rules.push(routingRule);
							}
						}

						const body: IDataObject = {
							properties: {
								domain,
								routingRules: rules,
							},
						};

						if (certificateId) {
							(body.properties as IDataObject).certificateId = certificateId;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/distributions/${distributionId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const distributionId = this.getNodeParameter('distributionId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/distributions/${distributionId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Edge Server IP Operations
				// ====================
				else if (resource === 'edgeServerIp') {
					if (operation === 'get') {
						const ipId = this.getNodeParameter('ipId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/ips/${ipId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const qs: IDataObject = {};
						if (!returnAll) {
							qs.limit = limit;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/ips`,
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
