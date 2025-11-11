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
		{
			displayName: 'API Type',
			name: 'apiType',
			type: 'options',
			options: [
				{
					name: 'Native API',
					value: 'native',
					description: 'IONOS AI Model Hub native API',
				},
				{
					name: 'OpenAI Compatible',
					value: 'openai',
					description: 'OpenAI-compatible API endpoints',
				},
			],
			default: 'native',
			description: 'The type of API to use for AI Model Hub',
		},
		{
			displayName: 'Region',
			name: 'region',
			type: 'options',
			options: [
				{
					name: 'Berlin (de-txl)',
					value: 'de-txl',
				},
			],
			default: 'de-txl',
			description: 'The region for AI Model Hub API',
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
			baseURL: '={{$credentials.apiType === "openai" ? "https://openai.inference." + $credentials.region + ".ionos.com" : "https://inference." + $credentials.region + ".ionos.com"}}',
			url: '={{$credentials.apiType === "openai" ? "/v1/models" : "/models"}}',
			method: 'GET',
		},
	};
}
