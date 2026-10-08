# Mise en ligne — pas à pas

## 1. Déposer le code sur GitHub

Sur https://github.com/Samenky/enky-sdr-dashboard :
**Add file → Upload files**, glisse TOUS les fichiers et dossiers, puis **Commit changes**.

Garde l'arborescence : `app/`, `components/`, `lib/` doivent rester des dossiers.
Le plus simple est de glisser le dossier entier depuis ton explorateur.

## 2. Créer le projet Railway

railway.com → **New Project** → **GitHub Repository** → `enky-sdr-dashboard`.

Railway détecte Next.js et lance un premier build. Il échouera : les variables manquent.
C'est normal.

## 3. Les variables

Service → **Variables** → **New Variable**. Quatre à créer :

| Nom | Valeur |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bpnlsywxmwrvnvffzlow.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → clé `anon` |
| `SUPABASE_SERVICE_ROLE_KEY` | même page, clé `service_role` |
| `ALLOWED_EMAILS` | `samuel@enky.com,nicolas@enky.com,shari@enky.com,andre-louis@enky.com` |

Railway redéploie tout seul.

## 4. Générer le domaine

Service → **Settings** → **Networking** → **Generate Domain**.
Note l'URL obtenue, par exemple `enky-sdr-dashboard-production.up.railway.app`.

## 5. Autoriser la redirection dans Supabase

**Sans cette étape, le lien magique ne marche pas.**

Supabase → **Authentication** → **URL Configuration** :
- **Site URL** : `https://TON-URL.up.railway.app`
- **Redirect URLs** : ajoute `https://TON-URL.up.railway.app/auth/callback`

## 6. Vérifier le fournisseur email

Supabase → **Authentication** → **Providers** → **Email** :
- « Enable Email provider » : activé
- « Confirm email » : désactivé

## 7. Tester

Ouvre l'URL Railway. Tu dois arriver sur l'écran de connexion.
Saisis `samuel@enky.com`, tu reçois un mail, tu cliques, tu vois le dashboard.

Teste aussi avec une adresse NON autorisée : elle doit être refusée.

## Pour aller plus loin

**Domaine propre** : Settings → Networking → Custom Domain, puis ton CTO ajoute un CNAME.

**Emails qui arrivent en spam** : par défaut Supabase envoie depuis son domaine.
Configure un SMTP Enky dans Authentication → Emails → SMTP Settings.
