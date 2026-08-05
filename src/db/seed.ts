import { db } from './index';
import { categories, states, customers, products, purchases, transactions, cartItems } from './schema';
import { hash } from 'bcryptjs';
import { PRODUCT_DATA, CATEGORY_MAP, STATES } from './seed-data';

async function seed() {
  try {
    console.log('🌱 Starting seed...');

    // Clear existing data in correct order (foreign key constraints)
    await db.delete(cartItems);
    await db.delete(transactions);
    await db.delete(purchases);
    await db.delete(products);
    await db.delete(customers);
    await db.delete(categories);
    await db.delete(states);
    console.log('🧹 Cleared existing data');

    // Seed states
    for (const state of STATES) {
      await db.insert(states).values({ name: state, code: state.substring(0, 2).toUpperCase() });
    }
    console.log('📝 Seeded states');

    // Seed categories
    const categoryNames = ['Acura', 'Alfa Romeo', 'Audi', 'BMW', 'Cadillac', 'Genesis',
      'Infiniti', 'Jaguar', 'Kia', 'Lexus', 'Lincoln', 'Maserati', 'Mercedes Benz', 'Volvo'];
    for (const cat of categoryNames) {
      await db.insert(categories).values({ categoryName: cat });
    }
    console.log('🏷️  Seeded categories');

    // Map brand names to category IDs
    const allCats = await db.select().from(categories);
    const catMap = new Map(allCats.map(c => [c.categoryName, c.categoryId]));

    // Seed products
    for (const p of PRODUCT_DATA) {
      const catName = CATEGORY_MAP[p.categoryId];
      if (!catName) continue;
      const catId = catMap.get(catName);
      if (!catId) continue;

      await db.insert(products).values({
        name: p.name,
        price: p.price.toString(),
        description: p.description,
        quantityRemaining: p.quantityRemaining,
        categoryId: catId,
        imgUrl: p.imgUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    console.log('🚗 Seeded products');

    // Seed admin user
    const adminPassword = await hash('admin123', 10);
    await db.insert(customers).values({
      firstName: 'Admin',
      lastName: 'User',
      address: 'Admin Street',
      city: 'Admin City',
      passwordHash: adminPassword,
      zipCode: '00000',
      phone: '0000000000',
      stateId: 1,
      email: 'admin@lionstarauto.com',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('👤 Seeded admin user');

    // Seed sample customers
    const sampleCustomers = [
      { firstName: 'Nolan', lastName: 'Naik', email: 'nolannaik@gmail.com' },
      { firstName: 'Giovanni', lastName: 'Rossi', email: 'giovanni@example.com' },
      { firstName: 'Emma', lastName: 'Johnson', email: 'emma@example.com' },
    ];

    for (const c of sampleCustomers) {
      const pw = await hash('password123', 10);
      await db.insert(customers).values({
        firstName: c.firstName,
        lastName: c.lastName,
        address: '123 Main St',
        city: 'New York',
        passwordHash: pw,
        zipCode: '10001',
        phone: '5551234567',
        stateId: 47,
        email: c.email,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    console.log('👥 Seeded sample customers');

    console.log('✅ Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
