-- Script untuk hapus data testing yang error
-- Jalankan script ini di PostgreSQL untuk reset data

-- Hapus semua data di tabel projects (hati-hati, ini akan hapus SEMUA project!)
DELETE FROM projects WHERE project_ticket_no = '1' OR project_name = 'STAK ANOMALI';

-- Hapus semua data di tabel mtcs/non-projects yang error
DELETE FROM mtcs WHERE no_tiket = '123';

-- Atau jika ingin hapus SEMUA data testing (HATI-HATI!):
-- DELETE FROM projects;
-- DELETE FROM mtcs;

-- Reset sequence ID (opsional, untuk memulai dari 1 lagi)
-- ALTER SEQUENCE projects_id_seq RESTART WITH 1;
-- ALTER SEQUENCE mtcs_id_seq RESTART WITH 1;

-- Tampilkan data yang tersisa
SELECT * FROM projects ORDER BY id;
SELECT * FROM mtcs ORDER BY id;
