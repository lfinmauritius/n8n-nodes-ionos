# Analyse des fonctionnalités potentiellement manquantes

Basé sur la documentation IONOS mentionnée, voici les fonctionnalités qui pourraient être ajoutées au node IONOS Domain.

## Fonctionnalités déjà implémentées ✅

### Domain Operations
- Check Availability
- Get / Get Many
- Register
- Renew
- Transfer (initiation)
- Update (autoRenew, nameservers, transferLock, privacyProtection)

### Contact Operations
- Create
- Get / Get Many
- Update
- Delete

## Fonctionnalités potentiellement manquantes ⚠️

### 1. NameServers (opérations dédiées)
**Endpoint potentiel:** `GET/PUT /domains/v1/domains/{domainId}/nameservers`
- Récupérer les nameservers d'un domaine spécifique
- Mettre à jour uniquement les nameservers (séparé de l'update général)
- Lister les nameservers disponibles chez IONOS

### 2. Domain Statuses
**Endpoint potentiel:** `GET /domains/v1/domains/{domainId}/status`
- Obtenir le statut détaillé du domaine (locked, pending, active, expired, etc.)
- Historique des changements de statut

### 3. DNS Security (DNSSEC)
**Endpoint potentiel:** `GET/POST/DELETE /domains/v1/domains/{domainId}/dnssec`
- Activer/désactiver DNSSEC
- Obtenir les enregistrements DNSSEC (DS records)
- Gérer les clés DNSSEC

### 4. AuthCode Operations
**Endpoint potentiel:** `GET/POST /domains/v1/domains/{domainId}/authcode`
- **Obtenir le code d'autorisation** d'un domaine pour un transfert sortant
- Générer un nouveau code d'autorisation
- Actuellement, l'authCode est seulement utilisé lors du transfert entrant

### 5. Requests / Orders Management
**Endpoint potentiel:** `GET /domains/v1/requests`
- Lister toutes les requêtes/commandes en cours
- Obtenir le statut d'une requête spécifique (enregistrement, transfert, renouvellement)
- Suivre l'historique des opérations

### 6. Validation
**Endpoint potentiel:** `POST /domains/v1/domains/{domainId}/validate`
- Valider les données de contact
- Vérifier la conformité aux exigences du registre
- Validation pré-enregistrement

### 7. TLDs Information
**Endpoint potentiel:** `GET /domains/v1/tlds`
- Lister tous les TLDs disponibles
- Obtenir les prix par TLD
- Connaître les exigences spécifiques par TLD (documents requis, restrictions)
- Périodes de renouvellement disponibles par TLD

### 8. Transfer Actions
**Endpoint potentiel:** `GET/POST /domains/v1/transfers/{transferId}`
- Suivre l'état d'un transfert en cours
- Accepter un transfert entrant
- Refuser un transfert entrant
- Annuler un transfert sortant
- Obtenir l'historique des transferts

### 9. Domain Transfers (suivi)
**Endpoint potentiel:** `GET /domains/v1/domains/{domainId}/transfer`
- Vérifier si un domaine peut être transféré
- Obtenir le statut du transfert en cours
- Lister tous les transferts (entrants et sortants)

### 10. Email Verification
**Endpoint potentiel:** `POST /domains/v1/contacts/{contactId}/verify-email`
- Envoyer un email de vérification
- Vérifier le statut de validation de l'email
- Renvoyer l'email de vérification

### 11. Data Quality
**Endpoint potentiel:** `GET /domains/v1/contacts/{contactId}/quality`
- Vérifier la qualité des données de contact
- Obtenir des suggestions de correction
- Valider la conformité GDPR/WHOIS

### 12. Domain Preregistrations
**Endpoint potentiel:** `POST /domains/v1/preregistrations`
- Pré-enregistrer un domaine avant son lancement public (sunrise period)
- Lister les préenregistrements en cours
- Annuler un préenregistrement
- Obtenir les périodes de sunrise disponibles

### 13. Domain Ownership
**Endpoint potentiel:** `POST /domains/v1/domains/{domainId}/ownership-change`
- Initier un changement de propriétaire (trade)
- Accepter/refuser un changement de propriétaire
- Vérifier les exigences pour un changement de propriétaire
- Obtenir l'historique des changements de propriété

## Endpoints DNS déjà couverts dans IonosDns.node.ts

Le node IonosDns couvre:
- Zones: create, get, getAll, update, delete
- Records: create, get, getAll, update, delete, updateMany

## Recommandations

Pour compléter l'implémentation:

1. **Priorité Haute:**
   - AuthCode Operations (très demandé pour les transferts sortants)
   - Transfer Actions (suivi des transferts)
   - TLDs Information (utile pour vérifier les prix et disponibilités)

2. **Priorité Moyenne:**
   - Requests Management (suivi des opérations)
   - DNSSEC (sécurité DNS)
   - Email Verification (conformité ICANN)

3. **Priorité Basse (selon les besoins):**
   - Domain Preregistrations (cas d'usage spécifique)
   - Data Quality (peut être fait manuellement)
   - Domain Ownership (changement de propriétaire rare)

## Notes

⚠️ Cette analyse est basée sur les fonctionnalités standard des APIs de domaines et les sections mentionnées dans la documentation IONOS. Les endpoints exacts et les opérations disponibles doivent être vérifiés dans la documentation officielle IONOS à: https://developer.hosting.ionos.com/docs/domains

Pour confirmer quelles opérations sont réellement disponibles, il faudrait:
1. Accéder à la documentation interactive IONOS
2. Tester les endpoints avec des appels API
3. Consulter le fichier OpenAPI/Swagger si disponible
