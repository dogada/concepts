-- migrate:up

create table users (
  id varchar(100) PRIMARY KEY,
  name varchar(100) not null,
  nickname varchar(30),
  active boolean,
  created TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  roles jsonb not null default '[]'::jsonb,
  data jsonb not null default '{}'::jsonb
);

create table uaccounts (
  id varchar(1000) PRIMARY KEY,
  "userId" varchar(100) NOT NULL REFERENCES users,
  provider varchar(100) not null,
  "providerId" varchar(500) not null,
  name varchar(100),
  data jsonb not null default '{}'::jsonb,
  created TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated TIMESTAMPTZ NOT NULL DEFAULT now()
);

create table things (
  id varchar(100) PRIMARY KEY,
  type varchar(100) not null, -- entity, memo, comment, field, prop
  slug varchar(126) not null,
  content text not null,
  "creatorId" varchar(100) REFERENCES users,
  created TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  "parentId" varchar(100) REFERENCES things,
  "isPublic" boolean, -- true, false or null for hidden by admins
  data jsonb
);


--- create initial admin account
--- TODO: move to seed-file
insert into users ("id", "name", "active", "roles") values 
('3U07GfJJat901', 'Admin', true, '["admin", "editor", "contributor"]');

insert into uaccounts(id, "userId", provider, name, "providerId") 
values ('12345@google', '3U07GfJJat901', 'google', 'You', 12345);

-- migrate:down
drop table if exists things;
drop table if exists uaccounts;
drop table if exists users;
