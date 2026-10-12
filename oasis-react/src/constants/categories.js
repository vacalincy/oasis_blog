export const CATEGORIES = [
  {
    id: "code-development",
    name: "Code & Development",
    slug: "code-development",
    aliases: ["code & development", "code", "development", "programming", "web"],
    description: "Foundational markup, clean semantics, complex responsive layouts, web animations, and modern interface components.",
    subcategories: [
      { name: "HTML & CSS Architecture", desc: "Semantic structure, modular architecture, and clean code fundamentals." },
      { name: "Grid & Flexbox Layouts", desc: "Advanced responsive grids and editorial publication layouts." },
      { name: "Web Animations", desc: "Scroll-driven effects, micro-interactions, and fluid transitions." },
      { name: "Responsive Components", desc: "Crafting adaptive cards, navigation, and mobile-first elements." }
    ]
  },
  {
    id: "travel-outdoors",
    name: "Travel & Outdoors",
    slug: "travel-outdoors",
    aliases: ["travel & outdoors", "travel", "outdoors", "hiking", "mountains"],
    description: "Trail navigation, alpine exploration, essential gear guides, and travel logistics.",
    subcategories: [
      { name: "Mountain Hiking", desc: "Navigation, trail etiquette, and alpine trekking routes." },
      { name: "Alpine Routes", desc: "Local region guides, mountain passes, and scenic journeys." },
      { name: "Gear & Preparation", desc: "Technical layering, pack essentials, and backcountry preparedness." },
      { name: "Travel Logistics", desc: "Long-form itineraries, transit bookings, and travel timing." }
    ]
  },
  {
    id: "photography-film",
    name: "Photography & Film",
    slug: "photography-film",
    aliases: ["photography & film", "photography", "film", "photo", "camera"],
    description: "Mastering exposure, outdoor compositions, cinematic motion, and thoughtful color grading.",
    subcategories: [
      { name: "Camera Settings", desc: "Exposure triangles, crop sensors, and backlighting techniques." },
      { name: "Landscape & Nature", desc: "Composition strategies for street, desert, and mountain photography." },
      { name: "Video & Slow-Motion", desc: "Frame rate optimization, motion tracking, and dynamic camera work." },
      { name: "Post-Production", desc: "Editorial color grading, audio extraction, and digital darkroom workflows." }
    ]
  },
  {
    id: "design-interfaces",
    name: "Design & Interfaces",
    slug: "design-interfaces",
    aliases: ["design & interfaces", "design", "interfaces", "ui", "ux", "typography"],
    description: "Design systems in Figma, Swiss typography, negative space, and real-world UX case studies.",
    subcategories: [
      { name: "Figma Mastery", desc: "Design tokens, auto-layout, and scalable component systems." },
      { name: "Minimalist UI", desc: "Swiss International Style, negative space, and disciplined grids." },
      { name: "Typography", desc: "Pairing typefaces, visual hierarchy, and cross-screen readability." },
      { name: "UX Case Studies", desc: "Interface audits, redesign teardowns, and client deliverables." }
    ]
  },
  {
    id: "science-technology",
    name: "Science & Technology",
    slug: "science-technology",
    aliases: ["science & technology", "science & tech", "science", "technology", "tech"],
    description: "Hardware ecosystems, multi-room audio acoustics, essential software, and AI developments.",
    subcategories: [
      { name: "Ecosystems & Devices", desc: "Device synchronization, unified workflows, and troubleshooting." },
      { name: "Audio & Streaming Systems", desc: "Multi-room audio acoustics, DACs, and network streaming protocols." },
      { name: "Software & Tools", desc: "Indie software, daily utilities, and productive developer tools." },
      { name: "Tech Trends", desc: "Artificial intelligence, spatial computing, and digital culture shifts." }
    ]
  },
  {
    id: "music-culture",
    name: "Music & Culture",
    slug: "music-culture",
    aliases: ["music & culture", "music & audio", "music", "culture", "audio"],
    description: "Prog rock retrospectives, synthpop evolutions, and deep dives into songwriting and meaning.",
    subcategories: [
      { name: "Progressive & Classic Rock", desc: "Concept albums, golden era recordings, and genre histories." },
      { name: "Alternative & Synthpop", desc: "Sonic evolution, electronic textures, and cross-genre experiments." },
      { name: "Artist Retrospectives", desc: "Legendary discographies and cultural legacies." },
      { name: "Music Theory & Meaning", desc: "Hidden lyrical themes, harmonics, and song breakdowns." }
    ]
  },
  {
    id: "food-culinary",
    name: "Food & Culinary",
    slug: "food-culinary",
    aliases: ["food & culinary", "food & culture", "food", "culinary"],
    description: "Wholesome grains, vibrant fresh bowls, effortless daily cooking, and culinary chemistry.",
    subcategories: [
      { name: "Healthy Grains", desc: "Nutrient-dense grains, ancient carbs, and balanced recipes." },
      { name: "Cheese & Veggie Bowls", desc: "Pairing feta, roasted mushrooms, and crisp garden vegetables." },
      { name: "Quick Everyday Meals", desc: "Aesthetic, nourishing dishes prepared in under thirty minutes." },
      { name: "Culinary Chemistry", desc: "Maillard reactions, food emulsions, and culinary science." }
    ]
  },
  {
    id: "automotive-mobility",
    name: "Automotive & Mobility",
    slug: "automotive-mobility",
    aliases: ["automotive & mobility", "automotive", "mobility", "cars"],
    description: "Iconic sports cars, vehicle ownership analysis, driving culture, and scenic road trips.",
    subcategories: [
      { name: "Classic & Sports Cars", desc: "Heritage profiles, silhouette studies, and automotive industrial design." },
      { name: "Ownership & Insurance", desc: "Total cost of ownership, classic policies, and first-car calculations." },
      { name: "Driving Culture", desc: "Road manners, mechanical sympathy, and the joy of the open road." },
      { name: "Road Trips", desc: "Scenic coastal byways, alpine passes, and overland logistics." }
    ]
  },
  {
    id: "education-lifestyle",
    name: "Education & Lifestyle",
    slug: "education-lifestyle",
    aliases: ["education & lifestyle", "lifestyle & people", "education", "lifestyle"],
    description: "Campus routines, financial literacy, mindful productivity, and creative freelancing.",
    subcategories: [
      { name: "Student Life", desc: "Study environments, campus routines, and academic balance." },
      { name: "Financial Logistics", desc: "Global transfers, tuition management, and conscious personal budgeting." },
      { name: "Productivity", desc: "Time blocking, distraction-free workspaces, and intentional habits." },
      { name: "Career & Freelance", desc: "Client communication, contracts, and preparing assets for print." }
    ]
  },
  {
    id: "literature-culture",
    name: "Literature & Culture",
    slug: "literature-culture",
    aliases: ["literature & culture", "literature & history", "literature", "books"],
    description: "Classic dystopian fiction, literary inspirations in cinema, modern prose, and societal art.",
    subcategories: [
      { name: "Dystopian Fiction", desc: "Analyses of classic speculative fiction and social commentary." },
      { name: "Literary Influences", desc: "How legendary books inspire filmmakers and composers." },
      { name: "Modern Prose", desc: "Essays, contemporary reviews, and thoughtful critiques." },
      { name: "Art & Society", desc: "The timeless dialogue between artistic movements and societal change." }
    ]
  }
];

export function findCategory(catParam) {
  if (!catParam) return null;
  const lower = catParam.trim().toLowerCase();
  
  // Exact slug match
  let found = CATEGORIES.find(c => c.slug.toLowerCase() === lower);
  if (found) return found;

  // Exact or alias match
  found = CATEGORIES.find(c => 
    c.name.toLowerCase() === lower || 
    (c.aliases && c.aliases.some(a => a.toLowerCase() === lower || lower.includes(a.toLowerCase())))
  );
  if (found) return found;

  // Split "Main - Sub"
  const mainPart = catParam.split(' - ')[0].trim().toLowerCase();
  found = CATEGORIES.find(c => 
    c.slug.toLowerCase() === mainPart ||
    c.name.toLowerCase() === mainPart ||
    (c.aliases && c.aliases.some(a => a.toLowerCase() === mainPart || mainPart.includes(a.toLowerCase())))
  );

  return found || null;
}

export function parsePostCategory(catString) {
  if (!catString) return { main: 'General', sub: null, categoryObj: null };
  const parts = catString.split(' - ');
  const mainName = parts[0].trim();
  const subName = parts[1] ? parts[1].trim() : null;
  const categoryObj = findCategory(mainName);
  
  return {
    main: categoryObj ? categoryObj.name : mainName,
    sub: subName,
    categoryObj
  };
}
