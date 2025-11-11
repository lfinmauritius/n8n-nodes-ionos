import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

const baseUrl = 'https://iam.ionos.com';

export class IonosCloudIdentity implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud Identity',
		name: 'ionosCloudIdentity',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Manage IAM password policies for security and compliance with IONOS Cloud Identity. Developped with Love and AI by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud Identity',
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
			// Operation
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new password policy',
						action: 'Create a password policy',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a password policy',
						action: 'Get a password policy',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many password policies',
						action: 'Get many password policies',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a password policy',
						action: 'Update a password policy',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a password policy',
						action: 'Delete a password policy',
					},
				],
				default: 'getMany',
			},

			// ====================
			// Password Policy Fields
			// ====================

			// Policy ID
			{
				displayName: 'Password Policy ID',
				name: 'policyId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID (UUID) of the Password Policy',
			},

			// Description
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'Password policy for production environment',
				description: 'Human-readable description of the policy (max 1024 characters)',
			},

			// Minimum Length
			{
				displayName: 'Minimum Length',
				name: 'minLength',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				typeOptions: {
					minValue: 5,
				},
				default: 8,
				description: 'Minimum number of characters required for passwords',
			},

			// Minimum Number Characters
			{
				displayName: 'Minimum Number Characters',
				name: 'minNumberChars',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Minimum number of digit characters [0-9] required',
			},

			// Minimum Uppercase Characters
			{
				displayName: 'Minimum Uppercase Characters',
				name: 'minUpperChars',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Minimum number of uppercase letters [A-Z] required',
			},

			// Minimum Lowercase Characters
			{
				displayName: 'Minimum Lowercase Characters',
				name: 'minLowerChars',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Minimum number of lowercase letters [a-z] required',
			},

			// Minimum Special Characters
			{
				displayName: 'Minimum Special Characters',
				name: 'minSpecialChars',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Minimum number of special characters (non-alphanumeric) required',
			},

			// Effective Policy
			{
				displayName: 'Get Effective Policy',
				name: 'effectivePolicy',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getMany'],
					},
				},
				default: false,
				description: 'Whether to return the policy in effect for the actor\'s contract. If no custom policy exists, returns IONOS default policy.',
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

				if (operation === 'create') {
					const description = this.getNodeParameter('description', i) as string;
					const minLength = this.getNodeParameter('minLength', i) as number;
					const minNumberChars = this.getNodeParameter('minNumberChars', i, 0) as number;
					const minUpperChars = this.getNodeParameter('minUpperChars', i, 0) as number;
					const minLowerChars = this.getNodeParameter('minLowerChars', i, 0) as number;
					const minSpecialChars = this.getNodeParameter('minSpecialChars', i, 0) as number;

					const body: IDataObject = {
						properties: {
							description,
							minLength,
							minNumberChars,
							minUpperChars,
							minLowerChars,
							minSpecialChars,
						},
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'ionosCloud',
						{
							method: 'POST',
							url: `${baseUrl}/passwordpolicies`,
							body,
							headers: { 'Content-Type': 'application/json' },
						},
					);
				} else if (operation === 'get') {
					const policyId = this.getNodeParameter('policyId', i) as string;

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'ionosCloud',
						{
							method: 'GET',
							url: `${baseUrl}/passwordpolicies/${policyId}`,
						},
					);
				} else if (operation === 'getMany') {
					const effectivePolicy = this.getNodeParameter('effectivePolicy', i, false) as boolean;

					const qs: IDataObject = {};
					if (effectivePolicy) {
						qs.effectivePolicy = 'true';
					}

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'ionosCloud',
						{
							method: 'GET',
							url: `${baseUrl}/passwordpolicies`,
							qs,
						},
					);

					responseData = (responseData as IDataObject).items as IDataObject[];
				} else if (operation === 'update') {
					const policyId = this.getNodeParameter('policyId', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const minLength = this.getNodeParameter('minLength', i) as number;
					const minNumberChars = this.getNodeParameter('minNumberChars', i, 0) as number;
					const minUpperChars = this.getNodeParameter('minUpperChars', i, 0) as number;
					const minLowerChars = this.getNodeParameter('minLowerChars', i, 0) as number;
					const minSpecialChars = this.getNodeParameter('minSpecialChars', i, 0) as number;

					const body: IDataObject = {
						id: policyId,
						properties: {
							description,
							minLength,
							minNumberChars,
							minUpperChars,
							minLowerChars,
							minSpecialChars,
						},
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'ionosCloud',
						{
							method: 'PUT',
							url: `${baseUrl}/passwordpolicies/${policyId}`,
							body,
							headers: { 'Content-Type': 'application/json' },
						},
					);
				} else if (operation === 'delete') {
					const policyId = this.getNodeParameter('policyId', i) as string;

					await this.helpers.httpRequestWithAuthentication.call(
						this,
						'ionosCloud',
						{
							method: 'DELETE',
							url: `${baseUrl}/passwordpolicies/${policyId}`,
						},
					);

					responseData = { success: true };
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
