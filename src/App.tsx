import React, { useEffect, useMemo, useState, createContext, useContext } from "react";
import {
  Package,
  Layers,
  Droplets,
  Wrench,
  HelpCircle,
  Home as HomeIcon,
  ChevronRight,
  Phone,
  BookOpen,
  Info,
  Image as ImageIcon,
  ShoppingCart,
  User,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { SITE_CONTENT } from "./siteContent";

type InventoryMap = Record<string, number>;
type CartItem = { id: string; qty: number };
type PageKey = "home" | "inspiration" | "admin";

const LS_KEY_INV = "resiniflex_inventory_v1";
const LS_KEY_CART = "resiniflex_cart_v1";
const LS_KEY_ADMIN = "resiniflex_admin_authed_v1";

function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function saveLS<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

type StoreCtx = {
  inventory: InventoryMap;
  setStock: (id: string, qty: number) => void;
  setStocksBulk: (entries: InventoryMap) => void;
  getStock: (id: string) => number;
  cart: CartItem[];
  addToCart: (id: string) => void;
  cartCount: number;
};

const StoreContext = createContext<StoreCtx | null>(null);

function StoreProvider({ children }: { children: React.ReactNode }) {
  const defaultInv: InventoryMap = useMemo(() => {
    const base: InventoryMap = {};
    SITE_CONTENT.products.forEach((p, i) => {
      // Définir des stocks de départ (à modifier en back-office)
      base[p.id] = [10, 5, 0, 12][i] ?? 0;
    });
    return base;
  }, []);

  const [inventory, setInventory] = useState<InventoryMap>(() => loadLS(LS_KEY_INV, defaultInv));
  const [cart, setCart] = useState<CartItem[]>(() => loadLS(LS_KEY_CART, [] as CartItem[]));

  useEffect(() => saveLS(LS_KEY_INV, inventory), [inventory]);
  useEffect(() => saveLS(LS_KEY_CART, cart), [cart]);

  const setStock = (id: string, qty: number) => setInventory((prev) => ({ ...prev, [id]: Math.max(0, Math.floor(qty)) }));
  const setStocksBulk = (entries: InventoryMap) => setInventory(entries);
  const getStock = (id: string) => inventory[id] ?? 0;

  const addToCart = (id: string) => {
    const current = getStock(id);
    if (current <= 0) return;
    setInventory((prev) => ({ ...prev, [id]: current - 1 }));
    setCart((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      if (idx === -1) return [...prev, { id, qty: 1 }];
      const copy = [...prev];
      copy[idx] = { id, qty: copy[idx].qty + 1 };
      return copy;
    });
  };

  const cartCount = cart.reduce((sum, it) => sum + it.qty, 0);

  const value: StoreCtx = { inventory, setStock, setStocksBulk, getStock, cart, addToCart, cartCount };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("StoreProvider manquant");
  return ctx;
}

function useAdminAuth() {
  const [authed, setAuthed] = useState<boolean>(() => loadLS(LS_KEY_ADMIN, false));
  useEffect(() => saveLS(LS_KEY_ADMIN, authed), [authed]);
  return { authed, setAuthed } as const;
}

export default function App() {
  const [page, setPage] = useState<PageKey>("home");

  // lecture hash initial et synchro navigation -> permet accès direct /#admin etc.
  useEffect(() => {
    const applyHash = () => {
      const h = (location.hash || "").replace("#", "");
      if (h === "inspiration" || h === "admin" || h === "home") setPage(h as PageKey);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const navigate = (p: PageKey) => {
    setPage(p);
    location.hash = p === "home" ? "" : `#${p}`;
  };

  return (
    <StoreProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden lg:flex lg:w-80 flex-col border-r bg-white/90 backdrop-blur sticky top-0 h-screen p-6 gap-6">
            <Brand />

            <NavSection title="Nos produits">
              <NavItem icon={<Package className="w-5 h-5" />} label="Kits systèmes" />
              <NavItem icon={<Layers className="w-5 h-5" />} label="Granulats de marbre" />
              <NavItem icon={<Droplets className="w-5 h-5" />} label="Résines & liants" />
              <NavItem icon={<Wrench className="w-5 h-5" />} label="Accessoires & outillage" />
            </NavSection>

            <NavSection title="Nos conseils">
              <NavItem icon={<BookOpen className="w-5 h-5" />} label="Guides & tutoriels" />
              <NavItem icon={<HelpCircle className="w-5 h-5" />} label="FAQ" />
            </NavSection>

            <div>
              <button onClick={() => navigate("inspiration")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-gray-100">
                <span className="shrink-0 text-gray-700">
                  <ImageIcon className="w-5 h-5" />
                </span>
                <span className="text-sm font-medium">Inspiration & Projets</span>
                <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
              </button>
            </div>

            <NavSection title="Nous contacter">
              <NavItem icon={<Phone className="w-5 h-5" />} label="Contact & SAV" />
            </NavSection>

            <NavSection title="Notre histoire">
              <NavItem icon={<Info className="w-5 h-5" />} label="Qui sommes-nous ?" />
            </NavSection>

            <NavSection title="Gestion (privée)">
              <button onClick={() => navigate("admin")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-gray-100">
                <span className="shrink-0 text-gray-700">
                  <Settings className="w-5 h-5" />
                </span>
                <span className="text-sm">Back‑office (stocks)</span>
                <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
              </button>
            </NavSection>

            <div className="mt-auto text-xs text-gray-500">© {new Date().getFullYear()} Resiniflex — France & International</div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <Header onGoHome={() => navigate("home")} />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
              {page === "home" && <HomePage />}
              {page === "inspiration" && <InspirationPage />}
              {page === "admin" && <AdminPage />}
            </div>
          </main>
        </div>
      </div>
    </StoreProvider>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-gray-900 text-white grid place-content-center font-bold">R</div>
      <div>
        <div className="text-xl font-extrabold tracking-tight">Resiniflex</div>
        <div className="text-xs text-gray-500">Revêtements sols & murs</div>
      </div>
    </div>
  );
}

function Header({ onGoHome }: { onGoHome: () => void }) {
  const { cartCount } = useStore();
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        <button onClick={onGoHome} className="flex items-center gap-3 lg:hidden">
          <HomeIcon className="w-5 h-5" />
          <span className="font-bold">Resiniflex</span>
        </button>
        <div className="flex-1 max-w-xl">
          <input
            placeholder="Rechercher un produit, une teinte…"
            className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-xl border px-3 py-2 text-sm flex items-center gap-2">
            <User className="w-4 h-4" /> Mon compte
          </button>
          <button className="rounded-xl bg-gray-900 text-white px-3 py-2 text-sm flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Panier{cartCount ? ` (${cartCount})` : ""}
          </button>
        </div>
      </div>
    </header>
  );
}

function NavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">{title}</div>
      <div className="grid gap-1">{children}</div>
    </div>
  );
}

function NavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-gray-100">
      <span className="shrink-0 text-gray-700">{icon}</span>
      <span className="text-sm">{label}</span>
      <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
    </button>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Produits en vedette</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SITE_CONTENT.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <ValueCard title="Qualité pro" desc="Systèmes testés, durables, résistants UV/gel." />
        <ValueCard title="Conseil & tutoriels" desc="Guides pas-à-pas, FAQ, assistance." />
        <ValueCard title="Livraison pondéreux" desc="Palette, RDV de livraison, suivi." />
      </section>
    </>
  );
}

function Hero() {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-8 md:p-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Sols & murs résistants et esthétiques.</h1>
        <p className="mt-3 text-white/80">Granulats de marbre, résines et systèmes complets — France & International.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="inline-flex items-center gap-2 rounded-xl bg-white text-gray-900 px-4 py-2 text-sm font-medium" href="#">
            Calculateur de surface
          </a>
          <a className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm" href="#">
            Voir les coloris
          </a>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: typeof SITE_CONTENT.products[number] }) {
  const { getStock, addToCart } = useStore();
  const stock = getStock(product.id);
  const out = stock <= 0;
  return (
    <div className="rounded-2xl border bg-white p-4 flex flex-col">
      <div className="aspect-[4/3] rounded-xl bg-gray-100 mb-3 grid place-content-center text-gray-500 text-sm">Image produit</div>
      <div className="font-medium leading-snug">{product.name}</div>
      <div className="text-sm text-gray-600 mt-1">{product.category}</div>
      <div className="mt-2 flex items-center justify-between">
        <div className="font-semibold">{product.price.toFixed(2)} €</div>
        <StockBadge stock={stock} />
      </div>
      <button
        className={`mt-3 rounded-xl px-3 py-2 text-sm border ${
          out ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-900 text-white border-gray-900"
        }`}
        disabled={out}
        onClick={() => addToCart(product.id)}
        title={out ? "Épuisé — indisponible" : "Ajouter au panier"}
      >
        {out ? "Épuisé" : "Ajouter au panier"}
      </button>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  const state = stock <= 0 ? "Épuisé" : stock <= 3 ? "Stock bas" : "En stock";
  return (
    <span
      className={`text-xs px-2 py-1 rounded-lg border ${
        stock <= 0
          ? "bg-gray-100 text-gray-500 border-gray-200"
          : stock <= 3
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-emerald-50 text-emerald-700 border-emerald-200"
      }`}
    >
      {state}
      {stock > 0 ? ` (${stock})` : ""}
    </span>
  );
}

function ValueCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="font-semibold">{title}</div>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  );
}

function InspirationPage() {
  const samples = SITE_CONTENT.galleries;
  return (
    <div>
      <h1 className="text-2xl font-bold">Inspiration & Projets</h1>
      <p className="text-sm text-gray-600 mt-1">Découvrez des exemples concrets et le rendu final de nos systèmes selon les types de projets.</p>

      <GallerySection
        title="Piscine & stratification"
        subtitle="Sécurisez et sublimez les abords de piscine : confort au pied, antidérapant, résistance UV & eau chlorée."
        items={samples.piscine}
      />
      <GallerySection
        title="Terrasse — sol décoratif"
        subtitle="Rendu minéral sans joint, drainant, idéal terrasses, allées et plages."
        items={samples.terrasse}
      />
      <GallerySection
        title="Étanchéité & cuvelage"
        subtitle="Protection des murs/toitures/chènéaux et cuvelage de locaux : barrières anti-humidité et durabilité."
        items={samples.etancheite}
      />
      <GallerySection
        title="Moquette de pierre"
        subtitle="Revêtement drainant en granulats de marbre liés à la résine : esthétique, antidérapant et confortable."
        items={samples.moquette}
      />
    </div>
  );
}

function renderCaption(
  sectionTitle: string,
  item: GalleryItem { city: string; surface: number; teinte: string; granulometrie: string },img: string; 
) {
  const heading = `${sectionTitle} — ${item.city}, ${item.surface} m²`;
  const lines = [
    `Teinte : ${item.teinte} · Granulométrie : ${item.granulometrie}.`,
    `Préparation du support, application du système résine et finition adaptée à l'usage.`,
    `Remise en service : 24–48 h (selon conditions).`,
  ];
  return { heading, text: lines.join(" ") };
}

function GallerySection({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: GalleryItem[];{ city: string; surface: number; teinte: string; granulometrie: string }[];
}) {
  return (
    <section className="mt-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {items.map((item, i) => {
          const { heading, text } = renderCaption(title, item);
          return {item.img ? (
  <img
    src={item.img}
    alt={`${heading} — ${item.teinte} ${item.granulometrie}`}
    className="w-full aspect-[4/3] object-cover"
  />
) : (
  <div className="aspect-[4/3] bg-gray-100 grid place-content-center text-sm text-gray-500">
    Photo {i + 1}
  </div>
)}


function AdminPage() {
  const { inventory, setStock, setStocksBulk } = useStore();
  const { authed, setAuthed } = useAdminAuth();
  const [pin, setPin] = useState("");

  const [draft, setDraft] = useState<Record<string, number>>(() => ({ ...inventory }));
  useEffect(() => setDraft({ ...inventory }), [inventory]);

  const handleSave = () => {
    const clean: Record<string, number> = {};
    SITE_CONTENT.products.forEach((p) => {
      const v = Number.isFinite(draft[p.id]) ? Math.max(0, Math.floor(draft[p.id])) : 0;
      clean[p.id] = v;
    });
    setStocksBulk(clean);
  };

  if (!authed) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="w-6 h-6" /> Back‑office — Accès privé
        </h1>
        <p className="text-sm text-gray-600 mt-2">Saisissez votre code PIN pour accéder à la gestion des stocks (maquette).</p>
        <div className="mt-4 flex gap-2">
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Code PIN (ex : 1234)"
            className="rounded-xl border px-4 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
          <button onClick={() => setAuthed(pin == "1234")} className="rounded-xl bg-gray-900 text-white px-4 py-2 text-sm">
            Se connecter
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          ⚠️ Démo : remplacez le PIN côté code plus tard (ou branchez une vraie authentification).
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Back‑office — Stocks produits</h1>
      <p className="text-sm text-gray-600 mt-1">
        Définissez les quantités disponibles. À 0, le produit passe automatiquement en <em>Épuisé</em> et l’ajout au panier est désactivé.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2 pr-4">Produit</th>
              <th className="py-2 pr-4">Catégorie</th>
              <th className="py-2 pr-4">Prix</th>
              <th className="py-2 pr-4">Stock</th>
            </tr>
          </thead>
          <tbody>
            {SITE_CONTENT.products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="py-2 pr-4">{p.name}</td>
                <td className="py-2 pr-4 text-gray-600">{p.category}</td>
                <td className="py-2 pr-4">{p.price.toFixed(2)} €</td>
                <td className="py-2 pr-4">
                  <input
                    type="number"
                    min={0}
                    value={draft[p.id] ?? 0}
                    onChange={(e) => setDraft((d) => ({ ...d, [p.id]: Number(e.target.value) }))}
                    className="w-24 rounded-lg border px-3 py-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={handleSave} className="rounded-xl bg-gray-900 text-white px-4 py-2 text-sm">
          Enregistrer
        </button>
        <button onClick={() => setDraft({ ...inventory })} className="rounded-xl border px-4 py-2 text-sm">
          Annuler
        </button>
        <button
          onClick={() => {
            const reset: Record<string, number> = {};
            SITE_CONTENT.products.forEach((p) => (reset[p.id] = 0));
            setDraft(reset);
          }}
          className="rounded-xl border px-4 py-2 text-sm"
        >
          Tout mettre à 0
        </button>
      </div>
    </div>
  );
}
