/**
 * Curated tag suggestions used in the admin product editor and surfaced
 * on the storefront (concern tiles, ingredient tiles). Admins can still
 * type free-form tags, but these keep things consistent.
 */
export const CONCERN_TAGS = ["Хуурайшил", "Толбо", "Бүдэг", "Хөгшрөлт", "Батга", "Тослог"];

export const INGREDIENT_TAGS = [
  "Hyaluronic",
  "Niacinamide",
  "Vitamin C",
  "Retinol",
  "Salicylic Acid",
  "Ceramide",
  "SPF 50",
  "Collagen",
];

export const ALL_SUGGESTED_TAGS = [...CONCERN_TAGS, ...INGREDIENT_TAGS];
