-- Seed data for the first Story of Arda knowledge-graph experience.
-- Safe to re-run: journey steps, event locations, and item-free sample rows are
-- scoped by slug and cleaned before reinsertion.

INSERT INTO arda_era (slug, name, sort_order, period_label, summary)
VALUES
  ('first-age', '제1시대', 1, '실마릴 전쟁', '벨레리안드의 비극과 영웅담이 겹쳐지는 시대입니다.'),
  ('second-age', '제2시대', 2, '왕들의 시대', '누메노르의 영광과 몰락, 사우론의 귀환이 이어지는 시대입니다.'),
  ('third-age', '제3시대', 3, '반지전쟁 전후', '곤도르, 로한, 모르도르, 리븐델을 잇는 반지전쟁의 시대입니다.')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  period_label = EXCLUDED.period_label,
  summary = EXCLUDED.summary;

INSERT INTO arda_map_profile (era_id, legacy_map_id, map_name, image_url, title, description)
VALUES
  (
    (SELECT id FROM arda_era WHERE slug = 'third-age'),
    (SELECT id FROM map WHERE name = 'Middle Earth' LIMIT 1),
    'Middle Earth',
    '/Middle Earth.jpg',
    '가운데땅 말기의 전쟁과 왕국',
    '곤도르, 로한, 모르도르, 리븐델, 로스로리엔을 잇는 반지전쟁의 무대입니다.'
  ),
  (
    (SELECT id FROM arda_era WHERE slug = 'first-age'),
    (SELECT id FROM map WHERE name = 'Beleriand' LIMIT 1),
    'Beleriand',
    '/Beleriand.jpg',
    '벨레리안드의 비극과 영웅담',
    '놀도르의 귀환, 베렌과 루시엔, 투린의 비극, 곤돌린의 몰락이 겹쳐지는 지도입니다.'
  ),
  (
    (SELECT id FROM arda_era WHERE slug = 'second-age'),
    (SELECT id FROM map WHERE name = 'Numenor' LIMIT 1),
    'Numenor',
    '/Numenor.jpg',
    '누메노르의 영광과 몰락',
    '인간 왕국의 절정과 오만, 사우론의 간계, 몰락 이후의 계보를 읽는 지도입니다.'
  )
ON CONFLICT (map_name) DO UPDATE SET
  era_id = EXCLUDED.era_id,
  legacy_map_id = EXCLUDED.legacy_map_id,
  image_url = EXCLUDED.image_url,
  title = EXCLUDED.title,
  description = EXCLUDED.description;

INSERT INTO arda_place (page_id, map_profile_id, slug, name, english_name, kind, default_point, spoiler_level, summary)
VALUES
  ((SELECT id FROM page WHERE en_name = 'minas-tirith' LIMIT 1), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 'minas-tirith', '미나스 티리스', 'Minas Tirith', 'city', ST_SetSRID(ST_MakePoint(2450.0072, 1962.575), 4326), 0, '곤도르의 수도이자 서쪽 인간 왕국의 마지막 성채입니다.'),
  ((SELECT id FROM page WHERE en_name = 'osgiliath' LIMIT 1), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 'osgiliath', '오스길리아스', 'Osgiliath', 'city', ST_SetSRID(ST_MakePoint(2486.7017, 1989.8004), 4326), 0, '안두인 위의 옛 수도이자 곤도르 쇠퇴의 상징적 전장입니다.'),
  ((SELECT id FROM page WHERE en_name = 'rivendell' LIMIT 1), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 'rivendell', '리븐델', 'Rivendell', 'refuge', ST_SetSRID(ST_MakePoint(1848.8328, 746.6704), 4326), 0, '엘론드의 피난처이자 반지원정대가 결성되는 지식의 거점입니다.'),
  ((SELECT id FROM page WHERE en_name = 'misty-mountains' LIMIT 1), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 'misty-mountains', '안개 산맥', 'Misty Mountains', 'mountain', ST_SetSRID(ST_MakePoint(1936.3607, 897.4971), 4326), 0, '가운데땅을 가르는 거대한 산맥이자 원정대의 길을 갈라놓는 장벽입니다.'),
  ((SELECT id FROM page WHERE en_name = 'lothlorien' LIMIT 1), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 'lothlorien', '로스로리엔', 'Lothlorien', 'forest', ST_SetSRID(ST_MakePoint(1987.927, 1189.6115), 4326), 0, '갈라드리엘의 숲이자 상실 이후 원정대가 다시 방향을 잡는 장소입니다.'),
  ((SELECT id FROM page WHERE en_name = 'anduin' LIMIT 1), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 'anduin', '안두인', 'Anduin', 'river', ST_SetSRID(ST_MakePoint(2149.9587, 1286.9312), 4326), 0, '원정대가 흩어지고 각자의 전쟁으로 들어가는 큰 강길입니다.'),
  ((SELECT id FROM page WHERE en_name = 'mordor' LIMIT 1), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 'mordor', '모르도르', 'Mordor', 'realm', ST_SetSRID(ST_MakePoint(3083.7443, 2053.4878), 4326), 0, '사우론의 땅이자 반지의 여정이 끝나는 적의 심장부입니다.'),
  ((SELECT id FROM page WHERE en_name = 'rohan' LIMIT 1), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 'rohan', '로한', 'Rohan', 'realm', ST_SetSRID(ST_MakePoint(1970.1393, 1557.7642), 4326), 0, '기마대의 왕국이자 곤도르와 함께 서쪽 전선을 지탱하는 인간 왕국입니다.'),
  ((SELECT id FROM page WHERE en_name = 'helms-deep' LIMIT 1), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 'helms-deep', '헬름 협곡', 'Helm''s Deep', 'fortress', ST_SetSRID(ST_MakePoint(1785.9546, 1690.0562), 4326), 0, '로한이 무너지지 않았음을 증명한 요새입니다.'),
  ((SELECT id FROM page WHERE en_name = 'isengard' LIMIT 1), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 'isengard', '아이센가드', 'Isengard', 'fortress', ST_SetSRID(ST_MakePoint(1688.3238, 1520.817), 4326), 0, '사루만의 배신이 로한 전쟁의 불씨가 되는 요새입니다.'),
  ((SELECT id FROM page WHERE en_name = 'edoras' LIMIT 1), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 'edoras', '에도라스', 'Edoras', 'city', ST_SetSRID(ST_MakePoint(1878.2828, 1732.935), 4326), 0, '세오덴의 귀환과 로한의 결단이 시작되는 왕도입니다.'),
  ((SELECT id FROM page WHERE en_name = 'black-gate' LIMIT 1), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 'black-gate', '검은 문', 'Black Gate', 'gate', ST_SetSRID(ST_MakePoint(2601.5, 1712.5789), 4326), 0, '서쪽의 병력이 사우론의 시선을 묶어 두는 마지막 전장입니다.')
ON CONFLICT (slug) DO UPDATE SET
  page_id = EXCLUDED.page_id,
  map_profile_id = EXCLUDED.map_profile_id,
  name = EXCLUDED.name,
  english_name = EXCLUDED.english_name,
  kind = EXCLUDED.kind,
  default_point = EXCLUDED.default_point,
  spoiler_level = EXCLUDED.spoiler_level,
  summary = EXCLUDED.summary;

INSERT INTO arda_event (page_id, era_id, slug, title, event_kind, date_label, sequence_order, spoiler_level, summary, consequence)
VALUES
  (NULL, (SELECT id FROM arda_era WHERE slug = 'second-age'), 'minas-anor-founded', '미나스 아노르가 세워지다', 'founding', 'S.A. 3320', 10, 0, '누메노르 몰락 이후 망명 왕국 곤도르가 세워지며, 태양의 탑 미나스 아노르가 안두인 서쪽 방어선의 핵심이 됩니다.', '오스길리아스와 함께 곤도르의 권력 축을 이루고, 훗날 미나스 티리스라는 이름으로 서쪽 인간 왕국의 상징이 됩니다.'),
  (NULL, (SELECT id FROM arda_era WHERE slug = 'third-age'), 'osgiliath-falls-capital-moves', '수도의 무게가 미나스 티리스로 옮겨지다', 'fall', 'T.A. 1640', 20, 0, '오스길리아스가 전염병과 전쟁으로 약해지면서 곤도르의 실질적 중심은 미나스 아노르로 이동합니다.', '도시는 더 이상 변방 요새가 아니라 곤도르의 기억과 통치가 모이는 마지막 성채가 됩니다.'),
  (NULL, (SELECT id FROM arda_era WHERE slug = 'third-age'), 'pelennor-fields', '펠렌노르 평원의 전투', 'battle', 'T.A. 3019', 30, 0, '미나스 티리스가 모르도르의 대군에 포위되고, 로한의 기마대와 아라고른의 남부 병력이 전장의 흐름을 뒤집습니다.', '곤도르는 멸망 직전에서 살아남고, 왕의 귀환이 현실의 정치 질서로 이어질 길이 열립니다.'),
  (NULL, (SELECT id FROM arda_era WHERE slug = 'third-age'), 'aragorn-crowned', '왕의 귀환', 'return', 'T.A. 3019', 40, 0, '아라고른이 엘렛사르 왕으로 즉위하며 오랫동안 비어 있던 곤도르의 왕좌가 회복됩니다.', '미나스 티리스는 전쟁의 폐허가 아니라 재건과 통합 왕국의 수도로 다시 읽히게 됩니다.'),
  (NULL, (SELECT id FROM arda_era WHERE slug = 'third-age'), 'council-of-elrond', '엘론드의 회의', 'council', 'T.A. 3018', 50, 0, '여러 자유 민족의 대표들이 리븐델에 모여 절대반지의 운명을 논의하고, 파괴라는 거의 불가능한 결론에 도달합니다.', '반지원정대가 결성되며 세계의 운명은 왕국의 군대가 아니라 작은 동행의 길 위로 옮겨갑니다.'),
  (NULL, (SELECT id FROM arda_era WHERE slug = 'third-age'), 'helms-deep-stands', '헬름 협곡이 버티다', 'battle', 'T.A. 3019', 60, 0, '사루만의 군대가 로한을 무너뜨리려 하지만, 헬름 협곡의 방어전은 로한이 아직 끝나지 않았음을 증명합니다.', '세오덴은 방어만 하는 왕이 아니라 곤도르를 향해 달려갈 왕으로 바뀝니다.'),
  (NULL, (SELECT id FROM arda_era WHERE slug = 'third-age'), 'black-gate-last-stand', '검은 문 앞의 마지막 미끼', 'battle', 'T.A. 3019', 70, 0, '서쪽의 병력은 승산 없는 전투를 감수하며 사우론의 시선을 자신들에게 묶어 둡니다.', '전쟁의 승패는 전장의 힘이 아니라 운명의 산으로 향한 작은 틈에서 결정됩니다.')
ON CONFLICT (slug) DO UPDATE SET
  era_id = EXCLUDED.era_id,
  title = EXCLUDED.title,
  event_kind = EXCLUDED.event_kind,
  date_label = EXCLUDED.date_label,
  sequence_order = EXCLUDED.sequence_order,
  spoiler_level = EXCLUDED.spoiler_level,
  summary = EXCLUDED.summary,
  consequence = EXCLUDED.consequence;

DELETE FROM arda_event_location
WHERE event_id IN (SELECT id FROM arda_event WHERE slug IN (
  'minas-anor-founded',
  'osgiliath-falls-capital-moves',
  'pelennor-fields',
  'aragorn-crowned',
  'council-of-elrond',
  'helms-deep-stands',
  'black-gate-last-stand'
));

INSERT INTO arda_event_location (event_id, place_id, map_profile_id, point, location_order, note)
VALUES
  ((SELECT id FROM arda_event WHERE slug = 'minas-anor-founded'), (SELECT id FROM arda_place WHERE slug = 'minas-tirith'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), ST_SetSRID(ST_MakePoint(2450.0072, 1962.575), 4326), 1, '미나스 아노르의 건립 위치'),
  ((SELECT id FROM arda_event WHERE slug = 'osgiliath-falls-capital-moves'), (SELECT id FROM arda_place WHERE slug = 'minas-tirith'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), ST_SetSRID(ST_MakePoint(2450.0072, 1962.575), 4326), 1, '수도 기능이 이동한 성채'),
  ((SELECT id FROM arda_event WHERE slug = 'osgiliath-falls-capital-moves'), (SELECT id FROM arda_place WHERE slug = 'osgiliath'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), ST_SetSRID(ST_MakePoint(2486.7017, 1989.8004), 4326), 2, '약해진 옛 수도'),
  ((SELECT id FROM arda_event WHERE slug = 'pelennor-fields'), (SELECT id FROM arda_place WHERE slug = 'minas-tirith'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), ST_SetSRID(ST_MakePoint(2450.0072, 1962.575), 4326), 1, '공성전의 중심'),
  ((SELECT id FROM arda_event WHERE slug = 'aragorn-crowned'), (SELECT id FROM arda_place WHERE slug = 'minas-tirith'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), ST_SetSRID(ST_MakePoint(2450.0072, 1962.575), 4326), 1, '왕의 즉위'),
  ((SELECT id FROM arda_event WHERE slug = 'council-of-elrond'), (SELECT id FROM arda_place WHERE slug = 'rivendell'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), ST_SetSRID(ST_MakePoint(1848.8328, 746.6704), 4326), 1, '회의와 원정대 결성'),
  ((SELECT id FROM arda_event WHERE slug = 'helms-deep-stands'), (SELECT id FROM arda_place WHERE slug = 'helms-deep'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), ST_SetSRID(ST_MakePoint(1785.9546, 1690.0562), 4326), 1, '로한의 방어전'),
  ((SELECT id FROM arda_event WHERE slug = 'black-gate-last-stand'), (SELECT id FROM arda_place WHERE slug = 'black-gate'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), ST_SetSRID(ST_MakePoint(2601.5, 1712.5789), 4326), 1, '마지막 미끼');

INSERT INTO arda_journey (slug, title, subtitle, description, spoiler_level, sort_order)
VALUES
  ('fellowship-road', '반지원정대의 길', '리븐델에서 모르도르까지', '영화와 원작 독자가 가장 쉽게 따라올 수 있는 대표 루트입니다. 장소를 누르면 지도가 해당 지점으로 이동합니다.', 0, 10),
  ('rohan-gondor-war', '로한과 곤도르의 전쟁선', '헬름 협곡에서 펠렌노르까지', '두 인간 왕국이 어떻게 따로 버티다가 하나의 전선으로 합쳐지는지 따라가는 전쟁 루트입니다.', 0, 20),
  ('erebor-road', '외로운 산으로 가는 길', '호빗의 모험 루트', '빌보의 여정을 따라 리븐델, 안개 산맥, 어둠숲, 에레보르로 이어지는 모험선을 읽습니다.', 0, 30)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  spoiler_level = EXCLUDED.spoiler_level,
  sort_order = EXCLUDED.sort_order;

DELETE FROM arda_journey_step
WHERE journey_id IN (SELECT id FROM arda_journey WHERE slug IN ('fellowship-road', 'rohan-gondor-war', 'erebor-road'));

INSERT INTO arda_journey_step (journey_id, event_id, place_id, map_profile_id, step_order, title, point, summary)
VALUES
  ((SELECT id FROM arda_journey WHERE slug = 'fellowship-road'), (SELECT id FROM arda_event WHERE slug = 'council-of-elrond'), (SELECT id FROM arda_place WHERE slug = 'rivendell'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 1, '리븐델', ST_SetSRID(ST_MakePoint(1848.8328, 746.6704), 4326), '원정대가 결성되고 반지의 운명이 결정된 피난처입니다.'),
  ((SELECT id FROM arda_journey WHERE slug = 'fellowship-road'), NULL, (SELECT id FROM arda_place WHERE slug = 'misty-mountains'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 2, '안개 산맥', ST_SetSRID(ST_MakePoint(1936.3607, 897.4971), 4326), '카라드라스와 모리아의 선택이 갈라지는 험한 장벽입니다.'),
  ((SELECT id FROM arda_journey WHERE slug = 'fellowship-road'), NULL, (SELECT id FROM arda_place WHERE slug = 'lothlorien'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 3, '로스로리엔', ST_SetSRID(ST_MakePoint(1987.927, 1189.6115), 4326), '갈라드리엘의 숲에서 원정대는 상실 이후 다시 방향을 잡습니다.'),
  ((SELECT id FROM arda_journey WHERE slug = 'fellowship-road'), NULL, (SELECT id FROM arda_place WHERE slug = 'anduin'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 4, '안두인', ST_SetSRID(ST_MakePoint(2149.9587, 1286.9312), 4326), '원정대가 흩어지고 각자의 전쟁으로 들어가는 강길입니다.'),
  ((SELECT id FROM arda_journey WHERE slug = 'fellowship-road'), (SELECT id FROM arda_event WHERE slug = 'pelennor-fields'), (SELECT id FROM arda_place WHERE slug = 'minas-tirith'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 5, '미나스 티리스', ST_SetSRID(ST_MakePoint(2450.0072, 1962.575), 4326), '서쪽 인간 왕국의 마지막 방어선입니다.'),
  ((SELECT id FROM arda_journey WHERE slug = 'fellowship-road'), NULL, (SELECT id FROM arda_place WHERE slug = 'mordor'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 6, '모르도르', ST_SetSRID(ST_MakePoint(3083.7443, 2053.4878), 4326), '반지의 여정이 끝나는 적의 땅입니다.'),
  ((SELECT id FROM arda_journey WHERE slug = 'rohan-gondor-war'), NULL, (SELECT id FROM arda_place WHERE slug = 'isengard'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 1, '아이센가드', ST_SetSRID(ST_MakePoint(1688.3238, 1520.817), 4326), '사루만의 배신이 로한 전쟁의 불씨가 됩니다.'),
  ((SELECT id FROM arda_journey WHERE slug = 'rohan-gondor-war'), (SELECT id FROM arda_event WHERE slug = 'helms-deep-stands'), (SELECT id FROM arda_place WHERE slug = 'helms-deep'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 2, '헬름 협곡', ST_SetSRID(ST_MakePoint(1785.9546, 1690.0562), 4326), '로한이 무너지지 않았다는 사실을 증명한 요새입니다.'),
  ((SELECT id FROM arda_journey WHERE slug = 'rohan-gondor-war'), NULL, (SELECT id FROM arda_place WHERE slug = 'edoras'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 3, '에도라스', ST_SetSRID(ST_MakePoint(1878.2828, 1732.935), 4326), '세오덴의 귀환과 기마대의 결단이 시작되는 왕도입니다.'),
  ((SELECT id FROM arda_journey WHERE slug = 'rohan-gondor-war'), (SELECT id FROM arda_event WHERE slug = 'pelennor-fields'), (SELECT id FROM arda_place WHERE slug = 'minas-tirith'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 4, '미나스 티리스', ST_SetSRID(ST_MakePoint(2450.0072, 1962.575), 4326), '로한의 기마대가 곤도르의 절망을 깨는 장소입니다.'),
  ((SELECT id FROM arda_journey WHERE slug = 'rohan-gondor-war'), (SELECT id FROM arda_event WHERE slug = 'black-gate-last-stand'), (SELECT id FROM arda_place WHERE slug = 'black-gate'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 5, '검은 문', ST_SetSRID(ST_MakePoint(2601.5, 1712.5789), 4326), '서쪽의 병력이 마지막 미끼가 되어 시간을 법니다.'),
  ((SELECT id FROM arda_journey WHERE slug = 'erebor-road'), NULL, (SELECT id FROM arda_place WHERE slug = 'rivendell'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 1, '리븐델', ST_SetSRID(ST_MakePoint(1848.8328, 746.6704), 4326), '뜻밖의 모험이 고대의 지식과 만나는 쉼터입니다.'),
  ((SELECT id FROM arda_journey WHERE slug = 'erebor-road'), NULL, (SELECT id FROM arda_place WHERE slug = 'misty-mountains'), (SELECT id FROM arda_map_profile WHERE map_name = 'Middle Earth'), 2, '안개 산맥', ST_SetSRID(ST_MakePoint(1936.3607, 897.4971), 4326), '골룸과 반지가 이야기의 깊은 축으로 들어오는 산맥입니다.');
