-- +goose Up
CREATE TABLE lstm_predictions (
    id              SERIAL PRIMARY KEY,
    city            VARCHAR(50),
    date            DATE,
    predicted_pm25  FLOAT,
    actual_pm25     FLOAT,
    rmse            FLOAT,
    mae             FLOAT,
    r2_score        FLOAT,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- +goose Down
DROP TABLE lstm_predictions;
