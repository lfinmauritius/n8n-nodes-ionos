# Exemples d'Utilisation - IONOS Nodes

## Table des Matières
- [Exemples DNS](#exemples-dns)
- [Exemples Domain](#exemples-domain)

## Scénario 1: Créer une zone DNS et ajouter des enregistrements

### Workflow n8n

1. **Nœud 1: IONOS DNS - Create Zone**
   ```
   Resource: Zone
   Operation: Create
   Zone Name: mondomaine.com
   Type: NATIVE
   ```

2. **Nœud 2: IONOS DNS - Create A Record**
   ```
   Resource: Record
   Zone ID: {{ $json.id }} (depuis le nœud précédent)
   Operation: Create
   Record Name: www
   Record Type: A
   Content: 192.168.1.100
   Additional Fields:
     - TTL: 3600
   ```

3. **Nœud 3: IONOS DNS - Create MX Record**
   ```
   Resource: Record
   Zone ID: {{ $json.id }} (depuis le nœud 1)
   Operation: Create
   Record Name: @
   Record Type: MX
   Content: mail.mondomaine.com
   Additional Fields:
     - TTL: 3600
     - Priority: 10
   ```

## Scénario 2: Mettre à jour l'IP d'un enregistrement A (Dynamic DNS)

### Workflow n8n

1. **Nœud 1: HTTP Request - Get Public IP**
   ```
   Method: GET
   URL: https://api.ipify.org?format=json
   ```

2. **Nœud 2: IONOS DNS - List Records**
   ```
   Resource: Record
   Zone ID: votre-zone-id
   Operation: Get Many
   ```

3. **Nœud 3: Filter - Trouver l'enregistrement A**
   ```
   Condition: {{ $json.name }} equals "www"
   AND {{ $json.type }} equals "A"
   ```

4. **Nœud 4: IONOS DNS - Update Record**
   ```
   Resource: Record
   Zone ID: votre-zone-id
   Operation: Update
   Record ID: {{ $json.id }}
   Update Fields:
     - Content: {{ $node["HTTP Request"].json.ip }}
   ```

## Scénario 3: Backup de toutes les zones DNS

### Workflow n8n

1. **Nœud 1: Schedule Trigger**
   ```
   Trigger: Cron
   Expression: 0 2 * * * (tous les jours à 2h du matin)
   ```

2. **Nœud 2: IONOS DNS - List All Zones**
   ```
   Resource: Zone
   Operation: Get Many
   Return All: true
   ```

3. **Nœud 3: Loop Over Items**
   - Pour chaque zone

4. **Nœud 4: IONOS DNS - Get Records**
   ```
   Resource: Record
   Zone ID: {{ $json.id }}
   Operation: Get Many
   Return All: true
   ```

5. **Nœud 5: Google Drive - Upload File**
   ```
   Operation: Upload
   File Name: dns-backup-{{ $json.name }}-{{ new Date().toISOString() }}.json
   File Content: {{ JSON.stringify($json) }}
   ```

## Scénario 4: Ajouter automatiquement un enregistrement TXT pour vérification

### Workflow n8n

1. **Nœud 1: Webhook**
   ```
   HTTP Method: POST
   Path: /add-verification
   ```

2. **Nœud 2: IONOS DNS - Create TXT Record**
   ```
   Resource: Record
   Zone ID: {{ $json.body.zoneId }}
   Operation: Create
   Record Name: _verification
   Record Type: TXT
   Content: {{ $json.body.verificationCode }}
   Additional Fields:
     - TTL: 300
   ```

3. **Nœud 3: Wait**
   ```
   Time: 5 minutes
   ```

4. **Nœud 4: IONOS DNS - Delete TXT Record**
   ```
   Resource: Record
   Zone ID: {{ $json.body.zoneId }}
   Operation: Delete
   Record ID: {{ $node["IONOS DNS"].json.id }}
   ```

## Scénario 5: Migration de DNS depuis un fichier CSV

### Fichier CSV
```csv
zone_id,name,type,content,ttl,priority
abc123,www,A,192.168.1.1,3600,
abc123,mail,A,192.168.1.2,3600,
abc123,@,MX,mail.example.com,3600,10
```

### Workflow n8n

1. **Nœud 1: Read Binary File**
   ```
   File Path: /path/to/dns-records.csv
   ```

2. **Nœud 2: Move Binary Data**
   ```
   Mode: Binary to JSON
   ```

3. **Nœud 3: Split In Batches**
   ```
   Batch Size: 10
   ```

4. **Nœud 4: IONOS DNS - Create Record**
   ```
   Resource: Record
   Zone ID: {{ $json.zone_id }}
   Operation: Create
   Record Name: {{ $json.name }}
   Record Type: {{ $json.type }}
   Content: {{ $json.content }}
   Additional Fields:
     - TTL: {{ $json.ttl }}
     - Priority: {{ $json.priority }}
   ```

## Scénario 6: Monitoring et alerte sur les changements DNS

### Workflow n8n

1. **Nœud 1: Schedule Trigger**
   ```
   Trigger: Interval
   Time: Every 15 minutes
   ```

2. **Nœud 2: IONOS DNS - List Zones**
   ```
   Resource: Zone
   Operation: Get Many
   Return All: true
   ```

3. **Nœud 3: IONOS DNS - Get Records for Each Zone**
   ```
   Resource: Record
   Zone ID: {{ $json.id }}
   Operation: Get Many
   Return All: true
   ```

4. **Nœud 4: Compare with Previous State**
   ```
   Use Function node to compare with stored state
   ```

5. **Nœud 5: IF - Changes Detected**
   ```
   Condition: {{ $json.changed }} equals true
   ```

6. **Nœud 6: Send Email Alert**
   ```
   To: admin@example.com
   Subject: DNS Changes Detected
   Body: {{ $json.changes }}
   ```

## Conseils d'Utilisation

### Gestion des Erreurs
Utilisez toujours le paramètre "Continue On Fail" pour éviter que votre workflow s'arrête en cas d'erreur sur un enregistrement.

### Rate Limiting
L'API IONOS peut avoir des limites de requêtes. Ajoutez des nœuds "Wait" entre les appels si vous effectuez de nombreuses opérations.

### Variables d'Environnement
Stockez les Zone IDs fréquemment utilisés comme variables d'environnement dans n8n pour faciliter la maintenance.

### Logging
Ajoutez des nœuds "Set" pour logger les étapes importantes et faciliter le débogage.

## Code Examples (Function Node)

### Valider un enregistrement DNS
```javascript
const record = $input.first().json;

// Validation pour un enregistrement A
if (record.type === 'A') {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(record.content)) {
    throw new Error('Invalid IPv4 address');
  }
}

// Validation pour un enregistrement CNAME
if (record.type === 'CNAME') {
  if (!record.content.endsWith('.')) {
    record.content += '.';
  }
}

return { json: record };
```

### Générer des enregistrements DNS en masse
```javascript
const subdomains = ['www', 'api', 'mail', 'ftp', 'blog'];
const baseIP = '192.168.1.';
const records = [];

for (let i = 0; i < subdomains.length; i++) {
  records.push({
    name: subdomains[i],
    type: 'A',
    content: baseIP + (100 + i),
    ttl: 3600
  });
}

return records.map(r => ({ json: r }));
```

---

# Exemples Domain

## Scénario 7: Vérifier et enregistrer un domaine

### Workflow n8n

1. **Nœud 1: IONOS Domain - Check Availability**
   ```
   Resource: Domain
   Operation: Check Availability
   Domain Name: monnouveau-domaine.com
   ```

2. **Nœud 2: IF - Domain Available**
   ```
   Condition: {{ $json.available }} equals true
   ```

3. **Nœud 3: IONOS Domain - Create Contact**
   ```
   Resource: Contact
   Operation: Create
   Contact Type: Person
   First Name: John
   Last Name: Doe
   Email: john@example.com
   Phone: +1.1234567890
   Address:
     - Street: 123 Main St
     - City: New York
     - State: NY
     - Postal Code: 10001
     - Country: US
   ```

4. **Nœud 4: IONOS Domain - Register**
   ```
   Resource: Domain
   Operation: Register
   Domain Name: monnouveau-domaine.com
   Registration Details:
     - Period: 1
     - Owner Contact ID: {{ $node["IONOS Domain 1"].json.id }}
     - Admin Contact ID: {{ $node["IONOS Domain 1"].json.id }}
     - Tech Contact ID: {{ $node["IONOS Domain 1"].json.id }}
     - Auto Renew: true
   ```

## Scénario 8: Surveillance des expirations de domaines

### Workflow n8n

1. **Nœud 1: Schedule Trigger**
   ```
   Trigger: Cron
   Expression: 0 9 * * * (tous les jours à 9h)
   ```

2. **Nœud 2: IONOS Domain - List All Domains**
   ```
   Resource: Domain
   Operation: Get Many
   Return All: true
   ```

3. **Nœud 3: Function - Check Expiration**
   ```javascript
   const items = $input.all();
   const warningDays = 30; // Alerte 30 jours avant expiration
   const now = new Date();
   const expiringDomains = [];

   for (const item of items) {
     const expirationDate = new Date(item.json.expirationDate);
     const daysUntilExpiration = Math.floor(
       (expirationDate - now) / (1000 * 60 * 60 * 24)
     );

     if (daysUntilExpiration <= warningDays && daysUntilExpiration > 0) {
       expiringDomains.push({
         json: {
           domain: item.json.name,
           expirationDate: item.json.expirationDate,
           daysLeft: daysUntilExpiration,
           id: item.json.id
         }
       });
     }
   }

   return expiringDomains;
   ```

4. **Nœud 4: IF - Has Expiring Domains**
   ```
   Condition: {{ $json.daysLeft }} is not empty
   ```

5. **Nœud 5: Send Email**
   ```
   To: admin@example.com
   Subject: ⚠️ Domaines arrivant à expiration
   Body: Les domaines suivants expirent bientôt: {{ $json.domain }} ({{ $json.daysLeft }} jours)
   ```

## Scénario 9: Mise à jour en masse des nameservers

### Workflow n8n

1. **Nœud 1: IONOS Domain - List Domains**
   ```
   Resource: Domain
   Operation: Get Many
   Return All: true
   ```

2. **Nœud 2: Filter - Specific Domains**
   ```
   Condition: {{ $json.name }} matches regex ".*\.example\.com"
   ```

3. **Nœud 3: IONOS Domain - Update Nameservers**
   ```
   Resource: Domain
   Operation: Update
   Domain ID: {{ $json.id }}
   Update Fields:
     - Nameservers: ns1.cloudflare.com,ns2.cloudflare.com
   ```

## Scénario 10: Transfert automatique de domaine

### Workflow n8n

1. **Nœud 1: Webhook**
   ```
   HTTP Method: POST
   Path: /transfer-domain
   Expected payload:
   {
     "domain": "example.com",
     "authCode": "ABC123XYZ",
     "ownerContactId": "contact-id-123"
   }
   ```

2. **Nœud 2: IONOS Domain - Check Current Status**
   ```
   Resource: Domain
   Operation: Get Many
   ```

3. **Nœud 3: Filter - Not Already Owned**
   ```
   Condition: {{ $json.name }} not equals {{ $node["Webhook"].json.body.domain }}
   ```

4. **Nœud 4: IONOS Domain - Transfer**
   ```
   Resource: Domain
   Operation: Transfer
   Domain Name: {{ $node["Webhook"].json.body.domain }}
   Auth Code: {{ $node["Webhook"].json.body.authCode }}
   Transfer Details:
     - Owner Contact ID: {{ $node["Webhook"].json.body.ownerContactId }}
   ```

5. **Nœud 5: HTTP Response**
   ```
   Status Code: 200
   Body: {
     "success": true,
     "message": "Domain transfer initiated",
     "domain": "{{ $node["Webhook"].json.body.domain }}"
   }
   ```

## Scénario 11: Synchronisation des contacts entre domaines

### Workflow n8n

1. **Nœud 1: IONOS Domain - Get Master Contact**
   ```
   Resource: Contact
   Operation: Get
   Contact ID: master-contact-id
   ```

2. **Nœud 2: IONOS Domain - List All Domains**
   ```
   Resource: Domain
   Operation: Get Many
   Return All: true
   ```

3. **Nœud 3: Loop Over Items**
   - Boucle sur chaque domaine

4. **Nœud 4: IONOS Domain - Update Domain Contacts**
   ```
   Resource: Domain
   Operation: Update
   Domain ID: {{ $json.id }}
   Update Fields:
     - Admin Contact ID: {{ $node["IONOS Domain"].json.id }}
     - Tech Contact ID: {{ $node["IONOS Domain"].json.id }}
   ```

## Scénario 12: Rapport mensuel des domaines

### Workflow n8n

1. **Nœud 1: Schedule Trigger**
   ```
   Trigger: Cron
   Expression: 0 0 1 * * (le 1er de chaque mois à minuit)
   ```

2. **Nœud 2: IONOS Domain - List All Domains**
   ```
   Resource: Domain
   Operation: Get Many
   Return All: true
   ```

3. **Nœud 3: Function - Generate Report**
   ```javascript
   const items = $input.all();
   const report = {
     totalDomains: items.length,
     activeAutoRenew: 0,
     withPrivacy: 0,
     transferLocked: 0,
     byTLD: {}
   };

   for (const item of items) {
     // Comptage auto-renewal
     if (item.json.autoRenew) report.activeAutoRenew++;

     // Comptage privacy
     if (item.json.privacyProtection) report.withPrivacy++;

     // Comptage transfer lock
     if (item.json.transferLock) report.transferLocked++;

     // Comptage par TLD
     const tld = item.json.name.split('.').pop();
     report.byTLD[tld] = (report.byTLD[tld] || 0) + 1;
   }

   return [{ json: report }];
   ```

4. **Nœud 4: Google Sheets - Create Report**
   ```
   Operation: Append
   Spreadsheet: Domain Reports
   Sheet: Monthly Stats
   Values: {{ $json }}
   ```

5. **Nœud 5: Send Email with Report**
   ```
   To: management@example.com
   Subject: 📊 Rapport mensuel des domaines
   Body: HTML report with statistics
   ```

## Code Examples (Function Node) - Domain

### Calculer le coût total des renouvellements
```javascript
const domains = $input.all();
const pricing = {
  'com': 12.99,
  'net': 13.99,
  'org': 14.99,
  'io': 39.99,
  'fr': 9.99
};

let totalCost = 0;
const breakdown = [];

for (const item of domains) {
  const tld = item.json.name.split('.').pop();
  const price = pricing[tld] || 15.00; // Prix par défaut

  if (item.json.autoRenew) {
    totalCost += price;
    breakdown.push({
      domain: item.json.name,
      price: price,
      renewalDate: item.json.expirationDate
    });
  }
}

return [{
  json: {
    totalCost,
    currency: 'USD',
    numberOfDomains: breakdown.length,
    breakdown
  }
}];
```

### Valider un nom de domaine
```javascript
const domainName = $input.first().json.domainName;

function validateDomain(domain) {
  // Vérifier le format général
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;

  if (!domainRegex.test(domain)) {
    return { valid: false, error: 'Format de domaine invalide' };
  }

  // Vérifier la longueur
  if (domain.length > 253) {
    return { valid: false, error: 'Nom de domaine trop long' };
  }

  // Vérifier chaque label
  const labels = domain.split('.');
  for (const label of labels) {
    if (label.length > 63) {
      return { valid: false, error: 'Label trop long' };
    }
    if (label.startsWith('-') || label.endsWith('-')) {
      return { valid: false, error: 'Label ne peut pas commencer ou finir par un tiret' };
    }
  }

  return { valid: true, domain };
}

return [{ json: validateDomain(domainName) }];
```
