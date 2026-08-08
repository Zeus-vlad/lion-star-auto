import { pgSchema, serial, varchar, text, integer, decimal, boolean, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { and, desc, eq, sql } from 'drizzle-orm';
import { jsonb } from 'drizzle-orm/pg-core';

// Schema prefix for Neon - using lion_star_auto schema
const SCHEMA = 'lion_star_auto';
const autoSchema = pgSchema(SCHEMA);

export const categories = autoSchema.table('categories', {
  categoryId: serial('category_id').primaryKey(),
  categoryName: varchar('category_name', { length: 200 }).notNull().unique(),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('categories_name_idx').on(table.categoryName),
]);

export const states = autoSchema.table('states', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  code: varchar('code', { length: 2 }).notNull().unique(),
  taxRate: decimal('tax_rate', { precision: 5, scale: 4 }).default('0.0000').notNull(),
}, (table) => [
  index('states_name_idx').on(table.name),
]);

export const customers = autoSchema.table('customers', {
  customerId: serial('customer_id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  passwordHash: text('password_hash').notNull(),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'set null' }),
  zipCode: varchar('zip_code', { length: 20 }),
  isAdmin: boolean('is_admin').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('customers_email_idx').on(table.email),
  index('customers_state_id_idx').on(table.stateId),
]);

export const products = autoSchema.table('products', {
  productId: serial('product_id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  description: text('description'),
  quantityRemaining: integer('quantity_remaining').default(0).notNull(),
  categoryId: integer('category_id').references(() => categories.categoryId, { onDelete: 'set null' }),
  imgUrl: varchar('img_url', { length: 500 }),
  year: integer('year'),
  mileage: integer('mileage'),
  fuelType: varchar('fuel_type', { length: 50 }),
  transmission: varchar('transmission', { length: 50 }),
  engine: varchar('engine', { length: 100 }),
  gearbox: varchar('gearbox', { length: 50 }),
  colour: varchar('colour', { length: 50 }),
  interior: varchar('interior', { length: 50 }),
  wheel: varchar('wheel', { length: 50 }),
  drivetrain: varchar('drivetrain', { length: 50 }),
  topSpeed: integer('top_speed'),
  time60: decimal('time_60', { precision: 3, scale: 1 }),
  featured: boolean('featured').default(false),
  config: jsonb('config'),
  inCart: boolean('in_cart').default(false).notNull(),
  count: integer('count').default(0).notNull(),
  total: decimal('total', { precision: 12, scale: 2 }).default(sql`'0.00'`),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('products_category_id_idx').on(table.categoryId),
  index('products_name_idx').on(table.name),
  index('products_price_idx').on(table.price),
]);

export const purchases = autoSchema.table('purchases', {
  purchaseId: serial('purchase_id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.productId, { onDelete: 'cascade' }),
  customerId: integer('customer_id').references(() => customers.customerId, { onDelete: 'set null' }),
  quantity: integer('quantity').notNull().default(1),
  priceAtPurchase: decimal('price_at_purchase', { precision: 12, scale: 2 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('purchases_product_id_idx').on(table.productId),
  index('purchases_customer_id_idx').on(table.customerId),
]);

export const transactions = autoSchema.table('transactions', {
  transactionId: serial('transaction_id').primaryKey(),
  customerId: integer('customer_id').notNull().references(() => customers.customerId, { onDelete: 'cascade' }),
  purchaseId: integer('purchase_id').references(() => purchases.purchaseId, { onDelete: 'set null' }),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).default('0.00'),
  stateTax: decimal('state_tax', { precision: 5, scale: 4 }).default('0.0000'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentStatus: varchar('payment_status', { length: 50 }).default('pending'),
  paymentPlan: jsonb('payment_plan'),
  shippingAddress: text('shipping_address'),
  shippingCity: varchar('shipping_city', { length: 100 }),
  shippingStateId: integer('shipping_state_id').references(() => states.id, { onDelete: 'set null' }),
  shippingZipCode: varchar('shipping_zip_code', { length: 20 }),
  dateOfTransaction: timestamp('date_of_transaction').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('transactions_customer_id_idx').on(table.customerId),
  index('transactions_purchase_id_idx').on(table.purchaseId),
  index('transactions_date_idx').on(table.dateOfTransaction),
]);

export const cartItems = autoSchema.table('cart_items', {
  cartId: serial('cart_id').primaryKey(),
  customerId: integer('customer_id').notNull().references(() => customers.customerId, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull().references(() => products.productId, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('cart_customer_id_idx').on(table.customerId),
  index('cart_product_id_idx').on(table.productId),
  unique('cart_customer_product_unique').on(table.customerId, table.productId),
]);

// Type exports
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type State = typeof states.$inferSelect;
export type NewState = typeof states.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Purchase = typeof purchases.$inferSelect;
export type NewPurchase = typeof purchases.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
