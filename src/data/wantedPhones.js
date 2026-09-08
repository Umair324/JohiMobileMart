export const wantedPhones = [
  {
    id: "w1",
    title: "Looking for iPhone 13",
    brand: "Apple",
    model: "iPhone 13",
    minBudget: 120000,
    maxBudget: 140000,
    condition: "Used / Good",
    ptaRequired: true,
    location: "Johi",
    description:
      "I am looking for iPhone 13 128GB PTA approved. Budget around Rs. 140,000. Prefer minimal scratches and good battery health.",
    buyer: {
      name: "Kamran Shar",
      whatsapp: "0321-1112233",
    },
    postedAt: "2026-08-28T09:00:00",
  },
  {
    id: "w2",
    title: "Need Samsung A-series, 8GB RAM",
    brand: "Samsung",
    model: "A54 or A55",
    minBudget: 65000,
    maxBudget: 85000,
    condition: "Like New / Good",
    ptaRequired: true,
    location: "Johi",
    description:
      "Looking for a Samsung A54 or A55 with 8GB RAM, PTA approved, in like-new condition. Willing to inspect in person around Johi bazaar.",
    buyer: {
      name: "Rehana Bhatti",
      whatsapp: "0333-2223344",
    },
    postedAt: "2026-08-27T15:20:00",
  },
  {
    id: "w3",
    title: "Budget phone for student use",
    brand: "Any",
    model: "Redmi / Infinix / Tecno",
    minBudget: 20000,
    maxBudget: 35000,
    condition: "Good / Fair",
    ptaRequired: false,
    location: "Dadu",
    description:
      "Need a simple, working phone for daily calls and study apps. Budget is tight, condition can be average as long as it works well.",
    buyer: {
      name: "Yasir Panhwar",
      whatsapp: "0345-3334455",
    },
    postedAt: "2026-08-26T11:10:00",
  },
  {
    id: "w4",
    title: "Looking for OnePlus with 12GB+ RAM",
    brand: "OnePlus",
    model: "10 Pro / 11",
    minBudget: 100000,
    maxBudget: 135000,
    condition: "Good",
    ptaRequired: true,
    location: "Johi",
    description:
      "Gamer looking for a fast OnePlus phone with at least 12GB RAM and PTA approved. Screen and battery should be in good shape.",
    buyer: {
      name: "Danish Magsi",
      whatsapp: "0300-4445566",
    },
    postedAt: "2026-08-25T18:00:00",
  },
];

export const getWantedById = (id) => wantedPhones.find((w) => w.id === id);
