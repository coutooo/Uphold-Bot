-- init.sql

CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    currency_pair VARCHAR(255),
    rate_change_percentage DOUBLE PRECISION,
    alert_time TIMESTAMP,
    configuration JSONB
);
