const plans = {
  FREE: {
    name: 'Free',
    price: 0,
    templatesAllowed: 3,
    unlimitedProducts: false,
    customization: false,
    advancedDesignTools: false,
    professionalTemplates: false,
  },
  BASIC: {
    name: 'Basic',
    price: 5,
    templatesAllowed: 8,
    unlimitedProducts: true,
    customization: true,
    advancedDesignTools: false,
    professionalTemplates: false,
  },
  PRO: {
    name: 'Pro',
    price: 10,
    introOffer: '$8 for first 2 months',
    templatesAllowed: 20,
    unlimitedProducts: true,
    customization: true,
    advancedDesignTools: true,
    professionalTemplates: true,
  },
};

const templates = [
  ...Array.from({ length: 3 }).map((_, i) => ({ id: `free-${i + 1}`, tier: 'FREE', name: `Free Template ${i + 1}` })),
  ...Array.from({ length: 8 }).map((_, i) => ({ id: `basic-${i + 1}`, tier: 'BASIC', name: `Basic Template ${i + 1}` })),
  ...Array.from({ length: 20 }).map((_, i) => ({ id: `pro-${i + 1}`, tier: 'PRO', name: `Pro Template ${i + 1}` })),
];

const algeriaWilayas = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Bejaia','Biskra','Bechar','Blida','Bouira','Tamanrasset',
  'Tebessa','Tlemcen','Tiaret','Tizi Ouzou','Algiers','Djelfa','Jijel','Setif','Saida','Skikda','Sidi Bel Abbes',
  'Annaba','Guelma','Constantine','Medea','Mostaganem','Msila','Mascara','Ouargla','Oran','El Bayadh','Illizi',
  'Bordj Bou Arreridj','Boumerdes','El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza',
  'Mila','Ain Defla','Naama','Ain Temouchent','Ghardaia','Relizane','Timimoun','Bordj Badji Mokhtar','Ouled Djellal',
  'Beni Abbes','In Salah','In Guezzam','Touggourt','Djanet','El Meghaier','El Meniaa'
];

module.exports = { plans, templates, algeriaWilayas };
