export interface Perfume {
  id: number;
  name: string;
  brand: string;
  price: number;
  description: string;
  image:string;
  notes:string[];
}

export const perfumes: Perfume[] = [
  {
    id: 1,
    name: "Dalal",
    brand: "Lattafa",
    price: 120.0, 
    description: "A classic floral fragrance with notes of jasmine, rose, and ylang-ylang.",
    image: "https://example.com/chanel-no5.jpg",
    notes: ["Jasmine", "Rose", "Ylang-Ylang"]  
  },
  {
    id: 2,
    name: "Million Gold For Her",
    brand: "Rabanne",
    price: 95.0,
    description: "A fresh and spicy fragrance with notes of bergamot, pepper, and ambroxan.",
    image: "https://example.com/dior-sauvage.jpg",
    notes: ["Bergamot", "Pepper", "Ambroxan"]
  },
  {
    id: 3,
    name: "Tharwah Gold",
    brand: "Lattafa",
    price: 150.0,
    description: "A warm and woody fragrance with notes of oud, amber, and vanilla.",
    image: "https://example.com/creed-aventus.jpg",
    notes: ["Oud", "Amber", "Vanilla"]
  },
  {
    id: 4,
    name: "Libre Intense",
    brand: "Yves Saint Laurent",
    price: 130.0,
    description: "A rich and intense fragrance with notes of oud, saffron, and patchouli.",
    image: "https://example.com/jo-malone-wood-sage.jpg",
    notes: ["Oud", "Saffron", "Patchouli"]
  },
  {
    id: 5,
    name: "Queen of Arabia",
    brand: "Lattafa",
    price: 110.0,
    description: "A luxurious and exotic fragrance with notes of oud, rose, and amber.",
    image: "https://example.com/tom-ford-black-orchid.jpg",
    notes: ["Oud", "Rose", "Amber"]
  },
  {
    id: 6,
    name: "Vanilla Powder",
    brand: "Matiere Premiere",
    price: 110.0,
    description: "A luxurious and exotic fragrance with notes of oud, rose, and amber.",
    image: "https://example.com/tom-ford-black-orchid.jpg",
    notes: ["Oud", "Rose", "Amber"]
  }
]