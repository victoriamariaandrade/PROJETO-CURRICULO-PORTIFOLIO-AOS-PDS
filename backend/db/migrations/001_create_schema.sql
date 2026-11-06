-- Schema do currículo: pessoas e suas entidades (1:N), tecnologias compartilhadas (N:N).

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Pessoa dona do currículo.
CREATE TABLE people (
  id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug        VARCHAR(80)  NOT NULL UNIQUE,
  name        VARCHAR(120) NOT NULL,
  role        VARCHAR(120) NOT NULL,
  headline    VARCHAR(200) NOT NULL,
  summary     TEXT         NOT NULL,
  location    VARCHAR(120),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Links de contato (e-mail, GitHub, LinkedIn, site).
CREATE TABLE contacts (
  id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  person_id      INTEGER      NOT NULL REFERENCES people (id) ON DELETE CASCADE,
  type           VARCHAR(20)  NOT NULL CHECK (type IN ('email', 'github', 'linkedin', 'website')),
  label          VARCHAR(200) NOT NULL,
  url            TEXT         NOT NULL,
  display_order  INTEGER      NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Formação acadêmica.
CREATE TABLE education (
  id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  person_id    INTEGER      NOT NULL REFERENCES people (id) ON DELETE CASCADE,
  degree       VARCHAR(80)  NOT NULL,
  course       VARCHAR(150) NOT NULL,
  institution  VARCHAR(150) NOT NULL,
  start_year   SMALLINT     NOT NULL,
  end_year     SMALLINT,
  status       VARCHAR(20)  NOT NULL CHECK (status IN ('completed', 'in-progress')),
  description  TEXT,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT education_years_check CHECK (end_year IS NULL OR end_year >= start_year),
  CONSTRAINT education_completed_check CHECK (status <> 'completed' OR end_year IS NOT NULL)
);

-- Experiência profissional. end_date NULL = emprego atual.
CREATE TABLE experiences (
  id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  person_id    INTEGER      NOT NULL REFERENCES people (id) ON DELETE CASCADE,
  role         VARCHAR(120) NOT NULL,
  company      VARCHAR(120) NOT NULL,
  start_date   DATE         NOT NULL,
  end_date     DATE,
  description  TEXT         NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT experiences_dates_check CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Projetos do portfólio.
CREATE TABLE projects (
  id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  person_id       INTEGER      NOT NULL REFERENCES people (id) ON DELETE CASCADE,
  name            VARCHAR(120) NOT NULL,
  description     TEXT         NOT NULL,
  category        VARCHAR(80)  NOT NULL,
  icon            VARCHAR(60),
  repository_url  TEXT,
  display_order   INTEGER      NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Catálogo de tecnologias, compartilhado entre pessoas, experiências, projetos e habilidades.
CREATE TABLE technologies (
  id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        VARCHAR(60)  NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX technologies_name_key ON technologies (lower(name));

-- N:N experiência <-> tecnologia (position preserva a ordem de exibição).
CREATE TABLE experience_technologies (
  experience_id  INTEGER  NOT NULL REFERENCES experiences (id) ON DELETE CASCADE,
  technology_id  INTEGER  NOT NULL REFERENCES technologies (id) ON DELETE RESTRICT,
  position       SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY (experience_id, technology_id)
);

-- N:N projeto <-> tecnologia.
CREATE TABLE project_technologies (
  project_id     INTEGER  NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  technology_id  INTEGER  NOT NULL REFERENCES technologies (id) ON DELETE RESTRICT,
  position       SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY (project_id, technology_id)
);

-- Categorias de habilidades (Front-end, Mobile, Back-end...).
CREATE TABLE skill_categories (
  id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  person_id      INTEGER     NOT NULL REFERENCES people (id) ON DELETE CASCADE,
  name           VARCHAR(80) NOT NULL,
  icon           VARCHAR(60),
  display_order  INTEGER     NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT skill_categories_person_name_key UNIQUE (person_id, name)
);

-- Habilidade = tecnologia dentro de uma categoria (N:N categoria <-> tecnologia).
CREATE TABLE skills (
  id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id    INTEGER  NOT NULL REFERENCES skill_categories (id) ON DELETE CASCADE,
  technology_id  INTEGER  NOT NULL REFERENCES technologies (id) ON DELETE RESTRICT,
  position       SMALLINT NOT NULL DEFAULT 0,
  CONSTRAINT skills_category_technology_key UNIQUE (category_id, technology_id)
);

CREATE INDEX contacts_person_id_idx ON contacts (person_id);
CREATE INDEX education_person_id_idx ON education (person_id);
CREATE INDEX experiences_person_id_idx ON experiences (person_id);
CREATE INDEX projects_person_id_idx ON projects (person_id);
CREATE INDEX skill_categories_person_id_idx ON skill_categories (person_id);
CREATE INDEX experience_technologies_technology_id_idx ON experience_technologies (technology_id);
CREATE INDEX project_technologies_technology_id_idx ON project_technologies (technology_id);
CREATE INDEX skills_technology_id_idx ON skills (technology_id);

CREATE TRIGGER people_updated_at BEFORE UPDATE ON people FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER technologies_updated_at BEFORE UPDATE ON technologies FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER skill_categories_updated_at BEFORE UPDATE ON skill_categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();
