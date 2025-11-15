import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class IonosCloudDbaas implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IONOS Cloud DBaaS',
		name: 'ionosCloudDbaas',
		icon: 'file:ionos.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Manage IONOS Cloud Database as a Service (PostgreSQL, MongoDB, MariaDB, Redis). Developped with Love by Ascenzia (ascenzia.fr)',
		defaults: {
			name: 'IONOS Cloud DBaaS',
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
			// Resource Selection
			{
				displayName: 'Database Type',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'PostgreSQL',
						value: 'postgresql',
						description: 'Manage PostgreSQL database clusters',
					},
					{
						name: 'MongoDB',
						value: 'mongodb',
						description: 'Manage MongoDB database clusters',
					},
					{
						name: 'MariaDB',
						value: 'mariadb',
						description: 'Manage MariaDB database clusters',
					},
					{
						name: 'Redis',
						value: 'redis',
						description: 'Manage Redis In-Memory database replica sets',
					},
				],
				default: 'postgresql',
			},

			// ====================
			// PostgreSQL Operations
			// ====================
			{
				displayName: 'Resource',
				name: 'postgresqlResource',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['postgresql'],
					},
				},
				options: [
					{
						name: 'Cluster',
						value: 'cluster',
						description: 'Manage PostgreSQL clusters',
					},
					{
						name: 'User',
						value: 'user',
						description: 'Manage PostgreSQL users',
					},
					{
						name: 'Database',
						value: 'database',
						description: 'Manage PostgreSQL databases',
					},
					{
						name: 'Backup',
						value: 'backup',
						description: 'Manage PostgreSQL backups',
					},
					{
						name: 'Log',
						value: 'log',
						description: 'Get PostgreSQL logs',
					},
				],
				default: 'cluster',
			},

			// PostgreSQL Cluster Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['postgresql'],
						postgresqlResource: ['cluster'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a PostgreSQL cluster',
						action: 'Create a PostgreSQL cluster',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a PostgreSQL cluster',
						action: 'Get a PostgreSQL cluster',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many PostgreSQL clusters',
						action: 'Get many PostgreSQL clusters',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a PostgreSQL cluster',
						action: 'Update a PostgreSQL cluster',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a PostgreSQL cluster',
						action: 'Delete a PostgreSQL cluster',
					},
					{
						name: 'Restore',
						value: 'restore',
						description: 'Restore PostgreSQL cluster from backup',
						action: 'Restore PostgreSQL cluster from backup',
					},
				],
				default: 'create',
			},

			// PostgreSQL User Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['postgresql'],
						postgresqlResource: ['user'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a PostgreSQL user',
						action: 'Create a PostgreSQL user',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a PostgreSQL user',
						action: 'Get a PostgreSQL user',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many PostgreSQL users',
						action: 'Get many PostgreSQL users',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a PostgreSQL user',
						action: 'Update a PostgreSQL user',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a PostgreSQL user',
						action: 'Delete a PostgreSQL user',
					},
				],
				default: 'create',
			},

			// PostgreSQL Database Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['postgresql'],
						postgresqlResource: ['database'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a PostgreSQL database',
						action: 'Create a PostgreSQL database',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a PostgreSQL database',
						action: 'Get a PostgreSQL database',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many PostgreSQL databases',
						action: 'Get many PostgreSQL databases',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a PostgreSQL database',
						action: 'Delete a PostgreSQL database',
					},
				],
				default: 'create',
			},

			// PostgreSQL Backup Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['postgresql'],
						postgresqlResource: ['backup'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a PostgreSQL backup',
						action: 'Get a PostgreSQL backup',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many PostgreSQL backups',
						action: 'Get many PostgreSQL backups',
					},
				],
				default: 'getMany',
			},

			// PostgreSQL Log Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['postgresql'],
						postgresqlResource: ['log'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get PostgreSQL logs',
						action: 'Get PostgreSQL logs',
					},
				],
				default: 'get',
			},

			// ====================
			// MongoDB Operations
			// ====================
			{
				displayName: 'Resource',
				name: 'mongodbResource',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['mongodb'],
					},
				},
				options: [
					{
						name: 'Cluster',
						value: 'cluster',
						description: 'Manage MongoDB clusters',
					},
					{
						name: 'User',
						value: 'user',
						description: 'Manage MongoDB users',
					},
					{
						name: 'Snapshot',
						value: 'snapshot',
						description: 'Manage MongoDB snapshots',
					},
					{
						name: 'Template',
						value: 'template',
						description: 'Get MongoDB templates',
					},
					{
						name: 'Log',
						value: 'log',
						description: 'Get MongoDB logs',
					},
				],
				default: 'cluster',
			},

			// MongoDB Cluster Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['mongodb'],
						mongodbResource: ['cluster'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a MongoDB cluster',
						action: 'Create a MongoDB cluster',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a MongoDB cluster',
						action: 'Get a MongoDB cluster',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many MongoDB clusters',
						action: 'Get many MongoDB clusters',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a MongoDB cluster',
						action: 'Update a MongoDB cluster',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a MongoDB cluster',
						action: 'Delete a MongoDB cluster',
					},
					{
						name: 'Restore',
						value: 'restore',
						description: 'Restore MongoDB cluster from snapshot',
						action: 'Restore MongoDB cluster from snapshot',
					},
				],
				default: 'create',
			},

			// MongoDB User Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['mongodb'],
						mongodbResource: ['user'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a MongoDB user',
						action: 'Create a MongoDB user',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a MongoDB user',
						action: 'Get a MongoDB user',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many MongoDB users',
						action: 'Get many MongoDB users',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a MongoDB user',
						action: 'Update a MongoDB user',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a MongoDB user',
						action: 'Delete a MongoDB user',
					},
				],
				default: 'create',
			},

			// MongoDB Snapshot Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['mongodb'],
						mongodbResource: ['snapshot'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many MongoDB snapshots',
						action: 'Get many MongoDB snapshots',
					},
				],
				default: 'getMany',
			},

			// MongoDB Template Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['mongodb'],
						mongodbResource: ['template'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many MongoDB templates',
						action: 'Get many MongoDB templates',
					},
				],
				default: 'getMany',
			},

			// MongoDB Log Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['mongodb'],
						mongodbResource: ['log'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get MongoDB logs',
						action: 'Get MongoDB logs',
					},
				],
				default: 'get',
			},

			// ====================
			// MariaDB Operations
			// ====================
			{
				displayName: 'Resource',
				name: 'mariadbResource',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['mariadb'],
					},
				},
				options: [
					{
						name: 'Cluster',
						value: 'cluster',
						description: 'Manage MariaDB clusters',
					},
					{
						name: 'Backup',
						value: 'backup',
						description: 'Manage MariaDB backups',
					},
				],
				default: 'cluster',
			},

			// MariaDB Cluster Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['mariadb'],
						mariadbResource: ['cluster'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a MariaDB cluster',
						action: 'Create a MariaDB cluster',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a MariaDB cluster',
						action: 'Get a MariaDB cluster',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many MariaDB clusters',
						action: 'Get many MariaDB clusters',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a MariaDB cluster',
						action: 'Update a MariaDB cluster',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a MariaDB cluster',
						action: 'Delete a MariaDB cluster',
					},
					{
						name: 'Restore',
						value: 'restore',
						description: 'Restore MariaDB cluster from backup',
						action: 'Restore MariaDB cluster from backup',
					},
				],
				default: 'create',
			},

			// MariaDB Backup Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['mariadb'],
						mariadbResource: ['backup'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a MariaDB backup',
						action: 'Get a MariaDB backup',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many MariaDB backups',
						action: 'Get many MariaDB backups',
					},
				],
				default: 'getMany',
			},

			// ====================
			// Redis Operations
			// ====================
			{
				displayName: 'Resource',
				name: 'redisResource',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['redis'],
					},
				},
				options: [
					{
						name: 'ReplicaSet',
						value: 'replicaset',
						description: 'Manage Redis replica sets',
					},
					{
						name: 'Snapshot',
						value: 'snapshot',
						description: 'Manage Redis snapshots',
					},
				],
				default: 'replicaset',
			},

			// Redis ReplicaSet Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['redis'],
						redisResource: ['replicaset'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a Redis replica set',
						action: 'Create a Redis replica set',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a Redis replica set',
						action: 'Get a Redis replica set',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many Redis replica sets',
						action: 'Get many Redis replica sets',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a Redis replica set',
						action: 'Update a Redis replica set',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a Redis replica set',
						action: 'Delete a Redis replica set',
					},
				],
				default: 'create',
			},

			// Redis Snapshot Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['redis'],
						redisResource: ['snapshot'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a Redis snapshot',
						action: 'Create a Redis snapshot',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a Redis snapshot',
						action: 'Get a Redis snapshot',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many Redis snapshots',
						action: 'Get many Redis snapshots',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a Redis snapshot',
						action: 'Delete a Redis snapshot',
					},
					{
						name: 'Restore',
						value: 'restore',
						description: 'Restore Redis replica set from snapshot',
						action: 'Restore Redis replica set from snapshot',
					},
				],
				default: 'create',
			},

			// ====================
			// Common Fields
			// ====================

			// Cluster ID for PostgreSQL cluster operations
		{
			displayName: 'Cluster ID',
			name: 'clusterId',
			type: 'string',
			required: true,
			displayOptions: {
				show: {
					resource: ['postgresql'],
					postgresqlResource: ['cluster'],
					operation: ['get', 'update', 'delete', 'restore'],
				},
			},
			default: '',
			description: 'The unique ID of the PostgreSQL cluster',
		},

		// Cluster ID for MongoDB cluster operations
		{
			displayName: 'Cluster ID',
			name: 'clusterId',
			type: 'string',
			required: true,
			displayOptions: {
				show: {
					resource: ['mongodb'],
					mongodbResource: ['cluster'],
					operation: ['get', 'update', 'delete', 'restore'],
				},
			},
			default: '',
			description: 'The unique ID of the MongoDB cluster',
		},

		// Cluster ID for MariaDB cluster operations
		{
			displayName: 'Cluster ID',
			name: 'clusterId',
			type: 'string',
			required: true,
			displayOptions: {
				show: {
					resource: ['mariadb'],
					mariadbResource: ['cluster'],
					operation: ['get', 'update', 'delete', 'restore'],
				},
			},
			default: '',
			description: 'The unique ID of the MariaDB cluster',
		},

		// Cluster ID for PostgreSQL sub-resources (User, Database, Backup, Log)
		{
			displayName: 'Cluster ID',
			name: 'clusterId',
			type: 'string',
			required: true,
			displayOptions: {
				show: {
					resource: ['postgresql'],
					postgresqlResource: ['user', 'database', 'backup', 'log'],
				},
			},
			default: '',
			description: 'The unique ID of the PostgreSQL cluster',
		},

		// Cluster ID for MongoDB sub-resources (User, Database)
		{
			displayName: 'Cluster ID',
			name: 'clusterId',
			type: 'string',
			required: true,
			displayOptions: {
				show: {
					resource: ['mongodb'],
					mongodbResource: ['user', 'database'],
				},
			},
			default: '',
			description: 'The unique ID of the MongoDB cluster',
		},

			// ReplicaSet ID (for Redis)
			{
				displayName: 'ReplicaSet ID',
				name: 'replicasetId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['redis'],
						redisResource: ['replicaset'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the replica set',
			},

			// Snapshot ID (for Redis)
			{
				displayName: 'Snapshot ID',
				name: 'snapshotId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['redis'],
						redisResource: ['snapshot'],
						operation: ['get', 'delete', 'restore'],
					},
				},
				default: '',
				description: 'The unique ID of the snapshot',
			},

			// Backup ID (for PostgreSQL, MariaDB)
			{
				displayName: 'Backup ID',
				name: 'backupId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						postgresqlResource: ['backup'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The unique ID of the backup',
			},

			{
				displayName: 'Backup ID',
				name: 'backupId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						mariadbResource: ['backup'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The unique ID of the backup',
			},

			// Username (for PostgreSQL, MongoDB users)
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						postgresqlResource: ['user'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The username',
			},

		// Password for PostgreSQL User Update
		{
			displayName: 'New Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			required: true,
			displayOptions: {
				show: {
					resource: ['postgresql'],
					postgresqlResource: ['user'],
					operation: ['update'],
				},
			},
			default: '',
			description: 'The new password for the PostgreSQL user (10-63 characters)',
		},

			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						mongodbResource: ['user'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The username',
			},

		// Password for MongoDB User Update
		{
			displayName: 'New Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			required: true,
			displayOptions: {
				show: {
					resource: ['mongodb'],
					mongodbResource: ['user'],
					operation: ['update'],
				},
			},
			default: '',
			description: 'The new password for the MongoDB user (10-63 characters)',
		},

			// Database Name (for PostgreSQL databases)
			{
				displayName: 'Database Name',
				name: 'databaseName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						postgresqlResource: ['database'],
						operation: ['get', 'delete'],
					},
				},
				default: '',
				description: 'The database name',
			},

			// Display Name (for cluster/replicaset creation)
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
					},
				hide: {
					postgresqlResource: ['user', 'database', 'backup', 'log'],
					mongodbResource: ['user', 'database'],
					mariadbResource: ['backup'],
				},
				},
				default: '',
				description: 'The display name of the cluster/replica set',
			},

			// PostgreSQL Version
			{
				displayName: 'PostgreSQL Version',
				name: 'postgresVersion',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['postgresql'],
						postgresqlResource: ['cluster'],
						operation: ['create'],
					},
				},
				default: '15',
				description: 'The PostgreSQL version (e.g., 12, 13, 14, 15, 16)',
			},

			// MongoDB Version
			{
				displayName: 'MongoDB Version',
				name: 'mongoVersion',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['mongodb'],
						mongodbResource: ['cluster'],
						operation: ['create'],
					},
				},
				default: '6.0',
				description: 'The MongoDB version (e.g., 5.0, 6.0, 7.0)',
		},

		// Template ID - MongoDB only
		{
			displayName: 'Template ID',
			name: 'templateId',
			type: 'string',
			required: true,
			displayOptions: {
				show: {
					resource: ['mongodb'],
					mongodbResource: ['cluster'],
					operation: ['create'],
				},
			},
			default: '',
			placeholder: 'e.g., 6b78d3d3-3381-4493-8c04-76f4f034d20e',
			description: 'The unique ID of the template which specifies cores, storage size, and memory. Use /templates to get available templates.',
			},

			// MariaDB Version
			{
				displayName: 'MariaDB Version',
				name: 'mariadbVersion',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['mariadb'],
						mariadbResource: ['cluster'],
						operation: ['create'],
					},
				},
				default: '10.6',
				description: 'The MariaDB version (e.g., 10.6, 10.11)',
			},

			// Redis Version
			{
				displayName: 'Redis Version',
				name: 'redisVersion',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['redis'],
						redisResource: ['replicaset'],
						operation: ['create'],
					},
				},
				default: '7.2',
				description: 'The Redis version (e.g., 7.0, 7.2)',
			},

			// Instances (for cluster creation)
			{
				displayName: 'Instances',
				name: 'instances',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
					},
					hide: {
						resource: ['redis'],
					postgresqlResource: ['user', 'database', 'backup', 'log'],
					mongodbResource: ['user', 'database'],
					mariadbResource: ['backup'],
					},
				},
				default: 1,
				typeOptions: {
					minValue: 1,
					maxValue: 5,
				},
				description: 'The number of instances in the cluster (1-5)',
			},

			// Replicas (for Redis)
			{
				displayName: 'Replicas',
				name: 'replicas',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['redis'],
						redisResource: ['replicaset'],
						operation: ['create'],
					},
				},
				default: 1,
				typeOptions: {
					minValue: 1,
					maxValue: 5,
				},
				description: 'The number of replicas (1 = standalone, >1 = leader-follower)',
			},

			// Cores
			{
				displayName: 'Cores',
				name: 'cores',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				default: 4,
				description: 'The number of CPU cores (not used for MongoDB - templates control resources)',
			},


			// RAM (in MB) - PostgreSQL & MongoDB
			{
				displayName: 'RAM (MB)',
				name: 'ram',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
					},
					hide: {
						resource: ['mariadb', 'redis'],
					postgresqlResource: ['user', 'database', 'backup', 'log'],
					mongodbResource: ['user', 'database', 'cluster'],
					},
				},
				typeOptions: {
					minValue: 1024,
				},
				default: 4096,
				description: 'The amount of RAM in MB',
			},

			// RAM (in MB) - MariaDB
			{
				displayName: 'RAM (MB)',
				name: 'ram',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['mariadb'],
					mariadbResource: ['cluster'],
					},
				},
				typeOptions: {
					minValue: 1024,
				},
				default: 4096,
				description: 'The amount of RAM in MB',
			},

			// RAM (in MB) - Redis (fixed value)
			{
				displayName: 'RAM (MB)',
				name: 'ram',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['redis'],
					redisResource: ['replicaset'],
					},
				},
				typeOptions: {
					minValue: 256,
					maxValue: 256,
				},
				default: 256,
				description: 'The amount of RAM in MB (fixed at 256 MB for Redis)',
			},

			// Storage Size (in MB) - PostgreSQL & MongoDB
			{
				displayName: 'Storage Size (MB)',
				name: 'storageSize',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
					},
					hide: {
						resource: ['redis', 'mariadb'],
					postgresqlResource: ['user', 'database', 'backup', 'log'],
					mongodbResource: ['user', 'database', 'cluster'],
					},
				},
				typeOptions: {
					minValue: 5120,
				},
				default: 20480,
				description: 'The storage size in MB',
			},

			// Storage Size (in MB) - MariaDB (min 10 GB)
			{
				displayName: 'Storage Size (MB)',
				name: 'storageSize',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['mariadb'],
					mariadbResource: ['cluster'],
					},
				},
				typeOptions: {
					minValue: 10240,
				},
				default: 10240,
				description: 'The storage size in MB (min 10 GB / 10240 MB)',
			},

			// Location
			{
				displayName: 'Location',
				name: 'location',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						operation: ['create', 'get', 'getMany', 'update', 'delete'],
					},
				hide: {
					postgresqlResource: ['user', 'database', 'backup', 'log'],
					mongodbResource: ['user', 'database'],
					mariadbResource: ['backup'],
				},
				},
				options: [
				{
					name: 'Frankfurt, Germany (de/fra)',
					value: 'de/fra',
				},
				{
					name: 'Frankfurt 2, Germany (de/fra/2)',
					value: 'de/fra/2',
				},
				{
					name: 'Berlin, Germany (de/txl)',
					value: 'de/txl',
				},
				{
					name: 'Logroño, Spain (es/vit)',
					value: 'es/vit',
				},
				{
					name: 'Paris, France (fr/par)',
					value: 'fr/par',
				},
				{
					name: 'Birmingham, UK (gb/bhx)',
					value: 'gb/bhx',
				},
				{
					name: 'London, UK (gb/lhr)',
					value: 'gb/lhr',
				},
				{
					name: 'Newark, USA (us/ewr)',
					value: 'us/ewr',
				},
				{
					name: 'Las Vegas, USA (us/las)',
					value: 'us/las',
				},
				{
					name: 'Lenexa, USA (us/mci)',
					value: 'us/mci',
				},
				],
				default: 'de/fra',
				description: 'The location/region for the database',
			},

		// Storage Type (PostgreSQL & MongoDB only)
		{
			displayName: 'Storage Type',
			name: 'storageType',
			type: 'options',
			required: true,
			displayOptions: {
				show: {
					operation: ['create'],
				},
				hide: {
					resource: ['mariadb', 'redis'],
				postgresqlResource: ['user', 'database', 'backup', 'log'],
				mongodbResource: ['user', 'database', 'cluster'],
				},
			},
			options: [
				{
					name: 'HDD',
					value: 'HDD',
				},
				{
					name: 'SSD Standard',
					value: 'SSD Standard',
				},
				{
					name: 'SSD Premium',
					value: 'SSD Premium',
				},
			],
			default: 'SSD Standard',
			description: 'The storage type for the database cluster',
		},


		// Initial Username (Credentials) - PostgreSQL Cluster only
		{
			displayName: 'Username',
			name: 'credentialsUsername',
			type: 'string',
			required: true,
			displayOptions: {
				show: {
					resource: ['postgresql'],
					postgresqlResource: ['cluster'],
					operation: ['create'],
				},
			},
			default: '',
			placeholder: 'admin',
			description: 'The initial username for database access',
		},

		// Initial Password (Credentials) - PostgreSQL Cluster only
		{
			displayName: 'Password',
			name: 'credentialsPassword',
			type: 'string',
			required: true,
			typeOptions: {
				password: true,
			},
			displayOptions: {
				show: {
					resource: ['postgresql'],
					postgresqlResource: ['cluster'],
					operation: ['create'],
				},
			},
			default: '',
			description: 'The initial password for database access (min 10 characters)',
		},

// Initial Username (Credentials) - MariaDB Cluster only
		{
			displayName: 'Username',
			name: 'credentialsUsername',
			type: 'string',
			required: true,
			displayOptions: {
				show: {
					resource: ['mariadb'],
					mariadbResource: ['cluster'],
					operation: ['create'],
				},
			},
			default: '',
			placeholder: 'admin',
			description: 'The initial username for database access',
		},

		// Initial Password (Credentials) - MariaDB Cluster only
		{
			displayName: 'Password',
			name: 'credentialsPassword',
			type: 'string',
			required: true,
			typeOptions: {
				password: true,
			},
			displayOptions: {
				show: {
					resource: ['mariadb'],
					mariadbResource: ['cluster'],
					operation: ['create'],
				},
			},
			default: '',
			description: 'The initial password for database access (min 10 characters)',
		},

// Initial Username (Credentials) - Redis ReplicaSet only
		{
			displayName: 'Username',
			name: 'credentialsUsername',
			type: 'string',
			required: true,
			displayOptions: {
				show: {
					resource: ['redis'],
					redisResource: ['replicaset'],
					operation: ['create'],
				},
			},
			default: '',
			description: 'The initial username for database access',
		},

		// Initial Password (Credentials) - Redis ReplicaSet only
		{
			displayName: 'Password',
			name: 'credentialsPassword',
			type: 'string',
			typeOptions: {
				password: true,
			},
			required: true,
			displayOptions: {
				show: {
					resource: ['redis'],
					redisResource: ['replicaset'],
					operation: ['create'],
				},
			},
			default: '',
			description: 'The initial password for database access (min 10 characters)',
		},

		// Synchronization Mode (PostgreSQL only)
		{
			displayName: 'Synchronization Mode',
			name: 'synchronizationMode',
			type: 'options',
			required: true,
			displayOptions: {
				show: {
					resource: ['postgresql'],
					postgresqlResource: ['cluster'],
					operation: ['create'],
				},
			},
			options: [
				{
					name: 'Asynchronous',
					value: 'ASYNCHRONOUS',
					description: 'Asynchronous replication - faster but may lose data on failure',
				},
				{
					name: 'Synchronous',
					value: 'SYNCHRONOUS',
					description: 'Synchronous replication - balanced performance and durability',
				},
				{
					name: 'Strictly Synchronous',
					value: 'STRICTLY_SYNCHRONOUS',
					description: 'Strictly synchronous - highest durability but slower',
				},
			],
			default: 'ASYNCHRONOUS',
			description: 'The synchronization mode for PostgreSQL replication',
		},

	// Synchronization Mode (MariaDB only)
		{
			displayName: 'Synchronization Mode',
			name: 'synchronizationMode',
			type: 'options',
			required: true,
			displayOptions: {
				show: {
					resource: ['mariadb'],
					mariadbResource: ['cluster'],
					operation: ['create'],
				},
			},
			options: [
				{
					name: 'Asynchronous',
					value: 'ASYNCHRONOUS',
					description: 'Asynchronous replication',
				},
				{
					name: 'Synchronous',
					value: 'SYNCHRONOUS',
					description: 'Synchronous replication',
				},
				{
					name: 'Strictly Synchronous',
					value: 'STRICTLY_SYNCHRONOUS',
					description: 'Strictly synchronous replication',
				},
			],
			default: 'ASYNCHRONOUS',
			description: 'The synchronization mode for MariaDB replication',
		},

			// Connections (for PostgreSQL, MariaDB & Redis cluster creation - with CIDR)
			{
				displayName: 'Connections',
				name: 'connections',
				type: 'fixedCollection',
			required: true,
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: {
					show: {
						resource: ['postgresql', 'mariadb', 'redis'],
						operation: ['create'],
					},
					hide: {
					postgresqlResource: ['user', 'database', 'backup', 'log'],
					mariadbResource: ['backup'],
					redisResource: ['snapshot'],
					},
				},
				default: {},
				placeholder: 'Add Connection',
				options: [
					{
						displayName: 'Connection',
						name: 'connectionValues',
						values: [
							{
								displayName: 'Datacenter ID',
								name: 'datacenterId',
								type: 'string',
								default: '',
								description: 'The datacenter ID to connect to',
							},
							{
								displayName: 'LAN ID',
								name: 'lanId',
								type: 'string',
								default: '',
								description: 'The LAN ID to connect to',
							},
							{
								displayName: 'CIDR',
								name: 'cidr',
								type: 'string',
								default: '',
								placeholder: '192.168.1.0/24',
								description: 'The IP and subnet in CIDR notation',
							},
						],
					},
				],
			},

			// Connections (for MongoDB cluster creation - with cidrList)
			{
				displayName: 'Connections',
				name: 'connections',
				type: 'fixedCollection',
			required: true,
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: {
					show: {
						resource: ['mongodb'],
						mongodbResource: ['cluster'],
						operation: ['create'],
					},
				},
				default: {},
				placeholder: 'Add Connection',
				options: [
					{
						displayName: 'Connection',
						name: 'connectionValues',
						values: [
							{
								displayName: 'Datacenter ID',
								name: 'datacenterId',
								type: 'string',
								default: '',
								description: 'The datacenter ID to connect to',
							},
							{
								displayName: 'LAN ID',
								name: 'lanId',
								type: 'string',
								default: '',
								description: 'The LAN ID to connect to',
							},
							{
								displayName: 'CIDR List',
								name: 'cidrList',
								type: 'string',
								default: '',
								placeholder: '192.168.1.1,192.168.1.2,192.168.1.3',
								description: 'Comma-separated list of IPs for your cluster. Must provide as many IPs as instances. All IPs must be in a /24 network.',
							},
						],
					},
				],
			},

			// Additional Fields for Update - PostgreSQL
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['postgresql'],
						postgresqlResource: ['cluster'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Display Name',
						name: 'displayName',
						type: 'string',
						default: '',
						description: 'The new display name',
					},
					{
						displayName: 'Instances',
						name: 'instances',
						type: 'number',
						default: 1,
						description: 'The new number of instances',
					},
					{
						displayName: 'Cores',
						name: 'cores',
						type: 'number',
						default: 4,
						description: 'The new number of CPU cores',
					},
					{
						displayName: 'RAM (MB)',
						name: 'ram',
						type: 'number',
						default: 4096,
						description: 'The new amount of RAM in MB',
					},
					{
						displayName: 'Storage Size (MB)',
						name: 'storageSize',
						type: 'number',
						default: 20480,
						description: 'The new storage size in MB',
					},
				],
			},

			// Additional Fields for Update - MongoDB
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['mongodb'],
						mongodbResource: ['cluster'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Display Name',
						name: 'displayName',
						type: 'string',
						default: '',
						description: 'The new display name',
					},
					{
						displayName: 'Instances',
						name: 'instances',
						type: 'number',
						default: 1,
						description: 'The new number of instances',
					},
				],
			},

			// Additional Fields for Update - MariaDB
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['mariadb'],
						mariadbResource: ['cluster'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Display Name',
						name: 'displayName',
						type: 'string',
						default: '',
						description: 'The new display name',
					},
					{
						displayName: 'Instances',
						name: 'instances',
						type: 'number',
						default: 1,
						description: 'The new number of instances',
					},
					{
						displayName: 'Cores',
						name: 'cores',
						type: 'number',
						default: 4,
						description: 'The new number of CPU cores',
					},
					{
						displayName: 'RAM (MB)',
						name: 'ram',
						type: 'number',
						default: 4096,
						description: 'The new amount of RAM in MB',
					},
					{
						displayName: 'Storage Size (MB)',
						name: 'storageSize',
						type: 'number',
						default: 20480,
						description: 'The new storage size in MB',
					},
				],
			},

			// Additional Fields for Update - Redis
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['redis'],
						redisResource: ['replicaset'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Display Name',
						name: 'displayName',
						type: 'string',
						default: '',
						description: 'The new display name',
					},
					{
						displayName: 'Replicas',
						name: 'replicas',
						type: 'number',
						default: 1,
						description: 'The new number of replicas',
					},
					{
						displayName: 'Cores',
						name: 'cores',
						type: 'number',
						default: 4,
						description: 'The new number of CPU cores',
					},
					{
						displayName: 'RAM (MB)',
						name: 'ram',
						type: 'number',
						default: 256,
						description: 'The new amount of RAM in MB',
					},
				],
			},


			// User Creation Fields - PostgreSQL
			{
				displayName: 'Username',
				name: 'newUsername',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
						postgresqlResource: ['user'],
					},
				},
				default: '',
				description: 'The username for the new PostgreSQL user',
			},

			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
						postgresqlResource: ['user'],
					},
				},
				default: '',
				description: 'The password for the new PostgreSQL user',
			},

			// User Creation Fields - MongoDB
			{
				displayName: 'Username',
				name: 'newUsername',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
						mongodbResource: ['user'],
					},
				},
				default: '',
				description: 'The username for the new MongoDB user',
			},

			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
						mongodbResource: ['user'],
					},
				},
				default: '',
				description: 'The password for the new MongoDB user',
			},

			// Database Name (for creation)
			{
				displayName: 'Database Name',
				name: 'newDatabaseName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						postgresqlResource: ['database'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name for the new database',
			},

			{
				displayName: 'Owner',
				name: 'owner',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						postgresqlResource: ['database'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The owner username for the new database',
			},

			// Backup Restore ID
			{
				displayName: 'Backup ID',
				name: 'restoreBackupId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['restore'],
					},
					hide: {
						resource: ['redis'],
					},
				},
				default: '',
				description: 'The backup ID to restore from',
			},

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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = []

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ====================
				// PostgreSQL
				// ====================
				if (resource === 'postgresql') {
					const postgresqlResource = this.getNodeParameter('postgresqlResource', i) as string;
					const baseUrl = 'https://api.ionos.com/databases/postgresql';

					if (postgresqlResource === 'cluster') {
						if (operation === 'create') {
							const displayName = this.getNodeParameter('displayName', i) as string;
							const postgresVersion = this.getNodeParameter('postgresVersion', i) as string;
							const instances = this.getNodeParameter('instances', i) as number;
							const cores = this.getNodeParameter('cores', i, 4) as number;
							const ram = this.getNodeParameter('ram', i) as number;
							const storageSize = this.getNodeParameter('storageSize', i) as number;
							const location = this.getNodeParameter('location', i) as string;
							const connections = this.getNodeParameter('connections', i) as IDataObject;
						const storageType = this.getNodeParameter('storageType', i) as string;
						const credentialsUsername = this.getNodeParameter('credentialsUsername', i) as string;
						const credentialsPassword = this.getNodeParameter('credentialsPassword', i) as string;
						const synchronizationMode = this.getNodeParameter('synchronizationMode', i) as string;

							const body: IDataObject = {
								properties: {
									displayName,
									postgresVersion,
									instances,
									cores,
									ram,
									storageSize,
									location,
								storageType,
								synchronizationMode,
								credentials: {
									username: credentialsUsername,
									password: credentialsPassword,
								},
								},
							};

							if (connections.connectionValues) {
								const conn = connections.connectionValues as IDataObject;
								(body.properties as IDataObject).connections = [{
									datacenterId: conn.datacenterId,
									lanId: conn.lanId,
									cidr: conn.cidr,
								}];
							}

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'POST',
									url: `${baseUrl}/clusters`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						} else if (operation === 'get') {
							const clusterId = this.getNodeParameter('clusterId', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/clusters/${clusterId}`,
								},
							);
						} else if (operation === 'getMany') {
							const returnAll = this.getNodeParameter('returnAll', i);
							const limit = this.getNodeParameter('limit', i, 50) as number;

							const qs: IDataObject = {};
							if (!returnAll) {
								qs.limit = limit;
							}

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/clusters`,
									qs,
								},
							);

							responseData = (responseData as IDataObject).items as IDataObject[];
						} else if (operation === 'update') {
							const clusterId = this.getNodeParameter('clusterId', i) as string;
							const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

							const body: IDataObject = {
								properties: updateFields,
							};

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'PATCH',
									url: `${baseUrl}/clusters/${clusterId}`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						} else if (operation === 'delete') {
							const clusterId = this.getNodeParameter('clusterId', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'DELETE',
									url: `${baseUrl}/clusters/${clusterId}`,
								},
							);

							responseData = { success: true };
						} else if (operation === 'restore') {
							const clusterId = this.getNodeParameter('clusterId', i) as string;
							const restoreBackupId = this.getNodeParameter('restoreBackupId', i) as string;

							const body: IDataObject = {
								backupId: restoreBackupId,
							};

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'POST',
									url: `${baseUrl}/clusters/${clusterId}/restore`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						}
					} else if (postgresqlResource === 'user') {
						const clusterId = this.getNodeParameter('clusterId', i) as string;

						if (operation === 'create') {
							const newUsername = this.getNodeParameter('newUsername', i) as string;
							const password = this.getNodeParameter('password', i) as string;

							const body: IDataObject = {
								properties: {
									username: newUsername,
									password,
								},
							};

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'POST',
									url: `${baseUrl}/clusters/${clusterId}/users`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						} else if (operation === 'get') {
							const username = this.getNodeParameter('username', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/clusters/${clusterId}/users/${username}`,
								},
							);
						} else if (operation === 'getMany') {
							const returnAll = this.getNodeParameter('returnAll', i);
							const limit = this.getNodeParameter('limit', i, 50) as number;

							const qs: IDataObject = {};
							if (!returnAll) {
								qs.limit = limit;
							}

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/clusters/${clusterId}/users`,
									qs,
								},
							);

							responseData = (responseData as IDataObject).items as IDataObject[];
						} else if (operation === 'update') {
							const username = this.getNodeParameter('username', i) as string;
							const password = this.getNodeParameter('password', i) as string;

							const body: IDataObject = {
								properties: {
									password,
								},
							};

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'PATCH',
									url: `${baseUrl}/clusters/${clusterId}/users/${username}`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						} else if (operation === 'delete') {
							const username = this.getNodeParameter('username', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'DELETE',
									url: `${baseUrl}/clusters/${clusterId}/users/${username}`,
								},
							);

							responseData = { success: true };
						}
					} else if (postgresqlResource === 'database') {
						const clusterId = this.getNodeParameter('clusterId', i) as string;

						if (operation === 'create') {
							const newDatabaseName = this.getNodeParameter('newDatabaseName', i) as string;
							const owner = this.getNodeParameter('owner', i) as string;

							const body: IDataObject = {
								properties: {
									name: newDatabaseName,
									owner,
								},
							};

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'POST',
									url: `${baseUrl}/clusters/${clusterId}/databases`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						} else if (operation === 'get') {
							const databaseName = this.getNodeParameter('databaseName', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/clusters/${clusterId}/databases/${databaseName}`,
								},
							);
						} else if (operation === 'getMany') {
							const returnAll = this.getNodeParameter('returnAll', i);
							const limit = this.getNodeParameter('limit', i, 50) as number;

							const qs: IDataObject = {};
							if (!returnAll) {
								qs.limit = limit;
							}

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/clusters/${clusterId}/databases`,
									qs,
								},
							);

							responseData = (responseData as IDataObject).items as IDataObject[];
						} else if (operation === 'delete') {
							const databaseName = this.getNodeParameter('databaseName', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'DELETE',
									url: `${baseUrl}/clusters/${clusterId}/databases/${databaseName}`,
								},
							);

							responseData = { success: true };
						}
					} else if (postgresqlResource === 'backup') {
						if (operation === 'get') {
							const backupId = this.getNodeParameter('backupId', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/clusters/backups/${backupId}`,
								},
							);
						} else if (operation === 'getMany') {
							const returnAll = this.getNodeParameter('returnAll', i);
							const limit = this.getNodeParameter('limit', i, 50) as number;

							const qs: IDataObject = {};
							if (!returnAll) {
								qs.limit = limit;
							}

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/clusters/backups`,
									qs,
								},
							);

							responseData = (responseData as IDataObject).items as IDataObject[];
						}
					} else if (postgresqlResource === 'log') {
						const clusterId = this.getNodeParameter('clusterId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/clusters/${clusterId}/logs`,
							},
						);
					}
				}

				// ====================
				// MongoDB
				// ====================
				else if (resource === 'mongodb') {
					const mongodbResource = this.getNodeParameter('mongodbResource', i) as string;
					const baseUrl = 'https://api.ionos.com/databases/mongodb';

					if (mongodbResource === 'cluster') {
						if (operation === 'create') {
							const displayName = this.getNodeParameter('displayName', i) as string;
							const mongoVersion = this.getNodeParameter('mongoVersion', i) as string;
							const templateId = this.getNodeParameter('templateId', i) as string;
							const instances = this.getNodeParameter('instances', i) as number;
							const location = this.getNodeParameter('location', i) as string;
							const connections = this.getNodeParameter('connections', i) as IDataObject;

							const body: IDataObject = {
								properties: {
									displayName,
									mongoDBVersion: mongoVersion,
									templateID: templateId,
									instances,
									location,
								},
							};

							if (connections.connectionValues) {
								const conn = connections.connectionValues as IDataObject;
								const cidrListString = conn.cidrList as string;
								const cidrList = cidrListString.split(',').map(ip => ip.trim());

								(body.properties as IDataObject).connections = [{
									datacenterId: conn.datacenterId,
									lanId: conn.lanId,
									cidrList: cidrList,
								}];
							}

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'POST',
									url: `${baseUrl}/clusters`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						} else if (operation === 'get') {
							const clusterId = this.getNodeParameter('clusterId', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/clusters/${clusterId}`,
								},
							);
						} else if (operation === 'getMany') {
							const returnAll = this.getNodeParameter('returnAll', i);
							const limit = this.getNodeParameter('limit', i, 50) as number;

							const qs: IDataObject = {};
							if (!returnAll) {
								qs.limit = limit;
							}

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/clusters`,
									qs,
								},
							);

							responseData = (responseData as IDataObject).items as IDataObject[];
						} else if (operation === 'update') {
							const clusterId = this.getNodeParameter('clusterId', i) as string;
							const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

							const body: IDataObject = {
								properties: updateFields,
							};

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'PATCH',
									url: `${baseUrl}/clusters/${clusterId}`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						} else if (operation === 'delete') {
							const clusterId = this.getNodeParameter('clusterId', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'DELETE',
									url: `${baseUrl}/clusters/${clusterId}`,
								},
							);

							responseData = { success: true };
						} else if (operation === 'restore') {
							const clusterId = this.getNodeParameter('clusterId', i) as string;
							const restoreBackupId = this.getNodeParameter('restoreBackupId', i) as string;

							const body: IDataObject = {
								snapshotId: restoreBackupId,
							};

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'POST',
									url: `${baseUrl}/clusters/${clusterId}/restore`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						}
					} else if (mongodbResource === 'user') {
						const clusterId = this.getNodeParameter('clusterId', i) as string;

						if (operation === 'create') {
							const newUsername = this.getNodeParameter('newUsername', i) as string;
							const password = this.getNodeParameter('password', i) as string;

							const body: IDataObject = {
								properties: {
									username: newUsername,
									password,
								},
							};

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'POST',
									url: `${baseUrl}/clusters/${clusterId}/users`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						} else if (operation === 'get') {
							const username = this.getNodeParameter('username', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/clusters/${clusterId}/users/${username}`,
								},
							);
						} else if (operation === 'getMany') {
							const returnAll = this.getNodeParameter('returnAll', i);
							const limit = this.getNodeParameter('limit', i, 50) as number;

							const qs: IDataObject = {};
							if (!returnAll) {
								qs.limit = limit;
							}

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/clusters/${clusterId}/users`,
									qs,
								},
							);

							responseData = (responseData as IDataObject).items as IDataObject[];
						} else if (operation === 'update') {
							const username = this.getNodeParameter('username', i) as string;
							const password = this.getNodeParameter('password', i) as string;

							const body: IDataObject = {
								properties: {
									password,
								},
							};

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'PATCH',
									url: `${baseUrl}/clusters/${clusterId}/users/${username}`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						} else if (operation === 'delete') {
							const username = this.getNodeParameter('username', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'DELETE',
									url: `${baseUrl}/clusters/${clusterId}/users/${username}`,
								},
							);

							responseData = { success: true };
						}
					} else if (mongodbResource === 'snapshot') {
						const clusterId = this.getNodeParameter('clusterId', i) as string;

						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const qs: IDataObject = {};
						if (!returnAll) {
							qs.limit = limit;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/clusters/${clusterId}/snapshots`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (mongodbResource === 'template') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const qs: IDataObject = {};
						if (!returnAll) {
							qs.limit = limit;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/templates`,
								qs,
							},
						);

						responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (mongodbResource === 'log') {
						const clusterId = this.getNodeParameter('clusterId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/clusters/${clusterId}/logs`,
							},
						);
					}
				}

				// ====================
				// MariaDB
				// ====================
				else if (resource === 'mariadb') {
					const mariadbResource = this.getNodeParameter('mariadbResource', i) as string;
					const location = this.getNodeParameter('location', i, 'de/fra') as string;
					const baseUrl = `https://mariadb.${location.replace(/\//g, '-')}.ionos.com`;

					if (mariadbResource === 'cluster') {
						if (operation === 'create') {
							const displayName = this.getNodeParameter('displayName', i) as string;
							const mariadbVersion = this.getNodeParameter('mariadbVersion', i) as string;
							const instances = this.getNodeParameter('instances', i) as number;
							const cores = this.getNodeParameter('cores', i, 4) as number;
							const ramMB = this.getNodeParameter('ram', i) as number;
							const storageSizeMB = this.getNodeParameter('storageSize', i) as number;
							const connections = this.getNodeParameter('connections', i) as IDataObject;
						const credentialsUsername = this.getNodeParameter('credentialsUsername', i) as string;
						const credentialsPassword = this.getNodeParameter('credentialsPassword', i) as string;
						const synchronizationMode = this.getNodeParameter('synchronizationMode', i) as string;

							// Convert MB to GB for MariaDB API
							const ram = Math.round(ramMB / 1024);
							const storageSize = Math.round(storageSizeMB / 1024);

							const body: IDataObject = {
								properties: {
									displayName,
									mariadbVersion,
									instances,
									cores,
									ram,
									storageSize,
								synchronizationMode,
								credentials: {
									username: credentialsUsername,
									password: credentialsPassword,
								},
								},
							};

							if (connections.connectionValues) {
								const conn = connections.connectionValues as IDataObject;
								(body.properties as IDataObject).connections = [{
									datacenterId: conn.datacenterId,
									lanId: conn.lanId,
									cidr: conn.cidr,
								}];
							}

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'POST',
									url: `${baseUrl}/clusters`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						} else if (operation === 'get') {
							const clusterId = this.getNodeParameter('clusterId', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/clusters/${clusterId}`,
								},
							);
						} else if (operation === 'getMany') {
							const returnAll = this.getNodeParameter('returnAll', i);
							const limit = this.getNodeParameter('limit', i, 50) as number;

							const qs: IDataObject = {};
							if (!returnAll) {
								qs.limit = limit;
							}

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/clusters`,
									qs,
								},
							);

							responseData = (responseData as IDataObject).items as IDataObject[];
						} else if (operation === 'update') {
							const clusterId = this.getNodeParameter('clusterId', i) as string;
							const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

							// Convert MB to GB for MariaDB API and filter out empty values
							const properties: IDataObject = {};
							for (const [key, value] of Object.entries(updateFields)) {
								if (value !== '' && value !== null && value !== undefined) {
									if (key === 'ram' && typeof value === 'number') {
										properties[key] = Math.round(value / 1024);
									} else if (key === 'storageSize' && typeof value === 'number') {
										properties[key] = Math.round(value / 1024);
									} else {
										properties[key] = value;
									}
								}
							}

							const body: IDataObject = {
								properties,
							};

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'PATCH',
									url: `${baseUrl}/clusters/${clusterId}`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						} else if (operation === 'delete') {
							const clusterId = this.getNodeParameter('clusterId', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'DELETE',
									url: `${baseUrl}/clusters/${clusterId}`,
								},
							);

							responseData = { success: true };
						} else if (operation === 'restore') {
							const clusterId = this.getNodeParameter('clusterId', i) as string;
							const restoreBackupId = this.getNodeParameter('restoreBackupId', i) as string;

							const body: IDataObject = {
								backupId: restoreBackupId,
							};

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'POST',
									url: `${baseUrl}/clusters/${clusterId}/restore`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						}
					} else if (mariadbResource === 'backup') {
						if (operation === 'get') {
							const backupId = this.getNodeParameter('backupId', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/backups/${backupId}`,
								},
							);
						} else if (operation === 'getMany') {
							const returnAll = this.getNodeParameter('returnAll', i);
							const limit = this.getNodeParameter('limit', i, 50) as number;

							const qs: IDataObject = {};
							if (!returnAll) {
								qs.limit = limit;
							}

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/backups`,
									qs,
								},
							);

							responseData = (responseData as IDataObject).items as IDataObject[];
						}
					}
				}

				// ====================
				// Redis
				// ====================
				else if (resource === 'redis') {
					const redisResource = this.getNodeParameter('redisResource', i) as string;
					const location = this.getNodeParameter('location', i, 'de/fra') as string;
					const baseUrl = `https://in-memory-db.${location.replace(/\//g, '-')}.ionos.com`;

					if (redisResource === 'replicaset') {
						if (operation === 'create') {
							const displayName = this.getNodeParameter('displayName', i) as string;
							const redisVersion = this.getNodeParameter('redisVersion', i) as string;
							const replicas = this.getNodeParameter('replicas', i) as number;
							const cores = this.getNodeParameter('cores', i, 4) as number;
							const ram = this.getNodeParameter('ram', i) as number;
							const connections = this.getNodeParameter('connections', i) as IDataObject;
							const credentialsUsername = this.getNodeParameter('credentialsUsername', i) as string;
							const credentialsPassword = this.getNodeParameter('credentialsPassword', i) as string;

							const body: IDataObject = {
								properties: {
									displayName,
									version: redisVersion,
									replicas,
									resources: {
										cores,
										ram,
									},
									credentials: {
										username: credentialsUsername,
										password: credentialsPassword,
									},
								},
							};

							if (connections.connectionValues) {
								const conn = connections.connectionValues as IDataObject;
								(body.properties as IDataObject).connections = [{
									datacenterId: conn.datacenterId,
									lanId: conn.lanId,
									cidr: conn.cidr,
								}];
							}

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'POST',
									url: `${baseUrl}/replicasets`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						} else if (operation === 'get') {
							const replicasetId = this.getNodeParameter('replicasetId', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/replicasets/${replicasetId}`,
								},
							);
						} else if (operation === 'getMany') {
							const returnAll = this.getNodeParameter('returnAll', i);
							const limit = this.getNodeParameter('limit', i, 50) as number;

							const qs: IDataObject = {};
							if (!returnAll) {
								qs.limit = limit;
							}

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/replicasets`,
									qs,
								},
							);

							responseData = (responseData as IDataObject).items as IDataObject[];
					} else if (operation === 'update') {
						const replicasetId = this.getNodeParameter('replicasetId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						// First, GET the current replicaset configuration
						const currentReplicaset = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'GET',
								url: `${baseUrl}/replicasets/${replicasetId}`,
							},
						) as IDataObject;

						// Merge updateFields with current properties
						const properties = (currentReplicaset.properties || {}) as IDataObject;
						const resources = (properties.resources || {}) as IDataObject;

						// Update the fields
						for (const [key, value] of Object.entries(updateFields)) {
							if (value !== '' && value !== null && value !== undefined) {
								if (key === 'cores' || key === 'ram') {
									resources[key] = value;
								} else {
									properties[key] = value;
								}
							}
						}


						// Remove credentials from properties (write-only, cannot be updated)
						delete properties.credentials;
						// Update resources in properties
						properties.resources = resources;

						// PUT requires the complete replicaset structure
						const body: IDataObject = {
							id: currentReplicaset.id,
							metadata: currentReplicaset.metadata || {},
							properties,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'ionosCloud',
							{
								method: 'PUT',
								url: `${baseUrl}/replicasets/${replicasetId}`,
								body,
								headers: { 'Content-Type': 'application/json' },
							},
						);
						} else if (operation === 'delete') {
							const replicasetId = this.getNodeParameter('replicasetId', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'DELETE',
									url: `${baseUrl}/replicasets/${replicasetId}`,
								},
							);

							responseData = { success: true };
						}
					} else if (redisResource === 'snapshot') {
						if (operation === 'create') {
							const displayName = this.getNodeParameter('displayName', i) as string;
							const replicasetId = this.getNodeParameter('replicasetId', i) as string;

							const body: IDataObject = {
								properties: {
									displayName,
									replicasetId,
								},
							};

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'POST',
									url: `${baseUrl}/snapshots`,
									body,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						} else if (operation === 'get') {
							const snapshotId = this.getNodeParameter('snapshotId', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/snapshots/${snapshotId}`,
								},
							);
						} else if (operation === 'getMany') {
							const returnAll = this.getNodeParameter('returnAll', i);
							const limit = this.getNodeParameter('limit', i, 50) as number;

							const qs: IDataObject = {};
							if (!returnAll) {
								qs.limit = limit;
							}

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'GET',
									url: `${baseUrl}/snapshots`,
									qs,
								},
							);

							responseData = (responseData as IDataObject).items as IDataObject[];
						} else if (operation === 'delete') {
							const snapshotId = this.getNodeParameter('snapshotId', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'DELETE',
									url: `${baseUrl}/snapshots/${snapshotId}`,
								},
							);

							responseData = { success: true };
						} else if (operation === 'restore') {
							const snapshotId = this.getNodeParameter('snapshotId', i) as string;

							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'ionosCloud',
								{
									method: 'POST',
									url: `${baseUrl}/snapshots/${snapshotId}/restores`,
									headers: { 'Content-Type': 'application/json' },
								},
							);
						}
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
