import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

export class IonosCloudAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud AI',
		name: 'ionosCloudAi',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with IONOS Cloud AI Model Hub API. Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud AI',
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
			// Resource for Native API
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						apiType: ['native'],
					},
				},
				options: [
					{
						name: 'Foundation Model',
						value: 'model',
					},
					{
						name: 'Collection',
						value: 'collection',
					},
					{
						name: 'Document',
						value: 'document',
					},
				],
				default: 'model',
				description: 'Choose a resource for Native API operations',
			},

			// Resource for OpenAI Compatible API
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						apiType: ['openai'],
					},
				},
				options: [
					{
						name: 'OpenAI Compatible',
						value: 'openai',
					},
				],
				default: 'openai',
				description: 'OpenAI Compatible API endpoints',
			},

			// ===================================
			// Foundation Model Operations
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['model'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all available models',
						action: 'Get all models',
					},
					{
						name: 'Send Request',
						value: 'predict',
						description: 'Send a request to an AI model',
						action: 'Send a request',
					},
				],
				default: 'getAll',
			},

			// Model: Predict
			{
				displayName: 'Model ID',
				name: 'modelId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['model'],
						operation: ['predict'],
					},
				},
				default: '',
				placeholder: '4b71d0fe-d992-463e-82a1-de337d88ac2d',
				description: 'The ID of the model to use for prediction',
			},
			{
				displayName: 'Input',
				name: 'input',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['model'],
						operation: ['predict'],
					},
				},
				typeOptions: {
					rows: 4,
				},
				default: '',
				placeholder: 'Please provide some suggestion names for my business',
				description: 'The input text for the model',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['model'],
						operation: ['predict'],
					},
				},
				options: [
					{
						displayName: 'Collection ID',
						name: 'collectionId',
						type: 'string',
						default: '',
						description: 'ID of the collection to use for RAG',
					},
					{
						displayName: 'Collection Query',
						name: 'collectionQuery',
						type: 'string',
						default: '',
						description: 'Query for the collection',
					},
					{
						displayName: 'Max Length',
						name: 'max_length',
						type: 'number',
						default: 300,
						description: 'Maximum length of the generated text',
					},
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
						description: 'Sampling temperature (0-2)',
					},
				],
			},

			// ===================================
			// Collection Operations
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['collection'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new collection',
						action: 'Create a collection',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a collection',
						action: 'Delete a collection',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a collection',
						action: 'Get a collection',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all collections',
						action: 'Get many collections',
					},
					{
						name: 'Query',
						value: 'query',
						description: 'Query a collection for related content',
						action: 'Query a collection',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a collection',
						action: 'Update a collection',
					},
				],
				default: 'getAll',
			},

			// Collection: Create
			{
				displayName: 'Collection Name',
				name: 'collectionName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['collection'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'my-collection',
				description: 'The name of the collection (3-256 characters)',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['collection'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description of the collection (max 1024 characters)',
					},
					{
						displayName: 'Embedding Model',
						name: 'embeddingModel',
						type: 'string',
						default: 'BAAI/bge-large-en-v1.5',
						description: 'The embedding model to use',
					},
					{
						displayName: 'Database Type',
						name: 'dbType',
						type: 'options',
						options: [
							{
								name: 'ChromaDB',
								value: 'chromadb',
							},
							{
								name: 'PGVector',
								value: 'pgvector',
							},
						],
						default: 'chromadb',
						description: 'Type of database to use',
					},
					{
						displayName: 'Enable Chunking',
						name: 'enableChunking',
						type: 'boolean',
						default: false,
						description: 'Whether to enable document chunking',
					},
					{
						displayName: 'Chunk Size',
						name: 'chunkSize',
						type: 'number',
						default: 128,
						description: 'Size of each chunk (minimum 128)',
					},
					{
						displayName: 'Chunk Overlap',
						name: 'chunkOverlap',
						type: 'number',
						default: 50,
						description: 'Overlap between consecutive chunks (minimum 50)',
					},
				],
			},

			// Collection: Get, Update, Delete, Query
			{
				displayName: 'Collection ID',
				name: 'collectionId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['collection'],
						operation: ['get', 'update', 'delete', 'query'],
					},
				},
				default: '',
				placeholder: '550e8400-e29b-41d4-a716-446655440000',
				description: 'The ID of the collection',
			},

			// Collection: Update
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['collection'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The new name of the collection',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'The new description of the collection',
					},
				],
			},

			// Collection: Query
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['collection'],
						operation: ['query'],
					},
				},
				typeOptions: {
					rows: 2,
				},
				default: '',
				placeholder: 'What is Managed Kubernetes?',
				description: 'The search query string',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['collection'],
						operation: ['query'],
					},
				},
				default: 10,
				description: 'Maximum number of matches to return',
			},

			// Collection: Get Many
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['collection'],
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
						resource: ['collection'],
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

			// ===================================
			// Document Operations
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'Add',
						value: 'add',
						description: 'Add documents to a collection',
						action: 'Add documents',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a document',
						action: 'Delete a document',
					},
					{
						name: 'Delete All',
						value: 'deleteAll',
						description: 'Delete all documents in a collection',
						action: 'Delete all documents',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a document',
						action: 'Get a document',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all documents in a collection',
						action: 'Get many documents',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a document',
						action: 'Update a document',
					},
				],
				default: 'getAll',
			},

			// Document: Collection ID (required for all operations)
			{
				displayName: 'Collection ID',
				name: 'collectionId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				default: '',
				placeholder: '550e8400-e29b-41d4-a716-446655440000',
				description: 'The ID of the collection',
			},

			// Document: Add
			{
				displayName: 'Documents',
				name: 'documents',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['add'],
					},
				},
				default: {},
				placeholder: 'Add Document',
				options: [
					{
						name: 'documentValues',
						displayName: 'Document',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								required: true,
								description: 'Document name (3-256 characters)',
							},
							{
								displayName: 'Content',
								name: 'content',
								type: 'string',
								typeOptions: {
									rows: 4,
								},
								default: '',
								required: true,
								description: 'Document content (will be base64 encoded automatically)',
							},
							{
								displayName: 'Content Type',
								name: 'contentType',
								type: 'options',
								options: [
									{
										name: 'Text/Plain',
										value: 'text/plain',
									},
								],
								default: 'text/plain',
								description: 'The content type of the document',
							},
							{
								displayName: 'Description',
								name: 'description',
								type: 'string',
								default: '',
								description: 'Document description (max 1024 characters)',
							},
						],
					},
				],
			},

			// Document: Get, Update, Delete
			{
				displayName: 'Document ID',
				name: 'documentId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				placeholder: '4b71d0fe-d992-463e-82a1-de337d88ac2d',
				description: 'The ID of the document',
			},

			// Document: Update
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The new name of the document',
					},
					{
						displayName: 'Content',
						name: 'content',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'The new content of the document (will be base64 encoded)',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'The new description of the document',
					},
				],
			},

			// Document: Get Many
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['document'],
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
						resource: ['document'],
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

			// ===================================
			// OpenAI Compatible Operations
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['openai'],
					},
				},
				options: [
					{
						name: 'Chat Completion',
						value: 'chatCompletion',
						description: 'Create a chat completion',
						action: 'Create chat completion',
					},
					{
						name: 'Completion',
						value: 'completion',
						description: 'Create a text completion',
						action: 'Create completion',
					},
					{
						name: 'Embedding',
						value: 'embedding',
						description: 'Create embeddings',
						action: 'Create embeddings',
					},
					{
						name: 'Generate Image',
						value: 'imageGeneration',
						description: 'Generate an image',
						action: 'Generate image',
					},
					{
						name: 'Get Models',
						value: 'getModels',
						description: 'Get available models',
						action: 'Get models',
					},
				],
				default: 'chatCompletion',
			},

			// OpenAI: Chat Completion
			{
				displayName: 'Model',
				name: 'model',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['openai'],
						operation: ['chatCompletion'],
					},
				},
				default: 'meta-llama/Llama-3.3-70B-Instruct',
				placeholder: 'meta-llama/Llama-3.3-70B-Instruct',
				description: 'The model to use for chat completion',
			},
			{
				displayName: 'Messages',
				name: 'messages',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['openai'],
						operation: ['chatCompletion'],
					},
				},
				default: {},
				placeholder: 'Add Message',
				options: [
					{
						name: 'messageValues',
						displayName: 'Message',
						values: [
							{
								displayName: 'Role',
								name: 'role',
								type: 'options',
								options: [
									{
										name: 'System',
										value: 'system',
									},
									{
										name: 'User',
										value: 'user',
									},
									{
										name: 'Assistant',
										value: 'assistant',
									},
								],
								default: 'user',
								description: 'The role of the message author',
							},
							{
								displayName: 'Content',
								name: 'content',
								type: 'string',
								typeOptions: {
									rows: 2,
								},
								default: '',
								description: 'The content of the message',
							},
						],
					},
				],
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['openai'],
						operation: ['chatCompletion'],
					},
				},
				options: [
					{
						displayName: 'Temperature',
						name: 'temperature',
						type: 'number',
						default: 1.0,
						typeOptions: {
							minValue: 0,
							maxValue: 2,
							numberPrecision: 2,
						},
						description: 'Sampling temperature (0-2)',
					},
					{
						displayName: 'Max Tokens',
						name: 'max_tokens',
						type: 'number',
						default: 1000,
						description: 'Maximum number of tokens to generate',
					},
					{
						displayName: 'Top P',
						name: 'top_p',
						type: 'number',
						default: 1,
						typeOptions: {
							minValue: 0,
							maxValue: 1,
							numberPrecision: 2,
						},
						description: 'Nucleus sampling parameter',
					},
				],
			},

			// OpenAI: Completion
			{
				displayName: 'Model',
				name: 'model',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['openai'],
						operation: ['completion'],
					},
				},
				default: 'meta-llama/Llama-3.3-70B-Instruct',
				placeholder: 'meta-llama/Llama-3.3-70B-Instruct',
				description: 'The model to use for completion',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['openai'],
						operation: ['completion'],
					},
				},
				typeOptions: {
					rows: 4,
				},
				default: '',
				placeholder: 'Say this is a test',
				description: 'The prompt to generate completions from',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['openai'],
						operation: ['completion'],
					},
				},
				options: [
					{
						displayName: 'Temperature',
						name: 'temperature',
						type: 'number',
						default: 1.0,
						typeOptions: {
							minValue: 0,
							maxValue: 2,
							numberPrecision: 2,
						},
						description: 'Sampling temperature (0-2)',
					},
					{
						displayName: 'Max Tokens',
						name: 'max_tokens',
						type: 'number',
						default: 1000,
						description: 'Maximum number of tokens to generate',
					},
				],
			},

			// OpenAI: Embedding
			{
				displayName: 'Model',
				name: 'model',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['openai'],
						operation: ['embedding'],
					},
				},
				default: 'intfloat/e5-large-v2',
				placeholder: 'intfloat/e5-large-v2',
				description: 'The model to use for embeddings',
			},
			{
				displayName: 'Input',
				name: 'input',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['openai'],
						operation: ['embedding'],
					},
				},
				typeOptions: {
					rows: 2,
				},
				default: '',
				placeholder: 'The food was delicious and the waiter was friendly.',
				description: 'The text to create embeddings for',
			},

			// OpenAI: Image Generation
			{
				displayName: 'Model',
				name: 'model',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['openai'],
						operation: ['imageGeneration'],
					},
				},
				default: 'stabilityai/stable-diffusion-xl-base-1.0',
				placeholder: 'stabilityai/stable-diffusion-xl-base-1.0',
				description: 'The model to use for image generation',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['openai'],
						operation: ['imageGeneration'],
					},
				},
				typeOptions: {
					rows: 2,
				},
				default: '',
				placeholder: 'A beautiful sunset over the ocean',
				description: 'The prompt to generate the image from',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['openai'],
						operation: ['imageGeneration'],
					},
				},
				options: [
					{
						displayName: 'Size',
						name: 'size',
						type: 'options',
						options: [
							{
								name: '1024x1024',
								value: '1024*1024',
							},
							{
								name: '1792x1024',
								value: '1792*1024',
							},
							{
								name: '1024x1792',
								value: '1024*1792',
							},
						],
						default: '1024*1024',
						description: 'The size of the image to generate',
					},
					{
						displayName: 'Number of Images',
						name: 'n',
						type: 'number',
						default: 1,
						description: 'Number of images to generate',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const apiType = this.getNodeParameter('apiType', 0) as string;
		const region = this.getNodeParameter('region', 0) as string;
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		// Determine base URL based on parameters
		const baseURL =
			apiType === 'openai'
				? `https://openai.inference.${region}.ionos.com`
				: `https://inference.${region}.ionos.com`;

		for (let i = 0; i < items.length; i++) {
			try {
				// ===================================
				// Foundation Models
				// ===================================
				if (resource === 'model') {
					if (operation === 'getAll') {
						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/models`,
							headers: {
								Accept: 'application/json',
							},
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);

						const models = (response as IDataObject).items as IDataObject[];
						models.forEach((model) => {
							returnData.push({ json: model });
						});
					}

					if (operation === 'predict') {
						const modelId = this.getNodeParameter('modelId', i) as string;
						const input = this.getNodeParameter('input', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const body: IDataObject = {
							type: 'prediction',
							properties: {
								input,
							},
						};

						const options: IDataObject = {};
						if (additionalOptions.max_length) options.max_length = String(additionalOptions.max_length);
						if (additionalOptions.temperature)
							options.temperature = String(additionalOptions.temperature);

						if (Object.keys(options).length > 0) {
							(body.properties as IDataObject).options = options;
						}

						if (additionalOptions.collectionId) {
							(body.properties as IDataObject).collectionId = additionalOptions.collectionId;
						}
						if (additionalOptions.collectionQuery) {
							(body.properties as IDataObject).collectionQuery = additionalOptions.collectionQuery;
						}

						const requestOptions: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseURL}/models/${modelId}/predictions`,
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
							},
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							requestOptions,
						);
						returnData.push({ json: response as IDataObject });
					}
				}

				// ===================================
				// Collections
				// ===================================
				if (resource === 'collection') {
					if (operation === 'create') {
						const collectionName = this.getNodeParameter('collectionName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							type: 'collection',
							properties: {
								name: collectionName,
							},
						};

						if (additionalFields.description) {
							(body.properties as IDataObject).description = additionalFields.description;
						}

						if (additionalFields.embeddingModel) {
							(body.properties as IDataObject).embedding = {
								model: additionalFields.embeddingModel,
							};
						}

						if (additionalFields.dbType) {
							(body.properties as IDataObject).engine = {
								db_type: additionalFields.dbType,
							};
						}

						if (additionalFields.enableChunking) {
							const config: IDataObject = {};

							if (additionalFields.chunkSize) {
								config.chunk_size = additionalFields.chunkSize;
							}

							if (additionalFields.chunkOverlap) {
								config.chunk_overlap = additionalFields.chunkOverlap;
							}

							const chunking: IDataObject = {
								enabled: true,
								strategy: {
									name: 'fixed_size',
									config,
								},
							};

							(body.properties as IDataObject).chunking = chunking;
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseURL}/collections`,
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
							},
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'get') {
						const collectionId = this.getNodeParameter('collectionId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/collections/${collectionId}`,
							headers: {
								Accept: 'application/json',
							},
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/collections`,
							headers: {
								Accept: 'application/json',
							},
							qs: {
								limit: returnAll ? 1000 : limit,
							},
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);

						const collections = (response as IDataObject).items as IDataObject[];
						collections.forEach((collection) => {
							returnData.push({ json: collection });
						});
					}

					if (operation === 'update') {
						const collectionId = this.getNodeParameter('collectionId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {
							properties: {},
						};

						if (updateFields.name) {
							(body.properties as IDataObject).name = updateFields.name;
						}
						if (updateFields.description) {
							(body.properties as IDataObject).description = updateFields.description;
						}

						const options: IHttpRequestOptions = {
							method: 'PUT',
							url: `${baseURL}/collections/${collectionId}`,
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
							},
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'delete') {
						const collectionId = this.getNodeParameter('collectionId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'DELETE',
							url: `${baseURL}/collections/${collectionId}`,
							headers: {
								Accept: 'application/json',
							},
						};

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: { success: true, collectionId } });
					}

					if (operation === 'query') {
						const collectionId = this.getNodeParameter('collectionId', i) as string;
						const query = this.getNodeParameter('query', i) as string;
						const limit = this.getNodeParameter('limit', i, 10) as number;

						const body = {
							query,
							limit,
						};

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseURL}/collections/${collectionId}/query`,
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
							},
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}
				}

				// ===================================
				// Documents
				// ===================================
				if (resource === 'document') {
					const collectionId = this.getNodeParameter('collectionId', i) as string;

					if (operation === 'add') {
						const documents = this.getNodeParameter('documents', i) as IDataObject;
						const documentValues = (documents.documentValues as IDataObject[]) || [];

						const items = documentValues.map((doc) => {
							// Base64 encode the content
							// @ts-ignore
							const content = Buffer.from(doc.content as string, 'utf-8').toString('base64');

							return {
								type: 'document',
								properties: {
									name: doc.name,
									contentType: doc.contentType || 'text/plain',
									content,
									...(doc.description && { description: doc.description }),
								},
							};
						});

						const body = {
							type: 'collection',
							items,
						};

						const options: IHttpRequestOptions = {
							method: 'PUT',
							url: `${baseURL}/collections/${collectionId}/documents`,
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
							},
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'get') {
						const documentId = this.getNodeParameter('documentId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/collections/${collectionId}/documents/${documentId}`,
							headers: {
								Accept: 'application/json',
							},
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseURL}/collections/${collectionId}/documents`,
							headers: {
								Accept: 'application/json',
							},
							qs: {
								limit: returnAll ? 1000 : limit,
							},
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);

						const documents = (response as IDataObject).items as IDataObject[];
						documents.forEach((document) => {
							returnData.push({ json: document });
						});
					}

					if (operation === 'update') {
						const documentId = this.getNodeParameter('documentId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {
							type: 'document',
							properties: {},
						};

						if (updateFields.name) {
							(body.properties as IDataObject).name = updateFields.name;
						}
						if (updateFields.description) {
							(body.properties as IDataObject).description = updateFields.description;
						}
						if (updateFields.content) {
							// @ts-ignore
							const content = Buffer.from(updateFields.content as string, 'utf-8').toString('base64');
							(body.properties as IDataObject).content = content;
							(body.properties as IDataObject).contentType = 'text/plain';
						}

						const options: IHttpRequestOptions = {
							method: 'PUT',
							url: `${baseURL}/collections/${collectionId}/documents/${documentId}`,
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
							},
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'delete') {
						const documentId = this.getNodeParameter('documentId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'DELETE',
							url: `${baseURL}/collections/${collectionId}/documents/${documentId}`,
							headers: {
								Accept: 'application/json',
							},
						};

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: { success: true, documentId } });
					}

					if (operation === 'deleteAll') {
						const options: IHttpRequestOptions = {
							method: 'DELETE',
							url: `${baseURL}/collections/${collectionId}/documents`,
							headers: {
								Accept: 'application/json',
							},
						};

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: { success: true, collectionId } });
					}
				}

				// ===================================
				// OpenAI Compatible
				// ===================================
				if (resource === 'openai') {
					const openaiBaseURL = `https://openai.inference.${region}.ionos.com`;

					if (operation === 'getModels') {
						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${openaiBaseURL}/v1/models`,
							headers: {
								Accept: 'application/json',
							},
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'chatCompletion') {
						const model = this.getNodeParameter('model', i) as string;
						const messages = this.getNodeParameter('messages', i) as IDataObject;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const messageValues = (messages.messageValues as IDataObject[]) || [];
						const formattedMessages = messageValues.map((msg) => ({
							role: msg.role,
							content: msg.content,
						}));

						const body: IDataObject = {
							model,
							messages: formattedMessages,
						};

						if (additionalOptions.temperature !== undefined) {
							body.temperature = additionalOptions.temperature;
						}
						if (additionalOptions.max_tokens) {
							body.max_tokens = additionalOptions.max_tokens;
						}
						if (additionalOptions.top_p !== undefined) {
							body.top_p = additionalOptions.top_p;
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${openaiBaseURL}/v1/chat/completions`,
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
							},
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'completion') {
						const model = this.getNodeParameter('model', i) as string;
						const prompt = this.getNodeParameter('prompt', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const body: IDataObject = {
							model,
							prompt,
						};

						if (additionalOptions.temperature !== undefined) {
							body.temperature = additionalOptions.temperature;
						}
						if (additionalOptions.max_tokens) {
							body.max_tokens = additionalOptions.max_tokens;
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${openaiBaseURL}/v1/completions`,
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
							},
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'embedding') {
						const model = this.getNodeParameter('model', i) as string;
						const input = this.getNodeParameter('input', i) as string;

						const body = {
							model,
							input: [input],
						};

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${openaiBaseURL}/v1/embeddings`,
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
							},
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
					}

					if (operation === 'imageGeneration') {
						const model = this.getNodeParameter('model', i) as string;
						const prompt = this.getNodeParameter('prompt', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const body: IDataObject = {
							model,
							prompt,
							response_format: 'b64_json',
						};

						if (additionalOptions.size) {
							body.size = additionalOptions.size;
						}
						if (additionalOptions.n) {
							body.n = additionalOptions.n;
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${openaiBaseURL}/v1/images/generations`,
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
							},
							body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							options,
						);
						returnData.push({ json: response as IDataObject });
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
