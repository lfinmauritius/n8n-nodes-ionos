import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

const baseUrl = 'https://api.ionos.com/containerregistries';

export class IonosCloudContainerRegistry implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud Container Registry',
		name: 'ionosCloudContainerRegistry',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Manage IONOS Cloud Container Registry for Docker and OCI artifacts. Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud Container Registry',
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
						name: 'Registry',
						value: 'registry',
						description: 'Manage container registries',
					},
					{
						name: 'Token',
						value: 'token',
						description: 'Manage registry access tokens',
					},
					{
						name: 'Repository',
						value: 'repository',
						description: 'View registry repositories',
					},
					{
						name: 'Artifact',
						value: 'artifact',
						description: 'View repository artifacts',
					},
					{
						name: 'Location',
						value: 'location',
						description: 'Get available registry locations',
					},
					{
						name: 'Name',
						value: 'name',
						description: 'Check registry name availability',
					},
				],
				default: 'registry',
			},

			// Registry Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['registry'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a container registry',
						action: 'Create a registry',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a registry',
						action: 'Get a registry',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many registries',
						action: 'Get many registries',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a registry',
						action: 'Update a registry',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a registry',
						action: 'Delete a registry',
					},
				],
				default: 'create',
			},

			// Token Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['token'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a token',
						action: 'Create a token',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a token',
						action: 'Get a token',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many tokens',
						action: 'Get many tokens',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a token',
						action: 'Update a token',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a token',
						action: 'Delete a token',
					},
				],
				default: 'create',
			},

			// Repository Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['repository'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a repository',
						action: 'Get a repository',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many repositories',
						action: 'Get many repositories',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a repository',
						action: 'Delete a repository',
					},
				],
				default: 'getMany',
			},

			// Artifact Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['artifact'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an artifact',
						action: 'Get an artifact',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many artifacts',
						action: 'Get many artifacts',
					},
					{
						name: 'Get Vulnerabilities',
						value: 'getVulnerabilities',
						description: 'Get artifact vulnerabilities',
						action: 'Get artifact vulnerabilities',
					},
				],
				default: 'getMany',
			},

			// Location Operations
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
						name: 'Get Many',
						value: 'getMany',
						description: 'Get available locations',
						action: 'Get available locations',
					},
				],
				default: 'getMany',
			},

			// Name Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['name'],
					},
				},
				options: [
					{
						name: 'Check Availability',
						value: 'checkAvailability',
						description: 'Check if registry name is available',
						action: 'Check name availability',
					},
				],
				default: 'checkAvailability',
			},

			// ====================
			// Registry Fields
			// ====================

			// Registry ID
			{
				displayName: 'Registry ID',
				name: 'registryId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['registry', 'token', 'repository', 'artifact'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the registry',
			},

			// Registry ID for Token/Repository/Artifact operations
			{
				displayName: 'Registry ID',
				name: 'registryId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['token', 'repository', 'artifact'],
						operation: ['create', 'getMany', 'getVulnerabilities'],
					},
				},
				default: '',
				description: 'The unique ID of the registry',
			},

			// Registry Name
			{
				displayName: 'Name',
				name: 'registryName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['registry'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the registry (3-63 chars, lowercase, alphanumeric and hyphens)',
				placeholder: 'my-registry',
			},

			// Registry Location
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['registry'],
						operation: ['create'],
					},
				},
				default: 'de/fra',
				description: 'The location ID where the registry will be created',
			},

			// Garbage Collection Schedule
			{
				displayName: 'Garbage Collection Schedule',
				name: 'garbageCollectionSchedule',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['registry'],
						operation: ['create'],
					},
				},
				default: '{"time":"04:00:00Z","days":["Sunday"]}',
				description: 'Schedule for automatic garbage collection',
			},

			// Registry Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['registry'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'API Subnet Allow List',
						name: 'apiSubnetAllowList',
						type: 'string',
						default: '',
						description: 'Comma-separated list of CIDRs allowed to access the registry API',
					},
					{
						displayName: 'Vulnerability Scanning Enabled',
						name: 'vulnerabilityScanningEnabled',
						type: 'boolean',
						default: true,
						description: 'Whether vulnerability scanning is enabled',
					},
				],
			},

			// ====================
			// Token Fields
			// ====================

			// Token ID
			{
				displayName: 'Token ID',
				name: 'tokenId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['token'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the token',
			},

			// Token Name
			{
				displayName: 'Name',
				name: 'tokenName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['token'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the token',
			},

			// Token Scopes
			{
				displayName: 'Scopes',
				name: 'scopes',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['token'],
						operation: ['create'],
					},
				},
				default: '[{"actions":["pull"],"name":"*","type":"repository"}]',
				description: 'Array of scope objects defining token permissions',
			},

			// Token Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['token'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'Expiry Date',
						name: 'expiryDate',
						type: 'string',
						default: '',
						description: 'Token expiry date in ISO format (e.g., 2025-12-31T23:59:59Z)',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Enabled',
								value: 'enabled',
							},
							{
								name: 'Disabled',
								value: 'disabled',
							},
						],
						default: 'enabled',
						description: 'Token status',
					},
				],
			},

			// ====================
			// Repository Fields
			// ====================

			// Repository Name
			{
				displayName: 'Repository Name',
				name: 'repositoryName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['repository', 'artifact'],
						operation: ['get', 'delete', 'getVulnerabilities'],
					},
				},
				default: '',
				description: 'The name of the repository',
			},

			// ====================
			// Artifact Fields
			// ====================

			// Artifact Digest
			{
				displayName: 'Artifact Digest',
				name: 'digest',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['artifact'],
						operation: ['get', 'getVulnerabilities'],
					},
				},
				default: '',
				description: 'The digest of the artifact (SHA256 hash)',
				placeholder: 'sha256:abc123...',
			},

			// ====================
			// Name Check Fields
			// ====================

			// Name to Check
			{
				displayName: 'Name',
				name: 'nameToCheck',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['name'],
						operation: ['checkAvailability'],
					},
				},
				default: '',
				description: 'The registry name to check for availability',
				placeholder: 'my-registry',
			},

			// ====================
			// Common Fields
			// ====================

			// Filter Name
			{
				displayName: 'Filter by Name',
				name: 'filterName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['registry'],
						operation: ['getMany'],
					},
				},
				default: '',
				description: 'Filter registries by name',
			},

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
				// Registry Operations
				// ====================
				if (resource === 'registry') {
					if (operation === 'create') {
						const name = this.getNodeParameter('registryName', i) as string;
						const location = this.getNodeParameter('location', i) as string;
						const garbageCollectionScheduleString = this.getNodeParameter('garbageCollectionSchedule', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const garbageCollectionSchedule = JSON.parse(garbageCollectionScheduleString);

						const body: IDataObject = {
							properties: {
								name,
								location,
								garbageCollectionSchedule,
								features: {
									vulnerabilityScanning: {
										enabled: additionalFields.vulnerabilityScanningEnabled !== false,
									},
								},
								...(additionalFields.apiSubnetAllowList && {
									apiSubnetAllowList: (additionalFields.apiSubnetAllowList as string)
										.split(',')
										.map((cidr) => cidr.trim()),
								}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/registries`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const registryId = this.getNodeParameter('registryId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/registries/${registryId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 100) as number;
						const filterName = this.getNodeParameter('filterName', i, '') as string;

						const qs: IDataObject = {};

						if (filterName) {
							qs['filter.name'] = filterName;
						}

						if (!returnAll) {
							qs.limit = limit.toString();
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/registries`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const registryId = this.getNodeParameter('registryId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {},
						};

						if (additionalFields.apiSubnetAllowList) {
							(body.properties as IDataObject).apiSubnetAllowList = (additionalFields.apiSubnetAllowList as string)
								.split(',')
								.map((cidr) => cidr.trim());
						}

						if (additionalFields.vulnerabilityScanningEnabled !== undefined) {
							(body.properties as IDataObject).features = {
								vulnerabilityScanning: {
									enabled: additionalFields.vulnerabilityScanningEnabled,
								},
							};
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PATCH',
								url: `${baseUrl}/registries/${registryId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const registryId = this.getNodeParameter('registryId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/registries/${registryId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Token Operations
				// ====================
				else if (resource === 'token') {
					const registryId = this.getNodeParameter('registryId', i) as string;

					if (operation === 'create') {
						const name = this.getNodeParameter('tokenName', i) as string;
						const scopesString = this.getNodeParameter('scopes', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const scopes = JSON.parse(scopesString);

						const body: IDataObject = {
							properties: {
								name,
								scopes,
								...(additionalFields.expiryDate && { expiryDate: additionalFields.expiryDate }),
								...(additionalFields.status && { status: additionalFields.status }),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/registries/${registryId}/tokens`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const tokenId = this.getNodeParameter('tokenId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/registries/${registryId}/tokens/${tokenId}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const qs: IDataObject = {};

						if (!returnAll) {
							qs.limit = limit.toString();
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/registries/${registryId}/tokens`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const tokenId = this.getNodeParameter('tokenId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								...(additionalFields.expiryDate && { expiryDate: additionalFields.expiryDate }),
								...(additionalFields.status && { status: additionalFields.status }),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PATCH',
								url: `${baseUrl}/registries/${registryId}/tokens/${tokenId}`,
								body,
								headers: { 'Content-Type': 'application/vnd.profitbricks.partial-properties+json' },
							},
						);
					} else if (operation === 'delete') {
						const tokenId = this.getNodeParameter('tokenId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/registries/${registryId}/tokens/${tokenId}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Repository Operations
				// ====================
				else if (resource === 'repository') {
					const registryId = this.getNodeParameter('registryId', i) as string;

					if (operation === 'get') {
						const repositoryName = this.getNodeParameter('repositoryName', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/registries/${registryId}/repositories/${repositoryName}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const qs: IDataObject = {};

						if (!returnAll) {
							qs.limit = limit.toString();
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/registries/${registryId}/repositories`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'delete') {
						const repositoryName = this.getNodeParameter('repositoryName', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/registries/${registryId}/repositories/${repositoryName}`,
							},
						);

						responseData = { success: true };
					}
				}

				// ====================
				// Artifact Operations
				// ====================
				else if (resource === 'artifact') {
					const registryId = this.getNodeParameter('registryId', i) as string;
					const repositoryName = this.getNodeParameter('repositoryName', i) as string;

					if (operation === 'get') {
						const digest = this.getNodeParameter('digest', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/registries/${registryId}/repositories/${repositoryName}/artifacts/${digest}`,
							},
						);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const qs: IDataObject = {};

						if (!returnAll) {
							qs.limit = limit.toString();
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/registries/${registryId}/repositories/${repositoryName}/artifacts`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'getVulnerabilities') {
						const digest = this.getNodeParameter('digest', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/registries/${registryId}/repositories/${repositoryName}/artifacts/${digest}/vulnerabilities`,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					}
				}

				// ====================
				// Location Operations
				// ====================
				else if (resource === 'location') {
					if (operation === 'getMany') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/locations`,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					}
				}

				// ====================
				// Name Check Operations
				// ====================
				else if (resource === 'name') {
					if (operation === 'checkAvailability') {
						const nameToCheck = this.getNodeParameter('nameToCheck', i) as string;

						try {
							await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'HEAD',
									url: `${baseUrl}/names/${nameToCheck}`,
								},
							);

							// If HEAD succeeds, name is NOT available
							responseData = { name: nameToCheck, available: false };
						} catch (error) {
							// If HEAD returns 404, name IS available
							if ((error as any).statusCode === 404) {
								responseData = { name: nameToCheck, available: true };
							} else {
								throw error;
							}
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
