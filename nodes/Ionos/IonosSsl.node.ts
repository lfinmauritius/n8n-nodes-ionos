import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

export class IonosSsl implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS SSL',
		name: 'ionosSsl',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Manage SSL certificates with IONOS. Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS SSL',
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
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an SSL certificate',
						action: 'Delete a certificate',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an SSL certificate',
						action: 'Get a certificate',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all SSL certificates',
						action: 'Get many certificates',
					},
					{
						name: 'Upload',
						value: 'upload',
						description: 'Upload a new SSL certificate',
						action: 'Upload a certificate',
					},
				],
				default: 'getAll',
			},

			// Certificate ID (for Get and Delete operations)
			{
				displayName: 'Certificate ID',
				name: 'certificateId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['get', 'delete'],
					},
				},
				default: '',
				description: 'The ID of the SSL certificate',
			},

			// Upload: Certificate Details
			{
				displayName: 'Certificate Name',
				name: 'certificateName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['upload'],
					},
				},
				default: '',
				placeholder: 'example.com',
				description: 'A friendly name for the certificate',
			},
			{
				displayName: 'Certificate',
				name: 'certificate',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['upload'],
					},
				},
				typeOptions: {
					rows: 10,
				},
				default: '',
				placeholder: '-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----',
				description: 'The SSL certificate in PEM format',
			},
			{
				displayName: 'Private Key',
				name: 'privateKey',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['upload'],
					},
				},
				typeOptions: {
					rows: 10,
					password: true,
				},
				default: '',
				placeholder: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----',
				description: 'The private key in PEM format',
			},
			{
				displayName: 'Certificate Chain',
				name: 'certificateChain',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['upload'],
					},
				},
				typeOptions: {
					rows: 10,
				},
				default: '',
				placeholder: '-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----',
				description: 'The certificate chain (intermediate certificates) in PEM format',
			},

			// Get Many: Pagination options
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
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
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'get') {
					const certificateId = this.getNodeParameter('certificateId', i) as string;

					const options: IHttpRequestOptions = {
						method: 'GET',
						url: `/ssl/v1/certificates/${certificateId}`,
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
						url: '/ssl/v1/certificates',
						qs: {
							limit: returnAll ? 1000 : limit,
						},
					};

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'ionosApi',
						options,
					);

					const certificates = (response as IDataObject).items as IDataObject[];
					if (certificates) {
						certificates.forEach((certificate) => {
							returnData.push({ json: certificate });
						});
					} else {
						returnData.push({ json: response as IDataObject });
					}
				}

				if (operation === 'upload') {
					const certificateName = this.getNodeParameter('certificateName', i) as string;
					const certificate = this.getNodeParameter('certificate', i) as string;
					const privateKey = this.getNodeParameter('privateKey', i) as string;
					const certificateChain = this.getNodeParameter('certificateChain', i, '') as string;

					const body: IDataObject = {
						name: certificateName,
						certificate: certificate.trim(),
						privateKey: privateKey.trim(),
					};

					if (certificateChain) {
						body.certificateChain = certificateChain.trim();
					}

					const options: IHttpRequestOptions = {
						method: 'POST',
						url: '/ssl/v1/certificates',
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
					const certificateId = this.getNodeParameter('certificateId', i) as string;

					const options: IHttpRequestOptions = {
						method: 'DELETE',
						url: `/ssl/v1/certificates/${certificateId}`,
					};

					await this.helpers.httpRequestWithAuthentication.call(this, 'ionosApi', options);
					returnData.push({ json: { success: true, certificateId } });
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
