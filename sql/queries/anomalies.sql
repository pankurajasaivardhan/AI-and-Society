-- name: GetCityAnomaly :one
SELECT city, date, pm25, is_anomaly, severity FROM anomalies WHERE city=$1;
