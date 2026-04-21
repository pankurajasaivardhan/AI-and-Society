-- +goose Up
CREATE TABLE model_metrics (
    id          SERIAL PRIMARY KEY,
    city        VARCHAR(50),
    model_type  VARCHAR(50),
    rmse        FLOAT,
    mae         FLOAT,
    r2_score    FLOAT,
    confidence  FLOAT,
    trained_at  TIMESTAMP DEFAULT NOW()
);

-- +goose Down
DROP TABLE model_metrics;
