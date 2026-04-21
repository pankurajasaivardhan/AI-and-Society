package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/KiranSatyaRaj/pollutrace/internal/database"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type apiConfig struct {
	db *database.Queries
}

func main() {
	godotenv.Load()

	dbURL := os.Getenv("DB_URL")
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		fmt.Println(err)
		return
	}

	dbQueries := database.New(db)
	cfg := apiConfig{db: dbQueries}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/pollution", func(w http.ResponseWriter, r *http.Request) {
		cityParams := r.URL.Query().Get("city")
		city := sql.NullString{String: cityParams}
		city_data, err := cfg.db.GetCityPollutionRecord(r.Context(), city)
		if err != nil {
			fmt.Println(err)
			return
		}
		type pollutionRecord struct {
			City sql.NullString  `json:"city"`
			Date sql.NullTime    `json:"date"`
			Pm25 sql.NullFloat64 `json:"pm25"`
			Pm10 sql.NullFloat64 `json:"pm10"`
			No2  sql.NullFloat64 `json:"no2"`
			Co   sql.NullFloat64 `json:"co"`
		}
		resp := make([]pollutionRecord, len(city_data))
		for i := 0; i < len(city_data); i++ {
			resp[i].City = city_data[i].City
			resp[i].Date = city_data[i].Date
			resp[i].Pm25 = city_data[i].Pm25
			resp[i].Pm10 = city_data[i].Pm10
			resp[i].No2 = city_data[i].No2
			resp[i].Co = city_data[i].Co
		}
		dat, err := json.Marshal(resp)
		if err != nil {
			w.WriteHeader(404)
			w.Write([]byte("Bad Request"))
		}
		w.WriteHeader(201)
		w.Write(dat)
	})

	mux.HandleFunc("GET /api/anomalies", func(w http.ResponseWriter, r *http.Request) {
		cityParams := r.URL.Query().Get("city")
		city := sql.NullString{String: cityParams}
		city_anomaly, err := cfg.db.GetCityAnomaly(r.Context(), city)
		resp := struct {
			City      sql.NullString  `json:"city"`
			Date      sql.NullTime    `json:"date"`
			Pm25      sql.NullFloat64 `json:"pm25"`
			IsAnomaly sql.NullBool    `json:"is_anomaly"`
			Severity  sql.NullString  `json:"severity"`
		}{
			City:      city_anomaly.City,
			Date:      city_anomaly.Date,
			Pm25:      city_anomaly.Pm25,
			IsAnomaly: city_anomaly.IsAnomaly,
			Severity:  city_anomaly.Severity,
		}

		dat, err := json.Marshal(resp)
		if err != nil {
			w.WriteHeader(404)
			w.Write([]byte("Bad Request"))
			return
		}
		w.WriteHeader(201)
		w.Write(dat)
	})

	server := http.Server{Handler: mux}
	server.Addr = ":8080"
	if err := server.ListenAndServe(); err != nil {
		fmt.Println(err)
		return
	}
}
