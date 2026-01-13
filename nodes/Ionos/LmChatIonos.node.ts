import { ChatOpenAI } from '@langchain/openai';
import type {
	INodeType,
	INodeTypeDescription,
	ISupplyDataFunctions,
	SupplyData,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';

export class LmChatIonos implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Chat Model',
		name: 'lmChatIonos',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		description: 'Chat Model for IONOS AI Model Hub (OpenAI-compatible). Developed with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Chat Model',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Language Models', 'Root Nodes'],
				'Language Models': ['Chat Models (Recommended)'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.ionos.com/cloud/ai/ai-model-hub',
					},
				],
			},
		},
		inputs: [],
		outputs: ['ai_languageModel'],
		outputNames: ['Model'],
		credentials: [
			{
				name: 'ionosCloud',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Region',
				name: 'region',
				type: 'options',
				default: 'de-txl',
				options: [
					{
						name: 'Berlin, Germany (de-txl)',
						value: 'de-txl',
						description: 'Primary datacenter - documented in official API',
					},
					{
						name: 'Frankfurt, Germany (de-fra)',
						value: 'de-fra',
						description: 'Secondary datacenter - referenced in IONOS blog',
					},
				],
				description: 'IONOS AI Model Hub datacenter. Only German datacenters are available for data sovereignty compliance.',
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getModels',
				},
				default: 'meta-llama/Llama-3.3-70B-Instruct',
				description: 'The model to use for chat completion. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Temperature',
						name: 'temperature',
						type: 'number',
						default: 0.7,
						typeOptions: {
							minValue: 0,
							maxValue: 2,
							numberPrecision: 2,
						},
						description: 'Controls randomness. Lower values make the model more deterministic, higher values make it more creative. Range: 0-2.',
					},
					{
						displayName: 'Max Tokens',
						name: 'maxTokens',
						type: 'number',
						default: 1024,
						typeOptions: {
							minValue: 1,
						},
						description: 'Maximum number of tokens to generate in the response',
					},
					{
						displayName: 'Top P',
						name: 'topP',
						type: 'number',
						default: 1,
						typeOptions: {
							minValue: 0,
							maxValue: 1,
							numberPrecision: 2,
						},
						description: 'Nucleus sampling parameter. The model considers tokens with top_p probability mass.',
					},
					{
						displayName: 'Frequency Penalty',
						name: 'frequencyPenalty',
						type: 'number',
						default: 0,
						typeOptions: {
							minValue: -2,
							maxValue: 2,
							numberPrecision: 2,
						},
						description: 'Penalizes tokens based on their frequency in the text so far. Range: -2 to 2.',
					},
					{
						displayName: 'Presence Penalty',
						name: 'presencePenalty',
						type: 'number',
						default: 0,
						typeOptions: {
							minValue: -2,
							maxValue: 2,
							numberPrecision: 2,
						},
						description: 'Penalizes tokens based on whether they appear in the text so far. Range: -2 to 2.',
					},
					{
						displayName: 'Timeout',
						name: 'timeout',
						type: 'number',
						default: 60000,
						typeOptions: {
							minValue: 1000,
						},
						description: 'Request timeout in milliseconds',
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			async getModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const credentials = await this.getCredentials('ionosCloud');
					const region = this.getNodeParameter('region', 'de-txl') as string;

					const options: IHttpRequestOptions = {
						method: 'GET',
						url: `https://openai.inference.${region}.ionos.com/v1/models`,
						headers: {
							Authorization: `Bearer ${credentials.apiToken}`,
							Accept: 'application/json',
						},
					};

					const response = await this.helpers.request(options);
					const data = typeof response === 'string' ? JSON.parse(response) : response;

					if (data?.data && Array.isArray(data.data)) {
						return data.data
							.filter((model: IDataObject) => {
								// Filter to only show chat-capable models (exclude embedding models)
								const modelId = model.id as string;
								return !modelId.toLowerCase().includes('embed') &&
									!modelId.toLowerCase().includes('e5-') &&
									!modelId.toLowerCase().includes('bge-');
							})
							.map((model: IDataObject) => ({
								name: model.id as string,
								value: model.id as string,
							}))
							.sort((a: INodePropertyOptions, b: INodePropertyOptions) =>
								a.name.localeCompare(b.name)
							);
					}

					// Return default models if API call fails
					return [
						{ name: 'meta-llama/Llama-3.3-70B-Instruct', value: 'meta-llama/Llama-3.3-70B-Instruct' },
						{ name: 'meta-llama/Meta-Llama-3.1-405B-Instruct-FP8', value: 'meta-llama/Meta-Llama-3.1-405B-Instruct-FP8' },
						{ name: 'mistralai/Mistral-Large-Instruct-2411', value: 'mistralai/Mistral-Large-Instruct-2411' },
					];
				} catch {
					// Return default models on error
					return [
						{ name: 'meta-llama/Llama-3.3-70B-Instruct', value: 'meta-llama/Llama-3.3-70B-Instruct' },
						{ name: 'meta-llama/Meta-Llama-3.1-405B-Instruct-FP8', value: 'meta-llama/Meta-Llama-3.1-405B-Instruct-FP8' },
						{ name: 'mistralai/Mistral-Large-Instruct-2411', value: 'mistralai/Mistral-Large-Instruct-2411' },
					];
				}
			},
		},
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		const credentials = await this.getCredentials('ionosCloud');

		const region = this.getNodeParameter('region', itemIndex) as string;
		const model = this.getNodeParameter('model', itemIndex) as string;
		const options = this.getNodeParameter('options', itemIndex, {}) as {
			temperature?: number;
			maxTokens?: number;
			topP?: number;
			frequencyPenalty?: number;
			presencePenalty?: number;
			timeout?: number;
		};

		// Build the base URL for the IONOS OpenAI-compatible endpoint
		const baseURL = `https://openai.inference.${region}.ionos.com/v1`;

		const chatModel = new ChatOpenAI({
			openAIApiKey: credentials.apiToken as string,
			modelName: model,
			temperature: options.temperature ?? 0.7,
			maxTokens: options.maxTokens ?? 1024,
			topP: options.topP ?? 1,
			frequencyPenalty: options.frequencyPenalty ?? 0,
			presencePenalty: options.presencePenalty ?? 0,
			timeout: options.timeout ?? 60000,
			configuration: {
				baseURL,
			},
		});

		return {
			response: chatModel,
		};
	}
}
