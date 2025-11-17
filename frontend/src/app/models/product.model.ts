export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    sellerId: string;
    quantity: number;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Code Wizard Tee',
    description: 'For devs who love stylish, clever code jokes.',
    price: 29,
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'
    ],
    category: 'code-nerd',
    sellerId: 'USER-002',
    quantity: 10
  },
  {
    id: '2',
    name: 'Anime Power Tee',
    description: 'Channel your favorite anime heroes with this bold tee!',
    price: 31,
    images: [
      'https://images.unsplash.com/photo-1724654814378-108c93f5fa54?w=400',
      'https://images.unsplash.com/photo-1724654814378-108c93f5fa54?w=800'
    ],
    category: 'anime-pop',
    sellerId: 'USER-002',
    quantity: 7
  },
  {
    id: '3',
    name: 'Minimal Tech Shirt',
    description: 'A strip of color for the minimalist techie.',
    price: 23,
    images: [
      'https://images.unsplash.com/photo-1660900506164-9efffc7a4245?w=400'
    ],
    category: 'minimal-tech',
    sellerId: 'USER-004',
    quantity: 25
  },
  {
    id: '4',
    name: 'Pixel Gamer Tee',
    description: 'Old school pixel art for modern gamers.',
    price: 27,
    images: [
      'https://images.unsplash.com/photo-1758179762049-615d9aac58ea?w=400'
    ],
    category: 'gaming-esports',
    sellerId: 'USER-004',
    quantity: 12
  },
  {
    id: '5',
    name: 'Geek Meme Mashup',
    description: 'All your favorite internet memes… on one tee!',
    price: 22,
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=401'
    ],
    category: 'geeky-memes',
    sellerId: 'USER-006',
    quantity: 16
  },
  {
    id: '6',
    name: 'Limited Collab Edition',
    description: 'A rare collab tee – get it while it lasts!',
    price: 45,
    images: [
      'https://images.unsplash.com/photo-1724654814378-108c93f5fa54?w=401'
    ],
    category: 'limited-editions',
    sellerId: 'USER-006',
    quantity: 3
  }
];

/*
{
  id: '7',
  name: 'Sharingan Ninja Tee',
  description: 'For anime fans and shinobi admirers. Striking eyes and mysterious vibes.',
  price: 29,
  images: [
    'andrea-de-santis-1ZlOGMp6Eu0-unsplash.jpg'
  ],
  category: 'anime-pop',
  sellerId: 'USER-001',
  quantity: 10
},
{
  id: '8',
  name: 'Dragon Ball Crew Tee',
  description: 'Bring the energy with iconic Dragon Ball Z characters on your shirt!',
  price: 32,
  images: [
    'akshay-chauhan-GQ62Gz6-BFg-unsplash.jpg'
  ],
  category: 'anime-pop',
  sellerId: 'USER-001',
  quantity: 7
},
{
  id: '9',
  name: 'Meme Cat Pocket Tee',
  description: 'For meme lovers—cheeky pocket cat with a hidden message.',
  price: 26,
  images: [
    'max-herr-EHyJ7F-8oEQ-unsplash.jpg'
  ],
  category: 'geeky-memes',
  sellerId: 'USER-001',
  quantity: 15
}

*/