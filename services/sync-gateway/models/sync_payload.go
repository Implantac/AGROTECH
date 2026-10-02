package models

import "time"

// SyncPayloadBatch representa o pacote compactado enviado pelo mobile em background
type SyncPayloadBatch struct {
	BatchID                string                   `json:"batch_id"`
	FarmID                 string                   `json:"farm_id"`
	DeviceID               string                   `json:"device_id"`
	OperatorID             string                   `json:"operator_id"`
	SentAt                 time.Time                `json:"sent_at"`
	DeviceSequenceCounter  int64                    `json:"device_sequence_counter"`
	FieldOperations        []FieldOperationRecord   `json:"field_operations"`
	PestMonitoringRecords  []PestMonitoringRecord   `json:"pest_monitoring_records"`
	RefuelingRecords       []RefuelingRecord        `json:"refueling_records"`
	LivestockEvents        []LivestockEventRecord   `json:"livestock_events"`
}

type TankMixItem struct {
	InputID          string  `json:"input_id"`
	LoteID           string  `json:"lote_id,omitempty"`
	TankOrder        int     `json:"tank_order"`
	DosePerHectare   float64 `json:"dose_per_hectare"`
	TotalQuantity    float64 `json:"total_quantity"`
	UnitAppliedPrice float64 `json:"unit_applied_price"`
}

type FieldOperationRecord struct {
	ID                    string        `json:"id"` // UUIDv7 gerado no client
	PlotID                string        `json:"plot_id"`
	MachineID             string        `json:"machine_id,omitempty"`
	OperationType         string        `json:"operation_type"` // 'PLANTIO', 'PULVERIZACAO', 'COLHEITA'
	InitialHourmeter      float64       `json:"initial_hourmeter"`
	FinalHourmeter        float64       `json:"final_hourmeter"`
	HoursWorked           float64       `json:"hours_worked"`
	TemperatureCelsius    float64       `json:"temperature_celsius"`
	RelativeHumidityPct   float64       `json:"relative_humidity_pct"`
	WindSpeedKmh          float64       `json:"wind_speed_kmh"`
	TankMix               []TankMixItem `json:"tank_mix"`
	StartedAt             time.Time     `json:"started_at"`
	FinishedAt            time.Time     `json:"finished_at"`
	DeviceLocalTimestamp  time.Time     `json:"device_local_timestamp"`
}

type PestMonitoringRecord struct {
	ID                   string    `json:"id"` // UUIDv7
	PlotID               string    `json:"plot_id"`
	BiologicalTarget     string    `json:"biological_target"`
	TargetType           string    `json:"target_type"` // 'PRAGA', 'DOENCA', 'DANINHA'
	DamageLevel          string    `json:"damage_level"` // 'BAIXO', 'MEDIO', 'CRITICO'
	SampleCount          float64   `json:"sample_count"`
	Latitude             float64   `json:"latitude"`
	Longitude            float64   `json:"longitude"`
	PhotoURL             string    `json:"photo_url,omitempty"`
	DeviceLocalTimestamp time.Time `json:"device_local_timestamp"`
}

type RefuelingRecord struct {
	ID                   string    `json:"id"`
	MachineID            string    `json:"machine_id"`
	Hourmeter            float64   `json:"hourmeter"`
	LitersFuel           float64   `json:"liters_fuel"`
	TankOriginID         string    `json:"tank_origin_id"`
	DeviceLocalTimestamp time.Time `json:"device_local_timestamp"`
}

type LivestockEventRecord struct {
	ID                   string    `json:"id"`
	AnimalRFID           string    `json:"animal_rfid"`
	EventType            string    `json:"event_type"` // 'PESAGEM', 'VACINACAO', 'TRANSFERENCIA'
	WeightKg             float64   `json:"weight_kg,omitempty"`
	MedicationID         string    `json:"medication_id,omitempty"`
	WithdrawalDays       int       `json:"withdrawal_days,omitempty"`
	DeviceLocalTimestamp time.Time `json:"device_local_timestamp"`
}

type SyncAckResponse struct {
	Status           string    `json:"status"`
	BatchID          string    `json:"batch_id"`
	ReceivedAt       time.Time `json:"received_at"`
	ServerMonotonic  int64     `json:"server_monotonic"`
	AcceptedItems    int       `json:"accepted_items"`
	RequiresConflict bool      `json:"requires_conflict_review"`
}
