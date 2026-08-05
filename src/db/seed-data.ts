// Product data - all 50 luxury vehicles from the original database
export const PRODUCT_DATA: {
  name: string;
  price: number;
  description: string;
  quantityRemaining: number;
  categoryId: number;
  imgUrl: string;
}[] = [
  { name: '2021 Lexus ES', price: 40000, description: 'Premium Sedan', quantityRemaining: 21, categoryId: 10, imgUrl: 'lexus.jpg' },
  { name: '2021 Mercedes-Benz S Class', price: 109000, description: 'Luxury Sedan', quantityRemaining: 27, categoryId: 13, imgUrl: 'Mercedes Benz/Mercedes Benz S Class Sedan.jpg' },
  { name: '2021 Mercedes-Benz E Class', price: 54000, description: 'Premium Sedan', quantityRemaining: 36, categoryId: 13, imgUrl: 'Mercedes Benz/Mercedes Benz E Class Sedan.jpg' },
  { name: '2022 Audi A6', price: 55000, description: 'Premium Sedan', quantityRemaining: 43, categoryId: 3, imgUrl: 'Audi A6.jpg' },
  { name: '2022 Lexus ES', price: 40000, description: 'Premium Sedan', quantityRemaining: 63, categoryId: 10, imgUrl: 'lexus.jpg' },
  { name: '2021 Audi A8', price: 86000, description: 'Luxury Sedan', quantityRemaining: 28, categoryId: 3, imgUrl: 'audi-a8.jpeg' },
  { name: '2022 Mercedes-Benz E Class', price: 54000, description: 'Premium Sedan', quantityRemaining: 55, categoryId: 13, imgUrl: 'Mercedes Benz/Mercedes Benz E Class Sedan.jpg' },
  { name: '2021 Cadillac CT4', price: 33000, description: 'Sedan', quantityRemaining: 62, categoryId: 5, imgUrl: 'cadillac-ct4.jpg' },
  { name: '2021 Genesis G80', price: 47000, description: 'Premium Sedan', quantityRemaining: 58, categoryId: 6, imgUrl: 'genesis-g80.jpg' },
  { name: '2021 Genesis G70', price: 36000, description: 'Sedan', quantityRemaining: 77, categoryId: 6, imgUrl: 'genesis-g70.jpg' },
  { name: '2021 BMW 5 Series', price: 54000, description: 'Premium Sedan', quantityRemaining: 50, categoryId: 4, imgUrl: 'bmw-5-series.jpg' },
  { name: '2021 Cadillac CT5', price: 36000, description: 'Sedan', quantityRemaining: 76, categoryId: 5, imgUrl: 'cadillac-ct5.jpg' },
  { name: '2022 BMW 7 Series', price: 86000, description: 'Luxury Sedan', quantityRemaining: 37, categoryId: 4, imgUrl: 'bmw-7-series.jpg' },
  { name: '2021 Genesis G90', price: 72000, description: 'Luxury Sedan', quantityRemaining: 66, categoryId: 6, imgUrl: 'genesis-g90.jpg' },
  { name: '2022 Genesis G80', price: 48000, description: 'Premium Sedan', quantityRemaining: 83, categoryId: 6, imgUrl: 'genesis-g80.jpg' },
  { name: '2021 Infiniti Q50', price: 36000, description: 'Sedan', quantityRemaining: 89, categoryId: 7, imgUrl: 'infiniti-q50.jpg' },
  { name: '2022 Genesis G70', price: 37000, description: 'Premium Sedan', quantityRemaining: 117, categoryId: 6, imgUrl: 'genesis-g70.jpg' },
  { name: '2021 Lexus IS', price: 39000, description: 'Sedan', quantityRemaining: 79, categoryId: 10, imgUrl: 'lexus-is.jpg' },
  { name: '2021 BMW 2 Series', price: 35000, description: 'Sedan', quantityRemaining: 128, categoryId: 4, imgUrl: 'bmw-2-series.jpg' },
  { name: '2022 Acura TLX', price: 37000, description: 'Sedan', quantityRemaining: 75, categoryId: 1, imgUrl: 'acura-tlx.jpg' },
  { name: '2021 Mercedes-Benz A Class', price: 33000, description: 'Sedan', quantityRemaining: 138, categoryId: 13, imgUrl: 'Mercedes Benz/Mercedes Benz A Class Sedan.jpg' },
  { name: '2021 Lexus LS', price: 76000, description: 'Luxury Sedan', quantityRemaining: 54, categoryId: 10, imgUrl: 'lexus-ls.jpg' },
  { name: '2021 Jaguar XF', price: 43000, description: 'Premium Sedan', quantityRemaining: 78, categoryId: 8, imgUrl: 'jaguar-xf.jpg' },
  { name: '2021 Acura ILX', price: 26000, description: 'Sedan', quantityRemaining: 152, categoryId: 1, imgUrl: 'acura-ilx.jpg' },
  { name: '2020 BMW 7 Series', price: 86000, description: 'Luxury Sedan', quantityRemaining: 14, categoryId: 4, imgUrl: 'bmw-7-series.jpg' },
  { name: '2022 Cadillac CT5', price: 37000, description: 'Sedan', quantityRemaining: 62, categoryId: 5, imgUrl: 'cadillac-ct5.jpg' },
  { name: '2021 BMW 3 Series', price: 41000, description: 'Premium Sedan', quantityRemaining: 86, categoryId: 4, imgUrl: 'bmw-3-series.jpg' },
  { name: '2021 Acura TLX', price: 37000, description: 'Sedan', quantityRemaining: 99, categoryId: 1, imgUrl: 'acura-tlx.jpg' },
  { name: '2022 Audi A5', price: 43000, description: 'Premium Sedan', quantityRemaining: 74, categoryId: 3, imgUrl: 'audi-a5.jpg' },
  { name: '2021 Volvo S60', price: 38000, description: 'Sedan', quantityRemaining: 83, categoryId: 14, imgUrl: 'volvo-s60.jpg' },
  { name: '2021 Audi A6', price: 54000, description: 'Premium Sedan', quantityRemaining: 68, categoryId: 3, imgUrl: 'Audi A6.jpg' },
  { name: '2022 Audi A4', price: 39000, description: 'Sedan', quantityRemaining: 90, categoryId: 3, imgUrl: 'audi-a4.jpg' },
  { name: '2022 Maserati Ghibli', price: 76000, description: 'Luxury Sedan', quantityRemaining: 44, categoryId: 12, imgUrl: 'maserati-ghibli.jpg' },
  { name: '2022 Audi A3', price: 33000, description: 'Sedan', quantityRemaining: 82, categoryId: 3, imgUrl: 'audi-a3.jpg' },
  { name: '2020 Mercedes-Benz S Class', price: 94000, description: 'Luxury Sedan', quantityRemaining: 53, categoryId: 13, imgUrl: 'Mercedes Benz/Mercedes Benz S Class Sedan.jpg' },
  { name: '2021 Jaguar F-Type', price: 61000, description: 'Luxury Sedan', quantityRemaining: 0, categoryId: 8, imgUrl: 'jaguar-f-type.jpg' },
  { name: '2020 Genesis G70', price: 35000, description: 'Sedan', quantityRemaining: 35, categoryId: 6, imgUrl: 'genesis-g70.jpg' },
  { name: '2021 Alfa Romeo Giulia', price: 40000, description: 'Premium Sedan', quantityRemaining: 48, categoryId: 2, imgUrl: 'alfa-giulia.jpg' },
  { name: '2021 Mercedes-Benz C Class', price: 41000, description: 'Premium Sedan', quantityRemaining: 64, categoryId: 13, imgUrl: 'Mercedes Benz/Mercedes Benz C Class Sedan.jpg' },
  { name: '2021 Genesis GV80', price: 48000, description: 'Premium SUV', quantityRemaining: 66, categoryId: 6, imgUrl: 'genesis-gv80.jpg' },
  { name: '2021 Audi Q3', price: 34000, description: 'SUV', quantityRemaining: 97, categoryId: 3, imgUrl: 'audi-q3.jpg' },
  { name: '2021 BMW X5', price: 62000, description: 'Luxury SUV', quantityRemaining: 44, categoryId: 4, imgUrl: 'bmw-x5.jpg' },
  { name: '2021 BMW X3', price: 43000, description: 'Premium SUV', quantityRemaining: 68, categoryId: 4, imgUrl: 'bmw-x3.jpg' },
  { name: '2021 BMW X1', price: 36000, description: 'SUV', quantityRemaining: 75, categoryId: 4, imgUrl: 'bmw-x1.jpg' },
  { name: '2021 BMW X7', price: 72000, description: 'Luxury SUV', quantityRemaining: 39, categoryId: 4, imgUrl: 'bmw-x7.jpg' },
  { name: '2022 BMW X5', price: 62000, description: 'Luxury SUV', quantityRemaining: 38, categoryId: 4, imgUrl: 'bmw-x5.jpg' },
  { name: '2022 BMW X3', price: 46000, description: 'Premium SUV', quantityRemaining: 60, categoryId: 4, imgUrl: 'bmw-x3.jpg' },
  { name: '2022 BMW X1', price: 36000, description: 'SUV', quantityRemaining: 93, categoryId: 4, imgUrl: 'bmw-x1.jpg' },
  { name: '2022 BMW X7', price: 72000, description: 'Luxury SUV', quantityRemaining: 27, categoryId: 4, imgUrl: 'bmw-x7.jpg' },
  { name: '2020 BMW X5', price: 58000, description: 'Premium SUV', quantityRemaining: 59, categoryId: 4, imgUrl: 'bmw-x5.jpg' },
  { name: '2020 BMW X3', price: 43000, description: 'Premium SUV', quantityRemaining: 67, categoryId: 4, imgUrl: 'bmw-x3.jpg' },
];

// Category name list
export const CATEGORY_NAMES = [
  'Acura', 'Alfa Romeo', 'Audi', 'BMW', 'Cadillac', 'Genesis',
  'Infiniti', 'Jaguar', 'Kia', 'Lexus', 'Lincoln', 'Maserati',
  'Mercedes Benz', 'Volvo',
];

// Category mapping (categoryId -> brandName)
export { CATEGORY_NAMES as LUXURY_BRANDS };
export const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'Washington, DC', 'West Virginia', 'Wisconsin',
  'Wyoming',
];

// Category mapping (categoryId -> brandName)
export const CATEGORY_MAP: Record<number, string> = {
  1: 'Acura',
  2: 'Alfa Romeo',
  3: 'Audi',
  4: 'BMW',
  5: 'Cadillac',
  6: 'Genesis',
  7: 'Infiniti',
  8: 'Jaguar',
  9: 'Kia',
  10: 'Lexus',
  11: 'Lincoln',
  12: 'Maserati',
  13: 'Mercedes Benz',
  14: 'Volvo',
};

// Helper: map category ID to image asset
export const CATEGORY_IMAGES: Record<string, string> = {
  'Acura': '/images/acura.png',
  'Alfa Romeo': '/images/alfa-romeo.png',
  'Audi': '/images/audi.png',
  'BMW': '/images/bmw.png',
  'Cadillac': '/images/cadillac.png',
  'Genesis': '/images/genesis.png',
  'Infiniti': '/images/infiniti.png',
  'Jaguar': '/images/jaguar.png',
  'Kia': '/images/kia.png',
  'Lexus': '/images/lexus.png',
  'Lincoln': '/images/lincoln.png',
  'Maserati': '/images/maserati.png',
  'Mercedes Benz': '/images/mercedes.png',
  'Volvo': '/images/volvo.png',
};

// Image URL mapping for cars that use stock images
export const STOCK_IMAGES: Record<string, string> = {
  'Audi A6': 'https://images.unsplash.com/photo-1600195127782-7d7c2a6e3e3f?w=800&q=80',
  'Audi A8': 'https://images.unsplash.com/photo-1563871944272-8a8e6e4e4e8e?w=800&q=80',
  'Audi A5': 'https://images.unsplash.com/photo-1563871944272-8a8e6e4e4e8e?w=800&q=80',
  'Audi A4': 'https://images.unsplash.com/photo-1563871944272-8a8e6e4e4e8e?w=800&q=80',
  'Audi A3': 'https://images.unsplash.com/photo-1563871944272-8a8e6e4e4e8e?w=800&q=80',
  'Audi Q3': 'https://images.unsplash.com/photo-1563871944272-8a8e6e4e4e8e?w=800&q=80',
  'BMW 5 Series': 'https://images.unsplash.com/photo-1555371277-68586b402b7b?w=800&q=80',
  'BMW 7 Series': 'https://images.unsplash.com/photo-1555371277-68586b402b7b?w=800&q=80',
  'BMW 3 Series': 'https://images.unsplash.com/photo-1555371277-68586b402b7b?w=800&q=80',
  'BMW 2 Series': 'https://images.unsplash.com/photo-1555371277-68586b402b7b?w=800&q=80',
  'BMW X5': 'https://images.unsplash.com/photo-1555371277-68586b402b7b?w=800&q=80',
  'BMW X3': 'https://images.unsplash.com/photo-1555371277-68586b402b7b?w=800&q=80',
  'BMW X1': 'https://images.unsplash.com/photo-1555371277-68586b402b7b?w=800&q=80',
  'BMW X7': 'https://images.unsplash.com/photo-1555371277-68586b402b7b?w=800&q=80',
  'Cadillac CT4': 'https://images.unsplash.com/photo-1556185199-6a3d2a5e3a2b?w=800&q=80',
  'Cadillac CT5': 'https://images.unsplash.com/photo-1556185199-6a3d2a5e3a2b?w=800&q=80',
  'Genesis G80': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
  'Genesis G70': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
  'Genesis G90': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
  'Genesis GV80': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
  'Infiniti Q50': 'https://images.unsplash.com/photo-1593931377430-b4c0e6e2e4d1?w=800&q=80',
  'Jaguar XF': 'https://images.unsplash.com/photo-1580894899114-e76c12008680?w=800&q=80',
  'Jaguar F-Type': 'https://images.unsplash.com/photo-1580894899114-e76c12008680?w=800&q=80',
  'Lexus ES': 'https://images.unsplash.com/photo-1593931377430-b4c0e6e2e4d1?w=800&q=80',
  'Lexus IS': 'https://images.unsplash.com/photo-1593931377430-b4c0e6e2e4d1?w=800&q=80',
  'Lexus LS': 'https://images.unsplash.com/photo-1593931377430-b4c0e6e2e4d1?w=800&q=80',
  'Acura TLX': 'https://images.unsplash.com/photo-1519052537439-e1e9ae586e43?w=800&q=80',
  'Acura ILX': 'https://images.unsplash.com/photo-1519052537439-e1e9ae586e43?w=800&q=80',
  'Alfa Romeo Giulia': 'https://images.unsplash.com/photo-1519052537439-e1e9ae586e43?w=800&q=80',
  'Maserati Ghibli': 'https://images.unsplash.com/photo-1580894899114-e76c12008680?w=800&q=80',
  'Volvo S60': 'https://images.unsplash.com/photo-1580894899114-e76c12008680?w=800&q=80',
};