-- +goose Up
CREATE TABLE anomalies (
    id                   SERIAL PRIMARY KEY,
    city                 VARCHAR(50),
    date                 DATE,
    pm25                 FLOAT,
    reconstruction_error FLOAT,
    threshold            FLOAT,
    is_anomaly           BOOLEAN,
    severity             VARCHAR(20),
    created_at           TIMESTAMP DEFAULT NOW()
);

-- +goose Down
DROP TABLE anomalies;
