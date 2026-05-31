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
| `field-registry.jsx` | ~230 | **SURSĂ UNICĂ câmpuri.** `window.FIELD_REGISTRY` (121 câmpuri) + `CAT_ORDER/CAT_ICONS/CONTRACT_GROUPS/SOURCE_STYLE` + `extractFields()/fieldsByCategory()`. Încărcat PRIMUL în ambele HTML |
| `shared.jsx` | 286 | Iconițe SVG, `AppFrame`, `BottomNav`, `StatusBadge`, `Avatar`, primitive UI |
| `app.jsx` | 352 | Root `App()`. Routing pe string (`screen` state). Sesiune Supabase, `navigate(to)`, CRUD contracte/assets |
| `pages-auth.jsx` | 431 | Landing, Login, Register, Onboarding, `PROFILE_TYPES` |
| `pages-main.jsx` | 1604 | Dashboard, History, **Settings**, DatePersonale. Meniul din Settings duce la celelalte ecrane |
| `pages-firma.jsx` | 200 | Date firmă (DateFirmaScreen) |
| `pages-assets.jsx` | 605 | Active: mașini / proprietăți / companii. `ASSET_TYPES`, `AssetPickerSheet` |
| `pages-contract.jsx` | ~1950 | **Fluxul de generare** (4 pași: Template → Scan → Form → Preview). ✅ migrat la `window.FIELD_REGISTRY`. `CATEGORIES = window.TEMPLATE_CATEGORIES`. |
| ~~`pages-templates.jsx`~~ | — | **ELIMINAT** — management template-uri e acum doar în `admin.jsx` (admin-only). Ruta `templates-dashboard` nu mai există. |
| `admin.jsx` | 1106 | **Dashboard admin** (desktop). ✅ consumă `window.FIELD_REGISTRY` din `field-registry.jsx` |

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

**Template-uri în DB:** vezi secțiunea „Categorii template" mai jos. Toate folosesc chei NOI (canonice). `rentacar-standard` a fost rescris cu chei noi (39 fields: `client_ci_*`, `asset_auto_*`, `contract_*`).

---

## FIELD_REGISTRY — sursă unică în `proto/field-registry.jsx`

**Canonic acum:** `proto/field-registry.jsx` definește `window.FIELD_REGISTRY` (121 câmpuri, chei descriptive noi). Încărcat PRIMUL în ambele HTML.

Prefixe / categorii:
- `client_ci_*`, `client_permis_*`, `client_pasaport_*` — OCR documente client
- `asset_auto_*`, `asset_prop_*`, `asset_comp_*` — din Active (mașină/proprietate/companie)
- `eu_*` (eu, persoană), `firma_*` (firma mea) — din profil
- `contract_*` — manual/auto, sub-grupe: Generic / Auto / Imobiliare / Servicii
- `semnatura_mea`, `semnatura_client`, `firma_logo`, `rapidact_logo` — tip imagine

**Stare consumatori:**
- ✅ `admin.jsx` — consumă `window.FIELD_REGISTRY`
- ✅ `pages-contract.jsx` — migrat complet: `const FIELD_REGISTRY = window.FIELD_REGISTRY`. Rezolvă cheile noi. `buildContractBody()` fallback e acum generic (label-uri din registry, zero chei vechi). Verificat și în DB: `rentacar-standard` are 39 fields + `body_template` pe chei noi. Nicio cheie veche rămasă nicăieri (cod + DB).

### Schema unui câmp (vezi header-ul fișierului pentru detalii complete)
`{ label, cat, group?, source, type?, desc?, ocrDoc?, ocrKey?, profileKey?, assetType?, assetKey?, compute?, formGroup?, required?, placeholder?, options? }`

### Surse (`source`) — cum se rezolvă valoarea
- **ocr** — scanat la generare. `ocrDoc` (ci/permis/pasaport) + `ocrKey` (cheie în rezultatul OCR din `DOC_SCHEMAS`)
- **profile** — `profileKey` = coloană în `profiles`
- **asset** — `assetType` (car/property/company) + `assetKey` = cheie în `asset.details`
- **manual** — completat de user. `type`, `required`, `placeholder`, `options`, `formGroup`
- **computed** — `compute`: `today` | `days_between` | `total`
- **static** — hardcodat (ex. `rapidact_logo`)
- `type:'image'` — se inserează imagine în PDF (logo-uri, semnături)

### Două înțelesuri pentru grupare (atenție!)
- `group` = sub-tab picker pentru cat:'Contract' (Generic/Auto/Imobiliare/Servicii)
- `formGroup` = secțiunea din formularul StepForm (Perioadă/Tarife și plată/Condiții/Contract)

### Note OCR
**Motor:** edge function Supabase `ocr-ci` → OpenAI `gpt-4o-mini` (vision, `detail:'high'`). Moduri prompt: `ro_ci`, `ro_permis`, `ro_pasaport`, `ro_ci_permis` (acoperă format CI vechi/nou + MRZ pașaport). ⚠️ Cheia OpenAI e încă hardcodată în sursa edge function + `verify_jwt:false` — de securizat (acceptat ca risc pe moment).

**Extragere reală (`DOC_SCHEMAS` în `pages-contract.jsx`):** CI = `full_name, cnp, ci_serie, ci_nr, data_nastere, ci_valabilitate`; permis = `titular, nr, categorii, expirare`. Restul `ocrKey`-urilor sunt forward-compatible (se rezolvă la `''`). Pașaportul: prompt server gata, dar fără `DOC_SCHEMAS` client încă.

**Data nașterii din CNP (2026-05-31):** se calculează DETERMINIST din CNP (cifrele 2-7 = YYMMDD → `DD.MM.YY`) via `cnpToBirthdate()` din `shared.jsx`, NU din data tipărită citită de OCR. Verificare încrucișată cu data tipărită → `uncertain` (⚠️) la nepotrivire sau CNP invalid. Se aplică doar când există CNP valid (acte fără CNP → data tipărită). Folosit în ambele scanări (contract + profil).

**Mărime poză + robustețe (2026-05-31):** `compressImage` reduce latura lungă la **1100px** (OpenAI `detail:'high'` reduce oricum la ~768px latură scurtă → OCR neschimbat, upload mai rapid). Scanarea din contract are timeout **20s** pe fetch + guard **10s** la decodarea imaginii (HEIC etc.) — fără ele rotița se învârtea la infinit.

### Sintaxă template
- Câmpuri: `{{client_ci_nume_complet}}` în `body_template`. `fields[]` se derivă din `{{...}}` cu `extractFields()`.
- Formatare (markdown-like, **încă nerandată la generarea PDF**): `**bold**`, `*italic*`, `__underline__`, `[size=N]...[/size]`, `[center]/[left]/[right]`.

---

## Categorii template

**Sursă unică:** `proto/field-registry.jsx` → `window.TEMPLATE_CATEGORIES` (consumat de `admin.jsx` și `pages-contract.jsx`). NU mai hardcoda liste de categorii în alte fișiere.

Cele 4 categorii **atribuibile** (dropdown admin + editor):
**Imobiliare 🏠 · Rent a car 🚗 · Resurse Umane 👥 · General 📋**

`DEFAULT_TEMPLATE_CATEGORY = 'General'` (fallback când lipsește categoria).

**Contractele Mele 📁** = grupare **virtuală** (NU se atribuie din dropdown): template-urile create de utilizator (`user_id ≠ null`). În admin apar grupate per-utilizator (`👤`); pentru user sunt template-urile proprii. Definit ca `window.TEMPLATE_CAT_MINE`.

**Template-uri în DB (global, `user_id = null`) — 3 per categorie, cele `test-*` sunt de test:**
- General: `Contract Decomodat`, `Prestări Servicii` (test), `NDA` (test)
- Imobiliare: `Închiriere Apartament`, `Comodat Imobil`, `Antecontract Vânzare` (toate test)
- Rent a car: `Închiriere Auto`, `Comodat Auto` (test), `Predare-Primire Auto` (test)
- Resurse Umane: `Contract Individual de Muncă`, `Colaborare PFA`, `Act Adițional CIM` (toate test)
- + `test-mele-imprumut` (Contractele Mele, atașat lui `stefan@rapidact.ro`)

---

## Convenții & capcane

- **Limbă: română** peste tot în UI.
- **Diacritice + Edit tool:** fișierele folosesc `ș`/`ț` cu virgulă (U+0219/U+021B), nu cedilă. Edit tool poate eșua la `old_string` cu diacritice. Pentru blocuri mari de înlocuit cu diacritice → **patch Python pe bază de linii** (nu string-match).
- **Workflow Stefan (Faza 1 vs 2):** Faza 1 = concept/UX/prototip cu mock/in-memory. Backend real (DB/auth/plăți) doar la cerere explicită. Aici suntem deja pe Supabase real (DB + auth funcționale).
- `version.json` se citește în Settings (mobile) și în sidebar-ul admin. Format: `{ version, commit, date, time }`.

---

## De făcut (pending)

1. ✅ **GATA — Migrarea `pages-contract.jsx` la `field-registry.jsx`.** Consumă `window.FIELD_REGISTRY`; `rentacar-standard` rescris cu chei noi (39 fields). ✅ Fallback-ul hardcodat din `buildContractBody()` e acum generic (label-uri din registry, zero chei vechi). ✅ `TEMPLATES` seed + toate referințele (`company_rep`→`firma_reprezentant`, `driver_name`→`client_ci_nume_complet`) pe chei noi. **Rămas: testează generarea unui contract real** end-to-end (resolve `ocrDoc/ocrKey`, `assetType/assetKey`, `compute`; `StepForm` pe `formGroup`; auto-calc `days_between`/`total`).
2. **Mapping asset → câmpuri** pentru `asset_*`: la selectarea unui activ, completează `asset_auto_*` etc. din `asset.details` via `assetKey` din FIELD_REGISTRY (registry-ul declară deja `assetType`+`assetKey`). NU mai există `contractMap` în `pages-assets.jsx` (era cod mort cu chei vechi — eliminat). Notă: unele `assetKey` (engine_cc, power, seats, itp_exp, rca_exp...) nu există încă în `ASSET_TYPES` — de extins.
3. **Randare formatare în PDF** — interpretează `**bold**`, `[center]`, `[size=N]` la generare (pdf-lib).
4. ✅ **GATA — Câmpuri tip imagine INLINE în PDF.** `{{semnatura_mea}}`/`{{semnatura_client}}` se inserează ca imagine **exact la poziția placeholderului** din `body_template` (nu mai există blocul hardcodat LOCATOR/LOCATAR de la final). Mecanism: `resolveContractValues` pune un token private-use (`IMG_TOKEN`, `IMG:key`); loop-ul de generare detectează tokenul, desenează imaginea inline (`imgMap`, înălțime 30pt), iar preview-ul HTML arată `✍ [label]`. Semnătură lipsă/omisă (`skipSig`) → linie goală pentru semnat manual. `firma_logo` (profiles.logo_url) merge pe același mecanism; `rapidact_logo` (static) — încă neimplementat. **Notă:** dacă un template NU conține `{{semnatura_*}}`, semnătura NU mai apare nicăieri (by design).
5. **Coloane DB lipsă** (opțional): `profiles.firm_iban`, `profiles.firm_banca` (pentru `firma_iban/firma_banca`).
6. **Bonus 10 contracte „de test" la cont nou (prima lună).** La înscriere oferim +10 contracte peste limita planului, pentru testare în prima lună. Implementare la onboarding (`handleFinish`/`handleSkip` în `pages-auth.jsx`): fie setăm `contracts_limit` mai mare (ex. `5 + 10`), fie un câmp separat `trial_bonus` (+ `trial_expires_at`) ca să-l putem expira după 30 zile. Decizia curentă (consum la generare, **fără refund la ștergere** — `deleteContract` în `app.jsx` NU scade `contracts_used`) e intenționată și compatibilă cu bonusul.
7. La fiecare deploy: bump `?v=` în `index.html` + `admin.html`, update `version.json`, commit (push manual din GitHub Desktop).

---

## Istoric modificări (changelog)

### 2026-05-31
1. **Categorii template — sursă unică & consistență.** Definite în `field-registry.jsx`: `TEMPLATE_CATEGORIES` (🏠 Imobiliare · 🚗 Rent a car · 👥 Resurse Umane · 📋 General), `TEMPLATE_CAT_MINE` (📁 Contractele Mele — grupare virtuală `user_id ≠ null`), `TEMPLATE_CAT_IDS`, `DEFAULT_TEMPLATE_CATEGORY = 'General'`, `templateCatIcon`. Consumate de `admin.jsx` (dropdown + grupare ordonată canonic) și `pages-contract.jsx` (`CATEGORIES`). Eliminate listele hardcodate inconsistente de dinainte (`Mobilitate/Comercial/HR/Altele/Muncă/Închirieri Auto`).
2. **DB categorii.** `rentacar-standard`: `Mobilitate → Rent a car`. Create 10 template-uri de test globale (3/categorie) + 1 propriu (`test-mele-imprumut`, secțiunea Contractele Mele, atașat lui `stefan@rapidact.ro`).
3. **`rentacar-standard` rescris pe chei noi** (39 fields, `client_ci_*`/`asset_auto_*`/`contract_*`) + `body_template` canonic. Zero chei vechi.
4. **Curățat toate rămășițele de chei vechi din cod:** `pages-contract.jsx` (seed `TEMPLATES` → chei noi; `buildContractBody` fallback → generic pe label-uri din registry; referințe `company_rep → firma_reprezentant`, `driver_name → client_ci_nume_complet`); `pages-assets.jsx` (eliminat 3× `contractMap` — cod mort). Verificat: **0 chei vechi în tot `proto/`**.
5. **Fix `legal_rep` gol** pentru `stefan@rapidact.ro` (`eu_nume_complet` → `profile.legal_rep`) → numele ÎMPRUMUTĂTOR/părții nu mai apare gol în contract.
6. **Semnături/imagini INLINE** la poziția `{{semnatura_*}}` din `body_template`; **eliminat blocul hardcodat LOCATOR/LOCATAR** de la final (token private-use + `imgMap` la generare; preview HTML arată marcaj). Rezolvă problema „semnături duble" + terminologie greșită.
7. **Notat:** `pages-templates.jsx` eliminat anterior (management template = admin-only). Pending #1, #2, #4 actualizate.
8. **Rămas neatins:** formatarea text în PDF (`**bold**`/`[center]`/`[size=N]` apar încă literal) — pending #3.
