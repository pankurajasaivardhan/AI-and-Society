-- +goose Up
CREATE TABLE source_analysis (
    id              SERIAL PRIMARY KEY,
    city            VARCHAR(50),
    top_source_1    VARCHAR(50),
    top_source_2    VARCHAR(50),
    top_source_3    VARCHAR(50),
    pm10_importance FLOAT,
    co_importance   FLOAT,
    nh3_importance  FLOAT,
    confidence      FLOAT,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- +goose Down
DROP TABLE source_analysis;
