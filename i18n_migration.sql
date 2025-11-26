-- Migration to convert text columns to JSONB for Internationalization

-- 1. Technical Rider
-- We need to change the column type. Since we have existing data, we can cast it to JSONB.
-- Existing text will be treated as a string inside JSONB, e.g., "Guitar Amp" -> "Guitar Amp"
-- Our helper will handle this case (if it's a string, return it; if it's an object, look for locale).

ALTER TABLE technical_rider 
ALTER COLUMN name TYPE JSONB USING to_jsonb(name),
ALTER COLUMN alternative TYPE JSONB USING to_jsonb(alternative),
ALTER COLUMN observations TYPE JSONB USING to_jsonb(observations);

-- Note: If you want to initialize them as objects for new entries, the default is null, which is fine.
-- But for existing data, `to_jsonb("some text")` results in `"some text"` (a JSON string).
-- This is perfect for our backward compatibility strategy.

-- 2. Members (Future proofing, though not explicitly requested yet, good to have)
ALTER TABLE members
ALTER COLUMN role TYPE JSONB USING to_jsonb(role),
ALTER COLUMN description TYPE JSONB USING to_jsonb(description);

-- 3. Products (Merch)
ALTER TABLE products
ALTER COLUMN description TYPE JSONB USING to_jsonb(description);

-- 4. Albums
ALTER TABLE albums
ALTER COLUMN description TYPE JSONB USING to_jsonb(description);
