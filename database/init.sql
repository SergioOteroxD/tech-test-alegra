DROP TABLE IF EXISTS recipes CASCADE;

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT null,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS ingredients CASCADE;

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
  	created_at TIMESTAMP DEFAULT NOW(),
  	updated_at TIMESTAMP DEFAULT NOW()
);


DROP TABLE IF EXISTS recipe_ingredients CASCADE;

CREATE TABLE recipe_ingredients (
  recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity INT NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (recipe_id, ingredient_id)
);


DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  status VARCHAR(20) CHECK (status IN ('PENDING', 'PREPARING', 'COMPLETED')),
  recipe_id INT REFERENCES recipes(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


DROP TABLE IF EXISTS inventory CASCADE;

CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity INT DEFAULT 5 CHECK (quantity >= 0),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS purchases CASCADE;

CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity INT CHECK (quantity > 0),
  purchased_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_recipes
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_ingredients
BEFORE UPDATE ON ingredients
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_inventory
BEFORE UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_orders
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_purchases
BEFORE UPDATE ON purchases
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_recipe_ingredients
BEFORE UPDATE ON recipe_ingredients
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();


insert
	into
	ingredients (name)
values 
('tomato'),
('lemon'),
('potato'),
('rice'),
('ketchup'),
('lettuce'),
('onion'),
('cheese'),
('meat'),
('chicken');


INSERT INTO recipes (name) VALUES 
('Chicken Salad'),
('Grilled Cheese Sandwich'),
('Rice with Meat'),
('Tomato Soup'),
('Potato Wedges with Ketchup'),
('Lemon Chicken');

-- Chicken Salad
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(1, (SELECT id FROM ingredients WHERE name = 'chicken'), 1),
(1, (SELECT id FROM ingredients WHERE name = 'lettuce'), 1),
(1, (SELECT id FROM ingredients WHERE name = 'lemon'), 1),
(1, (SELECT id FROM ingredients WHERE name = 'onion'), 1);

-- Grilled Cheese Sandwich
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(2, (SELECT id FROM ingredients WHERE name = 'cheese'), 2),
(2, (SELECT id FROM ingredients WHERE name = 'tomato'), 1),
(2, (SELECT id FROM ingredients WHERE name = 'onion'), 1);

-- Rice with Meat
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(3, (SELECT id FROM ingredients WHERE name = 'rice'), 3),
(3, (SELECT id FROM ingredients WHERE name = 'meat'), 2),
(3, (SELECT id FROM ingredients WHERE name = 'onion'), 1),
(3, (SELECT id FROM ingredients WHERE name = 'tomato'), 1);

-- Tomato Soup
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(4, (SELECT id FROM ingredients WHERE name = 'tomato'), 2),
(4, (SELECT id FROM ingredients WHERE name = 'onion'), 1),
(4, (SELECT id FROM ingredients WHERE name = 'cheese'), 2);

-- Potato Wedges with Ketchup
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(5, (SELECT id FROM ingredients WHERE name = 'potato'), 3),
(5, (SELECT id FROM ingredients WHERE name = 'ketchup'), 2),
(5, (SELECT id FROM ingredients WHERE name = 'onion'), 1);

-- Lemon Chicken
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(6, (SELECT id FROM ingredients WHERE name = 'chicken'), 2),
(6, (SELECT id FROM ingredients WHERE name = 'lemon'), 2),
(6, (SELECT id FROM ingredients WHERE name = 'rice'), 1);


insert
	into
	inventory (ingredient_id)
values 
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10);