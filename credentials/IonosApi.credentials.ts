import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class IonosApi implements ICredentialType {
	name = 'ionosApi';
	displayName = 'IONOS API';
	documentationUrl = 'https://developer.hosting.ionos.com/docs/getstarted';
	properties: INodeProperties[] = [
		{
			displayName: 'Authentication Method',
			name: 'authMethod',
			type: 'options',
			options: [
				{
					name: 'API Key',
					value: 'apiKey',
				},
				{
					name: 'API Prefix + Secret',
					value: 'prefixSecret',
				},
			],
			default: 'apiKey',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			displayOptions: {
				show: {
					authMethod: ['apiKey'],
				},
			},
			description: 'The API key from your IONOS account',
		},
		{
			displayName: 'API Prefix',
			name: 'apiPrefix',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					authMethod: ['prefixSecret'],
				},
			},
		},
		{
			displayName: 'API Secret',
			name: 'apiSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			displayOptions: {
				show: {
					authMethod: ['prefixSecret'],
				},
			},
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.hosting.ionos.com',
			description: 'The base URL for the IONOS API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.authMethod === "apiKey" ? $credentials.apiKey : ""}}',
				Authorization:
					'={{$credentials.authMethod === "prefixSecret" ? "Basic " + Buffer.from($credentials.apiPrefix + "." + $credentials.apiSecret).toString("base64") : ""}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/dns/v1/zones',
			method: 'GET',
		},
	};
}
