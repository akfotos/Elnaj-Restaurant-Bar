import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const IMG = (id: string) => `https://images.unsplash.com/${id}?w=800&q=80`;

async function main() {
  const admin = await db.user.upsert({
    where: { email: "admin@elnaj.com" },
    update: {},
    create: { email: "admin@elnaj.com", name: "Elnaj Admin", passwordHash: await bcrypt.hash("admin1234", 10), role: "ADMIN" },
  });
  console.log("admin:", admin.email);

  const cats = await Promise.all(
    [
      ["Grills & Mains", "grills", 0],
      ["Local Favorites", "local", 1],
      ["Small Chops & Starters", "small-chops", 2],
      ["Salads & Vegan", "vegan", 3],
      ["Drinks & Bar", "drinks", 4],
      ["Desserts", "desserts", 5],
    ].map(([name, slug, sortOrder]) =>
      db.category.upsert({ where: { slug: slug as string }, update: {}, create: { name: name as string, slug: slug as string, sortOrder: sortOrder as number } })
    )
  );
  const C = (slug: string) => cats.find((c) => c.slug === slug)!.id;

  const products = [
    {
      name: "Jollof Rice with Grilled Chicken", slug: "jollof-grilled-chicken", categoryId: C("local"),
      description: "Smoky party-style jollof rice served with a char-grilled chicken quarter, fried plantain and shito.",
      price: 65, compareAtPrice: 75, stock: 40, isFeatured: true, isBestseller: true, spicyLevel: 2, prepTimeMins: 25,
      ingredients: "Long grain rice, tomatoes, scotch bonnet, chicken, plantain, shito",
      allergens: "none", dietaryLabels: "halal,spicy", nutrition: JSON.stringify({ calories: 720, protein: "38g", carbs: "85g", fat: "22g" }),
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Jollof_%28Jollof-_Rice%29.jpg/960px-Jollof_%28Jollof-_Rice%29.jpg",
    },
    {
      name: "Banku & Grilled Tilapia", slug: "banku-tilapia", categoryId: C("local"),
      description: "Fermented corn and cassava dough with whole grilled tilapia, fresh pepper sauce and onions.",
      price: 85, stock: 25, isBestseller: true, spicyLevel: 3, prepTimeMins: 35,
      ingredients: "Corn dough, cassava dough, tilapia, pepper, tomatoes, onions",
      allergens: "fish", dietaryLabels: "spicy", nutrition: JSON.stringify({ calories: 640, protein: "45g", carbs: "70g", fat: "18g" }),
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Grilled_Tilapia_001.jpg/960px-Grilled_Tilapia_001.jpg",
    },
    {
      name: "Suya Beef Skewers", slug: "suya-beef", categoryId: C("grills"),
      description: "Flame-grilled beef skewers rubbed in house-made yaji spice, served with onions and extra suya pepper.",
      price: 55, stock: 30, isFeatured: true, isBestseller: true, spicyLevel: 3, prepTimeMins: 20,
      ingredients: "Beef, groundnut yaji spice, onions", allergens: "peanuts", dietaryLabels: "halal,spicy,gluten-free",
      nutrition: JSON.stringify({ calories: 420, protein: "35g", carbs: "8g", fat: "28g" }),
      image: IMG("photo-1555939594-58d7cb561ad1"),
    },
    {
      name: "Grilled Lamb Chops", slug: "lamb-chops", categoryId: C("grills"),
      description: "Rosemary and garlic marinated lamb chops with grilled vegetables.",
      price: 120, stock: 15, isFeatured: true, spicyLevel: 0, prepTimeMins: 30,
      ingredients: "Lamb, rosemary, garlic, olive oil, seasonal vegetables", allergens: "none", dietaryLabels: "halal,gluten-free",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Grilled_lamb_chops.jpg/960px-Grilled_lamb_chops.jpg",
    },
    {
      name: "Kelewele (Spiced Plantain)", slug: "kelewele", categoryId: C("small-chops"),
      description: "Ripe plantain cubes marinated in ginger, chilli and spices, fried until caramelized.",
      price: 25, stock: 50, isBestseller: true, spicyLevel: 2, prepTimeMins: 15,
      ingredients: "Plantain, ginger, chilli, cloves, oil", allergens: "none", dietaryLabels: "vegan,gluten-free,spicy",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/37/Kelewele.jpg",
    },
    {
      name: "Spring Rolls & Samosas Platter", slug: "spring-rolls-samosas", categoryId: C("small-chops"),
      description: "A mixed platter of crispy vegetable spring rolls and beef samosas with sweet chilli dip.",
      price: 40, stock: 35, spicyLevel: 1, prepTimeMins: 15,
      ingredients: "Spring roll pastry, vegetables, beef, pastry, sweet chilli", allergens: "gluten", dietaryLabels: "spicy",
      image: IMG("photo-1601050690597-df0568f70950"),
    },
    {
      name: "Grilled Chicken Avocado Salad", slug: "chicken-avocado-salad", categoryId: C("vegan"),
      description: "Char-grilled chicken strips over avocado, mixed greens, cherry tomatoes with citrus dressing.",
      price: 60, stock: 20, spicyLevel: 0, prepTimeMins: 20,
      ingredients: "Chicken, avocado, greens, tomato, citrus vinaigrette", allergens: "none", dietaryLabels: "gluten-free,halal",
      image: "https://upload.wikimedia.org/wikipedia/commons/7/72/Chicken_salad.jpg",
    },
    {
      name: "Vegan Buddha Bowl", slug: "vegan-buddha-bowl", categoryId: C("vegan"),
      description: "Roasted chickpeas, quinoa, sweet potato, greens and tahini dressing.",
      price: 50, stock: 20, isSeasonal: true, spicyLevel: 0, prepTimeMins: 20,
      ingredients: "Chickpeas, quinoa, sweet potato, kale, tahini", allergens: "sesame", dietaryLabels: "vegan,gluten-free",
      nutrition: JSON.stringify({ calories: 480, protein: "18g", carbs: "62g", fat: "16g" }),
      image: IMG("photo-1512621776951-a57141f2eefd"),
    },
    {
      name: "Sobolo (Hibiscus Cooler)", slug: "sobolo", categoryId: C("drinks"),
      description: "Chilled hibiscus brew with ginger, pineapple and a hint of cloves. Sold per litre or glass.",
      price: 15, stock: 100, weightBased: false, unitLabel: "per glass", spicyLevel: 0, prepTimeMins: 5, isSeasonal: true,
      ingredients: "Hibiscus, ginger, pineapple, cloves, sugar", allergens: "none", dietaryLabels: "vegan,gluten-free",
      storageNotes: "Keep refrigerated, consume within 48h",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Homemade_sorrel_drink.jpg/960px-Homemade_sorrel_drink.jpg",
    },
    {
      name: "Fresh Palm Wine", slug: "palm-wine", categoryId: C("drinks"),
      description: "Locally tapped palm wine. Age-restricted — ID required on delivery.",
      price: 30, stock: 12, unitLabel: "per bottle", spicyLevel: 0, prepTimeMins: 5,
      ingredients: "Palm sap", allergens: "none", dietaryLabels: "vegan,gluten-free",
      storageNotes: "Keep chilled; natural fermentation continues",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/85/Palm_wine.jpg",
    },
    {
      name: "Signature Cocktail: Elnaj Sunset", slug: "elnaj-sunset", categoryId: C("drinks"),
      description: "Rum, passion fruit, mango and a chilli-salt rim. Age-restricted — ID required.",
      price: 45, stock: 60, unitLabel: "per glass", spicyLevel: 1, prepTimeMins: 5, isFeatured: true,
      ingredients: "Rum, passion fruit, mango, lime, chilli salt", allergens: "none", dietaryLabels: "spicy",
      image: IMG("photo-1551024709-8f23befc6f87"),
    },
    {
      name: "Chocolate Fondant", slug: "chocolate-fondant", categoryId: C("desserts"),
      description: "Warm molten-centre chocolate cake with vanilla ice cream.",
      price: 35, stock: 20, spicyLevel: 0, prepTimeMins: 15, isSeasonal: true,
      ingredients: "Dark chocolate, butter, eggs, flour, sugar, vanilla ice cream", allergens: "gluten,dairy,eggs", dietaryLabels: "vegetarian",
      image: IMG("photo-1578985545062-69928b1d9587"),
    },
    {
      name: "Waakye (bulk, per kg)", slug: "waakye-bulk", categoryId: C("local"),
      description: "Rice and beans cooked with sorghum leaves, sold by weight for events and family orders.",
      price: 40, stock: 100, weightBased: true, unitLabel: "per kg", spicyLevel: 0, prepTimeMins: 30,
      ingredients: "Rice, black-eyed beans, sorghum leaves", allergens: "none", dietaryLabels: "vegan,gluten-free",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Waakye_in_Ghana.jpg",
    },
    {
      name: "Fufu & Light Soup", slug: "fufu-light-soup", categoryId: C("local"),
      description: "Pounded cassava and plantain fufu served with spiced light soup and your choice of meat.",
      price: 75, stock: 30, isBestseller: true, spicyLevel: 3, prepTimeMins: 35,
      ingredients: "Cassava, plantain, goat meat or chicken, tomatoes, pepper", allergens: "none", dietaryLabels: "gluten-free,spicy",
      image: "https://upload.wikimedia.org/wikipedia/commons/0/01/Fufu_and_light_soup_in_asanka.jpg",
    },
    {
      name: "Kenkey & Fried Fish", slug: "kenkey-fried-fish", categoryId: C("local"),
      description: "Ga kenkey wrapped in corn husks, served with fried fish, fresh pepper sauce and onions.",
      price: 55, stock: 30, isBestseller: true, spicyLevel: 3, prepTimeMins: 30,
      ingredients: "Fermented corn dough, fried fish, shito, pepper, onions", allergens: "fish", dietaryLabels: "gluten-free,spicy",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Fante_kenkey_01.jpg",
    },
    {
      name: "Tuo Zaafi & Ayoyo Soup", slug: "tuo-zaafi", categoryId: C("local"),
      description: "Northern Ghanaian maize flour dumpling with slippery ayoyo (jute leaves) soup and meat.",
      price: 70, stock: 20, spicyLevel: 1, prepTimeMins: 35,
      ingredients: "Maize flour, ayoyo leaves, dawadawa, meat", allergens: "none", dietaryLabels: "gluten-free",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/48/Tuozaafi_and_Green_leaves_soup.jpg",
    },
    {
      name: "Red Red (Beans & Fried Plantain)", slug: "red-red", categoryId: C("local"),
      description: "Black-eyed beans stewed in red palm oil, served with fried ripe plantain. A beloved street classic.",
      price: 45, stock: 35, isBestseller: true, spicyLevel: 1, prepTimeMins: 25,
      ingredients: "Black-eyed beans, palm oil, onions, plantain, gari", allergens: "none", dietaryLabels: "vegan,gluten-free",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Red_red_and_ripe_plantain.jpg",
    },
    {
      name: "Fufu in Groundnut Soup", slug: "fufu-groundnut-soup", categoryId: C("local"),
      description: "Fufu served in rich groundnut (peanut) soup with smoked fish — hearty and warming.",
      price: 80, stock: 25, spicyLevel: 1, prepTimeMins: 35,
      ingredients: "Peanut butter, tomatoes, smoked fish, fufu", allergens: "peanuts,fish", dietaryLabels: "gluten-free",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/53/Fufu_in_groundnut_soup_with_fish.jpg",
    },
    {
      name: "Kontomire Stew (Palava Sauce)", slug: "kontomire-stew", categoryId: C("local"),
      description: "Cocoyam leaf stew with agushi (melon seeds), smoked fish and palm oil, served with boiled plantain or yam.",
      price: 50, stock: 25, spicyLevel: 1, prepTimeMins: 30,
      ingredients: "Cocoyam leaves, agushi, smoked fish, palm oil, boiled plantain", allergens: "fish", dietaryLabels: "gluten-free",
      image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Kontomire_stew.jpg",
    },
    {
      name: "Fried Yam & Chicken", slug: "fried-yam-chicken", categoryId: C("small-chops"),
      description: "Crispy golden yam chips with peppered fried chicken and shito — the classic Ghanaian snack plate.",
      price: 48, stock: 40, spicyLevel: 2, prepTimeMins: 20,
      ingredients: "Yam, chicken, shito, pepper, oil", allergens: "none", dietaryLabels: "gluten-free,spicy",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Fried_Yam_with_Fried_Chicken.jpg",
    },
    {
      name: "Koose (Bean Cakes)", slug: "koose", categoryId: C("small-chops"),
      description: "Deep-fried black-eyed bean cakes — crunchy outside, fluffy inside. Great with hausa koko.",
      price: 20, stock: 60, spicyLevel: 0, prepTimeMins: 15,
      ingredients: "Black-eyed beans, onions, pepper, oil", allergens: "none", dietaryLabels: "vegan,gluten-free",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Bean_cake_%28Akara%29.jpg",
    },
  ];

  for (const p of products) {
    await db.product.upsert({ where: { slug: p.slug }, update: {}, create: { compareAtPrice: undefined, ...p } });
  }

  // selectable add-ons per dish — "Name: price" (0 = free choice)
  const extrasMap: Record<string, [string, number][]> = {
    "jollof-grilled-chicken": [["Extra chicken", 15], ["Extra plantain", 8], ["Side salad", 10], ["Extra jollof scoop", 12], ["Boiled egg", 5], ["Shito on the side", 3]],
    "banku-tilapia": [["Extra tilapia", 35], ["Extra banku ball", 10], ["Extra pepper sauce", 3], ["Side salad", 10]],
    "suya-beef": [["Extra skewer", 18], ["Fresh onions", 0], ["Extra yaji spice", 3], ["Side salad", 10]],
    "lamb-chops": [["Extra lamb chop", 40], ["Seasonal vegetables", 12], ["Side salad", 10], ["Extra sauce", 5]],
    "kelewele": [["Groundnuts", 5], ["Extra portion", 20]],
    "spring-rolls-samosas": [["Extra spring roll", 6], ["Extra samosa", 6], ["Sweet chilli dip", 3]],
    "chicken-avocado-salad": [["Extra grilled chicken", 15], ["Extra avocado", 10], ["Extra dressing", 3]],
    "vegan-buddha-bowl": [["Extra avocado", 10], ["Extra chickpeas", 8], ["Tahini dressing", 4]],
    "chocolate-fondant": [["Extra ice cream scoop", 8], ["Whipped cream", 5], ["Extra fondant", 25]],
    "waakye-bulk": [["Fried egg", 5], ["Kelewele side", 12], ["Spaghetti side", 8], ["Shito", 3], ["Salad", 10]],
    "fufu-light-soup": [["Extra goat meat", 20], ["Extra chicken", 15], ["Extra fufu ball", 12], ["Fish", 18]],
    "kenkey-fried-fish": [["Extra fish", 25], ["Extra kenkey", 8], ["Shito", 3], ["Extra pepper sauce", 3]],
    "tuo-zaafi": [["Extra meat", 20], ["Extra tuo", 10]],
    "red-red": [["Extra plantain", 8], ["Gari sprinkle", 3], ["Fried fish", 20], ["Boiled egg", 5]],
    "fufu-groundnut-soup": [["Extra smoked fish", 18], ["Extra meat", 20], ["Extra fufu ball", 12]],
    "kontomire-stew": [["Boiled yam", 10], ["Boiled plantain", 8], ["Extra smoked fish", 18], ["Boiled egg", 5]],
    "fried-yam-chicken": [["Extra chicken wing", 8], ["Extra yam", 10], ["Shito", 3], ["Ketchup", 0]],
    "koose": [["Hausa koko (millet porridge)", 10], ["Extra koose", 4]],
  };
  for (const [slug, extras] of Object.entries(extrasMap)) {
    await db.product.updateMany({
      where: { slug },
      data: { extras: JSON.stringify(extras.map(([name, price]) => ({ name, price }))) },
    });
  }

  await db.deliveryZone.createMany({
    data: [
      { name: "Osu / Central", postalCodes: "GA-0,GA0,Osu", fee: 10, minOrder: 30, etaMinutes: 30 },
      { name: "East Legon", postalCodes: "GL-0,EastLegon", fee: 18, minOrder: 50, etaMinutes: 45 },
      { name: "Airport / Cantonments", postalCodes: "GA-1,Airport", fee: 15, minOrder: 40, etaMinutes: 40 },
    ],
  });

  await db.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", description: "10% off first order", percentOff: 10, minOrder: 50 },
  });
  await db.coupon.upsert({
    where: { code: "FREEDEL" },
    update: {},
    create: { code: "FREEDEL", description: "Free delivery over GHS 200", minOrder: 200, freeDelivery: true },
  });

  console.log("seeded");
}

main().finally(() => db.$disconnect());
