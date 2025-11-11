import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class IonosCloud implements ICredentialType {
	name = 'ionosCloud';
	displayName = 'IONOS Cloud';
	documentationUrl = 'https://docs.ionos.com/cloud/getting-started/authentication';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'JWT token for IONOS Cloud APIs. Generate tokens via the Auth API or Token Manager in DCD.',
			placeholder: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '="Bearer " + $credentials.apiToken',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.ionos.com',
			url: '/cloudapi/v6/datacenters',
			method: 'GET',
		},
	};
}
