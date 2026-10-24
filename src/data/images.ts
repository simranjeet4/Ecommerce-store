/**
 * Central image registry. Swap any URL here (e.g. for a CDN or seller uploads)
 * without touching components. Remote images are demo photography from Unsplash.
 * SmartImage renders a tasteful fallback if any remote image fails to load.
 */
const u = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const img = {
  hero: '/images/hero.png',
  fashionEditorial: '/images/fashion.png',
  jewelleryEditorial: '/images/jewellery.png',

  headphones: u('1505740420928-5e560c06d30e'),
  smartwatch: u('1523275335684-37898b6baf30'),
  camera: u('1526170375885-4d8ecf77b99f'),
  laptop: u('1496181133206-80ce9b88a853'),
  keyboard: u('1587829741301-dc798b83add3'),
  speaker: u('1608043152269-423dbba4e7e1'),

  sneakers: u('1549298916-b41d501d3772'),
  redShoes: u('1542291026-7eec264c27ff'),
  tshirt: u('1521572163474-6864f9cf17ab'),
  sunglasses: u('1572635196237-14b3f281503f'),
  leatherWatch: u('1524592094714-0f0654e20314'),
  ring: u('1605100804763-247f67b3557e'),
  necklace: u('1599643478518-a784e5dc4c8f'),
  backpack: u('1553062407-98eeb64c6a62'),

  skincare: u('1556228578-8c89e6adf883'),
  lipstick: u('1586495777744-4413f21062fa'),

  armchair: u('1567538096630-e0c55bd6374c'),
  sofa: u('1555041469-a586c61ea9bc'),
  lamp: u('1507473885765-e6ed057f782c'),
  plants: u('1485955900006-10f4d324d411'),

  pottery: u('1565193566173-7a0ee3dbe261'),
  mugs: u('1514228742587-6b1558fcca3d'),

  giftBox: u('1549465220-1a8b9238cd48'),
  notebook: u('1531346878377-a5be20888e57'),
  candles: u('1603006905003-be475563bc59'),
  tea: u('1544787219-7f47ccb76574'),

  kitchen: u('1556909114-f6e7ad7d3136'),
  spices: u('1596040033229-a9821ebd058d'),
  knife: u('1593618998160-e34014e67546'),
  bottle: u('1602143407151-7111542de6e8'),
} as const;
