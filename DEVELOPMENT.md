# Guide de Développement - n8n-nodes-ionos

## Installation et Configuration

### Prérequis
- Node.js >= 18.10
- npm ou pnpm

### Installation des dépendances
```bash
npm install
```

### Compilation
```bash
# Build une fois
npm run build

# Mode développement avec watch
npm run dev
```

## Structure du Projet

```
n8n-nodes-ionos/
├── credentials/
│   └── IonosApi.credentials.ts    # Configuration d'authentification
├── nodes/
│   └── Ionos/
│       ├── IonosDns.node.ts       # Nœud DNS (zones et records)
│       ├── IonosDomain.node.ts    # Nœud Domain (domaines et contacts)
│       └── ionos.svg              # Icône IONOS
├── dist/                          # Fichiers compilés
├── package.json
├── tsconfig.json
├── README.md                      # Documentation principale
├── DEVELOPMENT.md                 # Guide développeur
└── EXAMPLES.md                    # Exemples d'utilisation
```

## Test du Nœud en Local

### Option 1: Lien npm
```bash
# Dans le dossier n8n-nodes-ionos
npm run build
npm link

# Dans votre installation n8n
cd ~/.n8n
npm link n8n-nodes-ionos

# Redémarrer n8n
n8n start
```

### Option 2: Installation directe
```bash
# Depuis votre dossier n8n
npm install /chemin/vers/n8n-nodes-ionos
```

### Option 3: Développement avec n8n
```bash
# Installer n8n globalement si ce n'est pas déjà fait
npm install n8n -g

# Lancer n8n avec le nœud custom
export N8N_CUSTOM_EXTENSIONS="/chemin/vers/n8n-nodes-ionos"
n8n start
```

## Configuration des Credentials IONOS

1. Dans n8n, allez dans **Credentials** > **New**
2. Cherchez **IONOS API**
3. Choisissez votre méthode d'authentification:
   - **API Key**: Entrez votre clé API IONOS
   - **API Prefix + Secret**: Entrez votre prefix et secret

### Obtenir vos identifiants IONOS

1. Connectez-vous à votre compte IONOS
2. Allez dans les paramètres API
3. Générez une nouvelle clé API ou récupérez votre prefix/secret

## Utilisation du Nœud DNS

### Gestion des Zones

#### Créer une zone
- **Resource**: Zone
- **Operation**: Create
- **Zone Name**: example.com
- **Type**: NATIVE/MASTER/SLAVE

#### Lister les zones
- **Resource**: Zone
- **Operation**: Get Many
- **Return All**: true/false

#### Mettre à jour une zone
- **Resource**: Zone
- **Operation**: Update
- **Zone ID**: l'ID de la zone
- **Update Fields**: champs à modifier

#### Supprimer une zone
- **Resource**: Zone
- **Operation**: Delete
- **Zone ID**: l'ID de la zone

### Gestion des Enregistrements DNS

#### Créer un enregistrement
- **Resource**: Record
- **Zone ID**: l'ID de la zone parente
- **Operation**: Create
- **Record Name**: www
- **Record Type**: A/AAAA/CNAME/MX/TXT/SRV/NS/CAA
- **Content**: 192.168.1.1 (ou autre valeur selon le type)
- **Additional Fields**:
  - TTL: 3600
  - Priority: 10 (pour MX/SRV)
  - Disabled: false

#### Lister les enregistrements
- **Resource**: Record
- **Zone ID**: l'ID de la zone
- **Operation**: Get Many

#### Mettre à jour un enregistrement
- **Resource**: Record
- **Zone ID**: l'ID de la zone
- **Operation**: Update
- **Record ID**: l'ID de l'enregistrement
- **Update Fields**: champs à modifier

#### Supprimer un enregistrement
- **Resource**: Record
- **Zone ID**: l'ID de la zone
- **Operation**: Delete
- **Record ID**: l'ID de l'enregistrement

## Utilisation du Nœud Domain

### Gestion des Domaines

#### Vérifier la disponibilité d'un domaine
- **Resource**: Domain
- **Operation**: Check Availability
- **Domain Name**: example.com

#### Enregistrer un domaine
- **Resource**: Domain
- **Operation**: Register
- **Domain Name**: example.com
- **Registration Details**:
  - Period: 1-10 ans
  - Owner Contact ID: ID du contact propriétaire
  - Admin Contact ID: ID du contact administrateur
  - Tech Contact ID: ID du contact technique
  - Nameservers: ns1.example.com,ns2.example.com
  - Auto Renew: true/false

#### Lister les domaines
- **Resource**: Domain
- **Operation**: Get Many
- **Return All**: true/false

#### Obtenir les détails d'un domaine
- **Resource**: Domain
- **Operation**: Get
- **Domain ID**: l'ID du domaine

#### Mettre à jour un domaine
- **Resource**: Domain
- **Operation**: Update
- **Domain ID**: l'ID du domaine
- **Update Fields**:
  - Auto Renew: true/false
  - Nameservers: ns1.example.com,ns2.example.com
  - Transfer Lock: true/false
  - Privacy Protection: true/false

#### Renouveler un domaine
- **Resource**: Domain
- **Operation**: Renew
- **Domain ID**: l'ID du domaine

#### Transférer un domaine
- **Resource**: Domain
- **Operation**: Transfer
- **Domain Name**: example.com
- **Auth Code**: code d'autorisation
- **Transfer Details**:
  - Owner Contact ID
  - Admin Contact ID
  - Tech Contact ID

### Gestion des Contacts

#### Créer un contact
- **Resource**: Contact
- **Operation**: Create
- **Contact Type**: Person ou Organization
- **First Name**: (pour Person)
- **Last Name**: (pour Person)
- **Organization Name**: (pour Organization)
- **Email**: contact@example.com
- **Phone**: +1.1234567890
- **Address**:
  - Street
  - City
  - State
  - Postal Code
  - Country (code ISO)

#### Lister les contacts
- **Resource**: Contact
- **Operation**: Get Many

#### Mettre à jour un contact
- **Resource**: Contact
- **Operation**: Update
- **Contact ID**: l'ID du contact
- **Update Fields**: champs à modifier

#### Supprimer un contact
- **Resource**: Contact
- **Operation**: Delete
- **Contact ID**: l'ID du contact

## API Endpoints

### DNS API Endpoints

- `GET /dns/v1/zones` - Liste des zones
- `POST /dns/v1/zones` - Créer une zone
- `GET /dns/v1/zones/{zoneId}` - Détails d'une zone
- `PATCH /dns/v1/zones/{zoneId}` - Modifier une zone
- `DELETE /dns/v1/zones/{zoneId}` - Supprimer une zone
- `GET /dns/v1/zones/{zoneId}/records` - Liste des enregistrements
- `POST /dns/v1/zones/{zoneId}/records` - Créer un enregistrement
- `GET /dns/v1/zones/{zoneId}/records/{recordId}` - Détails d'un enregistrement
- `PATCH /dns/v1/zones/{zoneId}/records/{recordId}` - Modifier un enregistrement
- `DELETE /dns/v1/zones/{zoneId}/records/{recordId}` - Supprimer un enregistrement

### Domains API Endpoints

- `GET /domains/v1/availability/{domainName}` - Vérifier la disponibilité
- `GET /domains/v1/domains` - Liste des domaines
- `POST /domains/v1/domains` - Enregistrer un domaine
- `GET /domains/v1/domains/{domainId}` - Détails d'un domaine
- `PATCH /domains/v1/domains/{domainId}` - Modifier un domaine
- `POST /domains/v1/domains/{domainId}/renew` - Renouveler un domaine
- `POST /domains/v1/transfers` - Transférer un domaine
- `GET /domains/v1/contacts` - Liste des contacts
- `POST /domains/v1/contacts` - Créer un contact
- `GET /domains/v1/contacts/{contactId}` - Détails d'un contact
- `PATCH /domains/v1/contacts/{contactId}` - Modifier un contact
- `DELETE /domains/v1/contacts/{contactId}` - Supprimer un contact

## Développement

### Ajouter de nouvelles opérations

1. Modifier `nodes/Ionos/IonosDns.node.ts`
2. Ajouter la nouvelle opération dans les options
3. Ajouter les paramètres nécessaires
4. Implémenter la logique dans la méthode `execute()`

### Lint et Format
```bash
# Vérifier le code
npm run lint

# Corriger automatiquement
npm run lintfix

# Formater le code
npm run format
```

### Publication

Avant de publier sur npm:

1. Mettre à jour la version dans `package.json`
2. Mettre à jour le README avec des exemples
3. Vérifier que tous les tests passent
4. Build le projet: `npm run build`
5. Publier: `npm publish`

## Ressources

- [Documentation n8n pour créer des nœuds](https://docs.n8n.io/integrations/creating-nodes/)
- [API IONOS DNS](https://api.ionos.com/docs/dns/v1/)
- [IONOS Developer Portal](https://developer.hosting.ionos.com/)

## Dépannage

### Le nœud n'apparaît pas dans n8n
- Vérifiez que le build s'est bien passé
- Vérifiez le chemin dans `package.json` section `n8n.nodes`
- Redémarrez n8n complètement

### Erreur d'authentification
- Vérifiez que vos credentials IONOS sont corrects
- Testez l'authentification avec l'API directement
- Vérifiez que l'API key n'a pas expiré

### Erreurs de build
- Supprimez `node_modules` et `dist`
- Réinstallez: `npm install`
- Rebuilder: `npm run build`
