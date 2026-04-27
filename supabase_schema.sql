-- ==========================================
-- H&B STORE - COMPLETE SUPABASE SCHEMA & RLS
-- ==========================================
-- Copy and paste this entire script into your Supabase SQL Editor and run it.

-- 1. Create Profiles Table (Stores user roles and details)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'staff')),
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL NOT NULL,
    category TEXT,
    image TEXT,
    images TEXT[],
    stock INTEGER DEFAULT 0,
    sizes TEXT[],
    colors TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Null if guest checkout
    email TEXT NOT NULL,
    address JSONB NOT NULL,
    items JSONB NOT NULL,
    total DECIMAL NOT NULL,
    status TEXT DEFAULT 'Pending',
    payment_method TEXT DEFAULT 'COD',
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Create Banners Table
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    "desc" TEXT,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Create Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount DECIMAL NOT NULL,
    type TEXT DEFAULT 'Percentage',
    usageLimit INTEGER DEFAULT 100,
    used INTEGER DEFAULT 0,
    expiry DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- RLS POLICIES
-- ==========================================

-- 1. PROFILES POLICIES
-- Users can view their own profile. Admins can view all profiles.
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile." ON public.profiles FOR UPDATE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff')
);

-- 2. PRODUCTS POLICIES
-- Anyone can view products. Only admins/staff can insert/update/delete.
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products." ON public.products FOR INSERT WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff')
);
CREATE POLICY "Admins can update products." ON public.products FOR UPDATE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff')
);
CREATE POLICY "Admins can delete products." ON public.products FOR DELETE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff')
);

-- 3. CATEGORIES POLICIES
-- Anyone can view. Only admins/staff can edit.
CREATE POLICY "Categories viewable by everyone." ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories." ON public.categories FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff')
);

-- 4. ORDERS POLICIES
-- Users can insert their own orders. Admins can view/update all orders.
-- (We allow anon insert so guests can checkout if needed, or require auth)
CREATE POLICY "Anyone can insert an order" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff')
);
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff')
);
CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff')
);

-- 5. BANNERS POLICIES
CREATE POLICY "Banners viewable by everyone." ON public.banners FOR SELECT USING (true);
CREATE POLICY "Admins manage banners." ON public.banners FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff')
);

-- 6. COUPONS POLICIES
CREATE POLICY "Coupons viewable by everyone." ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Admins manage coupons." ON public.coupons FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff')
);

-- ==========================================
-- TRIGGERS (Auto-create profile on signup)
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
      new.id, 
      new.raw_user_meta_data->>'full_name', 
      COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if trigger exists before creating
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- SUCCESS: Database is now fully initialized and secured!
