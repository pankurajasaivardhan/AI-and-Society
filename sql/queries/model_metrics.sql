-- name: GetModelMetrics :many
SELECT city, model_type, rmse, mae, r2_score, confidence FROM model_metrics;
