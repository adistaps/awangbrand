-- GANTI email dengan email login admin Anda di Supabase Auth sebelum dijalankan
INSERT INTO public.admin_users (user_id)
SELECT id FROM auth.users WHERE email = 'GANTI_EMAIL_ADMIN@contoh.com'
ON CONFLICT DO NOTHING;
