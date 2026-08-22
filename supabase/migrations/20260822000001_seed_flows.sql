-- Demo flows: one investor participation + one client listing on PNC-PAR-001

insert into participations (project_id, investor_id, committed_amount, paid_amount, ownership_pct, status)
select p.id, i.id, 25000, 25000, 5.000000, 'active'
from projects p, profiles i
where p.code = 'PNC-PAR-001' and i.email = 'inversor@pachanova.local'
on conflict do nothing;

insert into capital_transactions (project_id, participation_id, profile_id, kind, amount, status, method, notes)
select p.id, par.id, i.id, 'contribution', 25000, 'reconciled', 'manual', 'Aporte inicial demo'
from projects p
join profiles i on i.email = 'inversor@pachanova.local'
join participations par on par.project_id = p.id and par.investor_id = i.id
where p.code = 'PNC-PAR-001';

update projects
set raised_capital = 25000
where code = 'PNC-PAR-001';

insert into listings (project_id, kind, title, description, unit_code, area_m2, price, status)
select id, 'lot', 'Lote A-12', 'Lote de salida del landbanking Paracas. Oferta al cliente, no al inversor.', 'A-12', 450, 85000, 'published'
from projects
where code = 'PNC-PAR-001';
