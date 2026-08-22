-- Portafolio de trabajo: 3 giros con documentos, hitos y ofertas.

insert into projects (code, name, type, status, location, thesis, currency, target_capital, raised_capital, round_status, metadata)
values
  (
    'PNC-SB-002',
    'San Bartolo — Edificio Pacífico',
    'building_sale',
    'funding',
    'San Bartolo, Lima Sur',
    'Desarrollo de 48 departamentos frente al malecón. El inversor cofinancia la obra. El cliente compra la unidad.',
    'USD', 2400000, 410000, 'open',
    '{"cover":"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80","units":48}'::jsonb
  ),
  (
    'PNC-CHI-003',
    'Chilca — Renta industrial liviana',
    'building_rent',
    'active',
    'Chilca, Cañete',
    'Nave existente para alquiler a operadores logísticos. El inversor recibe distribución de renta. El cliente arrienda el módulo.',
    'USD', 900000, 900000, 'closed',
    '{"cover":"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80","modules":12}'::jsonb
  )
on conflict (code) do update set
  name = excluded.name,
  thesis = excluded.thesis,
  target_capital = excluded.target_capital,
  raised_capital = excluded.raised_capital,
  round_status = excluded.round_status,
  metadata = excluded.metadata,
  status = excluded.status,
  location = excluded.location;

update projects
set
  thesis = 'Compra de 5 ha en Paracas para madurar y vender. El inversor cofinancia la tierra. El cliente compra el lote al final.',
  metadata = '{"cover":"https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80","hectares":5}'::jsonb,
  target_capital = 500000,
  raised_capital = 25000,
  round_status = 'open',
  status = 'funding'
where code = 'PNC-PAR-001';

-- Documents
insert into project_documents (project_id, title, category, file_url, visibility)
select id, title, category, file_url, visibility
from projects p
cross join (values
  ('Partida registral', 'titulo', 'https://example.com/partida.pdf', 'investor'),
  ('Tasación independiente', 'tasacion', 'https://example.com/tasacion.pdf', 'investor'),
  ('Plano / memoria', 'plano', 'https://example.com/plano.pdf', 'investor')
) as d(title, category, file_url, visibility)
where p.code in ('PNC-PAR-001','PNC-SB-002','PNC-CHI-003')
  and not exists (
    select 1 from project_documents x where x.project_id = p.id and x.title = d.title
  );

insert into project_documents (project_id, title, category, file_url, visibility)
select id, 'Ficha de unidad tipo', 'comercial', 'https://example.com/unidad.pdf', 'client'
from projects where code = 'PNC-SB-002'
and not exists (select 1 from project_documents where title = 'Ficha de unidad tipo');

-- Milestones
insert into project_milestones (project_id, title, status, sort_order)
select p.id, m.title, m.status::milestone_status, m.sort
from projects p
join (values
  ('PNC-PAR-001', 'Due diligence del predio', 'done', 1),
  ('PNC-PAR-001', 'Compra de tierra', 'in_progress', 2),
  ('PNC-PAR-001', 'Habilitación y loteo', 'pending', 3),
  ('PNC-PAR-001', 'Venta de lotes', 'pending', 4),
  ('PNC-SB-002', 'Licencias municipales', 'done', 1),
  ('PNC-SB-002', 'Cimentación', 'in_progress', 2),
  ('PNC-SB-002', 'Estructura', 'pending', 3),
  ('PNC-SB-002', 'Entrega de departamentos', 'pending', 4),
  ('PNC-CHI-003', 'Compra del activo', 'done', 1),
  ('PNC-CHI-003', 'Primer contrato de renta', 'done', 2),
  ('PNC-CHI-003', 'Ocupación 80%', 'in_progress', 3)
) as m(code, title, status, sort) on m.code = p.code
where not exists (
  select 1 from project_milestones x where x.project_id = p.id and x.title = m.title
);

-- Extra listings
insert into listings (project_id, kind, title, description, unit_code, area_m2, price, status)
select p.id, v.kind::listing_kind, v.title, v.description, v.unit_code, v.area, v.price, v.status::listing_status
from projects p
join (values
  ('PNC-PAR-001', 'lot', 'Lote B-04', 'Frente a vía interna, 520 m².', 'B-04', 520, 92000, 'published'),
  ('PNC-SB-002', 'unit_sale', 'Depto 802 — 3 dorm.', 'Vista al mar, piso 8.', '802', 98, 185000, 'published'),
  ('PNC-SB-002', 'unit_sale', 'Depto 305 — 2 dorm.', 'Entrega 2027.', '305', 72, 128000, 'published'),
  ('PNC-CHI-003', 'rental', 'Módulo 04 — 800 m²', 'Renta mensual a operador logístico.', 'M-04', 800, 4200, 'published')
) as v(code, kind, title, description, unit_code, area, price, status) on v.code = p.code
where not exists (select 1 from listings l where l.unit_code = v.unit_code and l.project_id = p.id);

-- Second investor-looking participation on Chilca (already funded)
insert into participations (project_id, investor_id, committed_amount, paid_amount, ownership_pct, status)
select p.id, i.id, 50000, 50000, 5.555556, 'active'
from projects p, profiles i
where p.code = 'PNC-CHI-003' and i.email = 'inversor@pachanova.local'
on conflict do nothing;

insert into kyc_files (profile_id, doc_type, file_url, status)
select id, 'dni_front', 'https://example.com/dni-inversor.pdf', 'approved'
from profiles where email = 'inversor@pachanova.local'
and not exists (select 1 from kyc_files k join profiles p on p.id = k.profile_id where p.email = 'inversor@pachanova.local');

insert into audit_events (action, entity_type, payload)
values
  ('portfolio.seed', 'system', '{"note":"Portafolio de 3 giros cargado"}');
