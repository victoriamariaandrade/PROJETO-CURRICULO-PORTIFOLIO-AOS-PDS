-- Seed com dois currículos: Victória (dados reais do JSON) e Lucas (fictício). Apaga todos os dados atuais antes de inserir.
-- Os vínculos usam o slug da pessoa e nomes naturais (empresa, projeto, categoria),
-- então nenhum ID fica fixo no script.

BEGIN;

TRUNCATE people, technologies RESTART IDENTITY CASCADE;

-- Pessoas ---------------------------------------------------------------------------
-- Victória: dados do JSON do currículo. Lucas: segunda pessoa, fictícia.
INSERT INTO people (slug, name, role, headline, summary, location) VALUES
  ('victoria-andrade', 'Victória Maria Beltrão de Andrade', 'Estudante de Sistemas para Internet',
   NULL,
   'Estudante de tecnologia com interesse em desenvolvimento de software, inteligência artificial e qualidade de sistemas.',
   NULL),
  ('lucas-ferreira', 'Lucas Henrique Ferreira', 'Desenvolvedor Back-end',
   'APIs, bancos de dados e cloud',
   'Desenvolvedor back-end com 4 anos de experiência construindo APIs REST em Node.js, modelando bancos PostgreSQL e automatizando deploys em nuvem.',
   'João Pessoa, PB');

-- Interesses ------------------------------------------------------------------------
INSERT INTO interests (person_id, name, display_order)
SELECT p.id, interest.name, interest.position
FROM (VALUES
  ('victoria-andrade', ARRAY['Back-end', 'Front-end', 'Inteligência Artificial', 'Testes de Software (QA)']),
  ('lucas-ferreira', ARRAY['APIs', 'Bancos de dados', 'Cloud'])
) AS v (slug, names)
JOIN people p ON p.slug = v.slug
CROSS JOIN LATERAL unnest(v.names) WITH ORDINALITY AS interest (name, position);

-- Contatos --------------------------------------------------------------------------
-- O JSON da Victória não traz contatos; cadastre-os pela API (POST /api/people/victoria-andrade/contacts).
INSERT INTO contacts (person_id, type, label, url, display_order)
SELECT p.id, v.type, v.label, v.url, v.display_order
FROM (VALUES
  ('lucas-ferreira', 'email', 'lucas.ferreira@example.com', 'mailto:lucas.ferreira@example.com', 1),
  ('lucas-ferreira', 'github', 'github.com/lucasferreira-exemplo', 'https://github.com/lucasferreira-exemplo', 2),
  ('lucas-ferreira', 'website', 'lucasferreira.example.com', 'https://lucasferreira.example.com', 3)
) AS v (slug, type, label, url, display_order)
JOIN people p ON p.slug = v.slug;

-- Formação --------------------------------------------------------------------------
INSERT INTO education (person_id, degree, course, institution, start_year, end_year, status, description)
SELECT p.id, v.degree, v.course, v.institution, v.start_year, v.end_year, v.status, v.description
FROM (VALUES
  ('victoria-andrade', 'Graduação', 'Sistemas para Internet', 'Universidade Católica de Pernambuco', NULL::int, NULL::int, 'in-progress',
   NULL),
  ('lucas-ferreira', 'Especialização', 'Arquitetura de Sistemas Distribuídos', 'Instituto Horizonte Digital', 2023, 2024, 'completed',
   'Microsserviços, mensageria, observabilidade e computação em nuvem.'),
  ('lucas-ferreira', 'Tecnólogo', 'Análise e Desenvolvimento de Sistemas', 'Faculdade Nexo de Tecnologia', 2018, 2021, 'completed',
   'Programação, banco de dados, engenharia de requisitos e desenvolvimento web.')
) AS v (slug, degree, course, institution, start_year, end_year, status, description)
JOIN people p ON p.slug = v.slug;

-- Tecnologias (catálogo compartilhado) -----------------------------------------------
INSERT INTO technologies (name) VALUES
  ('Java'), ('JavaScript'), ('Python'), ('TypeScript'), ('React Native'), ('Expo'), ('HTML5'), ('CSS3'),
  ('Node.js'), ('Express'), ('NestJS'), ('Supabase'), ('SQL'), ('PostgreSQL'), ('Redis'), ('Prisma'),
  ('Git'), ('GitHub'), ('VS Code'), ('Postman'), ('Jest'), ('JSON'), ('APIs REST'), ('Front-end'), ('Back-end'),
  ('Docker'), ('AWS'), ('GitHub Actions'), ('Linux');

-- Experiências -----------------------------------------------------------------------
-- O JSON da Victória não traz experiências profissionais.
INSERT INTO experiences (person_id, role, company, start_date, end_date, description)
SELECT p.id, v.role, v.company, v.start_date::date, v.end_date::date, v.description
FROM (VALUES
  ('lucas-ferreira', 'Desenvolvedor Back-end Pleno', 'Marés Pagamentos', '2024-03-01', NULL,
   'Evolução da API de pagamentos, otimização de consultas SQL e criação de pipelines de deploy contínuo.'),
  ('lucas-ferreira', 'Desenvolvedor Back-end Júnior', 'Cobalto Sistemas', '2021-08-02', '2024-02-16',
   'Criação de APIs REST para sistemas de gestão, integração com serviços externos e testes automatizados.')
) AS v (slug, role, company, start_date, end_date, description)
JOIN people p ON p.slug = v.slug;

INSERT INTO experience_technologies (experience_id, technology_id, position)
SELECT e.id, t.id, tech.position
FROM (VALUES
  ('lucas-ferreira', 'Marés Pagamentos', ARRAY['Node.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Redis', 'AWS', 'Docker']),
  ('lucas-ferreira', 'Cobalto Sistemas', ARRAY['Node.js', 'Express', 'JavaScript', 'PostgreSQL', 'Jest'])
) AS v (slug, company, names)
JOIN people p ON p.slug = v.slug
JOIN experiences e ON e.person_id = p.id AND e.company = v.company
CROSS JOIN LATERAL unnest(v.names) WITH ORDINALITY AS tech (name, position)
JOIN technologies t ON t.name = tech.name;

-- Projetos --------------------------------------------------------------------------
-- partner: empresa, instituição ou contexto do projeto. icon: nome de um ícone do Ionicons.
INSERT INTO projects (person_id, name, description, category, partner, icon, repository_url, display_order)
SELECT p.id, v.name, v.description, v.category, v.partner, v.icon, v.repository_url, v.display_order
FROM (VALUES
  ('victoria-andrade', 'Aplicativo de Banco de Sangue',
   'Aplicação voltada à gestão e ao incentivo à doação de sangue, facilitando o acesso a informações e a conexão entre potenciais doadores.',
   NULL, 'Beyond', 'water-outline', NULL, 1),
  ('victoria-andrade', 'MoveTogether',
   'Aplicativo de exercícios físicos que incentiva hábitos saudáveis e a interação entre pessoas por meio de atividades físicas.',
   NULL, 'Porto Digital', 'fitness-outline', NULL, 2),
  ('victoria-andrade', 'Plataforma de Audiodescrição',
   'Solução Front-end para organização e formatação de conteúdos audiovisuais com audiodescrição, promovendo acessibilidade digital.',
   NULL, 'TV Globo', 'accessibility-outline', NULL, 3),
  ('victoria-andrade', 'Mapeamento de Escolas Públicas de Rondônia',
   'Plataforma para armazenamento, organização e visualização de dados cadastrais e geográficos de escolas públicas de Rondônia.',
   NULL, 'Universidade Católica de Pernambuco', 'map-outline', NULL, 4),
  ('victoria-andrade', 'Study Flow',
   'Aplicativo de gerenciamento de estudos, tarefas e atividades acadêmicas, auxiliando na organização e produtividade dos estudantes.',
   NULL, 'Projeto acadêmico', 'checkbox-outline', NULL, 5),
  ('victoria-andrade', 'Biblioteca Virtual',
   'Sistema desenvolvido em Java para gerenciamento de livros e organização de acervo virtual, aplicando conceitos de programação orientada a objetos.',
   NULL, 'Projeto acadêmico', 'library-outline', NULL, 6),
  ('lucas-ferreira', 'PayFlow API', 'API de cobranças recorrentes com webhooks, idempotência e conciliação diária.',
   'API · Back-end', NULL, 'card-outline', 'https://github.com/lucasferreira-exemplo/payflow-api', 1),
  ('lucas-ferreira', 'AgendaFácil', 'Back-end de agendamento de consultas com notificações por e-mail e painel administrativo.',
   'Web · Back-end', NULL, 'calendar-outline', 'https://github.com/lucasferreira-exemplo/agenda-facil', 2),
  ('lucas-ferreira', 'DeployKit', 'Templates de CI/CD para publicar APIs Node.js em contêineres com testes automatizados.',
   'DevOps', NULL, 'rocket-outline', NULL, 3)
) AS v (slug, name, description, category, partner, icon, repository_url, display_order)
JOIN people p ON p.slug = v.slug;

INSERT INTO project_technologies (project_id, technology_id, position)
SELECT pr.id, t.id, tech.position
FROM (VALUES
  ('victoria-andrade', 'Plataforma de Audiodescrição', ARRAY['Front-end']),
  ('victoria-andrade', 'Mapeamento de Escolas Públicas de Rondônia', ARRAY['Supabase', 'Back-end', 'Front-end']),
  ('victoria-andrade', 'Biblioteca Virtual', ARRAY['Java']),
  ('lucas-ferreira', 'PayFlow API', ARRAY['Node.js', 'NestJS', 'PostgreSQL', 'Redis']),
  ('lucas-ferreira', 'AgendaFácil', ARRAY['Node.js', 'Express', 'Prisma', 'PostgreSQL']),
  ('lucas-ferreira', 'DeployKit', ARRAY['Docker', 'GitHub Actions', 'AWS', 'Linux'])
) AS v (slug, project, names)
JOIN people p ON p.slug = v.slug
JOIN projects pr ON pr.person_id = p.id AND pr.name = v.project
CROSS JOIN LATERAL unnest(v.names) WITH ORDINALITY AS tech (name, position)
JOIN technologies t ON t.name = tech.name;

-- Habilidades -----------------------------------------------------------------------
INSERT INTO skill_categories (person_id, name, icon, display_order)
SELECT p.id, v.name, v.icon, v.display_order
FROM (VALUES
  ('victoria-andrade', 'Linguagens', 'code-slash-outline', 1),
  ('victoria-andrade', 'Mobile', 'phone-portrait-outline', 2),
  ('victoria-andrade', 'Front-end', 'desktop-outline', 3),
  ('victoria-andrade', 'Back-end', 'server-outline', 4),
  ('victoria-andrade', 'Banco de dados', 'layers-outline', 5),
  ('victoria-andrade', 'Ferramentas', 'construct-outline', 6),
  ('victoria-andrade', 'Dados e APIs', 'swap-horizontal-outline', 7),
  ('lucas-ferreira', 'Back-end', 'server-outline', 1),
  ('lucas-ferreira', 'Banco de dados', 'layers-outline', 2),
  ('lucas-ferreira', 'Cloud e DevOps', 'cloud-outline', 3),
  ('lucas-ferreira', 'Ferramentas', 'construct-outline', 4)
) AS v (slug, name, icon, display_order)
JOIN people p ON p.slug = v.slug;

INSERT INTO skills (category_id, technology_id, position)
SELECT c.id, t.id, tech.position
FROM (VALUES
  ('victoria-andrade', 'Linguagens', ARRAY['Java', 'JavaScript', 'Python']),
  ('victoria-andrade', 'Mobile', ARRAY['React Native', 'Expo']),
  ('victoria-andrade', 'Front-end', ARRAY['HTML5', 'CSS3']),
  ('victoria-andrade', 'Back-end', ARRAY['Node.js', 'Supabase']),
  ('victoria-andrade', 'Banco de dados', ARRAY['SQL', 'PostgreSQL']),
  ('victoria-andrade', 'Ferramentas', ARRAY['Git', 'GitHub', 'VS Code']),
  ('victoria-andrade', 'Dados e APIs', ARRAY['JSON', 'APIs REST']),
  ('lucas-ferreira', 'Back-end', ARRAY['Node.js', 'Express', 'NestJS', 'TypeScript', 'APIs REST']),
  ('lucas-ferreira', 'Banco de dados', ARRAY['PostgreSQL', 'Redis', 'Prisma']),
  ('lucas-ferreira', 'Cloud e DevOps', ARRAY['AWS', 'Docker', 'GitHub Actions', 'Linux']),
  ('lucas-ferreira', 'Ferramentas', ARRAY['Git', 'Jest', 'Postman', 'VS Code'])
) AS v (slug, category, names)
JOIN people p ON p.slug = v.slug
JOIN skill_categories c ON c.person_id = p.id AND c.name = v.category
CROSS JOIN LATERAL unnest(v.names) WITH ORDINALITY AS tech (name, position)
JOIN technologies t ON t.name = tech.name;

COMMIT;
