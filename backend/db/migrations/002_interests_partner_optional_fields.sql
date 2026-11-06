-- Ajustes para o currículo real: interesses da pessoa, parceiro dos projetos
-- e campos que nem todo currículo tem passam a ser opcionais.

ALTER TABLE people ALTER COLUMN headline DROP NOT NULL;
ALTER TABLE education ALTER COLUMN start_year DROP NOT NULL;
ALTER TABLE projects ALTER COLUMN category DROP NOT NULL;

-- Empresa, instituição ou contexto em que o projeto foi feito (ex.: "Porto Digital").
ALTER TABLE projects ADD COLUMN partner VARCHAR(120);

-- Áreas de interesse da pessoa (Back-end, Inteligência Artificial...).
CREATE TABLE interests (
  id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  person_id      INTEGER     NOT NULL REFERENCES people (id) ON DELETE CASCADE,
  name           VARCHAR(80) NOT NULL,
  display_order  INTEGER     NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT interests_person_name_key UNIQUE (person_id, name)
);
CREATE INDEX interests_person_id_idx ON interests (person_id);
