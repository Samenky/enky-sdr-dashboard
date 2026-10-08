# Enky — Dashboard Performance SDR

Pilotage des appels sortants : Ringover × Odoo × Clay × lemlist.

## Comment ça marche

Les données vivent dans Supabase (projet `enky-sdr-calls`). Trois workflows n8n
les alimentent : Ringover toutes les 15 min, les contacts chaque nuit, Clay chaque lundi.

La page appelle une seule fonction Postgres, `dashboard_payload()`, qui renvoie les
trois jeux de données **dans la même transaction**. C'est ce qui garantit qu'ils ne
peuvent pas diverger — le défaut qu'avait la version fichier statique.

## Variables d'environnement (Railway)

| Nom | Où la trouver |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | même page, clé `anon` |
| `SUPABASE_SERVICE_ROLE_KEY` | même page, clé `service_role` |
| `ALLOWED_EMAILS` | emails autorisés, séparés par des virgules |

La clé `service_role` donne un accès total à la base. Elle ne doit exister que dans
les variables Railway — jamais dans le code, jamais dans le dépôt.

## Accès

Connexion par lien magique. Seuls les emails listés dans `ALLOWED_EMAILS` passent,
vérifié deux fois : à la connexion, puis à chaque requête par le middleware.

## Ajouter ou retirer quelqu'un

Modifie `ALLOWED_EMAILS` dans Railway. Le redéploiement est automatique.

## Renommer un SDR

`lib/sdr.js`. Les emails servent uniquement de clé de jointure avec Ringover :
aucun message ne leur est envoyé.

