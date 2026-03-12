// Zest Protocol — Lending with Bitcoin collateral
export const ZEST = {
  deployer: "SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N",
  poolBorrow: "pool-borrow-v2-3",
  borrowHelper: "borrow-helper-v2-1-5",
} as const;

// BitFlow — DEX for Bitcoin DeFi
export const BITFLOW = {
  deployer: "SP2PPPT2R6S1G8VF2HQ3AHVGPH0XQQ68J4QV39AA6",
  core: "bitflow",
} as const;

// Stacking DAO — Liquid stacking (stSTX)
export const STACKING_DAO = {
  deployer: "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG",
  core: "stacking-dao-core-v6",
  reserve: "reserve-v1",
  commission: "commission-v2",
} as const;

// LISA Protocol — Liquid stacking (LiSTX)
export const LISA = {
  deployer: "SM26NBC8SFHNW4P1Y4DFH27974P56WN86C92HPEHH",
  token: "token-lisa",
  dao: "lisa-dao",
} as const;
