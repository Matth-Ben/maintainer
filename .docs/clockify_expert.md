# Documentation Intégration API Clockify

## 1. Authentification
- L'API utilise une **X-Api-Key**. 
- URL de base : `https://api.clockify.me/api/v1`

## 2. Endpoints Clés pour le Développeur
- **GET /workspaces** : Pour récupérer l'ID de l'espace de travail de l'entreprise.
- **GET /workspaces/{workspaceId}/projects** : Pour lister les projets et faire le mapping par nom.
- **GET /workspaces/{workspaceId}/projects/{projectId}** : Pour récupérer le budget et le temps écoulé.

## 3. Mapping Maintenance / Rentabilité
Pour chaque projet dans l'outil de maintenance, nous devons stocker le `clockify_project_id`.
- **Calcul Temps/Argent :**
  - Utiliser l'objet `estimate` (si défini) vs `actual_duration`.
  - La propriété `amount` dans les rapports permet de comparer le coût du contrat de maintenance au coût réel (temps passé * taux horaire).

## 4. Flux de synchronisation
1. Lors de la création d'un projet dans l'outil, proposer de lier un projet Clockify existant (via un Select alimenté par l'API).
2. Afficher sur le dashboard Next.js un widget "Rentabilité" qui appelle l'API Clockify côté serveur (Server Actions) pour éviter d'exposer la clé API au client.