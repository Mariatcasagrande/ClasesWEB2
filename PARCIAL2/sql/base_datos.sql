-- ===========================================================================
-- Parcial 2 - Aplicaciones Web 2
-- Script de creación de la base de datos PostgreSQL.
--
-- Uso recomendado:
--   1. Crear la base (una sola vez):
--        CREATE DATABASE parcial2_aw2;
--   2. Conectarse a ella:
--        \c parcial2_aw2
--   3. Ejecutar este archivo:
--        psql -U postgres -d parcial2_aw2 -f sql/base_datos.sql
--
-- El script es idempotente: puede ejecutarse más de una vez sin duplicar datos.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Tabla de usuarios (autenticación)
-- ---------------------------------------------------------------------------
-- La estructura sigue el script entregado por la cátedra.
-- Se conserva session_id aunque esta implementación use JWT: la sesión no se
-- guarda en la base, sino en la cookie firmada.
CREATE TABLE IF NOT EXISTS usuarios (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    session_id    VARCHAR(255) UNIQUE,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Credenciales solicitadas por la cátedra: admin / admin123.
-- El valor almacenado es el hash bcrypt provisto en el script (nunca la clave
-- plana). bcrypt.compare verifica "admin123" contra este hash.
INSERT INTO usuarios (username, password_hash)
VALUES (
    'admin',
    '$2b$10$KCUX3Pbqqh3prlEda.q.X.JfhUyMDdBIOtnisCPE6KFz.4LbTsJXe'
)
ON CONFLICT (username) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Tabla de productos (migrada desde datos/productos.json del Parcial 1)
-- ---------------------------------------------------------------------------
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

-- Ajusta la secuencia para que los próximos INSERT generen ids correctos
-- después de haber insertado ids explícitos.
SELECT setval(
    pg_get_serial_sequence('productos', 'id'),
    COALESCE((SELECT MAX(id) FROM productos), 1)
);

-- ---------------------------------------------------------------------------
-- Tabla de reportes: reemplaza el archivo reporte.json del Parcial 1.
-- Cada ejecución del procedimiento deja un registro histórico.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reportes (
    id              SERIAL PRIMARY KEY,
    total_productos INTEGER NOT NULL,
    valor_total     NUMERIC(14, 2) NOT NULL,
    detalle         JSONB NOT NULL,
    ejecutado_en    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- Procedimiento almacenado del endpoint /api/v1/procedimiento/balance.
--
-- Calcula:
--   - cantidad total de productos,
--   - valor total del inventario (SUM(precio * stock)),
--   - detalle por producto con su subtotal.
-- Luego guarda el reporte en la tabla "reportes" y devuelve el JSON.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generar_reporte_balance()
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_productos INTEGER;
    v_valor_total     NUMERIC(14, 2);
    v_detalle         JSONB;
    v_reporte         JSONB;
BEGIN
    -- Totales generales del inventario.
    SELECT COUNT(*), COALESCE(SUM(precio * stock), 0)
      INTO v_total_productos, v_valor_total
      FROM productos;

    -- Detalle por producto, ordenado por id.
    SELECT COALESCE(
               jsonb_agg(
                   jsonb_build_object(
                       'nombre',    nombre,
                       'categoria', categoria,
                       'stock',     stock,
                       'subtotal',  precio * stock
                   )
                   ORDER BY id
               ),
               '[]'::jsonb
           )
      INTO v_detalle
      FROM productos;

    -- Objeto final que se devuelve al cliente.
    v_reporte := jsonb_build_object(
        'proceso',        'Reporte generado por el procedimiento almacenado generar_reporte_balance()',
        'totalProductos', v_total_productos,
        'valorTotal',     v_valor_total,
        'detalle',        v_detalle
    );

    -- Persistencia del reporte (equivalente al reporte.json del Parcial 1).
    INSERT INTO reportes (total_productos, valor_total, detalle)
    VALUES (v_total_productos, v_valor_total, v_detalle);

    RETURN v_reporte;
END;
$$;
