USE podium_manager;

-- ============================================================
-- 50 MEMBRES
-- ============================================================
INSERT INTO members (first_name, last_name, phone, cin, registration_date, status) VALUES
-- Mensuel actifs (1-14)
('Youssef',  'Benali',       '0661100001', 'BE101001', '2026-05-18', 'active'),
('Karim',    'Idrissi',      '0661100002', 'BE101002', '2026-05-13', 'active'),
('Hamza',    'El Mansouri',  '0661100003', 'CD101003', '2026-06-01', 'active'),
('Omar',     'Benkirane',    '0661100004', 'CD101004', '2026-05-23', 'active'),
('Said',     'Alami',        '0661100005', 'EE101005', '2026-05-05', 'active'),
('Mehdi',    'Tahiri',       '0661100006', 'EE101006', '2026-05-26', 'active'),
('Anas',     'Cherkaoui',    '0661100007', 'FG101007', '2026-05-16', 'active'),
('Rachid',   'Berrada',      '0661100008', 'FG101008', '2026-05-30', 'active'),
('Imane',    'Zaki',         '0661100009', 'HH101009', '2026-05-03', 'active'),
('Fatima',   'Hajji',        '0661100010', 'HH101010', '2026-05-20', 'active'),
('Nadia',    'Benali',       '0661100011', 'IJ101011', '2026-05-10', 'active'),
('Sara',     'Fassi',        '0661100012', 'IJ101012', '2026-05-28', 'active'),
('Leila',    'Chraibi',      '0661100013', 'KL101013', '2026-05-06', 'active'),
('Hind',     'Bensouda',     '0661100014', 'KL101014', '2026-05-15', 'active'),
-- Mensuel expirés (15-20)
('Zineb',    'Lamrani',      '0661100015', 'MN101015', '2026-03-01', 'expired'),
('Amina',    'Tazi',         '0661100016', 'MN101016', '2026-02-13', 'expired'),
('Mounia',   'Alaoui',       '0661100017', 'OP101017', '2026-04-01', 'expired'),
('Hajar',    'Bennani',      '0661100018', 'OP101018', '2026-03-20', 'expired'),
('Rim',      'Lahlou',       '0661100019', 'QQ101019', '2026-04-08', 'expired'),
('Khadija',  'Rbati',        '0661100020', 'QQ101020', '2026-04-18', 'expired'),
-- Trimestriel actifs (21-30)
('Adil',     'Sekkat',       '0661100021', 'RS101021', '2026-04-01', 'active'),
('Tarik',    'Bennis',       '0661100022', 'RS101022', '2026-03-13', 'active'),
('Khalid',   'Lahlou',       '0661100023', 'TU101023', '2026-05-01', 'active'),
('Nabil',    'Fassi',        '0661100024', 'TU101024', '2026-04-13', 'active'),
('Younes',   'Benjelloun',   '0661100025', 'VW101025', '2026-03-18', 'active'),
('Bilal',    'Ouali',        '0661100026', 'VW101026', '2026-05-08', 'active'),
('Amine',    'Benomar',      '0661100027', 'XY101027', '2026-04-18', 'active'),
('Hassan',   'Chaibi',       '0661100028', 'XY101028', '2026-03-08', 'active'),
('Reda',     'Benali',       '0661100029', 'ZA101029', '2026-05-18', 'active'),
('Soufiane', 'El Alj',       '0661100030', 'ZA101030', '2026-04-03', 'active'),
-- Trimestriel expirés (31-33)
('Mariam',   'Bensouda',     '0661100031', 'BB101031', '2025-12-01', 'expired'),
('Houda',    'Alami',        '0661100032', 'BB101032', '2026-01-13', 'expired'),
('Dounia',   'Tazi',         '0661100033', 'CC101033', '2025-11-18', 'expired'),
-- Semestriel actifs (34-41)
('Widad',    'Berrada',      '0661100034', 'CC101034', '2025-12-28', 'active'),
('Sanaa',    'Idrissi',      '0661100035', 'DD101035', '2025-12-13', 'active'),
('Najat',    'Cherkaoui',    '0661100036', 'DD101036', '2026-01-28', 'active'),
('Bouchra',  'Tahiri',       '0661100037', 'EF101037', '2026-01-18', 'active'),
('Laila',    'El Fassi',     '0661100038', 'EF101038', '2025-11-28', 'active'),
('Meryem',   'Benali',       '0661100039', 'GH101039', '2026-02-28', 'active'),
('Ghita',    'Benkirane',    '0661100040', 'GH101040', '2026-02-13', 'active'),
('Ibrahim',  'Benali',       '0661100041', 'IK101041', '2026-01-08', 'active'),
-- Semestriel expirés (42-43)
('Yassine',  'El Haddad',    '0661100042', 'IK101042', '2025-05-28', 'expired'),
('Mohamed',  'Raji',         '0661100043', 'LM101043', '2025-08-13', 'expired'),
-- Annuel actifs (44-49)
('Othmane',  'Berrada',      '0661100044', 'LM101044', '2025-06-13', 'active'),
('Zakaria',  'Tazi',         '0661100045', 'NO101045', '2025-12-28', 'active'),
('Hicham',   'Bennani',      '0661100046', 'NO101046', '2025-07-28', 'active'),
('Jawad',    'El Alami',     '0661100047', 'PQ101047', '2025-10-13', 'active'),
('Ayoub',    'Sekkat',       '0661100048', 'PQ101048', '2026-02-28', 'active'),
('Ismail',   'Chraibi',      '0661100049', 'RS101049', '2025-07-08', 'active'),
-- Annuel expiré (50)
('Saad',     'Bennis',       '0661100050', 'RS101050', '2024-05-28', 'expired');


-- ============================================================
-- 50 ABONNEMENTS
-- ============================================================
INSERT INTO subscriptions (member_id, plan_id, start_date, end_date, status, total_amount, paid_amount) VALUES
-- Mensuel actifs
((SELECT id FROM members WHERE cin='BE101001'), 1, '2026-05-20', '2026-06-20', 'active',  250.00, 250.00),
((SELECT id FROM members WHERE cin='BE101002'), 1, '2026-05-15', '2026-06-15', 'active',  250.00, 250.00),
((SELECT id FROM members WHERE cin='CD101003'), 1, '2026-06-01', '2026-07-01', 'active',  250.00, 250.00),
((SELECT id FROM members WHERE cin='CD101004'), 1, '2026-05-25', '2026-06-25', 'active',  250.00, 200.00),
((SELECT id FROM members WHERE cin='EE101005'), 1, '2026-05-10', '2026-06-10', 'active',  250.00, 250.00),
((SELECT id FROM members WHERE cin='EE101006'), 1, '2026-05-28', '2026-06-28', 'active',  250.00, 250.00),
((SELECT id FROM members WHERE cin='FG101007'), 1, '2026-05-18', '2026-06-18', 'active',  250.00, 250.00),
((SELECT id FROM members WHERE cin='FG101008'), 1, '2026-06-01', '2026-07-01', 'active',  250.00, 250.00),
((SELECT id FROM members WHERE cin='HH101009'), 1, '2026-05-05', '2026-06-05', 'active',  250.00, 250.00),
((SELECT id FROM members WHERE cin='HH101010'), 1, '2026-05-22', '2026-06-22', 'active',  250.00, 150.00),
((SELECT id FROM members WHERE cin='IJ101011'), 1, '2026-05-12', '2026-06-12', 'active',  250.00, 250.00),
((SELECT id FROM members WHERE cin='IJ101012'), 1, '2026-05-30', '2026-06-30', 'active',  250.00, 250.00),
((SELECT id FROM members WHERE cin='KL101013'), 1, '2026-05-08', '2026-06-08', 'active',  250.00, 250.00),
((SELECT id FROM members WHERE cin='KL101014'), 1, '2026-05-17', '2026-06-17', 'active',  250.00, 250.00),
-- Mensuel expirés
((SELECT id FROM members WHERE cin='MN101015'), 1, '2026-03-01', '2026-04-01', 'expired', 250.00, 250.00),
((SELECT id FROM members WHERE cin='MN101016'), 1, '2026-02-15', '2026-03-15', 'expired', 250.00, 250.00),
((SELECT id FROM members WHERE cin='OP101017'), 1, '2026-04-01', '2026-05-01', 'expired', 250.00, 250.00),
((SELECT id FROM members WHERE cin='OP101018'), 1, '2026-03-20', '2026-04-20', 'expired', 250.00, 200.00),
((SELECT id FROM members WHERE cin='QQ101019'), 1, '2026-04-10', '2026-05-10', 'expired', 250.00, 250.00),
((SELECT id FROM members WHERE cin='QQ101020'), 1, '2026-04-20', '2026-05-20', 'expired', 250.00, 250.00),
-- Trimestriel actifs
((SELECT id FROM members WHERE cin='RS101021'), 2, '2026-04-01', '2026-07-01', 'active',  650.00, 650.00),
((SELECT id FROM members WHERE cin='RS101022'), 2, '2026-03-15', '2026-06-15', 'active',  650.00, 650.00),
((SELECT id FROM members WHERE cin='TU101023'), 2, '2026-05-01', '2026-08-01', 'active',  650.00, 650.00),
((SELECT id FROM members WHERE cin='TU101024'), 2, '2026-04-15', '2026-07-15', 'active',  650.00, 500.00),
((SELECT id FROM members WHERE cin='VW101025'), 2, '2026-03-20', '2026-06-20', 'active',  650.00, 650.00),
((SELECT id FROM members WHERE cin='VW101026'), 2, '2026-05-10', '2026-08-10', 'active',  650.00, 650.00),
((SELECT id FROM members WHERE cin='XY101027'), 2, '2026-04-20', '2026-07-20', 'active',  650.00, 650.00),
((SELECT id FROM members WHERE cin='XY101028'), 2, '2026-03-10', '2026-06-10', 'active',  650.00, 650.00),
((SELECT id FROM members WHERE cin='ZA101029'), 2, '2026-05-20', '2026-08-20', 'active',  650.00, 650.00),
((SELECT id FROM members WHERE cin='ZA101030'), 2, '2026-04-05', '2026-07-05', 'active',  650.00, 400.00),
-- Trimestriel expirés
((SELECT id FROM members WHERE cin='BB101031'), 2, '2025-12-01', '2026-03-01', 'expired', 650.00, 650.00),
((SELECT id FROM members WHERE cin='BB101032'), 2, '2026-01-15', '2026-04-15', 'expired', 650.00, 650.00),
((SELECT id FROM members WHERE cin='CC101033'), 2, '2025-11-20', '2026-02-20', 'expired', 650.00, 650.00),
-- Semestriel actifs
((SELECT id FROM members WHERE cin='CC101034'), 3, '2026-01-01', '2026-07-01', 'active',  1100.00, 1100.00),
((SELECT id FROM members WHERE cin='DD101035'), 3, '2025-12-15', '2026-06-15', 'active',  1100.00, 1100.00),
((SELECT id FROM members WHERE cin='DD101036'), 3, '2026-02-01', '2026-08-01', 'active',  1100.00, 1100.00),
((SELECT id FROM members WHERE cin='EF101037'), 3, '2026-01-20', '2026-07-20', 'active',  1100.00,  800.00),
((SELECT id FROM members WHERE cin='EF101038'), 3, '2025-12-01', '2026-06-01', 'active',  1100.00, 1100.00),
((SELECT id FROM members WHERE cin='GH101039'), 3, '2026-03-01', '2026-09-01', 'active',  1100.00, 1100.00),
((SELECT id FROM members WHERE cin='GH101040'), 3, '2026-02-15', '2026-08-15', 'active',  1100.00, 1100.00),
((SELECT id FROM members WHERE cin='IK101041'), 3, '2026-01-10', '2026-07-10', 'active',  1100.00, 1100.00),
-- Semestriel expirés
((SELECT id FROM members WHERE cin='IK101042'), 3, '2025-06-01', '2025-12-01', 'expired', 1100.00, 1100.00),
((SELECT id FROM members WHERE cin='LM101043'), 3, '2025-08-15', '2026-02-15', 'expired', 1100.00, 1100.00),
-- Annuel actifs
((SELECT id FROM members WHERE cin='LM101044'), 4, '2025-06-15', '2026-06-15', 'active',  2000.00, 2000.00),
((SELECT id FROM members WHERE cin='NO101045'), 4, '2026-01-01', '2027-01-01', 'active',  2000.00, 2000.00),
((SELECT id FROM members WHERE cin='NO101046'), 4, '2025-08-01', '2026-08-01', 'active',  2000.00, 2000.00),
((SELECT id FROM members WHERE cin='PQ101047'), 4, '2025-10-15', '2026-10-15', 'active',  2000.00, 1500.00),
((SELECT id FROM members WHERE cin='PQ101048'), 4, '2026-03-01', '2027-03-01', 'active',  2000.00, 2000.00),
((SELECT id FROM members WHERE cin='RS101049'), 4, '2025-07-10', '2026-07-10', 'active',  2000.00, 2000.00),
-- Annuel expiré
((SELECT id FROM members WHERE cin='RS101050'), 4, '2024-06-01', '2025-06-01', 'expired', 2000.00, 2000.00);


-- ============================================================
-- PAIEMENTS (un par abonnement)
-- ============================================================
INSERT INTO payments (subscription_id, amount, payment_date, method, received_by)
SELECT s.id, s.paid_amount,
  CONCAT(s.start_date, ' 09:00:00'),
  CASE (s.id % 3)
    WHEN 0 THEN 'cash'
    WHEN 1 THEN 'card'
    ELSE 'transfer'
  END,
  1
FROM subscriptions s
JOIN members m ON s.member_id = m.id
WHERE m.cin IN (
  'BE101001','BE101002','CD101003','CD101004','EE101005','EE101006','FG101007','FG101008',
  'HH101009','HH101010','IJ101011','IJ101012','KL101013','KL101014','MN101015','MN101016',
  'OP101017','OP101018','QQ101019','QQ101020','RS101021','RS101022','TU101023','TU101024',
  'VW101025','VW101026','XY101027','XY101028','ZA101029','ZA101030','BB101031','BB101032',
  'CC101033','CC101034','DD101035','DD101036','EF101037','EF101038','GH101039','GH101040',
  'IK101041','IK101042','LM101043','LM101044','NO101045','NO101046','PQ101047','PQ101048',
  'RS101049','RS101050'
)
AND s.paid_amount > 0;
