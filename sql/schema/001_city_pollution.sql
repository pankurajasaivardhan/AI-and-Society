-- +goose Up
CREATE TABLE city_pollution (
    id          SERIAL PRIMARY KEY,
    city        VARCHAR(50),
    date        DATE,
    pm25        FLOAT,
    pm10        FLOAT,
    no          FLOAT,
    no2         FLOAT,
    nox         FLOAT,
    nh3         FLOAT,
    so2         FLOAT,
    co          FLOAT,
    ozone       FLOAT,
    benzene     FLOAT,
    month       INT,
    season      VARCHAR(20),
    day_of_week INT,
    year        INT
);

-- +goose Down
DROP TABLE IF EXISTS city_pollution;
