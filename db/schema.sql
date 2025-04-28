CREATE TABLE Airports (
  id           INTEGER PRIMARY KEY,
  name         TEXT    NOT NULL,
  iata_code    TEXT    NOT NULL UNIQUE,
  city         TEXT    NOT NULL,
  country      TEXT    NOT NULL,
  description  TEXT
);

CREATE TABLE FacilityTypes (
  id    INTEGER PRIMARY KEY,
  name  TEXT    NOT NULL UNIQUE
);

CREATE TABLE Facilities (
  id               INTEGER PRIMARY KEY,
  airport_id       INTEGER NOT NULL REFERENCES Airports(id),
  facility_type_id INTEGER NOT NULL REFERENCES FacilityTypes(id),
  name             TEXT    NOT NULL,
  location         TEXT,
  description      TEXT,
  operating_hours  TEXT,
  contact_info     TEXT,
  website_url      TEXT,
  amenities        TEXT
);
