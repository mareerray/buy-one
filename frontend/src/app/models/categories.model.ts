export interface Category {
  id: string;
  name: string;
  icon: string; // Instead of ReactNode, pass SVG or CSS class
  description: string;
}

export const CATEGORIES = [
  {
    id: 'code-nerd',
    name: 'Code & Nerd Humor',
    icon: 'fa fa-code',
    description: 'Developer jokes, programming puns, and tech humor',
  },
  {
    id: 'anime-pop',
    name: 'Anime & Pop Culture',
    icon: 'fa fa-hand-peace',
    description: 'Your favorite anime characters and pop culture icons',
  },
  // { id: 'minimal-tech', name: 'Minimal Tech', icon: 'fa fa-microchip', description: 'Clean, minimalist designs for tech enthusiasts', color: 'from-slate-500 to-slate-700' },
  {
    id: 'code-queen',
    name: 'Code Queen',
    icon: 'fa fa-crown',
    description: 'Bold, confident styles inspired by women who code',
  },
  {
    id: 'gaming-esports',
    name: 'Gaming & Esports',
    icon: 'fa fa-gamepad',
    description: 'Gaming legends, esports teams, and pixel art',
  },
  {
    id: 'geeky-memes',
    name: 'Geeky Memes/Quotes',
    icon: 'fa fa-laugh',
    description: 'Internet memes and legendary geek quotes',
  },
  {
    id: 'limited-editions',
    name: 'Limited Editions',
    icon: 'fa fa-star',
    description: 'Exclusive collabs and limited-run designs',
  },
];

/*
'Code & Nerd Humor'
'Anime & Pop Culture'
'code-queen'
'Gaming & Esports'
'Geeky Memes/Quotes'
'Limited Editions'
*/
