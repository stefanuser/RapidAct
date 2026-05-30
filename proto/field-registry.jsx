// proto/field-registry.jsx — SURSĂ UNICĂ pentru toate câmpurile din contracte.
//
// Încărcat ÎNAINTEA celorlalte fișiere proto, în AMBELE aplicații (index.html + admin.html).
// Exportă pe window: FIELD_REGISTRY, CAT_ORDER, CAT_ICONS, CONTRACT_GROUPS, SOURCE_STYLE,
//                    extractFields(), fieldsByCategory().
//
// ─── Schema unui câmp ──────────────────────────────────────────────────────────
//   label        string   — nume afișat (RO)
//   cat          string   — categorie picker (vezi CAT_ORDER)
//   group        string?  — sub-grupă picker, DOAR pentru cat:'Contract' (Generic/Auto/Imobiliare/Servicii)
//   source       string   — 'ocr' | 'profile' | 'asset' | 'manual' | 'computed' | 'static'
//   type         string?  — randare: 'text'|'number'|'date'|'datetime'|'select'|'textarea'|'image'
//   desc         string?  — hint scurt în picker
//
//   ── metadata de rezolvare a valorii (în funcție de source) ──
//   ocrDoc       string?  — source:'ocr'     → 'ci' | 'permis' | 'pasaport'
//   ocrKey       string?  — source:'ocr'     → cheia din rezultatul OCR (vezi DOC_SCHEMAS în pages-contract.jsx)
//   profileKey   string?  — source:'profile' → coloana din tabela profiles
//   assetType    string?  — source:'asset'   → 'car' | 'property' | 'company'
//   assetKey     string?  — source:'asset'   → cheia din asset.details
//   compute      string?  — source:'computed'→ 'today' | 'days_between' | 'total'
//
//   ── randare formular (câmpuri manual/computed, folosite de StepForm) ──
//   formGroup    string?  — titlul secțiunii din formular (ex. 'Perioadă', 'Tarife și plată')
//   required     bool?
//   placeholder  string?
//   options      string[]? — pentru type:'select'
//
// NOTĂ: unele câmpuri OCR (loc naștere, adresă, cetățenie...) au ocrKey declarat dar
// NU sunt încă extrase de DOC_SCHEMAS. Se rezolvă la '' până se extinde OCR-ul. Forward-compatible.

const FIELD_REGISTRY = {
  // ══ CI Client (OCR) ═════════════════════════════════════════════════════════
  client_ci_nume_complet:  { label:'Nume complet',      cat:'CI Client', source:'ocr', ocrDoc:'ci', ocrKey:'full_name',       desc:'Extras automat din CI' },
  client_ci_cnp:           { label:'CNP',               cat:'CI Client', source:'ocr', ocrDoc:'ci', ocrKey:'cnp',             desc:'Cod Numeric Personal' },
  client_ci_serie:         { label:'Serie CI',          cat:'CI Client', source:'ocr', ocrDoc:'ci', ocrKey:'ci_serie',        desc:'Ex: RX, MZ, KL' },
  client_ci_numar:         { label:'Număr CI',          cat:'CI Client', source:'ocr', ocrDoc:'ci', ocrKey:'ci_nr' },
  client_ci_data_nastere:  { label:'Data nașterii',     cat:'CI Client', source:'ocr', ocrDoc:'ci', ocrKey:'data_nastere' },
  client_ci_loc_nastere:   { label:'Locul nașterii',    cat:'CI Client', source:'ocr', ocrDoc:'ci', ocrKey:'loc_nastere' },
  client_ci_adresa:        { label:'Adresă domiciliu',  cat:'CI Client', source:'ocr', ocrDoc:'ci', ocrKey:'adresa' },
  client_ci_cetatenie:     { label:'Cetățenie',         cat:'CI Client', source:'ocr', ocrDoc:'ci', ocrKey:'cetatenie' },
  client_ci_sex:           { label:'Sex',               cat:'CI Client', source:'ocr', ocrDoc:'ci', ocrKey:'sex',             desc:'M / F' },
  client_ci_emisa_de:      { label:'Emisă de',          cat:'CI Client', source:'ocr', ocrDoc:'ci', ocrKey:'emisa_de' },
  client_ci_data_emitere:  { label:'Data emiterii',     cat:'CI Client', source:'ocr', ocrDoc:'ci', ocrKey:'data_emitere' },
  client_ci_valabila_pana: { label:'Valabilă până',     cat:'CI Client', source:'ocr', ocrDoc:'ci', ocrKey:'ci_valabilitate' },

  // ══ Permis Client (OCR) ═══════════════════════════════════════════════════════
  client_permis_numar:        { label:'Număr permis',   cat:'Permis Client', source:'ocr', ocrDoc:'permis', ocrKey:'nr' },
  client_permis_cnp:          { label:'CNP',            cat:'Permis Client', source:'ocr', ocrDoc:'permis', ocrKey:'cnp' },
  client_permis_nume:         { label:'Nume',           cat:'Permis Client', source:'ocr', ocrDoc:'permis', ocrKey:'nume' },
  client_permis_prenume:      { label:'Prenume',        cat:'Permis Client', source:'ocr', ocrDoc:'permis', ocrKey:'prenume' },
  client_permis_data_nastere: { label:'Data nașterii',  cat:'Permis Client', source:'ocr', ocrDoc:'permis', ocrKey:'data_nastere' },
  client_permis_emis_de:      { label:'Emis de',        cat:'Permis Client', source:'ocr', ocrDoc:'permis', ocrKey:'emis_de' },
  client_permis_data_emitere: { label:'Data emiterii',  cat:'Permis Client', source:'ocr', ocrDoc:'permis', ocrKey:'data_emitere' },
  client_permis_valabil_pana: { label:'Valabil până',   cat:'Permis Client', source:'ocr', ocrDoc:'permis', ocrKey:'expirare' },
  client_permis_categorii:    { label:'Categorii',      cat:'Permis Client', source:'ocr', ocrDoc:'permis', ocrKey:'categorii', desc:'Ex: B, BE, C' },

  // ══ Pașaport Client (OCR) ═════════════════════════════════════════════════════
  client_pasaport_numar:        { label:'Număr pașaport', cat:'Pașaport Client', source:'ocr', ocrDoc:'pasaport', ocrKey:'nr' },
  client_pasaport_cnp:          { label:'CNP',            cat:'Pașaport Client', source:'ocr', ocrDoc:'pasaport', ocrKey:'cnp' },
  client_pasaport_nume:         { label:'Nume',           cat:'Pașaport Client', source:'ocr', ocrDoc:'pasaport', ocrKey:'nume' },
  client_pasaport_prenume:      { label:'Prenume',        cat:'Pașaport Client', source:'ocr', ocrDoc:'pasaport', ocrKey:'prenume' },
  client_pasaport_data_nastere: { label:'Data nașterii',  cat:'Pașaport Client', source:'ocr', ocrDoc:'pasaport', ocrKey:'data_nastere' },
  client_pasaport_loc_nastere:  { label:'Locul nașterii', cat:'Pașaport Client', source:'ocr', ocrDoc:'pasaport', ocrKey:'loc_nastere' },
  client_pasaport_cetatenie:    { label:'Cetățenie',      cat:'Pașaport Client', source:'ocr', ocrDoc:'pasaport', ocrKey:'cetatenie' },
  client_pasaport_sex:          { label:'Sex',            cat:'Pașaport Client', source:'ocr', ocrDoc:'pasaport', ocrKey:'sex' },
  client_pasaport_emis_de:      { label:'Emis de',        cat:'Pașaport Client', source:'ocr', ocrDoc:'pasaport', ocrKey:'emis_de' },
  client_pasaport_data_emitere: { label:'Data emiterii',  cat:'Pașaport Client', source:'ocr', ocrDoc:'pasaport', ocrKey:'data_emitere' },
  client_pasaport_valabil_pana: { label:'Valabil până',   cat:'Pașaport Client', source:'ocr', ocrDoc:'pasaport', ocrKey:'expirare' },

  // ══ Asset — Auto (assetType:'car', asset.details) ════════════════════════════
  asset_auto_marca:            { label:'Marcă',             cat:'Asset Auto', source:'asset', assetType:'car', assetKey:'make' },
  asset_auto_model:            { label:'Model',             cat:'Asset Auto', source:'asset', assetType:'car', assetKey:'model' },
  asset_auto_an:               { label:'An fabricație',     cat:'Asset Auto', source:'asset', assetType:'car', assetKey:'year' },
  asset_auto_culoare:          { label:'Culoare',           cat:'Asset Auto', source:'asset', assetType:'car', assetKey:'color' },
  asset_auto_nr_inmatriculare: { label:'Nr. înmatriculare', cat:'Asset Auto', source:'asset', assetType:'car', assetKey:'plate' },
  asset_auto_vin:              { label:'Serie VIN / Șasiu', cat:'Asset Auto', source:'asset', assetType:'car', assetKey:'vin' },
  asset_auto_combustibil:      { label:'Tip combustibil',   cat:'Asset Auto', source:'asset', assetType:'car', assetKey:'fuel' },
  asset_auto_capacitate:       { label:'Capacitate (cc)',   cat:'Asset Auto', source:'asset', assetType:'car', assetKey:'engine_cc' },
  asset_auto_putere:           { label:'Putere (CP/kW)',    cat:'Asset Auto', source:'asset', assetType:'car', assetKey:'power' },
  asset_auto_nr_locuri:        { label:'Nr. locuri',        cat:'Asset Auto', source:'asset', assetType:'car', assetKey:'seats' },
  asset_auto_itp_pana:         { label:'ITP valabil până',  cat:'Asset Auto', source:'asset', assetType:'car', assetKey:'itp_exp' },
  asset_auto_rca_pana:         { label:'RCA valabil până',  cat:'Asset Auto', source:'asset', assetType:'car', assetKey:'rca_exp' },
  asset_auto_casco:            { label:'Asigurare CASCO',   cat:'Asset Auto', source:'asset', assetType:'car', assetKey:'casco', desc:'Inclusă / Nu este inclusă' },

  // ══ Asset — Proprietate (assetType:'property') ════════════════════════════════
  asset_prop_adresa:       { label:'Adresă',             cat:'Asset Proprietate', source:'asset', assetType:'property', assetKey:'address' },
  asset_prop_oras:         { label:'Oraș',               cat:'Asset Proprietate', source:'asset', assetType:'property', assetKey:'city' },
  asset_prop_judet:        { label:'Județ',              cat:'Asset Proprietate', source:'asset', assetType:'property', assetKey:'county' },
  asset_prop_suprafata:    { label:'Suprafață (mp)',     cat:'Asset Proprietate', source:'asset', assetType:'property', assetKey:'surface' },
  asset_prop_etaj:         { label:'Etaj',               cat:'Asset Proprietate', source:'asset', assetType:'property', assetKey:'floor' },
  asset_prop_nr_camere:    { label:'Nr. camere',         cat:'Asset Proprietate', source:'asset', assetType:'property', assetKey:'rooms' },
  asset_prop_nr_cadastral: { label:'Nr. cadastral',      cat:'Asset Proprietate', source:'asset', assetType:'property', assetKey:'cadastral' },
  asset_prop_cf:           { label:'Nr. carte funciară', cat:'Asset Proprietate', source:'asset', assetType:'property', assetKey:'cf' },
  asset_prop_tip:          { label:'Tip proprietate',    cat:'Asset Proprietate', source:'asset', assetType:'property', assetKey:'prop_type', desc:'Apartament, casă, teren...' },

  // ══ Asset — Companie (assetType:'company') ════════════════════════════════════
  asset_comp_denumire:       { label:'Denumire',           cat:'Asset Companie', source:'asset', assetType:'company', assetKey:'name' },
  asset_comp_cui:            { label:'CUI',                cat:'Asset Companie', source:'asset', assetType:'company', assetKey:'cui' },
  asset_comp_reg_com:        { label:'Reg. Comerțului',    cat:'Asset Companie', source:'asset', assetType:'company', assetKey:'reg_com' },
  asset_comp_adresa:         { label:'Adresă sediu',       cat:'Asset Companie', source:'asset', assetType:'company', assetKey:'address' },
  asset_comp_oras:           { label:'Oraș',               cat:'Asset Companie', source:'asset', assetType:'company', assetKey:'city' },
  asset_comp_administrator:  { label:'Administrator',      cat:'Asset Companie', source:'asset', assetType:'company', assetKey:'contact_name' },
  asset_comp_capital_social: { label:'Capital social',     cat:'Asset Companie', source:'asset', assetType:'company', assetKey:'capital' },
  asset_comp_iban:           { label:'IBAN',               cat:'Asset Companie', source:'asset', assetType:'company', assetKey:'iban' },
  asset_comp_banca:          { label:'Bancă',              cat:'Asset Companie', source:'asset', assetType:'company', assetKey:'bank' },

  // ══ Eu — date personale (profiles) ════════════════════════════════════════════
  eu_nume_complet:        { label:'Nume complet',     cat:'Eu', source:'profile', profileKey:'legal_rep' },
  eu_cnp:                 { label:'CNP',              cat:'Eu', source:'profile', profileKey:'cnp' },
  eu_ci_serie:            { label:'Serie CI',         cat:'Eu', source:'profile', profileKey:'ci_serie' },
  eu_ci_numar:            { label:'Număr CI',         cat:'Eu', source:'profile', profileKey:'ci_nr' },
  eu_ci_valabila:         { label:'CI valabilă până', cat:'Eu', source:'profile', profileKey:'ci_valabilitate' },
  eu_adresa:              { label:'Adresă domiciliu', cat:'Eu', source:'profile', profileKey:'adresa' },
  eu_permis_nr:           { label:'Nr. permis',       cat:'Eu', source:'profile', profileKey:'permis_nr' },
  eu_permis_categorii:    { label:'Categorii permis', cat:'Eu', source:'profile', profileKey:'permis_categorii' },
  eu_permis_valabil_pana: { label:'Permis valabil până', cat:'Eu', source:'profile', profileKey:'permis_expirare' },

  // ══ Firma mea (profiles) ══════════════════════════════════════════════════════
  firma_denumire:     { label:'Denumire firmă',    cat:'Firma mea', source:'profile', profileKey:'firm_name' },
  firma_cui:          { label:'CUI',               cat:'Firma mea', source:'profile', profileKey:'firm_cui' },
  firma_reg_com:      { label:'Reg. Comerțului',   cat:'Firma mea', source:'profile', profileKey:'firm_reg' },
  firma_adresa:       { label:'Adresă',            cat:'Firma mea', source:'profile', profileKey:'firm_address' },
  firma_reprezentant: { label:'Reprezentant legal',cat:'Firma mea', source:'profile', profileKey:'legal_rep' },
  firma_iban:         { label:'IBAN',              cat:'Firma mea', source:'profile', profileKey:'firm_iban',  desc:'(necesită coloană în profiles)' },
  firma_banca:        { label:'Bancă',             cat:'Firma mea', source:'profile', profileKey:'firm_banca', desc:'(necesită coloană în profiles)' },
  firma_logo:         { label:'Logo firmă',        cat:'Firma mea', source:'profile', profileKey:'logo_url', type:'image', desc:'Imagine din profil' },
  rapidact_logo:      { label:'Logo RapidAct',     cat:'Firma mea', source:'static',  type:'image', desc:'Branding platformă' },

  // ══ Contract — Generic ════════════════════════════════════════════════════════
  contract_data:             { label:'Data contractului', cat:'Contract', group:'Generic', source:'computed', compute:'today', type:'text',     formGroup:'Contract', required:true,  desc:'Completată automat cu data de azi' },
  contract_numar:            { label:'Număr contract',    cat:'Contract', group:'Generic', source:'manual',   type:'text',     formGroup:'Contract', required:false, placeholder:'ex. 142' },
  contract_loc:              { label:'Locul încheierii',  cat:'Contract', group:'Generic', source:'manual',   type:'text',     formGroup:'Contract', required:true,  placeholder:'ex. București' },
  contract_valoare:          { label:'Valoare totală',    cat:'Contract', group:'Generic', source:'manual',   type:'number',   formGroup:'Tarife și plată', required:false, placeholder:'ex. 1500' },
  contract_moneda:           { label:'Monedă',            cat:'Contract', group:'Generic', source:'manual',   type:'select',   formGroup:'Tarife și plată', required:false, options:['RON','EUR','USD'] },
  contract_observatii:       { label:'Observații',        cat:'Contract', group:'Generic', source:'manual',   type:'textarea', formGroup:'Contract', required:false, placeholder:'Mențiuni, daune, clauze speciale...' },
  contract_perioada_de_la:   { label:'De la',             cat:'Contract', group:'Generic', source:'manual',   type:'date',     formGroup:'Perioadă', required:false, desc:'Data de început a perioadei' },
  contract_perioada_pana_la: { label:'Până la',           cat:'Contract', group:'Generic', source:'manual',   type:'date',     formGroup:'Perioadă', required:false, desc:'Data de sfârșit a perioadei' },
  contract_termen:           { label:'Termen de',         cat:'Contract', group:'Generic', source:'manual',   type:'text',     formGroup:'Perioadă', required:false, placeholder:'ex. 1 an, 6 luni, 30 zile' },

  // ══ Contract — Auto ═══════════════════════════════════════════════════════════
  contract_start:             { label:'Data și ora predării',    cat:'Contract', group:'Auto', source:'manual',   type:'datetime', formGroup:'Perioadă',        required:true },
  contract_end:               { label:'Data și ora restituirii', cat:'Contract', group:'Auto', source:'manual',   type:'datetime', formGroup:'Perioadă',        required:true },
  contract_durata:            { label:'Nr. zile închiriate',     cat:'Contract', group:'Auto', source:'computed', compute:'days_between', type:'number', formGroup:'Perioadă', required:true, desc:'Calculat din date' },
  contract_pret_zi:           { label:'Tarif / zi (RON)',        cat:'Contract', group:'Auto', source:'manual',   type:'number',   formGroup:'Tarife și plată', required:true,  placeholder:'ex. 150' },
  contract_total:             { label:'Total (RON)',             cat:'Contract', group:'Auto', source:'computed', compute:'total', type:'number', formGroup:'Tarife și plată', required:true, desc:'Zile × tarif' },
  contract_garantie:          { label:'Garanție (RON)',          cat:'Contract', group:'Auto', source:'manual',   type:'number',   formGroup:'Tarife și plată', required:true,  placeholder:'ex. 500' },
  contract_mod_plata:         { label:'Mod de plată',            cat:'Contract', group:'Auto', source:'manual',   type:'select',   formGroup:'Tarife și plată', required:true,  options:['Numerar','Card bancar','Transfer bancar','Online'] },
  contract_km_start:          { label:'Km la predare',           cat:'Contract', group:'Auto', source:'manual',   type:'number',   formGroup:'Condiții',        required:true,  placeholder:'ex. 45230' },
  contract_km_limita:         { label:'Km incluși / zi',         cat:'Contract', group:'Auto', source:'manual',   type:'select',   formGroup:'Condiții',        required:true,  options:['Nelimitați','100 km/zi','150 km/zi','200 km/zi','300 km/zi'] },
  contract_combustibil_nivel: { label:'Combustibil la predare',  cat:'Contract', group:'Auto', source:'manual',   type:'select',   formGroup:'Condiții',        required:true,  options:['1/4','1/2','3/4','Plin'] },
  contract_fransiza:          { label:'Franșiță daune (RON)',    cat:'Contract', group:'Auto', source:'manual',   type:'number',   formGroup:'Condiții',        required:false, placeholder:'ex. 1000' },

  // ══ Contract — Imobiliare ═════════════════════════════════════════════════════
  contract_chirie_lunara: { label:'Chirie lunară',     cat:'Contract', group:'Imobiliare', source:'manual', type:'number', formGroup:'Tarife și plată', required:true,  placeholder:'ex. 2000' },
  contract_durata_luni:   { label:'Durată (luni)',     cat:'Contract', group:'Imobiliare', source:'manual', type:'number', formGroup:'Perioadă',        required:true,  placeholder:'ex. 12' },
  contract_termen_plata:  { label:'Termen plată (ziua)',cat:'Contract', group:'Imobiliare', source:'manual', type:'text',  formGroup:'Tarife și plată', required:false, placeholder:'ex. ziua 5 a lunii' },
  contract_data_intrare:  { label:'Data intrării',     cat:'Contract', group:'Imobiliare', source:'manual', type:'date',   formGroup:'Perioadă',        required:false },
  contract_data_iesire:   { label:'Data ieșirii',      cat:'Contract', group:'Imobiliare', source:'manual', type:'date',   formGroup:'Perioadă',        required:false },
  contract_destinatie:    { label:'Destinația spațiului', cat:'Contract', group:'Imobiliare', source:'manual', type:'text', formGroup:'Condiții',       required:false, placeholder:'ex. locuință, birou' },
  contract_utilitati:     { label:'Utilități incluse', cat:'Contract', group:'Imobiliare', source:'manual', type:'text',   formGroup:'Condiții',        required:false },

  // ══ Contract — Servicii ═══════════════════════════════════════════════════════
  contract_obiect:            { label:'Obiectul contractului', cat:'Contract', group:'Servicii', source:'manual', type:'textarea', formGroup:'Contract',  required:true,  placeholder:'Descrierea serviciului prestat' },
  contract_termen_livrare:    { label:'Termen de livrare',     cat:'Contract', group:'Servicii', source:'manual', type:'text',     formGroup:'Perioadă',  required:false },
  contract_penalitati:        { label:'Penalități întârziere', cat:'Contract', group:'Servicii', source:'manual', type:'text',     formGroup:'Condiții',  required:false },
  contract_garantie_executie: { label:'Garanție de execuție',  cat:'Contract', group:'Servicii', source:'manual', type:'text',     formGroup:'Tarife și plată', required:false },

  // ══ Semnături ═════════════════════════════════════════════════════════════════
  semnatura_mea:    { label:'Semnătura mea',         cat:'Semnături', source:'profile', profileKey:'signature', type:'image', desc:'Imagine din profilul tău' },
  semnatura_client: { label:'Semnătura clientului',  cat:'Semnături', source:'manual',  type:'image', desc:'Desenată de client în chenarul de semnat' },
};

// ─── Vocabular categorii ────────────────────────────────────────────────────────
const CAT_ORDER = [
  'CI Client','Permis Client','Pașaport Client',
  'Asset Auto','Asset Proprietate','Asset Companie',
  'Eu','Firma mea','Contract','Semnături',
];
const CAT_ICONS = {
  'CI Client':'🪪', 'Permis Client':'🚗', 'Pașaport Client':'🛂',
  'Asset Auto':'🚙', 'Asset Proprietate':'🏠', 'Asset Companie':'🏢',
  'Eu':'👤', 'Firma mea':'🏛️', 'Contract':'📋', 'Semnături':'✍️',
};
const CONTRACT_GROUPS = ['Generic','Auto','Imobiliare','Servicii'];

// ─── Categorii TEMPLATE (sursă unică: picker contract, admin, editor user) ───────
// Cele 4 categorii tematice — atribuibile oricărui template (global SAU al userului).
const TEMPLATE_CATEGORIES = [
  { id:'Imobiliare',    icon:'🏠' },
  { id:'Rent a car',    icon:'🚗' },
  { id:'Resurse Umane', icon:'👥' },
  { id:'General',       icon:'📋' },
];
// Grupare VIRTUALĂ (nu se atribuie din dropdown): template-urile create de
// utilizator (user_id ≠ null). În admin = secțiunea per-utilizator (👤).
const TEMPLATE_CAT_MINE         = { id:'Contractele Mele', icon:'📁' };
const TEMPLATE_CAT_IDS          = TEMPLATE_CATEGORIES.map(c => c.id);
const DEFAULT_TEMPLATE_CATEGORY = 'General';
const templateCatIcon = (cat) =>
  (TEMPLATE_CATEGORIES.find(c => c.id === cat)?.icon) || '📄';

// ─── Stiluri badge pe sursă ─────────────────────────────────────────────────────
const SOURCE_STYLE = {
  ocr:      { bg:'#dcfce7', color:'#166534', label:'OCR'     },
  profile:  { bg:'#dbeafe', color:'#1e40af', label:'Profil'  },
  manual:   { bg:'#fef9c3', color:'#92400e', label:'Manual'  },
  computed: { bg:'#f3e8ff', color:'#6b21a8', label:'Auto'    },
  asset:    { bg:'#fce7f3', color:'#9d174d', label:'Activ'   },
  static:   { bg:'#f1f5f9', color:'#475569', label:'Static'  },
  image:    { bg:'#fff7ed', color:'#9a3412', label:'Imagine' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Extrage cheile {{...}} dintr-un body, păstrând doar cele existente în registry.
function extractFields(bodyText) {
  if (!bodyText) return [];
  return [...new Set(
    (bodyText.match(/\{\{([^}]+)\}\}/g) || [])
      .map(m => m.slice(2, -2).trim())
      .filter(k => k in FIELD_REGISTRY)
  )];
}
// Întoarce perechile [key, def] dintr-o categorie (+ sub-grup opțional pentru 'Contract').
function fieldsByCategory(cat, group) {
  return Object.entries(FIELD_REGISTRY).filter(([, v]) => {
    if (v.cat !== cat) return false;
    if (cat === 'Contract' && group && v.group !== group) return false;
    return true;
  });
}

// ─── Export global ──────────────────────────────────────────────────────────────
Object.assign(window, {
  FIELD_REGISTRY, CAT_ORDER, CAT_ICONS, CONTRACT_GROUPS, SOURCE_STYLE,
  TEMPLATE_CATEGORIES, TEMPLATE_CAT_MINE, TEMPLATE_CAT_IDS,
  DEFAULT_TEMPLATE_CATEGORY, templateCatIcon,
  extractFields, fieldsByCategory,
});
