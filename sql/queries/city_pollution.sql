-- name: GetCityPollutionRecord :many
SELECT city, date, pm25, pm10, no2, co FROM city_pollution WHERE city=$1;
