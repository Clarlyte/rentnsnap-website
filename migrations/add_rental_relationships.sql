-- Create rental_equipment table
CREATE TABLE IF NOT EXISTS rental_equipment (
    rental_equipment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_id UUID NOT NULL,
    equipment_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Drop existing constraints if they exist
ALTER TABLE rentals
DROP CONSTRAINT IF EXISTS fk_rentals_customer;

ALTER TABLE rental_equipment
DROP CONSTRAINT IF EXISTS fk_rental_equipment_rental;

ALTER TABLE rental_equipment
DROP CONSTRAINT IF EXISTS fk_rental_equipment_equipment;

-- Add foreign key constraints
ALTER TABLE rentals
ADD CONSTRAINT fk_rentals_customer
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
ON DELETE RESTRICT;

ALTER TABLE rental_equipment
ADD CONSTRAINT fk_rental_equipment_rental
FOREIGN KEY (rental_id) REFERENCES rentals(rental_id)
ON DELETE CASCADE;

ALTER TABLE rental_equipment
ADD CONSTRAINT fk_rental_equipment_equipment
FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id)
ON DELETE RESTRICT;

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_rentals_customer;
DROP INDEX IF EXISTS idx_rental_equipment_rental;
DROP INDEX IF EXISTS idx_rental_equipment_equipment;

-- Add indexes for better JOIN performance
CREATE INDEX idx_rentals_customer ON rentals(customer_id);
CREATE INDEX idx_rental_equipment_rental ON rental_equipment(rental_id);
CREATE INDEX idx_rental_equipment_equipment ON rental_equipment(equipment_id); 