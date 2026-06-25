export interface MenuItem {
  name: string;
  price: string; // e.g. "€ 11" or "€ 5 | € 10"
  allergens?: number[]; // list of allergen ids
  tags?: string[]; // e.g. ["🌶️", "*", "ND"]
  description?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface AllergenInfo {
  id: number;
  name: string;
  emoji: string;
  description: string;
}

export const ALLERGENI: Record<number, AllergenInfo> = {
  1: { id: 1, name: "Glutine", emoji: "🌾", description: "Cereali contenenti glutine (grano, segale, orzo, avena, farro)" },
  2: { id: 2, name: "Crostacei", emoji: "🦐", description: "Crostacei e prodotti a base di crostacei" },
  3: { id: 3, name: "Uova", emoji: "🥚", description: "Uova e prodotti a base di uova" },
  4: { id: 4, name: "Pesce", emoji: "🐟", description: "Pesce e prodotti a base di pesce" },
  5: { id: 5, name: "Arachidi", emoji: "🥜", description: "Arachidi e prodotti a base di arachidi" },
  6: { id: 6, name: "Soia", emoji: "🫘", description: "Soia e prodotti a base di soia" },
  7: { id: 7, name: "Latte", emoji: "🥛", description: "Latte e prodotti a base di latte (incluso lattosio)" },
  8: { id: 8, name: "Frutta a Guscio", emoji: "🌰", description: "Frutta a guscio (mandorle, nocciole, noci, pistacchi)" },
  9: { id: 9, name: "Sedano", emoji: "🌿", description: "Sedano e prodotti a base di sedano" },
  10: { id: 10, name: "Senape", emoji: "🌻", description: "Senape e prodotti a base di senape" },
  11: { id: 11, name: "Sesamo", emoji: "🟤", description: "Semi di sesamo e prodotti a base di sesamo" },
  12: { id: 12, name: "Solfiti", emoji: "🍷", description: "Anidride solforosa e solfiti in concentrazioni superiori a 10 mg/kg o 10 mg/l" },
  13: { id: 13, name: "Lupini", emoji: "🫛", description: "Lupini e prodotti a base di lupini" },
  14: { id: 14, name: "Molluschi", emoji: "🦑", description: "Molluschi e prodotti a base di molluschi" }
};
