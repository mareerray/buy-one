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
    images: ['assets/images/CodeWizardTee1.png', 'assets/images/CodeWizardTee2.jpeg'],
    category: 'code-nerd',
    sellerId: 'USER-002',
    quantity: 10,
  },
  {
    id: '2',
    name: 'Classic Portrait Tee',
    description:
      'Wear timeless art—this tee features a mysterious portrait with vintage colors, made for art lovers!',
    price: 45,
    images: [
      'assets/images/MarkusClassicPortraitTee1.png',
      'assets/images/MarkusClassicPortraitTee2.jpeg',
    ],
    category: 'limited-editions',
    sellerId: 'USER-006',
    quantity: 1,
  },
  {
    id: '3',
    name: 'Pop Code Queen Tee',
    description:
      'Stand out with bold code and bold color! This wearable artwork is for vibrant, confident women in tech, ready to code and conquer.',
    price: 30,
    images: ['assets/images/PopCodeQueenTee1.png', 'assets/images/PopCodeQueenTee2.png'],
    category: 'code-queen',
    sellerId: 'USER-008',
    quantity: 6,
  },
  {
    id: '4',
    name: 'Urban Legends Tee',
    description:
      'Stand out with a statement—this tee features two icons against a glowing city backdrop, perfect for those who set their own rules.',
    price: 45,
    images: ['assets/images/UrbanLegendsTee1.png', 'assets/images/UrbanLegendsTee2.jpeg'],
    category: 'limited-editions',
    sellerId: 'USER-006',
    quantity: 1,
  },
  {
    id: '5',
    name: 'Martial Arts Promo Tee',
    description:
      'Show off power and skill—a tee inspired by martial arts legends, perfect for those with fighting spirit.',
    price: 45,
    images: [
      'assets/images/AllenMartialArtsPromoTee1.png',
      'assets/images/AllenMartialArtsPromoTee2.jpeg',
    ],
    category: 'limited-editions',
    sellerId: 'USER-006',
    quantity: 1,
  },
  {
    id: '6',
    name: 'Action Noir Tee',
    description:
      'Make a statement—bold, fearless, and ready for the night. Action-movie vibes in every thread!',
    price: 45,
    images: ['assets/images/OlegActionNoirTee1.png', 'assets/images/OlegActionNoirTee2.jpeg'],
    category: 'limited-editions',
    sellerId: 'USER-006',
    quantity: 1,
  },
  {
    id: '7',
    name: 'Sharingan Ninja Tee',
    description: 'For anime fans and shinobi admirers. Striking eyes and mysterious vibes.',
    price: 35,
    images: ['assets/images/SharinganNinjaTee1.jpg'],
    category: 'anime-pop',
    sellerId: 'USER-004',
    quantity: 10,
  },
  {
    id: '8',
    name: 'Little Warrior Manga Tee',
    description:
      'Power up your style! Featuring a bold manga hero ready for adventure—this tee brings iconic action and nostalgia straight from classic anime pages.',
    price: 30,
    images: [
      'assets/images/LittleWarriorMangaTee1.png',
      'assets/images/LittleWarriorMangaTee2.png',
    ],
    category: 'anime-pop',
    sellerId: 'USER-002',
    quantity: 6,
  },
  {
    id: '9',
    name: 'Meme Cat Pocket Tee',
    description: 'For meme lovers—cheeky pocket cat with a hidden message.',
    price: 25,
    images: [
      'https://images.unsplash.com/photo-1704095371948-58d1f95d8064?q=80&w=2674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'assets/images/pixelArt.jpg',
    ],
    category: 'geeky-memes',
    sellerId: 'USER-004',
    quantity: 15,
  },
  {
    id: '10',
    name: 'Esports Champion Tee',
    description: 'Unleash your gaming spirit with this esports-inspired design!',
    price: 29,
    images: ['assets/images/EsportsChampionTee1.png', 'assets/images/EsportsChampionTee2.png'],
    category: 'gaming-esports',
    sellerId: 'USER-002',
    quantity: 10,
  },
  {
    id: '11',
    name: 'Cyber Shooter Tee',
    description: 'Level up with futuristic style! Perfect for FPS fans.',
    price: 29,
    images: ['assets/images/CyberShooterTee1.png', 'assets/images/CyberShooterTee2.png'],
    category: 'gaming-esports',
    sellerId: 'USER-002',
    quantity: 8,
  },
  {
    id: '12',
    name: 'Pro League Tee',
    description: 'Declare yourself a winner—bold, sharp, and ready for action!',
    price: 29,
    images: ['assets/images/ProLeagueTee1.png', 'assets/images/ProLeagueTee2.png'],
    category: 'gaming-esports',
    sellerId: 'USER-002',
    quantity: 6,
  },
  {
    id: '13',
    name: 'Keep Coding Tee',
    description:
      'Show off your coder pride! This shirt features a witty developer print. For anyone who lives on code and caffeine.',
    price: 28,
    images: ['assets/images/KeepCodingTee1.png', 'assets/images/KeepCodingTee2.png'],
    category: 'code-nerd',
    sellerId: 'USER-004',
    quantity: 6,
  },
  {
    id: '14',
    name: 'Groupie-Tracker Tee',
    description:
      'Geek out in style! This tee sports a fun, graph-inspired design with curly braces and clever programmer flair.',
    price: 22,
    images: ['assets/images/GroupieTrackerTee1.png', 'assets/images/GroupieTrackerTee2.png'],
    category: 'code-nerd',
    sellerId: 'USER-004',
    quantity: 6,
  },
  {
    id: '15',
    name: 'Debug Life Meme Tee',
    description:
      'Embrace the daily struggle of every coder! "Why isn’t it working?" gesture. Relatable, lighthearted, and perfect for debugging sessions.',
    price: 25,
    images: ['assets/images/DebugLifeMemeTee1.png', 'assets/images/DebugLifeMemeTee2.png'],
    category: 'geeky-memes',
    sellerId: 'USER-004',
    quantity: 6,
  },
  {
    id: '16',
    name: 'Totoro Night Pop Tee',
    description:
      'Step into a magical night with Totoro! This tee features the beloved forest spirit in glowing, dreamy colors—perfect for anime fans, dreamers, and Studio Ghibli lovers.',
    price: 30,
    images: ['assets/images/TotoroNightPopTee1.png', 'assets/images/TotoroNightPopTee2.jpg'],
    category: 'anime-pop',
    sellerId: 'USER-002',
    quantity: 6,
  },
  {
    id: '17',
    name: 'Not Bad Meme Tee',
    description:
      'Bring meme culture to real life! This “Not Bad” stamp tee is perfect for showing off your chill approval at any moment. Bright, bold, and limited edition.',
    price: 45,
    images: ['assets/images/OppaNotBadMemeTee1.png', 'assets/images/OppaNotBadMemeTee2.jpeg'],
    category: 'limited-editions',
    sellerId: 'USER-006',
    quantity: 1,
  },
  {
    id: '18',
    name: 'Bim! Coder Win Tee',
    description:
      'Celebrate your coding victories! Featuring the iconic “Bim!” message and a check mark, this geeky-memes shirt lets everyone know your code passed the test.',
    price: 30,
    images: ['assets/images/Bim!CoderWinTee1.png', 'assets/images/Bim!CoderWinTee2.png'],
    category: 'geeky-memes',
    sellerId: 'USER-002',
    quantity: 6,
  },
  {
    id: '19',
    name: 'Night Owl Coder Tee',
    description:
      'Celebrate late-night hacking and creativity! This tee captures the energy of a passionate coder working under glowing code screens.',
    price: 40,
    images: ['assets/images/NightOwlCoderTee1.png', 'assets/images/NightOwlCoderTee2.png'],
    category: 'code-queen',
    sellerId: 'USER-008',
    quantity: 6,
  },
  {
    id: '20',
    name: 'Flow State SPM Tee',
    description:
      'Feel the rhythm of deep coding sessions! A stylish shirt for women coders who hit their stride with smart tech, focus, and headphones.',
    price: 30,
    images: ['assets/images/FlowStateSPMTee1.png', 'assets/images/FlowStateSPMTee2.png'],
    category: 'code-queen',
    sellerId: 'USER-008',
    quantity: 6,
  },
  {
    id: '21',
    name: 'Zen Dev Moment Tee',
    description:
      'Embrace calm and concentration. Featuring a coder in a peaceful workspace, this tee is perfect for anyone who finds harmony in their code.',
    price: 30,
    images: ['assets/images/ZenDevMomentTee1.png', 'assets/images/ZenDevMomentTee2.png'],
    category: 'code-queen',
    sellerId: 'USER-008',
    quantity: 6,
  },
  {
    id: '22',
    name: 'Bright Ideas Tee',
    description:
      'Channel the spark of code creativity! This design celebrates women problem-solvers, idea makers, and developers with a burst of colorful inspiration.',
    price: 30,
    images: ['assets/images/BrightIdeasTee1.png', 'assets/images/BrightIdeasTee2.png'],
    category: 'code-queen',
    sellerId: 'USER-008',
    quantity: 6,
  },
  {
    id: '23',
    name: 'Messy Bun Dev Tee',
    description:
      'Show off your coding style! This tee features a creative coder rocking the iconic messy bun—perfect for those late nights, deep thinking, and breakthrough moments.',
    price: 30,
    images: ['assets/images/MessyBunDevTee1.png', 'assets/images/MessyBunDevTee2.png'],
    category: 'code-queen',
    sellerId: 'USER-008',
    quantity: 6,
  },
];
