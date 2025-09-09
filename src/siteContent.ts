export const SITE_CONTENT = {
  galleries: {
    piscine: [
      { city: "Nice", surface: 36, teinte: "Gris Clair", granulometrie: "2–4 mm" },
      { city: "Aix-en-Provence", surface: 48, teinte: "Botticino", granulometrie: "2–5 mm" },
      { city: "Biarritz", surface: 52, teinte: "Corail", granulometrie: "3–6 mm" },
      { city: "Montpellier", surface: 40, teinte: "Carrare", granulometrie: "2–4 mm" },
      { city: "Cannes", surface: 45, teinte: "Bianco Verona", granulometrie: "2–5 mm" },
      { city: "Perpignan", surface: 38, teinte: "Nero Ebano", granulometrie: "2–4 mm" },
    ],
    terrasse: [
      { city: "Lyon", surface: 42, teinte: "Botticino", granulometrie: "2–5 mm" },
      { city: "Nantes", surface: 50, teinte: "Gris Perle", granulometrie: "2–4 mm" },
      { city: "Bordeaux", surface: 60, teinte: "Sienne", granulometrie: "3–6 mm" },
      { city: "Toulouse", surface: 35, teinte: "Corail", granulometrie: "2–4 mm" },
      { city: "Rennes", surface: 55, teinte: "Carrare", granulometrie: "2–5 mm" },
      { city: "Reims", surface: 47, teinte: "Gris Clair", granulometrie: "2–4 mm" },
    ],
    etancheite: [
      { city: "Paris", surface: 28, teinte: "Gris Béton", granulometrie: "—" },
      { city: "Dijon", surface: 33, teinte: "Anthracite", granulometrie: "—" },
      { city: "Metz", surface: 30, teinte: "Ivoire", granulometrie: "—" },
      { city: "Strasbourg", surface: 46, teinte: "Gris Clair", granulometrie: "—" },
      { city: "Lille", surface: 40, teinte: "Ardoise", granulometrie: "—" },
      { city: "Clermont-Ferrand", surface: 32, teinte: "Sable", granulometrie: "—" },
    ],
    moquette: [
      {export const SITE_CONTENT = {
  galleries: {
    // ...
    moquette: [
      {
        city: "Plérin",
        surface: 44,
        teinte: "Botticino",        // remplace par ta teinte réelle
        granulometrie: "2–5 mm",    // remplace par ta granulométrie
        img: "/images/moquette-de-pierre-plerin.jpg" // <— ton fichier
      },
      // ... (les autres items peuvent rester tels quels)
    ],
  },
  // ...
} as const;

  galleries: {
    // ...
    moquette: [
      { city: "Marseille", surface: 44, teinte: "Botticino", granulometrie: "2–5 mm", img: "/images/ma-photo-moquette.jpg" },
      // les autres items peuvent rester sans img
    ],
  },
  // ...
} as const;
city: "Marseille", surface: 44, teinte: "Botticino", granulometrie: "2–5 mm" },
      { city: "Toulon", surface: 39, teinte: "Corail", granulometrie: "2–4 mm" },
      { city: "Montélimar", surface: 52, teinte: "Bianco Verona", granulometrie: "3–6 mm" },
      { city: "Annecy", surface: 41, teinte: "Gris Perle", granulometrie: "2–4 mm" },
      { city: "Pau", surface: 49, teinte: "Carrare", granulometrie: "2–5 mm" },
      { city: "La Rochelle", surface: 53, teinte: "Nero Ebano", granulometrie: "2–4 mm" },
    ],
  },
  products: [
    { id: "granulats_botticino_25kg", name: "Granulats de marbre Botticino — sac 25 kg (2–5 mm)", price: 24.9, category: "Granulats de marbre" },
    { id: "resine_epoxy_5l", name: "Résine époxy — bidon 5 L", price: 59.0, category: "Résines & liants" },
    { id: "vernis_pu_5l", name: "Vernis polyuréthane — bidon 5 L", price: 49.0, category: "Résines & liants" },
    { id: "kit_tapis_pierre_10m2", name: "Kit Tapis de pierre — 10 m² (granulats + liant + vernis)", price: 349.0, category: "Kits systèmes" },
  ],
} as const;
