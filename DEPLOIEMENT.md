# 🚀 Déployer l'app HOFT sur Netlify

Guide étape par étape pour un débutant. Ça prend environ 10 minutes.

---

## ÉTAPE 1 — Créer un dépôt GitHub

1. Va sur **github.com** → connecte-toi
2. Clique le bouton vert **"New"** (en haut à gauche)
3. Nomme le dépôt : `hoft-app`
4. Laisse tout par défaut → clique **"Create repository"**
5. **Copie l'URL** qui ressemble à :
   ```
   https://github.com/TON-NOM/hoft-app.git
   ```

---

## ÉTAPE 2 — Connecter et envoyer le code

Reviens ici dans Claude Code et colle cette commande (remplace `TON-NOM` par ton nom GitHub) :

```bash
git remote add origin https://github.com/TON-NOM/hoft-app.git
git push -u origin main
```

Si GitHub demande un mot de passe → utilise un **Personal Access Token** :
- GitHub → Settings → Developer settings → Personal access tokens → Generate new token (classic)
- Coche `repo` → Generate → copie le token → colle-le comme mot de passe

---

## ÉTAPE 3 — Connecter Netlify à GitHub

1. Va sur **netlify.com** → connecte-toi
2. Clique **"Add new site"** → **"Import an existing project"**
3. Clique **"Deploy with GitHub"** → autorise Netlify
4. Sélectionne ton dépôt **hoft-app**
5. Configure comme ceci :

   | Champ | Valeur |
   |-------|--------|
   | Base directory | `hoft-app` |
   | Build command | `npm run build` |
   | Publish directory | `hoft-app/dist` |

6. Clique **"Deploy site"**

Attends 2-3 minutes → Netlify te donne une URL comme `https://jolly-name-123.netlify.app`

---

## ÉTAPE 4 — Tester sur iPhone

1. Ouvre Safari sur ton iPhone
2. Va sur l'URL Netlify
3. Clique le bouton **Partager** (carré avec flèche)
4. Clique **"Sur l'écran d'accueil"**
5. L'app s'ouvre en plein écran comme une vraie app!

---

## ÉTAPE 5 (optionnel) — Connecter la base de données Supabase

Sans Supabase, l'app fonctionne en local (photos, checklist, signature) mais ne sauvegarde pas dans le cloud.

Pour activer le cloud :

1. Va sur **supabase.com** → créer un projet gratuit
2. Va dans **SQL Editor** → colle le contenu du fichier `hoft-app/supabase/schema.sql` → Run
3. Va dans **Settings → API** → copie `Project URL` et `anon public key`
4. Dans Netlify → **Site settings → Environment variables** → ajoute :
   - `VITE_SUPABASE_URL` = ton Project URL
   - `VITE_SUPABASE_ANON_KEY` = ton anon key
5. Dans Netlify → **Deploys → Trigger deploy**

---

## En cas de problème

- L'app ne s'affiche pas → vérifie que `Base directory` = `hoft-app` dans Netlify
- Erreur de build → dis-moi l'erreur dans Claude Code
- Photos ne marchent pas → normal en HTTPS, ça demande la permission de la caméra

