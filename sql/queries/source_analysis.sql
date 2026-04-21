-- name: GetSourceAnalysis :one
SELECT city, top_source_1, top_source_2, pm10_importance, confidence FROM source_analysis WHERE city=$1;
