import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

const baseUrl = 'https://api.ionos.com/certificatemanager';

export class IonosCloudCertificateManager implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud Certificate Manager',
		name: 'ionosCloudCertificateManager',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] }}',
		description: 'Manage SSL/TLS certificates with IONOS Certificate Manager. Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud Certificate Manager',
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
						name: 'Create',
						value: 'create',
						description: 'Upload a new SSL certificate',
						action: 'Create a certificate',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a certificate by ID',
						action: 'Get a certificate',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many certificates',
						action: 'Get many certificates',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a certificate name',
						action: 'Update a certificate',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a certificate',
						action: 'Delete a certificate',
					},
				],
				default: 'create',
			},

			// ====================
			// Certificate Fields
			// ====================

			// Certificate ID
			{
				displayName: 'Certificate ID',
				name: 'certificateId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the certificate',
			},

			// Certificate Name
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'My SSL Certificate',
				description: 'The friendly name for the certificate',
			},

			// Certificate Body
			{
				displayName: 'Certificate',
				name: 'certificate',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '-----BEGIN CERTIFICATE-----\nMIIE5TCCAs2gAwIBAgIBATANBgkqhkiG...\n-----END CERTIFICATE-----',
				description: 'The certificate body in PEM format',
			},

			// Certificate Chain
			{
				displayName: 'Certificate Chain',
				name: 'certificateChain',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '-----BEGIN CERTIFICATE-----\nMIIDoTCCAokCFDrAUWffdxWJVz2Axl9l...\n-----END CERTIFICATE-----',
				description: 'The certificate chain (intermediate certificates) in PEM format',
			},

			// Private Key
			{
				displayName: 'Private Key (PEM Format)',
				name: 'privateKey',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '-----BEGIN RSA PRIVATE KEY-----\nMIIJKQIBAAKCAgEAzDehfqWBr+9q0px...\n-----END RSA PRIVATE KEY-----',
				description: 'The RSA private key in PEM format (kept secure and never returned in responses)',
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

		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				if (operation === 'create') {
					const name = this.getNodeParameter('name', i) as string;
					const certificate = this.getNodeParameter('certificate', i) as string;
					const certificateChain = this.getNodeParameter('certificateChain', i) as string;
					const privateKey = this.getNodeParameter('privateKey', i) as string;

					const body: IDataObject = {
						properties: {
							name,
							certificate: certificate.trim(),
							certificateChain: certificateChain.trim(),
							privateKey: privateKey.trim(),
						},
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'ionosCloud',
						{
							method: 'POST',
							url: `${baseUrl}/certificates`,
							body,
							headers: { 'Content-Type': 'application/json' },
						},
					);
				} else if (operation === 'get') {
					const certificateId = this.getNodeParameter('certificateId', i) as string;

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'ionosCloud',
						{
							method: 'GET',
							url: `${baseUrl}/certificates/${certificateId}`,
						},
					);
				} else if (operation === 'getMany') {
					const returnAll = this.getNodeParameter('returnAll', i);
					const limit = this.getNodeParameter('limit', i, 50) as number;
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
							url: `${baseUrl}/certificates`,
							qs,
						},
					);

					responseData = (responseData as IDataObject).items as IDataObject[];
				} else if (operation === 'update') {
					const certificateId = this.getNodeParameter('certificateId', i) as string;
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
							method: 'PATCH',
							url: `${baseUrl}/certificates/${certificateId}`,
							body,
							headers: { 'Content-Type': 'application/json' },
						},
					);
				} else if (operation === 'delete') {
					const certificateId = this.getNodeParameter('certificateId', i) as string;

					await this.helpers.httpRequestWithAuthentication.call(
						this,
						'ionosCloud',
						{
							method: 'DELETE',
							url: `${baseUrl}/certificates/${certificateId}`,
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
