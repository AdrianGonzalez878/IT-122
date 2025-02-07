const plants = [
  {
    id: 1,
    name: "Rose",
    type: "Flor",
    sunlight: "Full sun",
    water: "Regular"
  },
  {
    id: 2,
    name: "Cactus",
    type: "Succulent",
    sunlight: "Direct sun",
    water: "Low"
  },
  {
    id: 3,
    name: "Orchid",
    type: "Flor",
    sunlight: "Indirect sun",
    water: "Moderate"
  },
  {
    id: 4,
    name: "Fern",
    type: "Foliage",
    sunlight: "Shade",
    water: "High"
  },
  {
    id: 5,
    name: "Lavender",
    type: "Herb",
    sunlight: "Full sun",
    water: "Low"
  }
];

export function getAll() {
  return plants;
}

export function getItem(id) {
  return plants.find(plant => plant.id === id);
}