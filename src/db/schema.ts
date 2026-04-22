export const USER_VERSION = 2

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS pets (
  id                INTEGER PRIMARY KEY,
  name              TEXT    NOT NULL,
  hunger            INTEGER NOT NULL,
  hunger_max        INTEGER NOT NULL DEFAULT 100,
  hunger_special    INTEGER NOT NULL DEFAULT 0,
  happiness         INTEGER NOT NULL,
  happiness_max     INTEGER NOT NULL DEFAULT 100,
  happiness_special INTEGER NOT NULL DEFAULT 0,
  energy            INTEGER NOT NULL,
  energy_max        INTEGER NOT NULL DEFAULT 100,
  energy_special    INTEGER NOT NULL DEFAULT 0,
  state             TEXT    NOT NULL DEFAULT 'normal'
);
`
