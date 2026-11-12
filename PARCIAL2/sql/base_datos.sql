-- Parcial 2 - Aplicaciones Web 2
-- Base de datos PostgreSQL

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    session_id    VARCHAR(255) UNIQUE,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Usuario: admin | Contraseña: admin123
INSERT INTO usuarios (username, password_hash)
VALUES ('admin', '$2b$10$KCUX3Pbqqh3prlEda.q.X.JfhUyMDdBIOtnisCPE6KFz.4LbTsJXe')
ON CONFLICT (username) DO NOTHING;

-- Productos
CREATE TABLE IF NOT EXISTS productos (
    id        SERIAL PRIMARY KEY,
    nombre    VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    precio    NUMERIC(12, 2) NOT NULL CHECK (precio >= 0),
    stock     INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

INSERT INTO productos (id, nombre, categoria, precio, stock) VALUES
    (1, 'Pan Francés', 'Panadería', 4500.00, 10),
    (2, 'Medialunas de Manteca', 'Facturas', 6000.00, 24),
    (3, 'Criollos de Hojaldre', 'Panadería', 5200.00, 15),
    (4, 'Pastafrola', 'Pastelería', 8500.00, 5),
    (5, 'Cañoncitos de Dulce de Leche', 'Facturas', 6500.00, 18),
    (6, 'Alfajores de Maicena', 'Pastelería', 7200.00, 12),
    (7, 'Chipa de Queso', 'Panadería', 9000.00, 30)
ON CONFLICT (id) DO NOTHING;

-- Reportes generados por el procedimiento
CREATE TABLE IF NOT EXISTS reportes (
    id              SERIAL PRIMARY KEY,
    total_productos INTEGER NOT NULL,
    valor_total     NUMERIC(14, 2) NOT NULL,
    detalle         JSONB NOT NULL,
    ejecutado_en    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
