import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

const baseUrl = 'https://api.ionos.com/cloudapi/v6';

export class IonosCloudStorage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud Storage',
		name: 'ionosCloudStorage',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Manage IONOS Cloud Storage (S3 Keys, Backup Units). Developped with Love and AI by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud Storage',
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
						name: 'S3 Key',
						value: 's3Key',
						description: 'Manage S3 Object Storage access keys',
					},
					{
						name: 'Backup Unit',
						value: 'backupUnit',
						description: 'Manage backup units for data protection',
					},
				],
				default: 's3Key',
			},

			// S3 Key Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['s3Key'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an S3 key for a user',
						action: 'Create an S3 key',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an S3 key',
						action: 'Get an S3 key',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many S3 keys for a user',
						action: 'Get many S3 keys',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an S3 key',
						action: 'Update an S3 key',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an S3 key',
						action: 'Delete an S3 key',
					},
					{
						name: 'Get SSO URL',
						value: 'getSsoUrl',
						description: 'Get single sign-on URL for S3 access',
						action: 'Get S3 SSO URL',
					},
				],
				default: 'create',
			},

			// Backup Unit Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['backupUnit'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a backup unit',
						action: 'Create a backup unit',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a backup unit',
						action: 'Get a backup unit',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many backup units',
						action: 'Get many backup units',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a backup unit',
						action: 'Update a backup unit',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a backup unit',
						action: 'Delete a backup unit',
					},
					{
						name: 'Get SSO URL',
						value: 'getSsoUrl',
						description: 'Get single sign-on URL for backup unit access',
						action: 'Get backup unit SSO URL',
					},
				],
				default: 'create',
			},

			// ====================
			// S3 Key Fields
			// ====================

			// User ID (for S3 Key)
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['s3Key'],
					},
				},
				default: '',
				description: 'The unique ID of the user',
			},

			// S3 Key ID
			{
				displayName: 'S3 Key ID',
				name: 's3KeyId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['s3Key'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the S3 key',
			},

			// S3 Key Active
			{
				displayName: 'Active',
				name: 'active',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['s3Key'],
						operation: ['update'],
					},
				},
				default: true,
				description: 'Whether the S3 key is active',
			},

			// ====================
			// Backup Unit Fields
			// ====================

			// Backup Unit ID
			{
				displayName: 'Backup Unit ID',
				name: 'backupUnitId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['backupUnit'],
						operation: ['get', 'update', 'delete', 'getSsoUrl'],
					},
				},
				default: '',
				description: 'The unique ID of the backup unit',
			},

			// Backup Unit Name
			{
				displayName: 'Name',
				name: 'backupUnitName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['backupUnit'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the backup unit',
			},

			// Backup Unit Email
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['backupUnit'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The email address for backup notifications',
			},

			// Backup Unit Password
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['backupUnit'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The password for the backup unit (minimum 8 characters)',
			},

			// Backup Unit Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['backupUnit'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'Email (Update)',
						name: 'email',
						type: 'string',
						default: '',
						description: 'The email address for backup notifications',
					},
					{
						displayName: 'Password (Update)',
						name: 'password',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						description: 'New password for the backup unit',
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
				let responseData: IDataObject | IDataObject[] = {};

				// ====================
				// S3 Key Operations
				// ====================
				if (resource === 's3Key') {
					const userId = this.getNodeParameter('userId', i) as string;

					if (operation === 'create') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/um/users/${userId}/s3keys`,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const s3KeyId = this.getNodeParameter('s3KeyId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/um/users/${userId}/s3keys/${s3KeyId}`,
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
								url: `${baseUrl}/um/users/${userId}/s3keys`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const s3KeyId = this.getNodeParameter('s3KeyId', i) as string;
						const active = this.getNodeParameter('active', i) as boolean;

						const body: IDataObject = {
							properties: {
								active,
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/um/users/${userId}/s3keys/${s3KeyId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const s3KeyId = this.getNodeParameter('s3KeyId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/um/users/${userId}/s3keys/${s3KeyId}`,
							},
						);

						responseData = { success: true };
					} else if (operation === 'getSsoUrl') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/um/users/${userId}/s3ssourl`,
							},
						);
					}
				}

				// ====================
				// Backup Unit Operations
				// ====================
				else if (resource === 'backupUnit') {
					if (operation === 'create') {
						const name = this.getNodeParameter('backupUnitName', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const password = this.getNodeParameter('password', i) as string;

						const body: IDataObject = {
							properties: {
								name,
								email,
								password,
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'POST',
								url: `${baseUrl}/backupunits`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'get') {
						const backupUnitId = this.getNodeParameter('backupUnitId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/backupunits/${backupUnitId}`,
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
								url: `${baseUrl}/backupunits`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const backupUnitId = this.getNodeParameter('backupUnitId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {
								...(additionalFields.email && { email: additionalFields.email }),
								...(additionalFields.password && { password: additionalFields.password }),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/backupunits/${backupUnitId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
					} else if (operation === 'delete') {
						const backupUnitId = this.getNodeParameter('backupUnitId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'DELETE',
								url: `${baseUrl}/backupunits/${backupUnitId}`,
							},
						);

						responseData = { success: true };
					} else if (operation === 'getSsoUrl') {
						const backupUnitId = this.getNodeParameter('backupUnitId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/backupunits/${backupUnitId}/ssourl`,
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
