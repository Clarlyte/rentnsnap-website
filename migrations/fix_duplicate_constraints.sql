-- Drop both existing constraints
ALTER TABLE rentals
DROP CONSTRAINT IF EXISTS fk_rentals_customer;

ALTER TABLE rentals
DROP CONSTRAINT IF EXISTS rentals_customer_id_fkey;

-- Add back just one constraint with a consistent name
ALTER TABLE rentals
ADD CONSTRAINT rentals_customer_id_fkey
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
ON DELETE RESTRICT; 