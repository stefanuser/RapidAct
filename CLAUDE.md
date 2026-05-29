# RapidAct.ro — context proiect

> Generator de contracte pentru firme din România (rent-a-car, imobiliare, HR).
> Flux: scanezi CI/permis/pașaport → completezi → generezi PDF cu diacritice în ~30 sec.

---

## Arhitectură (citește înainte de orice)

- **Static, fără build step.** React 18 + Babel Standalone încărcate din CDN. Codul JSX e transpilat în browser.
- **Componente partajate global:** fiecare fișier exportă cu `Object.assign(window, {...})` la final și le importă cu `const { X, Y } = window;` la început. NU există `import`/`export` ES modules.
- **Supabase** = auth + DB. Client global `window.sb`. Project ID: `wfresisyrlrawquzwlrs`.
- **PDF:** pdf-lib + fontkit (pentru diacritice românești corecte).
- **Cache-busting:** toate `<script>` au `?v=YYYYMMDD<literă>` (ex. `?v=20260528m`). **La fiecare modificare de `.jsx`, bumpează litera în `index.html` ȘI `admin.html`**, altfel browserul servește versiunea veche.

## Hosting & deploy (regulă fixă)

- **GitHub only.** Repo: `https://github.com/stefanuser/RapidAct.git`, branch `main`.
- **Push se face din GitHub Desktop**, NU din CLI (nu există credențiale git pe linia de comandă — `git push` eșuează cu „could not read Username").
- Claude poate face `git add` + `git commit`, dar pasul de **push îl face Stefan manual** din GitHub Desktop.
- Hosting preview: GitHub Pages → `https://stefanuser.github.io/RapidAct/`
- Hosting final: hostul propriu al lui Stefan.
- La fiecare commit, actualizează `version.json` (vezi mai jos).

## Două aplicații separate

| Fișier intrare | Pentru cine | Fișiere |
|---|---|---|
| `index.html` | **Utilizatori** (mobile-first, frame 420px) | `proto/*.jsx` (toate exceptând admin) |
| `admin.html` | **Admin intern** (desktop, full-width) | `proto/admin.jsx` |

URL admin: `https://stefanuser.github.io/RapidAct/admin.html`

---

## Fișiere `proto/`

| Fișier | Linii | Rol |
|---|---|---|
| `shared.jsx` | 286 | Iconițe SVG, `AppFrame`, `BottomNav`, `StatusBadge`, `Avatar`, primitive UI |
| `app.jsx` | 352 | Root `App()`. Routing pe string (`screen` state). Sesiune Supabase, `navigate(to)`, CRUD contracte/assets |
| `pages-auth.jsx` | 431 | Landing, Login, Register, Onboarding, `PROFILE_TYPES` |
| `pages-main.jsx` | 1604 | Dashboard, History, **Settings**, DatePersonale. Meniul din Settings duce la celelalte ecrane |
| `pages-firma.jsx` | 200 | Date firmă (DateFirmaScreen) |
| `pages-assets.jsx` | 605 | Active: mașini / proprietăți / companii. `ASSET_TYPES`, `AssetPickerSheet` |
| `pages-contract.jsx` | 1952 | **Fluxul de generare** (4 pași: Template → Scan → Form → Preview). ⚠️ FIELD_REGISTRY **VECHI** |
| `pages-templates.jsx` | 703 | Management template-uri **user-facing** (mobile). Rută `templates-dashboard` |
| `admin.jsx` | 1275 | **Dashboard admin** (desktop). FIELD_REGISTRY **NOU** |

### Routing (`app.jsx`)
`navigate(to)` = `setScreen(to)`. Ecrane: `landing, login, register, onboarding, dashboard, assets, history, settings, date-personale, date-firma, contract-new, contracte, templates-dashboard`. Toate ecranele primesc `shared = { navigate, profile, setProfile, contracts, assets, setAssets, logout, addAsset, deleteAsset }`.

---

## Bază de date (Supabase, schema `public`)

- **profiles** — `id` (=auth.users.id), `email`, `firm_name/cui/address/reg`, `legal_rep`, `plan`, `contracts_used/limit`, date CI (`cnp, ci_serie, ci_nr, ci_valabilitate, data_nastere, adresa`), date permis (`permis_*`), `signature`, **`is_admin`** (bool).
- **assets** — `id`, `user_id`, `type` (car/property/company), `name`, `address`, `details` (jsonb).
- **contracts** — `id`, `user_id`, `template_id`, `template_name`, `status`, `parties` (jsonb), `fields` (jsonb), `asset_id`, `pdf_url`, `created_at`.
- **contract_templates** — `id` (text), `name`, `icon`, `description`, `category`, `user_id` (NULL = global), `active`, `sort_order`, `scan_docs` (text[]), `body_template` (text), **`fields`** (text[]). NU mai există `field_map`/`manual_fields` (drop-uite).

**RLS:** funcția `is_admin()` (SECURITY DEFINER) verifică `profiles.is_admin`. Adminii citesc/scriu toate rândurile din profiles/contracts/assets/contract_templates. Userii normali doar rândurile proprii + template-urile globale.

**Admini setați:** `stefan@rapidact.ro`, `office@rapidact.ro`.

**Template-uri în DB acum:**
- `rentacar-standard` (global, „Închiriere Auto", 37 fields) — ⚠️ folosește chei VECHI
- `contract-decomodat-...` (global, creat din admin, chei NOI)

---

## FIELD_REGISTRY — ⚠️ DIVERGENȚĂ CRITICĂ DE REZOLVAT

Există **două** registre de câmpuri, incompatibile:

- **`admin.jsx`** = registry **NOU** (descriptiv). Prefixe:
  - `client_ci_*` (OCR carte identitate), `client_permis_*`, `client_pasaport_*`
  - `asset_auto_*`, `asset_prop_*`, `asset_comp_*` (din Active)
  - `eu_*` (profilul meu personal), `firma_*` (firma mea) — sursă „Profil"
  - `contract_*` (manual/auto) — sub-grupe: Generic / Auto / Imobiliare / Servicii
  - `semnatura_mea` + `semnatura_client` (tip imagine)
  - `firma_logo`, `rapidact_logo` (tip imagine)
- **`pages-contract.jsx`** = registry **VECHI**: `driver_name`, `vehicle_make`, `company_name`, `contract_date`, etc.

**Consecință:** template-urile create în admin (chei noi) NU se vor rezolva corect în fluxul de generare (care știe doar chei vechi). **Task prioritar: sincronizează `pages-contract.jsx` la registry-ul nou** + rescrie `rentacar-standard` cu chei noi.

### Surse de câmpuri (cum se rezolvă o valoare)
- **ocr** — scanat la momentul contractului (CI/permis/pașaport)
- **profile** — din profilul utilizatorului logat (`eu_*`, `firma_*`)
- **asset** — din activul selectat (mașină/proprietate/companie)
- **manual** — completat de user la generare
- **computed** — calculat automat (ex. `contract_data` = azi, durată = diff date)
- **static** — hardcodat (ex. `rapidact_logo`)
- **image** — tip special, se inserează imagine în PDF (logo-uri, semnături)

### Sintaxă template
- Câmpuri: `{{client_ci_nume_complet}}` în `body_template`.
- `fields[]` se derivă automat din `{{...}}` care există în registry.
- Formatare (markdown-like, de randat în PDF — **încă neimplementat la generare**): `**bold**`, `*italic*`, `__underline__`, `[size=N]...[/size]`, `[center]...[/center]`, `[left]`, `[right]`.

---

## Categorii template (curent)
**Imobiliare · Închirieri Auto · HR · Altele**

---

## Convenții & capcane

- **Limbă: română** peste tot în UI.
- **Diacritice + Edit tool:** fișierele folosesc `ș`/`ț` cu virgulă (U+0219/U+021B), nu cedilă. Edit tool poate eșua la `old_string` cu diacritice. Pentru blocuri mari de înlocuit cu diacritice → **patch Python pe bază de linii** (nu string-match).
- **Workflow Stefan (Faza 1 vs 2):** Faza 1 = concept/UX/prototip cu mock/in-memory. Backend real (DB/auth/plăți) doar la cerere explicită. Aici suntem deja pe Supabase real (DB + auth funcționale).
- `version.json` se citește în Settings (mobile) și în sidebar-ul admin. Format: `{ version, commit, date, time }`.

---

## De făcut (pending)

1. **[PRIORITAR] Sincronizează FIELD_REGISTRY** în `pages-contract.jsx` la cheile noi din `admin.jsx`. Rescrie template-ul `rentacar-standard` cu chei noi.
2. **Randare formatare în PDF** — interpretează `**bold**`, `[center]`, `[size=N]` la generare (pages-contract.jsx, pdf-lib).
3. **Câmpuri tip imagine în PDF** — `firma_logo`, `rapidact_logo`, `semnatura_mea`, `semnatura_client`.
4. **Mapping asset → câmpuri** pentru noile chei `asset_auto_*` / `asset_prop_*` / `asset_comp_*` (când selectezi un activ, completează câmpurile).
5. La fiecare deploy: bump `?v=` în `index.html` + `admin.html`, update `version.json`, commit (push manual din GitHub Desktop).
