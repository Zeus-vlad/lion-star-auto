CREATE TABLE "cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	CONSTRAINT "cart_customer_product_unique" UNIQUE("customer_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(200) NOT NULL,
	CONSTRAINT "categories_category_name_unique" UNIQUE("category_name")
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"customer_id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(200) NOT NULL,
	"last_name" varchar(200) NOT NULL,
	"address" varchar(200) NOT NULL,
	"city" varchar(200) NOT NULL,
	"password" varchar(255) NOT NULL,
	"zipcode" integer NOT NULL,
	"phone" varchar(20) NOT NULL,
	"bid" integer,
	"state_id" integer,
	"email" varchar(200) NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"description" text NOT NULL,
	"quantity_remaining" integer DEFAULT 0 NOT NULL,
	"category_id" integer,
	"img_url" text,
	"in_cart" boolean DEFAULT false NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"total" numeric(10, 2) DEFAULT '0.00',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"purchase_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"quantity_sold" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "states" (
	"state_id" serial PRIMARY KEY NOT NULL,
	"state_name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"trans_id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"purchase_id" integer NOT NULL,
	"date_of_transaction" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_purchase_id_unique" UNIQUE("purchase_id")
);
--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_customer_id_customers_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("customer_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_state_id_states_state_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."states"("state_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_customers_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("customer_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_purchase_id_purchases_purchase_id_fk" FOREIGN KEY ("purchase_id") REFERENCES "public"."purchases"("purchase_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cart_customer_id_idx" ON "cart" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "cart_product_id_idx" ON "cart" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "categories_name_idx" ON "categories" USING btree ("category_name");--> statement-breakpoint
CREATE INDEX "customers_email_idx" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "customers_state_id_idx" ON "customers" USING btree ("state_id");--> statement-breakpoint
CREATE INDEX "customers_bid_idx" ON "customers" USING btree ("bid");--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "products_price_idx" ON "products" USING btree ("price");--> statement-breakpoint
CREATE INDEX "purchases_product_id_idx" ON "purchases" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "states_name_idx" ON "states" USING btree ("state_name");--> statement-breakpoint
CREATE INDEX "transactions_customer_id_idx" ON "transactions" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "transactions_purchase_id_idx" ON "transactions" USING btree ("purchase_id");--> statement-breakpoint
CREATE INDEX "transactions_date_idx" ON "transactions" USING btree ("date_of_transaction");