const otpTypes = {
  SMS: 1,
  EMAIL: 2
}

const paymentModes = {
  CC: 0,
  SEPA: 1
}

const daysOfWeek = ['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM']

const fiscalRegimes = [
  { label: 'RF01: Ordinario', value: 'RF01' },
  {
    label: 'RF02: Contribuenti minimi',
    value: 'RF02'
  },
  {
    label: 'RF03: Nuove iniziative produttive',
    value: 'RF03'
  },
  {
    label: 'RF04: Agricoltura e attività connesse e pesca',
    value: 'RF04'
  },
  {
    label: 'RF05: Vendita sali e tabacchi',
    value: 'RF05'
  },
  {
    label: 'RF06: Commercio fiammiferi',
    value: 'RF06'
  },
  { label: 'RF07: Editoria', value: 'RF07' },
  {
    label: 'RF08: Gestione servizi telefonia pubblica',
    value: 'RF08'
  },
  {
    label: 'RF09: Rivendita documenti di trasporto pubblico e di sosta',
    value: 'RF09'
  },
  {
    label:
      'RF10: Intrattenimenti, giochi e altre attività di cui alla tariffa allegata al DPR 640/72',
    value: 'RF10'
  },
  {
    label: 'RF11: Agenzie viaggi e turismo',
    value: 'RF11'
  },
  { label: 'RF12: Agriturismo', value: 'RF12' },
  {
    label: 'RF13: Vendite a domicilio',
    value: 'RF13'
  },
  {
    label:
      'RF14: Rivendita beni usati, oggetti d’arte, d’antiquariato o da collezione',
    value: 'RF14'
  },
  {
    label:
      'RF15: Agenzie di vendite all’asta di oggetti d’arte, antiquariato o da collezione',
    value: 'RF15'
  },
  { label: 'RF16: IVA per cassa P.A.', value: 'RF16' },
  { label: 'RF17: IVA per cassa', value: 'RF17' },
  { label: 'RF18: Altro', value: 'RF18' },
  {
    label: 'RF19: Regime forfettario',
    value: 'RF19'
  }
]
const legalNatures = [
  { label: 'Impresa Individuale', value: 'Impresa Individuale' },
  { label: 'S.s.', value: 'S.s.' },
  { label: 'S.n.c.', value: 'S.n.c.' },
  { label: 'S.a.s.', value: 'S.a.s.' },
  { label: 'S.r.l.', value: 'S.r.l.' },
  { label: 'S.r.l.s.', value: 'S.r.l.s.' },
  { label: 'S.p.a.', value: 'S.p.a.' },
  { label: 'S.a.p.a.', value: 'S.a.p.a.' },
  { label: 'S.a.p.a.', value: 'S.a.p.a.' },
  { label: 'S.c.a.r.l.', value: 'S.c.a.r.l.' },
  { label: 'S.c.p.A.', value: 'S.c.p.A.' }
]

const unitSubcategoryToCategory = {
  1: 1,
  2: 1,
  3: 1,
  4: 2,
  5: 2,
  6: 2,
  7: 1,
  8: 3,
  9: 10,
  10: 4,
  11: 4,
  12: 4,
  13: 4,
  14: 5,
  15: 5,
  16: 5,
  18: 6,
  19: 5,
  20: 5,
  21: 5,
  22: 7,
  23: 7,
  24: 7,
  25: 7,
  26: 7,
  27: 7,
  28: 7,
  29: 8,
  30: 8,
  31: 8,
  32: 8,
  33: 8,
  34: 8,
  35: 8,
  36: 9,
  38: 3,
  39: 3
}

const unitCategoryOptions = [
  {
    label: 'Cibo, Bevande',
    value: '1'
  },
  { label: 'Accoglienza', value: '2' },
  {
    label: 'Bellezza e Benessere',
    value: '3'
  },
  {
    label: 'Salute',
    value: '4'
  },
  {
    label: 'Vendita al dettaglio',
    value: '5'
  },
  {
    label: 'Supermercato / Alimentari',
    value: '6'
  },
  {
    label: 'Servizi',
    value: '7'
  },
  {
    label: 'Intrattenimento',
    value: '8'
  },
  {
    label: 'Organizzazione di beneficenza',
    value: '9'
  },
  {
    label: 'Sport',
    value: '10'
  }
]

const unitSubcategoryOptions = [
  {
    label: 'Bar / Club / Caffé',
    value: { subCategory: '1', category: '1' }
  },
  {
    label: 'Ristorante / Fast Food',
    value: { subCategory: '2', category: '1' }
  },
  {
    label: 'Catering / Consegne',
    value: { subCategory: '3', category: '1' }
  },
  {
    label: 'Hotel / B&B / Albergo',
    value: { subCategory: '4', category: '2' }
  },
  {
    label: 'Camping',
    value: { subCategory: '5', category: '2' }
  },
  {
    label: 'Agriturismo',
    value: { subCategory: '6', category: '2' }
  },
  {
    label: 'Altro',
    value: { subCategory: '7', category: '1' }
  },
  {
    label: 'Parrucchiere',
    value: { subCategory: '8', category: '3' }
  },
  {
    label: 'Fitness',
    value: { subCategory: '9', category: '10' }
  },
  {
    label: 'Servizi medici',
    value: { subCategory: '10', category: '4' }
  },
  {
    label: 'Dentista',
    value: { subCategory: '11', category: '4' }
  },
  {
    label: 'Veterinario',
    value: { subCategory: '12', category: '4' }
  },
  {
    label: 'Altro',
    value: { subCategory: '13', category: '4' }
  },
  {
    label: 'Abbigliamento / Moda',
    value: { subCategory: '14', category: '5' }
  },
  {
    label: 'Giornali / Tabacchi',
    value: { subCategory: '15', category: '5' }
  },
  {
    label: 'Libreria',
    value: { subCategory: '16', category: '5' }
  },
  {
    label: 'Supermercato / Alimentari',
    value: { subCategory: '18', category: '6' }
  },
  {
    label: 'Informatica / Tech',
    value: { subCategory: '19', category: '5' }
  },
  {
    label: 'Arredamento',
    value: { subCategory: '20', category: '5' }
  },
  {
    label: 'Altro',
    value: { subCategory: '21', category: '5' }
  },
  {
    label: 'Taxi / NCC',
    value: { subCategory: '22', category: '7' }
  },
  {
    label: 'Trasporto pubblico',
    value: { subCategory: '23', category: '7' }
  },
  {
    label: 'Servizi professionali',
    value: { subCategory: '24', category: '7' }
  },
  {
    label: 'Artigiano',
    value: { subCategory: '25', category: '7' }
  },
  {
    label: 'Consulenza',
    value: { subCategory: '26', category: '7' }
  },
  {
    label: 'Educazione',
    value: { subCategory: '27', category: '7' }
  },
  {
    label: 'Altro',
    value: { subCategory: '28', category: '7' }
  },
  {
    label: 'Musica',
    value: { subCategory: '29', category: '8' }
  },
  {
    label: 'Concerti',
    value: { subCategory: '30', category: '8' }
  },
  {
    label: 'Cinema',
    value: { subCategory: '31', category: '8' }
  },
  {
    label: 'Teatro',
    value: { subCategory: '32', category: '8' }
  },
  {
    label: 'Musei',
    value: { subCategory: '33', category: '8' }
  },
  {
    label: 'Fiere',
    value: { subCategory: '34', category: '8' }
  },
  {
    label: 'Altro',
    value: { subCategory: '35', category: '8' }
  },
  {
    label: 'Organizzazione di beneficenza',
    value: { subCategory: '36', category: '9' }
  },
  {
    label: 'Wellness / Spa',
    value: { subCategory: '38', category: '3' }
  },
  {
    label: 'Estetica',
    value: { subCategory: '39', category: '3' }
  }
]

const unitCategory = {
  CITY: 1,
  ALIMENTARY: 2,
  COMPANY: 3
}

const userRoles = {
  ADMIN: 1,
  PIVA: 2,
  MERCHANT: 3,
  GENERATOR_DISTRIBUTOR: 4,
  DEPENDENT: 5,
  COLLABORATOR: 6,
  MERCHANT_ADMIN: 7
}

const unitScopes = {
  NONE: 0, // Nessuno scope unità, quindi privato
  TODUBA_ADMIN: 1,
  PIVA: 2,
  MERCHANT: 3,
  COMPANY: 4,
  CIRCUITO_SPESA: 5,
  MERCHANT_ADMIN: 6
}

const LIMITEBOLLO = 77.47

const scopeDescriptions = {
  [unitScopes.NONE]: 'Privato',
  [unitScopes.TODUBA_ADMIN]: 'Amministratore Toduba',
  [unitScopes.PIVA]: 'Autonomo',
  [unitScopes.MERCHANT]: 'Punto vendita',
  [unitScopes.COMPANY]: 'Azienda',
  [unitScopes.CIRCUITO_SPESA]: 'Circuito di spesa',
  [unitScopes.MERCHANT_ADMIN]: 'Esercente'
}

const assetsCodeOptions = [
  {
    label: 'Buoni pasto',
    name: 'Buoni pasto',
    value: process.env.NEXT_PUBLIC_STELLAR_TICKET_BP_ASSET
  },
  {
    label: 'Spese aziendali',
    name: 'Spese aziendali',
    value: process.env.NEXT_PUBLIC_STELLAR_TICKET_SR_ASSET
  },
  {
    label: 'Benefit',
    name: 'Benefit',
    value: process.env.NEXT_PUBLIC_STELLAR_TICKET_GIFT_ASSET
  }
]

const assetsCodeOptionsIndex = {
  [process.env.NEXT_PUBLIC_STELLAR_TICKET_BP_ASSET]: 0,
  [process.env.NEXT_PUBLIC_STELLAR_TICKET_SR_ASSET]: 1,
  [process.env.NEXT_PUBLIC_STELLAR_TICKET_GIFT_ASSET]: 2
}

const monthOptions = [
  {
    label: 'Gennaio',
    value: '1'
  },
  { label: 'Febbraio', value: '2' },
  {
    label: 'Marzo',
    value: '3'
  },
  {
    label: 'Aprile',
    value: '4'
  },
  {
    label: 'Maggio',
    value: '5'
  },
  {
    label: 'Giugno',
    value: '6'
  },
  {
    label: 'Luglio',
    value: '7'
  },
  {
    label: 'Agosto',
    value: '8'
  },
  { label: 'Settembre', value: '9' },
  {
    label: 'Ottobre',
    value: '10'
  },
  {
    label: 'Novembre',
    value: '11'
  },
  {
    label: 'Dicembre',
    value: '12'
  }
]
const statUses = {
  ENABLED: 0,
  DISABLED: 1
}

const transactionsHistoryReportTypes = {
  DAILY: 0,
  WEEKLY: 1,
  MONTHLY: 2
}

const purchaseStatuses = {
  PENDING: 0,
  PROCESSED: 1,
  CANCELED: 2
}

const purchaseInvoiceFees = {
  BP_IVA: 4,
  SERVICE_COSTS_IVA: 22,
  NOTIVA_THRESHOLD: 77.47,
  FEE_NOTIVA: 2
}

module.exports = {
  otpTypes,
  paymentModes,
  daysOfWeek,
  fiscalRegimes,
  legalNatures,
  userRoles,
  unitCategory,
  unitCategoryOptions,
  unitScopes,
  assetsCodeOptions,
  unitSubcategoryOptions,
  unitSubcategoryToCategory,
  monthOptions,
  statUses,
  transactionsHistoryReportTypes,
  scopeDescriptions,
  purchaseStatuses,
  assetsCodeOptionsIndex,
  purchaseInvoiceFees,
  LIMITEBOLLO
}
