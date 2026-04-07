# Analyse complète du site CoachMyNefs

Tu es un expert en audit de sites web React/TypeScript/Vite. Effectue une analyse complète du projet CoachMyNefs situé dans le répertoire courant.

## Instructions

Exécute les étapes suivantes dans l'ordre et produis un rapport structuré.

### 1. Vérification TypeScript
```bash
cd "/Users/ouahbi/Roqya Guide/ruqyaguide" && npx tsc -b 2>&1
```
→ Signale toutes les erreurs. Si aucune erreur : ✅

### 2. Build de production
```bash
cd "/Users/ouahbi/Roqya Guide/ruqyaguide" && npx vite build 2>&1 | tail -30
```
→ Capture les tailles de chunks, les warnings "chunk > 500kB", et note si le build réussit.

### 3. Analyse des imports inutilisés / dead code
Cherche dans `src/pages/` et `src/components/` :
- Imports déclarés mais non utilisés (pattern `import .* from` sans usage dans le fichier)
- Composants exportés mais jamais importés ailleurs
- Fichiers `.tsx/.ts` dans `src/` qui ne sont référencés nulle part

### 4. Cohérence des routes
Lis `src/App.tsx` et vérifie que :
- Chaque `<Route path="...">` correspond à un fichier page existant
- Chaque `<Link to="...">` dans les composants pointe vers une route déclarée dans App.tsx
- Les routes protégées (`ProtectedRoute`, `AdminRoute`) sont cohérentes

### 5. Variables d'environnement
Vérifie que `.env.example` contient toutes les variables nécessaires et qu'aucune clé sensible n'est commitée dans le code source (grep pour `sk_`, `eyJ`, mots de passe en dur).

### 6. Performance — tailles des chunks
Depuis la sortie du build, identifie :
- Chunks > 100 kB (à optimiser)
- Pages qui pourraient bénéficier de lazy loading supplémentaire
- Dépendances lourdes dans le bundle principal (`index-*.js`)

### 7. Accessibilité et SEO rapide
Pour chaque fichier dans `src/pages/`, vérifie :
- Présence du composant `<SEO ...>` avec title et description
- Images avec attribut `alt`
- Boutons sans label accessible (`<button>` sans texte ni aria-label)

### 8. État des pages principales
Pour chacune de ces pages, donne un statut rapide (✅ Complet / ⚠️ Partiel / ❌ Manquant) :
- `/` Home
- `/programme` Programme (questionnaire adaptatif, tracker)
- `/articles` Articles
- `/douas` Douas (gate freemium ?)
- `/forum` Forum
- `/videos` Vidéos
- `/quiz` Quiz
- `/tarifs` Tarifs (Stripe intégré ?)
- `/admin` Admin (onglet abonnements ?)

### 9. Intégration Stripe / Freemium
Vérifie :
- `api/create-subscription.js` existe ?
- `api/stripe-webhook.js` gère `customer.subscription.created` et `customer.subscription.deleted` ?
- `src/pages/Douas.tsx` : gate à partir de la doua 11 ?
- `src/pages/Programme.tsx` : gate à partir du jour 4 ?

### 10. Derniers commits Git
```bash
cd "/Users/ouahbi/Roqya Guide/ruqyaguide" && git log --oneline -10
```
→ Résume les 10 derniers changements.

---

## Format du rapport final

Présente le résultat sous cette forme :

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RAPPORT D'ANALYSE — CoachMyNefs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ TypeScript    : [résultat]
✅ Build         : [résultat + taille bundle]
⚠️  Performance  : [chunks > 100kB]
✅ Routes        : [résultat]
⚠️  SEO          : [pages sans SEO]
[...]

🔴 PROBLÈMES CRITIQUES (à corriger immédiatement)
  1. ...

🟡 AMÉLIORATIONS CONSEILLÉES
  1. ...

🟢 TOUT VA BIEN
  - ...

📋 PROCHAINES ÉTAPES SUGGÉRÉES
  1. ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Sois concis et actionnable. Évite de lister ce qui va bien en détail — focus sur les problèmes réels.
