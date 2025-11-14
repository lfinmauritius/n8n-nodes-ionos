import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

const baseUrl = 'https://api.ionos.com/billing';

export class IonosCloudBilling implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud Billing',
		name: 'ionosCloudBilling',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"]}} - {{$parameter["operation"]}}',
		description: 'Retrieve billing information, invoices, usage data, and resource utilization from IONOS Cloud. Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud Billing',
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
						name: 'EVN (Usage Data)',
						value: 'evn',
						description: 'Provisioning itemized data (Einzelverbrauchsnachweis)',
					},
					{
						name: 'Invoice',
						value: 'invoice',
						description: 'Invoice information',
					},
					{
						name: 'Product',
						value: 'product',
						description: 'Available products',
					},
					{
						name: 'Profile',
						value: 'profile',
						description: 'Billing profile information',
					},
					{
						name: 'Traffic',
						value: 'traffic',
						description: 'Traffic utilization data',
					},
					{
						name: 'Usage',
						value: 'usage',
						description: 'Resource usage information',
					},
					{
						name: 'Utilization',
						value: 'utilization',
						description: 'Resource utilization details',
					},
				],
				default: 'invoice',
			},

			// EVN Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['evn'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get EVN information',
						action: 'Get EVN information',
					},
					{
						name: 'Get by Period',
						value: 'getByPeriod',
						description: 'Get EVN for a specific period',
						action: 'Get EVN by period',
					},
				],
				default: 'get',
			},

			// Invoice Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get invoice information',
						action: 'Get invoice information',
					},
					{
						name: 'Get by ID',
						value: 'getById',
						description: 'Get invoice by ID',
						action: 'Get invoice by ID',
					},
					{
						name: 'Get by Period',
						value: 'getByPeriod',
						description: 'Get invoices for a specific period',
						action: 'Get invoice by period',
					},
				],
				default: 'get',
			},

			// Product Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['product'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get available products',
						action: 'Get available products',
					},
				],
				default: 'get',
			},

			// Traffic Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['traffic'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get traffic information',
						action: 'Get traffic information',
					},
					{
						name: 'Get by Period',
						value: 'getByPeriod',
						description: 'Get traffic for a specific period',
						action: 'Get traffic by period',
					},
				],
				default: 'get',
			},

			// Usage Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['usage'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get usage information',
						action: 'Get usage information',
					},
					{
						name: 'Get by Datacenter',
						value: 'getByDatacenter',
						description: 'Get usage by datacenter',
						action: 'Get usage by datacenter',
					},
				],
				default: 'get',
			},

			// Utilization Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['utilization'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get utilization information',
						action: 'Get utilization information',
					},
					{
						name: 'Get by Period',
						value: 'getByPeriod',
						description: 'Get utilization for a specific period',
						action: 'Get utilization by period',
					},
					{
						name: 'Get by ID',
						value: 'getById',
						description: 'Get daily utilization by ID',
						action: 'Get utilization by ID',
					},
				],
				default: 'get',
			},

			// Profile operation (single operation)
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['profile'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get billing profile',
						action: 'Get billing profile',
					},
				],
				default: 'get',
			},

			// ====================
			// Contract Number (used by most resources)
			// ====================

			// Contract Number for EVN, Product, Traffic, Usage, Utilization (all operations)
			{
				displayName: 'Contract Number',
				name: 'contractNumber',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['evn', 'product', 'traffic', 'usage', 'utilization'],
					},
				},
				default: '',
				placeholder: '12345678',
				description: 'Contract number',
			},

			// Contract Number for Invoice (Get and Get by ID only)
			{
				displayName: 'Contract Number',
				name: 'contractNumber',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['get', 'getById'],
					},
				},
				default: '',
				placeholder: '12345678',
				description: 'Contract number',
			},

			// Contract Number for Invoice Get by Period
			{
				displayName: 'Contract Number',
				name: 'contractNumber',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['getByPeriod'],
					},
				},
				default: '',
				placeholder: '12345678',
				description: 'Contract number',
			},


			// ====================
			// Period Parameter
			// ====================

			{
				displayName: 'Period',
				name: 'period',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getByPeriod'],
					},
				},
				default: '',
				placeholder: '2024-01',
				description: 'Period in YYYY-MM format',
			},

			// ====================
			// Invoice ID
			// ====================

			{
				displayName: 'Invoice ID',
				name: 'invoiceId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['getById'],
					},
				},
				default: '',
				placeholder: 'GY00101408',
				description: 'Invoice ID',
			},

			// ====================
			// Datacenter ID (for usage)
			// ====================

			{
				displayName: 'Datacenter ID',
				name: 'datacenterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['usage'],
						operation: ['getByDatacenter'],
					},
				},
				default: '',
				placeholder: 'dc-uuid',
				description: 'Datacenter UUID',
			},

			// ====================
			// Utilization ID (for daily utilization)
			// ====================

			{
				displayName: 'Utilization ID',
				name: 'utilizationId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['utilization'],
						operation: ['getById'],
					},
				},
				default: '',
				placeholder: 'utilization-uuid',
				description: 'Utilization UUID',
			},

			// ====================
			// Additional Options
			// ====================

			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Date',
						name: 'date',
						type: 'string',
						default: '',
						placeholder: '2024-01-01',
						description: 'Date for filtering (YYYY-MM-DD format)',
						displayOptions: {
							show: {
								'/resource': ['product'],
							},
						},
					},
					{
						displayName: 'Date Format',
						name: 'dateFormat',
						type: 'options',
						options: [
							{
								name: 'Short (YYYY-MM)',
								value: 'short',
							},
							{
								name: 'Long (YYYY-MM-DD)',
								value: 'long',
							},
						],
						default: 'short',
						description: 'Date format for invoice dates',
						displayOptions: {
							show: {
								'/resource': ['invoice'],
							},
						},
					},
					{
						displayName: 'IP Address',
						name: 'ip',
						type: 'string',
						default: '',
						placeholder: '192.168.1.1',
						description: 'Filter traffic by IP address',
						displayOptions: {
							show: {
								'/resource': ['traffic'],
							},
						},
					},
					{
						displayName: 'Output Format',
						name: 'output',
						type: 'options',
						options: [
							{
								name: 'JSON',
								value: 'json',
							},
							{
								name: 'CSV',
								value: 'csv',
							},
						],
						default: 'json',
						description: 'Output format for traffic data',
						displayOptions: {
							show: {
								'/resource': ['traffic'],
							},
						},
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
				// EVN (Usage Data)
				// ====================

				if (resource === 'evn') {
					const contractNumber = this.getNodeParameter('contractNumber', i) as string;

					if (operation === 'get') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/${contractNumber}/evn`,
							},
						);
					} else if (operation === 'getByPeriod') {
						const period = this.getNodeParameter('period', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/${contractNumber}/evn/${period}`,
							},
						);
					}
				}

				// ====================
				// Invoice
				// ====================

				else if (resource === 'invoice') {
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

					if (operation === 'get') {
						const contractNumber = this.getNodeParameter('contractNumber', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/${contractNumber}/invoices`,
							},
						);
					} else if (operation === 'getById') {
						const contractNumber = this.getNodeParameter('contractNumber', i) as string;
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;

						const qs: IDataObject = {};
						if (additionalOptions.dateFormat) {
							qs.dateFormat = additionalOptions.dateFormat;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/${contractNumber}/invoices/${invoiceId}`,
								qs,
							},
						);
					} else if (operation === 'getByPeriod') {
						const period = this.getNodeParameter('period', i) as string;
						const contractNumber = this.getNodeParameter('contractNumber', i, '') as string;

						const qs: IDataObject = {};
						if (contractNumber) {
							qs.contractId = contractNumber;
						}
						if (additionalOptions.dateFormat) {
							qs.dateFormat = additionalOptions.dateFormat;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/invoices/${period}`,
								qs,
							},
						);
					}
				}

				// ====================
				// Product
				// ====================

				else if (resource === 'product') {
					if (operation === 'get') {
						const contractNumber = this.getNodeParameter('contractNumber', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

						const qs: IDataObject = {};
						if (additionalOptions.date) {
							qs.date = additionalOptions.date;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/${contractNumber}/products`,
								qs,
							},
						);
					}
				}

				// ====================
				// Profile
				// ====================

				else if (resource === 'profile') {
					if (operation === 'get') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/profile`,
							},
						);
					}
				}

				// ====================
				// Traffic
				// ====================

				else if (resource === 'traffic') {
					const contractNumber = this.getNodeParameter('contractNumber', i) as string;
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

					const qs: IDataObject = {};
					if (additionalOptions.ip) {
						qs.ip = additionalOptions.ip;
					}
					if (additionalOptions.output) {
						qs.output = additionalOptions.output;
					}

					if (operation === 'get') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/${contractNumber}/traffic`,
								qs,
							},
						);
					} else if (operation === 'getByPeriod') {
						const period = this.getNodeParameter('period', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/${contractNumber}/traffic/${period}`,
								qs,
							},
						);
					}
				}

				// ====================
				// Usage
				// ====================

				else if (resource === 'usage') {
					const contractNumber = this.getNodeParameter('contractNumber', i) as string;

					if (operation === 'get') {
						const qs: IDataObject = {};
						// Optional period query parameter
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						if (additionalOptions.period) {
							qs.period = additionalOptions.period;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/${contractNumber}/usage`,
								qs,
							},
						);
					} else if (operation === 'getByDatacenter') {
						const datacenterId = this.getNodeParameter('datacenterId', i) as string;

						const qs: IDataObject = {};
						// Optional period query parameter
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						if (additionalOptions.period) {
							qs.period = additionalOptions.period;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/${contractNumber}/usage/${datacenterId}`,
								qs,
							},
						);
					}
				}

				// ====================
				// Utilization
				// ====================

				else if (resource === 'utilization') {
					const contractNumber = this.getNodeParameter('contractNumber', i) as string;

					if (operation === 'get') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/${contractNumber}/utilization`,
							},
						);
					} else if (operation === 'getByPeriod') {
						const period = this.getNodeParameter('period', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/${contractNumber}/utilization/${period}`,
							},
						);
					} else if (operation === 'getById') {
						const utilizationId = this.getNodeParameter('utilizationId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/${contractNumber}/utilization/daily/${utilizationId}`,
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
