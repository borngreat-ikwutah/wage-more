import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  bigint,
  integer,
  numeric,
  pgEnum,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// 1. IMPORT USER from your separate auth file
// Change "./schema" to wherever your user table is defined
import { user } from "./auth";

// ==========================================
// ENUMS
// ==========================================

export const marketStatusEnum = pgEnum("market_status", [
  "PENDING_CREATION",
  "ACTIVE",
  "PENDING_RESOLUTION",
  "RESOLVED",
  "CANCELLED",
]);

export const marketTypeEnum = pgEnum("market_type", ["BINARY", "MULTIPLE"]);

// Typescript interface for JSON columns
export interface MarketOption {
  id: number;
  name: string;
  imageUrl?: string;
  votes?: number;
}

// ==========================================
// MARKET TABLE
// ==========================================

export const market = pgTable(
  "market",
  {
    // Web2 ID (UUID) - Primary Key
    tempId: text("temp_id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    // Web3 ID (Smart Contract ID)
    id: bigint("id", { mode: "number" }),

    creatorAddress: text("creator_address").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),

    tags: text("tags")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),

    marketType: marketTypeEnum("market_type").notNull(),
    endTime: timestamp("end_time").notNull(),

    options: jsonb("options").$type<MarketOption[]>().notNull(),

    status: marketStatusEnum("status").default("PENDING_CREATION").notNull(),
    creationTxHash: text("creation_tx_hash"),

    winningOptionIndex: integer("winning_option_index"),
    resolvedAt: timestamp("resolved_at"),

    totalPool: numeric("total_pool", { precision: 78, scale: 0 })
      .default("0")
      .notNull(),

    volume24h: numeric("volume_24h", { precision: 78, scale: 0 }).default("0"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("market_chain_id_idx").on(table.id),
    index("market_status_idx").on(table.status),
    index("market_tags_idx").using("gin", table.tags),
    index("market_endtime_idx").on(table.endTime),
  ],
);

// ==========================================
// BET TABLE
// ==========================================

export const bet = pgTable(
  "bet",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    // Relationship to Market
    marketTempId: text("market_temp_id")
      .notNull()
      .references(() => market.tempId),
    marketChainId: bigint("market_chain_id", { mode: "number" }),

    // Relationship to User (Wallet Address)
    userAddress: text("user_address").notNull(),

    optionIndex: integer("option_index").notNull(),
    amount: numeric("amount", { precision: 78, scale: 0 }).notNull(),

    txHash: text("tx_hash").notNull(),
    blockNumber: bigint("block_number", { mode: "number" }),

    claimed: boolean("claimed").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("bet_user_idx").on(table.userAddress),
    index("bet_market_idx").on(table.marketTempId),
  ],
);

// ==========================================
// RELATIONS
// ==========================================

export const marketRelations = relations(market, ({ many }) => ({
  bets: many(bet),
}));

export const betRelations = relations(bet, ({ one }) => ({
  market: one(market, {
    fields: [bet.marketTempId],
    references: [market.tempId],
  }),
  // RELATIONS: Connects Bet -> User
  // This works because we imported 'user' at the top
  user: one(user, {
    fields: [bet.userAddress],
    references: [user.walletAddress],
  }),
}));
