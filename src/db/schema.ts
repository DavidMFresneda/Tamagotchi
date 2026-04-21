export const USER_VERSION = 1

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS pets (
  id          INTEGER PRIMARY KEY,
  name        TEXT    NOT NULL,
  hunger      INTEGER NOT NULL,
  happiness   INTEGER NOT NULL,
  energy      INTEGER NOT NULL,
  state       TEXT    NOT NULL DEFAULT 'normal'
);
`
