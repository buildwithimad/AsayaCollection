# 🌟 Asaya Collection

[![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.102.0-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, full-stack e-commerce platform built with Next.js, featuring a customer-facing storefront and a comprehensive admin panel for managing products, orders, and analytics.

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Installation](#-installation)
- [⚙️ Environment Setup](#️-environment-setup)
- [🏃‍♂️ Running the Application](#️-running-the-application)
- [📁 Project Structure](#-project-structure)
- [🗄️ Database Schema](#️-database-schema)
- [🔗 API Reference](#-api-reference)
- [📱 Usage](#-usage)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Authors](#-authors)
- [🙏 Acknowledgments](#-acknowledgments)

## ✨ Features

### 🛍️ Customer Storefront
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Product Catalog**: Browse products by categories, trending items, featured products, and best sellers
- **Advanced Search & Filtering**: Find products quickly with search and category filters
- **Product Details**: Detailed product pages with images, descriptions, reviews, and ratings
- **Shopping Cart**: Add to cart functionality with persistent storage
- **Secure Checkout**: Integrated payment processing and order management
- **User Authentication**: Sign up, login, and account management
- **Order Tracking**: View order history and status
- **Reviews & Ratings**: Customer reviews and star ratings for products
- **Email Notifications**: Order confirmations and updates via Resend

### 👨‍💼 Admin Panel
- **Dashboard Analytics**: Sales metrics, order statistics, and performance insights
- **Product Management**: Add, edit, delete, and manage product inventory
- **Order Management**: View and process orders, update order status
- **Category Management**: Organize products into categories
- **Customer Management**: View customer information and order history
- **Content Management**: Manage brand story, policies, and static pages
- **User Authentication**: Secure admin access with role-based permissions

### 🎨 Design & UX
- **Modern UI**: Clean, professional design with consistent branding
- **Smooth Animations**: Lenis for smooth scrolling and micro-interactions
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: Graceful error states and user feedback
- **Accessibility**: WCAG compliant design patterns

## 🏗️ Architecture

```
Asaya Collection/
├── asaya-collection/          # Main customer storefront (Next.js)
│   ├── app/                   # Next.js App Router
│   ├── components/            # Reusable React components
│   ├── context/               # React Context providers
│   ├── lib/                   # Utility libraries
│   ├── models/                # Data models (Mongoose)
│   ├── services/              # API service functions
│   ├── store/                 # Zustand state management
│   └── public/                # Static assets
├── admin-panel/               # Admin management panel (Next.js)
│   ├── app/                   # Next.js App Router (admin routes)
│   ├── components/            # Admin-specific components
│   ├── context/               # Admin context providers
│   └── lib/                   # Admin utilities
└── README.md                  # Project documentation
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.2.2](https://nextjs.org/) - React framework with App Router
- **React**: [React 19.2.4](https://reactjs.org/) - UI library
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) - Utility-first CSS framework
- **State Management**: [Zustand 5.0.12](https://zustand-demo.pmnd.rs/) - Lightweight state management
- **Icons**: [Lucide React](https://lucide.dev/) + [React Icons](https://react-icons.github.io/react-icons/)

### Backend & Database
- **Database**: [Supabase](https://supabase.com/) - PostgreSQL with real-time capabilities
- **Authentication**: Supabase Auth
- **Email Service**: [Resend](https://resend.com/) - Transactional email service
- **ORM**: [Mongoose](https://mongoosejs.com/) - MongoDB ODM (planned integration)

### Development Tools
- **TypeScript**: JavaScript with static typing
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Babel**: JavaScript transpilation
- **Next.js Toploader**: Loading indicators for page transitions

### Performance & UX
- **Lenis**: Smooth scrolling library
- **React Compiler**: Automatic React optimizations
- **Recharts**: Data visualization components

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: Version control system
- **Supabase Account**: For database and authentication
- **Resend Account**: For email services

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/buildwithimad/AsayaCollection.git
   cd AsayaCollection
   ```

2. **Install dependencies for both applications**:

   For the main storefront:
   ```bash
   cd asaya-collection
   npm install
   cd ..
   ```

   For the admin panel:
   ```bash
   cd admin-panel
   npm install
   cd ..
   ```

## ⚙️ Environment Setup

### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and API keys
3. Set up the following tables in your Supabase database:

### Environment Variables

Create `.env.local` files in both `asaya-collection/` and `admin-panel/` directories:

#### For `asaya-collection/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### For `admin-panel/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

> **Security Note**: Never commit `.env.local` files to version control. Add them to `.gitignore`.

### Database Schema Setup

Run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[],
  category_id UUID REFERENCES categories(id),
  stock INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the storefront**:
   ```bash
   cd asaya-collection
   npm run dev
   ```
   The storefront will be available at [http://localhost:3000](http://localhost:3000)

2. **Start the admin panel** (in a separate terminal):
   ```bash
   cd admin-panel
   npm run dev
   ```
   The admin panel will be available at [http://localhost:3000](http://localhost:3000) (different port if configured)

### Production Build

1. **Build the applications**:
   ```bash
   # Storefront
   cd asaya-collection
   npm run build

   # Admin Panel
   cd admin-panel
   npm run build
   ```

2. **Start production servers**:
   ```bash
   # Storefront
   npm start

   # Admin Panel
   npm start
   ```

## 📁 Project Structure

### Asaya Collection (Storefront)
```
asaya-collection/
├── app/                          # Next.js App Router pages
│   ├── about/                    # About page
│   ├── auth/                     # Authentication pages
│   ├── care-guide/               # Product care guide
│   ├── checkout/                 # Checkout process
│   ├── collections/              # Product collections
│   ├── contact/                  # Contact page
│   ├── cookies/                  # Cookie policy
│   ├── faq/                      # FAQ page
│   ├── login/                    # Login page
│   ├── orders/                   # Order history
│   ├── privacy/                  # Privacy policy
│   └── terms-and-conditions/     # Terms page
├── components/                   # Reusable components
│   ├── Home/                     # Homepage sections
│   ├── Layout/                   # Layout components
│   ├── Product/                  # Product-related components
│   └── UI/                       # UI components
├── context/                      # React Context providers
├── lib/                          # Utility functions
├── models/                       # Data models
├── services/                     # API service functions
├── store/                        # Zustand stores
└── public/                       # Static assets
```

### Admin Panel
```
admin-panel/
├── app/                          # Next.js App Router (admin)
│   ├── (admin)/                  # Protected admin routes
│   ├── auth/                     # Admin authentication
│   └── action/                   # Admin actions
├── components/                   # Admin components
├── context/                      # Admin context
└── lib/                          # Admin utilities
```

## 🗄️ Database Schema

### Core Tables

- **products**: Product catalog with pricing, inventory, and metadata
- **categories**: Product categorization system
- **orders**: Customer order records
- **order_items**: Individual items within orders
- **reviews**: Customer product reviews and ratings

### Key Relationships

- Products belong to Categories (many-to-one)
- Orders contain Order Items (one-to-many)
- Order Items reference Products (many-to-one)
- Reviews are associated with Products and Users (many-to-one)

## 🔗 API Reference

### Product Services

- `getAllProducts(page?, limit?)` - Get paginated products
- `getProductDetails(slug)` - Get single product with reviews
- `getFeaturedProducts()` - Get featured products
- `getBestSellers()` - Get best-selling products
- `getTrendingProducts()` - Get trending products
- `getProductsByCategory(categoryName)` - Get products by category
- `submitReview(reviewData)` - Submit product review

### Category Services

- `getAllCategories()` - Get all product categories

### Order Services

- `createOrder(orderData)` - Create new order
- `getOrderDetails(orderId)` - Get order information
- `updateOrderStatus(orderId, status)` - Update order status

## 📱 Usage

### For Customers
1. Browse products on the homepage
2. Use search and filters to find specific items
3. View detailed product information
4. Add items to cart and proceed to checkout
5. Create account or login to track orders
6. Leave reviews for purchased products

### For Administrators
1. Login to the admin panel
2. Manage products (add, edit, delete)
3. Process and update orders
4. View analytics and sales data
5. Manage categories and content

## 🧪 Testing

```bash
# Run tests for storefront
cd asaya-collection
npm test

# Run tests for admin panel
cd admin-panel
npm test
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**:
   - Import the repository to Vercel
   - Configure environment variables in Vercel dashboard

2. **Deploy storefront**:
   - Set build command: `npm run build`
   - Set output directory: `.next`

3. **Deploy admin panel**:
   - Repeat for admin-panel directory
   - Configure different domain or subdomain

### Manual Deployment

1. Build both applications
2. Deploy to your preferred hosting platform
3. Configure environment variables
4. Set up SSL certificates
5. Configure domain and DNS

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Imad** - *Initial work* - [buildwithimad](https://github.com/buildwithimad)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework used
- [Supabase](https://supabase.com/) - Backend as a service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Resend](https://resend.com/) - Email service

---

<div align="center">
  <p>Made with ❤️ by Imad Hussain Khan (Full Stack Web Developer)</p>
  <p>
    <a href="#asaya-collection">Back to top</a>
  </p>
</div></content>
<parameter name="filePath">D:\My Projects\AsayaCollection\README.md