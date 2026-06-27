import { MenuCategory } from "../types";

export const RESTAURANT_MENU: MenuCategory[] = [
  {
    id: "spec",
    name: "Specialità Pugliesi",
    items: [
      { name: "Salsiccia Zampina", price: "€ 5 | € 10", allergens: [7] },
      { name: "Gnummareddi", price: "€ 8 | € 15" },
      { name: "Salsiccia a Punta di Coltello, Piccante & Finocchietto", price: "€ 6 | € 12", allergens: [12] },
      { name: "Straccetti di Maiale Panati", price: "€ 5 | € 10", allergens: [1] },
      { name: "Burrata", price: "€ 3,50", allergens: [7] },
      { name: "Burrata Affumicata", price: "€ 4", allergens: [7], tags: ["*"] },
      { name: "Nodini", price: "€ 4", allergens: [7] },
      { name: "Stracciatella Pugliese", price: "€ 4", allergens: [7] },
      { name: "Olive Belle di Cerignola", price: "€ 4" },
      { name: "Olive Nere Fritte", price: "€ 4" }
    ]
  },
  {
    id: "anti",
    name: "Antipasti",
    items: [
      { name: "Tagliere Valle d'Itria", price: "€ 18 | € 24", allergens: [1, 7, 8] },
      { name: "Tagliere Maialino Nero", price: "€ 20", allergens: [12] },
      { name: "Focaccia Barese", price: "€ 16", allergens: [1], tags: ["*"] },
      { name: "Polpette di Pane, Menta e Limone", price: "€ 4", allergens: [1, 3, 7] },
      { name: "Uccelletti Pugliesi", price: "€ 5", allergens: [7, 12] },
      { name: "Tartare di Manzo con Stracciatella e Primitivo", price: "€ 13" },
      { name: "Cialledda con Burrata", price: "€ 8" },
      { name: "Cialledda con baccalà", price: "€ 14" },
      { name: "Pane", price: "€ 1,50", allergens: [1] }
    ]
  },
  {
    id: "prim",
    name: "Primi",
    items: [
      { name: "Cavatelli ai 3 Pomodori e Cacioricotta", price: "€ 11", allergens: [1, 7] },
      { name: "Troccoli al Ragù di Contrada", price: "€ 13", allergens: [1, 7, 9, 12] },
      { name: "Orecchiette con Zucchine, Fiori e Peperone Crusco", price: "€ 13" },
      { name: "Spaghetti all'Assassina", price: "€ 14", allergens: [1], tags: ["🌶️"] }
    ]
  },
  {
    id: "carn",
    name: "Carne",
    items: [
      { name: "Agnello alla Brace (~350g)", price: "€ 17", allergens: [1] },
      { name: "Diaframma di Manzo (~250g)", price: "€ 14", allergens: [1], tags: ["*"] },
      { name: "Straccetti di Manzo Marinati", price: "€ 8 | € 16", allergens: [1] },
      { name: "Galletto #VAINPUGLIA", price: "€ 15" }
    ]
  },
  {
    id: "bomb",
    name: "Bombette",
    items: [
      { name: "Bombetta Classica", price: "€ 5 | € 10", allergens: [7] },
      { name: "Bombetta Piccante", price: "€ 5 | € 10", allergens: [7], tags: ["🌶️"] },
      { name: "Bombetta Panata", price: "€ 5 | € 10", allergens: [1, 7] },
      { name: "Bombetta di Pancetta", price: "€ 5 | € 10", allergens: [1, 7] },
      { name: "Bombetta con Mortadella, Pistacchi e Stracciatella", price: "€ 9 | € 18", allergens: [7, 8, 12] },
      { name: "Bombetta con Capocollo di Martina Franca", price: "€ 8 | € 16", allergens: [7] }
    ]
  },
  {
    id: "cont",
    name: "Contorni",
    items: [
      { name: "Fave e Cicoria", price: "€ 5", allergens: [13], tags: ["*"] },
      { name: "Cicorietta di Campo Ripassata", price: "€ 5" },
      { name: "Patate alla Brace", price: "€ 5" },
      { name: "Patatine Fritte", price: "€ 6", allergens: [1], tags: ["*"] },
      { name: "Insalata di Pomodori e Basilico", price: "€ 5" },
      { name: "Peperoni Arraganati con Tarallo e Uvetta", price: "€ 6", allergens: [1] }
    ]
  },
  {
    id: "salu",
    name: "Salumi",
    items: [
      { name: "Capocollo di Martina Franca", price: "€ 6", allergens: [12] },
      { name: "Pancetta Arrotolata", price: "€ 5", allergens: [12] },
      { name: "Filetto di Maiale Lardellato", price: "€ 6", allergens: [12] },
      { name: "Salame Dolce e Piccante", price: "€ 5", allergens: [7, 12] }
    ]
  },
  {
    id: "tara",
    name: "Taralli",
    items: [
      { name: "Taralli Classici", price: "€ 3,50", allergens: [1, 7] },
      { name: "Taralli con Uvetta e Cipolla", price: "€ 4", allergens: [1, 7] },
      { name: "Taralli alla Pizzaiola", price: "€ 4", allergens: [1, 7] }
    ]
  },
  {
    id: "dolc",
    name: "Dolci",
    items: [
      { name: "Tiramisù", price: "€ 6", allergens: [1, 3, 7] },
      { name: "Pasticciotto Leccese", price: "€ 3,50", allergens: [1, 3, 6, 7, 10] },
      { name: "Sporcamuss", price: "€ 6", allergens: [1, 7] },
      { name: "Sporcamuss con Amarene", price: "€ 7", allergens: [1, 7] },
      { name: "Tetta della Monaca", price: "€ 7", allergens: [1, 3, 7], tags: ["*"] },
      { name: "Crostata di Mele e Crema Diplomatica", price: "€ 7", allergens: [1, 3, 7], tags: ["*"] },
      { name: "Cocomero", price: "€ 5" }
    ]
  },
  {
    id: "amar",
    name: "Amari & Caffè",
    items: [
      { name: "Caffè", price: "€ 1,50" },
      { name: "Caffè Decaffeinato", price: "€ 1,60" },
      { name: "Unicum", price: "€ 4,50" },
      { name: "Jefferson", price: "€ 6" },
      { name: "Grappa Barricata di Greco", price: "€ 6" },
      { name: "Grappa Bianca", price: "€ 4" },
      { name: "Grappa Barricata", price: "€ 5" },
      { name: "Grappa Special", price: "€ 8" },
      { name: "Amari Massarotti", price: "€ 5" },
      { name: "Amari Antichi Elisir", price: "€ 5" },
      { name: "Rosolio", price: "€ 5" },
      { name: "Passito di Fiano Astriluvio", price: "€ 6" }
    ]
  }
];

export const APERITIVO_MENU: MenuCategory[] = [
  {
    id: "ap-latt",
    name: "Latticini",
    items: [
      { name: "Burrata", price: "€ 3,50", allergens: [7] },
      { name: "Burrata Affumicata", price: "€ 4", allergens: [7] },
      { name: "Nodini", price: "€ 4", allergens: [7] },
      { name: "Stracciatella Pugliese", price: "€ 4", allergens: [7] },
      { name: "Figliata di Burrata 500g", price: "€ 12", allergens: [7] }
    ]
  },
  {
    id: "ap-tagl",
    name: "Taglieri",
    items: [
      { name: "Tagliere Valle d'Itria", price: "€ 18 | € 24", allergens: [1, 7, 8] },
      { name: "Tagliere di Formaggi", price: "€ 15", allergens: [7] },
      { name: "Tagliere Affettati Pugliesi", price: "€ 14", allergens: [1, 7, 8] }
    ]
  },
  {
    id: "ap-affe",
    name: "Affettati",
    items: [
      { name: "Capocollo di Martina Franca", price: "€ 6", allergens: [12] },
      { name: "Pancetta Arrotolata", price: "€ 5", allergens: [12] },
      { name: "Filetto di Maiale Lardellato", price: "€ 6", allergens: [12] },
      { name: "Salame Dolce e Piccante", price: "€ 5", allergens: [7, 12] }
    ]
  },
  {
    id: "ap-sfiz",
    name: "Sfizi di Puglia",
    items: [
      { name: "Taralli Classici", price: "€ 3,50", allergens: [1, 7] },
      { name: "Taralli con Uvetta e Cipolla", price: "€ 4", allergens: [1, 7] },
      { name: "Taralli alla Pizzaiola", price: "€ 4", allergens: [1, 7] },
      { name: "Patate Fritte", price: "€ 6", allergens: [1, 8, 10] },
      { name: "Olive Nere Dolci Fritte", price: "€ 6" },
      { name: "Olive Belle di Cerignola", price: "€ 4" },
      { name: "Lampascioni Fritti", price: "€ 9", allergens: [1] },
      { name: "Puccia con Polpo, Zucchine e Stracciatella", price: "€ 12" }
    ]
  },
  {
    id: "ap-fris",
    name: "Friselle",
    items: [
      { name: "Pomodoro", price: "€ 3", allergens: [1] },
      { name: "Pomodoro & Burrata", price: "€ 4", allergens: [1, 7] },
      { name: "Filetto di Maiale Lardellato & Cicoria", price: "€ 4", allergens: [1] },
      { name: "Pomodorini, Alici e Capperi", price: "€ 4", allergens: [1] },
      { name: "Capocollo, Pomodori Secchi e Stracciatella", price: "€ 5", allergens: [1, 7] }
    ]
  },
  {
    id: "ap-maia",
    name: "Maialino Nero",
    items: [
      { name: "Tagliere Maialino Nero", price: "€ 20", allergens: [1, 7, 8] },
      { name: "Bruschetta Caciocavallo e Lardo all'Acqua di Mare", price: "€ 8" },
      { name: "Ghiandaro (Culatello di Maialino Nero) ~100g", price: "€ 10" },
      { name: "Pancetta Arrotolata di Maialino Nero", price: "€ 7" },
      { name: "Filetto di Maiale Lardellato di Maialino Nero", price: "€ 8" }
    ]
  }
];

export const VINI_MENU: MenuCategory[] = [
  {
    id: "wine-calici",
    name: "Vini al Calice",
    items: [
      { name: "Prosecco Rosè DOC Extra Dry — Lamarca", price: "€ 6", description: "Veneto · 11% · Glera 85%, Pinot Nero 15%", tags: ["ND"] },
      { name: "Avocetta — Tenute Lu Spada", price: "€ 6", description: "Puglia · 12% · Minutolo 100%" },
      { name: "Tuffetto — Tenute Lu Spada", price: "€ 6", description: "Puglia · 13% · Negroamaro 100%" },
      { name: "Fuocorosa — Tenute Lu Spada", price: "€ 7", description: "Puglia · 12,5% · Susumaniello 100%" },
      { name: "Pezzalaruca — Conte Spagnoletti Zeuli", price: "€ 6", description: "Puglia · 13% · Nero di Troia 50%, Montepulciano 50%", tags: ["ND"] }
    ]
  },
  {
    id: "wine-bottiglie",
    name: "Vini in Bottiglia",
    items: [
      { name: "Prosecco Rosè DOC Extra Dry — La Marca", price: "€ 22", description: "Veneto · 11% · Glera 85%, Pinot Nero 15%" },
      { name: "Prosecco Superiore DOCG Brut Millesimato — La Marca", price: "€ 26", description: "Veneto · 11,5% · Glera 100%" },
      { name: "La Vileta — Trento DOC Extra Brut Blanc de Noirs", price: "€ 50", description: "Trentino · 12,5% · Pinot Nero 100%" },
      { name: "Nevaia — Conte Spagnoletti Zeuli", price: "€ 24", description: "Puglia · 13,5% · Fiano 100%" },
      { name: "Avocetta — Tenute Lu Spada", price: "€ 23", description: "Puglia · 12% · Minutolo 100%" },
      { name: "Kret — Valentino Butussi", price: "€ 23", description: "Friuli Venezia Giulia · 13% · Pinot Grigio 100%" },
      { name: "La Piana — Conte Spagnoletti Zeuli", price: "€ 22", description: "Puglia · 12,5% · Chardonnay 100%" },
      { name: "Lugana — Maragona", price: "€ 28", description: "12,5% · Lugana 100%" },
      { name: "Gewurztraminer — Villa Piccola", price: "€ 30", description: "Trentino Alto Adige · 14% · Gewurztraminer 100%" },
      { name: "Tuffetto — Tenute Lu Spada", price: "€ 24", description: "Puglia · 13% · Negroamaro 100%" },
      { name: "Colombaio — Conte Spagnoletti Zeuli", price: "€ 22", description: "Puglia · 12,5% · Bombino Nero 100%" },
      { name: "Fuocorosa — Conte Spagnoletti Zeuli", price: "€ 25", description: "Puglia · 12,5% · Bombino Nero 70%, Montepulciano 30%" },
      { name: "Chiaretto — Marangona", price: "€ 26", description: "Lombardia · 12,5% · Riviera del Garda Classica 100%" },
      { name: "Rinzacco — Conte Spagnoletti Zeuli", price: "€ 24", description: "Puglia · 13,5% · Nero di Troia Riserva 100%" },
      { name: "Nyroca — Tenute Lu Spada", price: "€ 25", description: "Puglia · 14% · Negroamaro 100%" },
      { name: "Masada Riserva — Tenute Lu Spada", price: "€ 32", description: "Puglia · 13,5% · Negroamaro 100%", tags: ["ND"] },
      { name: "Don Ferdinando — Conte Spagnoletti Zeuli", price: "€ 23", description: "Puglia · 14% · Primitivo 100%" },
      { name: "23 Settembre — Conte Spagnoletti Zeuli", price: "€ 65", description: "Puglia · 15% · Nero di Troia Riserva 100% · 2016" },
      { name: "Moriglione — Tenute Lu Spada", price: "€ 25", description: "Puglia · 14% · Primitivo 100%" }
    ]
  },
  {
    id: "wine-cocktails",
    name: "Cocktails",
    items: [
      { name: "Aperol Spritz", price: "€ 6" },
      { name: "Campari Spritz", price: "€ 6" },
      { name: "Hugo Spritz", price: "€ 6" },
      { name: "Passion Spritz", price: "€ 6" },
      { name: "Negroni", price: "€ 7" },
      { name: "Negroni Sbagliato", price: "€ 7" },
      { name: "Gin Tonic", price: "€ 8" },
      { name: "Gin Passion", price: "€ 8" }
    ]
  },
  {
    id: "wine-soft",
    name: "Soft Drinks & Birre",
    items: [
      { name: "Acqua Naturale / Frizzante", price: "€ 2,00" },
      { name: "Schweppes Arancia (0,18 cL)", price: "€ 2,50" },
      { name: "Pepsi (0,33 cL)", price: "€ 3,50" },
      { name: "Pepsi (1 L)", price: "€ 6,00" },
      { name: "Pepsi Zero (0,33 cL)", price: "€ 3,50" },
      { name: "SevenUp (0,33 cL)", price: "€ 3,00" },
      { name: "Chinotto (0,20 cL)", price: "€ 3,00" },
      { name: "Raffo Grezza (0,45 cL)", price: "€ 5,00" },
      { name: "Grolsch Weiss (0,3 cL)", price: "€ 4,00" },
      { name: "Grolsch Weiss (0,4 cL)", price: "€ 5,00" }
    ]
  }
];
