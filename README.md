# Resiniflex — Site e‑commerce (maquette Vite + React + Tailwind)

Ce dépôt contient une maquette **100% e‑commerce** pour Resiniflex :
- Menu gauche avec rubriques (Produits, Conseils, Inspiration & Projets, Contact, Histoire)
- Page Accueil avec **produits** et gestion de **stock** (badge En stock / Stock bas / Épuisé)
- Page **Inspiration & Projets** avec sous‑titres (Piscine & stratification, Terrasse — sol décoratif, Étanchéité & cuvelage, Moquette de pierre) + **légendes** (ville, surface, teinte, granulométrie)
- **Back‑office (stocks)** privé avec PIN de démo `1234`
- **Blocage d’ajout au panier** quand stock = 0 (affiche « Épuisé »)

## 🔧 Installer en local
```bash
npm install
npm run dev
```

## 🌐 Déployer en ligne (Vercel + GitHub)
1. **Créez un dépôt GitHub** (ex: `resiniflex-site`) et uploadez tous les fichiers.
2. Ouvrez **vercel.com** et cliquez **New Project → Import Git Repository** puis sélectionnez votre dépôt.
3. Framework = **Vite** (détecté automatiquement).  
   - Build Command : `npm run build`  
   - Output : `dist`
4. Lancez le déploiement → vous obtenez une URL du type `https://resiniflex.vercel.app` (modifiable).
5. Pour **modifier le site**, éditez les fichiers dans GitHub (ensuite Vercel redéploie automatiquement) :  
   - `src/siteContent.ts` → produits, prix, galeries, légendes (teinte, granulométrie, villes)  
   - `src/App.tsx` → structure/maquette (si besoin)

## 🔐 Accès Back‑office (stocks)
- Ouvrir la page, cliquer sur **Gestion (privée) → Back‑office (stocks)** (ou aller sur `/#admin`).
- Entrer le **PIN démo** `1234` → à changer ensuite dans `src/App.tsx` (`useAdminAuth`).

## 🧱 Technologies
- **Vite + React 18**
- **TailwindCSS 3**
- **lucide-react** pour les icônes
- TypeScript

## 📝 Notes
- Les stocks sont **persistés dans le navigateur** (localStorage) pour la maquette. En prod réelle, branchez une base (ex. Supabase, Firestore, Postgres) ou une plateforme e‑commerce (Shopify Headless / Medusa / Saleor).
- La navigation **/#admin** et **/#inspiration** fonctionne via le hash d’URL.
