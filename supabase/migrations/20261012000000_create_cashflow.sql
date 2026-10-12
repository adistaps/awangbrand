-- Migration: Add Cashflow Transactions table for AWANG Brand
CREATE TABLE IF NOT EXISTS public.cashflow_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    type VARCHAR(20) NOT NULL DEFAULT 'income', -- 'income' | 'expense'
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    channel VARCHAR(50) NOT NULL DEFAULT 'offline_store', -- 'offline_store', 'distributor', 'supermarket', 'online_shopee', etc.
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    store_name VARCHAR(255), -- Nama toko offline / cabang / mitra ritel
    description TEXT NOT NULL,
    reference_no VARCHAR(100),
    payment_method VARCHAR(50) DEFAULT 'Transfer Bank',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cashflow_date ON public.cashflow_transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_cashflow_brand ON public.cashflow_transactions(brand_id);
CREATE INDEX IF NOT EXISTS idx_cashflow_type ON public.cashflow_transactions(type);
