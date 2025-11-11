import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

export class IonosDomain implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Domain',
		name: 'ionosDomain',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage domains with IONOS. Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Domain',
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
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Domain',
						value: 'domain',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
				],
				default: 'domain',
			},

			// Domain Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['domain'],
					},
				},
				options: [
					{
						name: 'Check Availability',
						value: 'checkAvailability',
						description: 'Check if a domain is available for registration',
						action: 'Check domain availability',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get domain details',
						action: 'Get a domain',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all domains',
						action: 'Get many domains',
					},
					{
						name: 'Register',
						value: 'register',
						description: 'Register a new domain',
						action: 'Register a domain',
					},
					{
						name: 'Renew',
						value: 'renew',
						description: 'Renew a domain',
						action: 'Renew a domain',
					},
					{
						name: 'Transfer',
						value: 'transfer',
						description: 'Transfer a domain to IONOS',
						action: 'Transfer a domain',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update domain settings',
						action: 'Update a domain',
					},
				],
				default: 'getAll',
			},

			// Contact Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contact'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new contact',
						action: 'Create a contact',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get contact details',
						action: 'Get a contact',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all contacts',
						action: 'Get many contacts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a contact',
						action: 'Update a contact',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a contact',
						action: 'Delete a contact',
					},
				],
				default: 'getAll',
			},

			// Domain: Check Availability
			{
				displayName: 'Domain Name',
				name: 'domainName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['checkAvailability', 'register'],
					},
				},
				default: '',
				placeholder: 'example.com',
				description: 'The domain name to check or register',
			},

			// Domain: Get, Update, Renew, Transfer
			{
				displayName: 'Domain ID',
				name: 'domainId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['get', 'update', 'renew'],
					},
				},
				default: '',
				description: 'The ID of the domain',
			},

			// Domain: Register - Additional Fields
			{
				displayName: 'Registration Details',
				name: 'registrationDetails',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['register'],
					},
				},
				options: [
					{
						displayName: 'Period',
						name: 'period',
						type: 'number',
						default: 1,
						description: 'Registration period in years',
						typeOptions: {
							minValue: 1,
							maxValue: 10,
						},
					},
					{
						displayName: 'Owner Contact ID',
						name: 'ownerContactId',
						type: 'string',
						default: '',
						description: 'The ID of the owner contact',
					},
					{
						displayName: 'Admin Contact ID',
						name: 'adminContactId',
						type: 'string',
						default: '',
						description: 'The ID of the admin contact',
					},
					{
						displayName: 'Tech Contact ID',
						name: 'techContactId',
						type: 'string',
						default: '',
						description: 'The ID of the technical contact',
					},
					{
						displayName: 'Nameservers',
						name: 'nameservers',
						type: 'string',
						default: '',
						placeholder: 'ns1.example.com,ns2.example.com',
						description: 'Comma-separated list of nameservers',
					},
					{
						displayName: 'Auto Renew',
						name: 'autoRenew',
						type: 'boolean',
						default: true,
						description: 'Whether to enable auto-renewal',
					},
				],
			},

			// Domain: Transfer
			{
				displayName: 'Auth Code',
				name: 'authCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['transfer'],
					},
				},
				default: '',
				description: 'The authorization code for domain transfer',
			},
			{
				displayName: 'Transfer Details',
				name: 'transferDetails',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['transfer'],
					},
				},
				options: [
					{
						displayName: 'Owner Contact ID',
						name: 'ownerContactId',
						type: 'string',
						default: '',
						description: 'The ID of the owner contact',
					},
					{
						displayName: 'Admin Contact ID',
						name: 'adminContactId',
						type: 'string',
						default: '',
						description: 'The ID of the admin contact',
					},
					{
						displayName: 'Tech Contact ID',
						name: 'techContactId',
						type: 'string',
						default: '',
						description: 'The ID of the technical contact',
					},
				],
			},

			// Domain: Update
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Auto Renew',
						name: 'autoRenew',
						type: 'boolean',
						default: true,
						description: 'Whether to enable auto-renewal',
					},
					{
						displayName: 'Nameservers',
						name: 'nameservers',
						type: 'string',
						default: '',
						placeholder: 'ns1.example.com,ns2.example.com',
						description: 'Comma-separated list of nameservers',
					},
					{
						displayName: 'Transfer Lock',
						name: 'transferLock',
						type: 'boolean',
						default: true,
						description: 'Whether to enable transfer lock',
					},
					{
						displayName: 'Privacy Protection',
						name: 'privacyProtection',
						type: 'boolean',
						default: false,
						description: 'Whether to enable privacy protection',
					},
				],
			},

			// Domain: Get Many
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['domain'],
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
						resource: ['domain'],
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

			// Contact: Create
			{
				displayName: 'Contact Type',
				name: 'contactType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Person',
						value: 'person',
					},
					{
						name: 'Organization',
						value: 'organization',
					},
				],
				default: 'person',
				description: 'The type of contact',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
						contactType: ['person'],
					},
				},
				default: '',
				description: 'The first name of the contact',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
						contactType: ['person'],
					},
				},
				default: '',
				description: 'The last name of the contact',
			},
			{
				displayName: 'Organization Name',
				name: 'organizationName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
						contactType: ['organization'],
					},
				},
				default: '',
				description: 'The name of the organization',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'contact@example.com',
				description: 'The email address of the contact',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '+1.1234567890',
				description: 'The phone number of the contact',
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'collection',
				placeholder: 'Add Address Field',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Street',
						name: 'street',
						type: 'string',
						default: '',
						description: 'Street address',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						description: 'City',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'string',
						default: '',
						description: 'State or province',
					},
					{
						displayName: 'Postal Code',
						name: 'postalCode',
						type: 'string',
						default: '',
						description: 'Postal or ZIP code',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						placeholder: 'US',
						description: 'Country code (ISO 3166-1 alpha-2)',
					},
				],
			},

			// Contact: Get, Update, Delete
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID of the contact',
			},

			// Contact: Update
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'First Name',
						name: 'firstName',
						type: 'string',
						default: '',
						description: 'The first name of the contact',
					},
					{
						displayName: 'Last Name',
						name: 'lastName',
						type: 'string',
						default: '',
						description: 'The last name of the contact',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						description: 'The email address of the contact',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
						description: 'The phone number of the contact',
					},
					{
						displayName: 'Street',
						name: 'street',
						type: 'string',
						default: '',
						description: 'Street address',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						description: 'City',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'string',
						default: '',
						description: 'State or province',
					},
					{
						displayName: 'Postal Code',
						name: 'postalCode',
						type: 'string',
						default: '',
						description: 'Postal or ZIP code',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'Country code (ISO 3166-1 alpha-2)',
					},
				],
			},

			// Contact: Get Many
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['contact'],
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
						resource: ['contact'],
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
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'domain') {
					if (operation === 'checkAvailability') {
						const domainName = this.getNodeParameter('domainName', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `/domains/v1/availability/${domainName}`,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'get') {
						const domainId = this.getNodeParameter('domainId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `/domains/v1/domains/${domainId}`,
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
							url: '/domains/v1/domains',
							qs: {
								limit: returnAll ? 1000 : limit,
							},
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);

						const domains = (response as IDataObject).items as IDataObject[];
						if (domains) {
							domains.forEach((domain) => {
								returnData.push({ json: domain });
							});
						} else {
							returnData.push({ json: response as IDataObject });
						}
					}

					if (operation === 'register') {
						const domainName = this.getNodeParameter('domainName', i) as string;
						const registrationDetails = this.getNodeParameter(
							'registrationDetails',
							i,
						) as IDataObject;

						const body: IDataObject = {
							name: domainName,
							period: registrationDetails.period || 1,
							autoRenew: registrationDetails.autoRenew !== false,
						};

						if (registrationDetails.ownerContactId) {
							body.ownerContactId = registrationDetails.ownerContactId;
						}
						if (registrationDetails.adminContactId) {
							body.adminContactId = registrationDetails.adminContactId;
						}
						if (registrationDetails.techContactId) {
							body.techContactId = registrationDetails.techContactId;
						}
						if (registrationDetails.nameservers) {
							body.nameservers = (registrationDetails.nameservers as string)
								.split(',')
								.map((ns) => ns.trim());
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: '/domains/v1/domains',
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'renew') {
						const domainId = this.getNodeParameter('domainId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `/domains/v1/domains/${domainId}/renew`,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'transfer') {
						const domainName = this.getNodeParameter('domainName', i) as string;
						const authCode = this.getNodeParameter('authCode', i) as string;
						const transferDetails = this.getNodeParameter('transferDetails', i) as IDataObject;

						const body: IDataObject = {
							name: domainName,
							authCode,
						};

						if (transferDetails.ownerContactId) {
							body.ownerContactId = transferDetails.ownerContactId;
						}
						if (transferDetails.adminContactId) {
							body.adminContactId = transferDetails.adminContactId;
						}
						if (transferDetails.techContactId) {
							body.techContactId = transferDetails.techContactId;
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: '/domains/v1/transfers',
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'update') {
						const domainId = this.getNodeParameter('domainId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						if (updateFields.autoRenew !== undefined) {
							body.autoRenew = updateFields.autoRenew;
						}
						if (updateFields.nameservers) {
							body.nameservers = (updateFields.nameservers as string)
								.split(',')
								.map((ns) => ns.trim());
						}
						if (updateFields.transferLock !== undefined) {
							body.transferLock = updateFields.transferLock;
						}
						if (updateFields.privacyProtection !== undefined) {
							body.privacyProtection = updateFields.privacyProtection;
						}

						const options: IHttpRequestOptions = {
							method: 'PATCH',
							url: `/domains/v1/domains/${domainId}`,
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}
				}

				if (resource === 'contact') {
					if (operation === 'create') {
						const contactType = this.getNodeParameter('contactType', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const phone = this.getNodeParameter('phone', i) as string;
						const address = this.getNodeParameter('address', i) as IDataObject;

						const body: IDataObject = {
							type: contactType,
							email,
							phone,
							address: {
								street: address.street || '',
								city: address.city || '',
								state: address.state || '',
								postalCode: address.postalCode || '',
								country: address.country || '',
							},
						};

						if (contactType === 'person') {
							const firstName = this.getNodeParameter('firstName', i) as string;
							const lastName = this.getNodeParameter('lastName', i) as string;
							body.firstName = firstName;
							body.lastName = lastName;
						} else {
							const organizationName = this.getNodeParameter('organizationName', i) as string;
							body.organizationName = organizationName;
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: '/domains/v1/contacts',
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'get') {
						const contactId = this.getNodeParameter('contactId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `/domains/v1/contacts/${contactId}`,
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
							url: '/domains/v1/contacts',
							qs: {
								limit: returnAll ? 1000 : limit,
							},
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosApi',
							options,
						);

						const contacts = (response as IDataObject).items as IDataObject[];
						if (contacts) {
							contacts.forEach((contact) => {
								returnData.push({ json: contact });
							});
						} else {
							returnData.push({ json: response as IDataObject });
						}
					}

					if (operation === 'update') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						if (updateFields.firstName) body.firstName = updateFields.firstName;
						if (updateFields.lastName) body.lastName = updateFields.lastName;
						if (updateFields.email) body.email = updateFields.email;
						if (updateFields.phone) body.phone = updateFields.phone;

						const address: IDataObject = {};
						if (updateFields.street) address.street = updateFields.street;
						if (updateFields.city) address.city = updateFields.city;
						if (updateFields.state) address.state = updateFields.state;
						if (updateFields.postalCode) address.postalCode = updateFields.postalCode;
						if (updateFields.country) address.country = updateFields.country;

						if (Object.keys(address).length > 0) {
							body.address = address;
						}

						const options: IHttpRequestOptions = {
							method: 'PATCH',
							url: `/domains/v1/contacts/${contactId}`,
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
						const contactId = this.getNodeParameter('contactId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'DELETE',
							url: `/domains/v1/contacts/${contactId}`,
						};

						await this.helpers.httpRequestWithAuthentication.call(this, 'ionosApi', options);
						returnData.push({ json: { success: true, contactId } });
					}
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
