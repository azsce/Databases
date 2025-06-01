---
title: "99. Introduction to NoSQL Databases"
---

import IdealImage from '@theme/IdealImage';

#

## 1. Introduction to NoSQL

### 1.1 What is NoSQL?
*   NoSQL stands for "**Not Only SQL**"
*   It refers to a broad class of database management systems that differ from traditional relational databases (RDBMS).
*   Designed for **scalability, flexibility, and high performance** with unstructured or semi-structured data.

### 1.2 Why NoSQL?
*   **Big Data & Real-Time Web Apps**: Handles large volumes of data efficiently.
*   **Flexible Schema**: Unlike SQL, NoSQL does not require a fixed schema.
*   **Horizontal Scaling**: Easily distributes data across multiple servers (sharding).
*   **High Availability & Fault Tolerance**: Many NoSQL databases support replication.

### 1.3 SQL vs. NoSQL Comparison

| Feature         | SQL (Relational)                | NoSQL                                   |
|-----------------|---------------------------------|-----------------------------------------|
| **Data Model**    | Tables with fixed schema        | Flexible (Key-Value, Document, etc.)    |
| **Query Language**| SQL (Structured Query Lang.)    | Varies                                  |
| **Scalability**   | Vertical (hardware upgrade)     | Horizontal (distributed)                |
| **Use Cases**     | Complex queries, transactions   | Big Data, real-time apps, IoT           |

---
<div class="page-break"></div>

## 2. Types of NoSQL Databases

### 2.1 Key-Value Stores

**Structure:**
Key-value stores are the simplest form of NoSQL databases, where each item is stored as a `key-value pair`, similar to a dictionary or hash table. The `key` is a unique identifier, and the `value` can be any type of data (e.g., strings, numbers, JSON, or binary objects).

**DB Examples:**
*   **Redis** – An in-memory key-value store known for its speed, often used for caching.
*   **DynamoDB** – A fully managed AWS database that supports high scalability and low-latency access.
*   **Riak** – A distributed key-value store designed for fault tolerance.

**Use Cases:**
*   **Caching** – Storing frequently accessed data to reduce database load (e.g., Redis).
*   **Session Management** – Keeping user session data (e.g., shopping cart info).
*   **Real-time Applications** – Such as leaderboards or configuration settings.

---

### 2.2 Document Stores

**Structure:**
Document databases store data in `semi-structured formats` like JSON, BSON. Unlike key-value stores, document databases allow nested structures and support querying within documents. Each document can have a different schema, providing flexibility.

**DB Examples:**
*   **MongoDB** – A widely used document database with powerful querying and indexing.
*   **CouchDB** – Focuses on ease of use and offline synchronization.
*   **Firebase Firestore** – A cloud-based document store with real-time updates.

**Use Cases:**
*   **Content Management Systems (CMS)** – Storing articles, product catalogs, or blog posts.
*   **User Profiles** – Managing user data with varying attributes.
*   **E-commerce Applications** – Handling product details, reviews, and orders.

---

### 2.3 Column-Family Stores (Wide-Column Databases)

**Structure:**
Instead of storing data in rows (like relational databases), column-family databases organize data in `columns grouped into families`. This structure is optimized for reading large datasets efficiently, especially for analytical queries.

**DB Examples:**
*   **Apache Cassandra** – A highly scalable database designed for distributed environments.
*   **HBase** – Built on Hadoop, suitable for big data applications.

**Use Cases:**
*   **Time-Series Data** – Storing logs, sensor data, or financial records.
*   **Analytics & Big Data** – Handling large-scale data processing (e.g., recommendation engines).

---
<div class="page-break"></div>

### 2.4 Graph Databases

**Structure:**
Graph databases represent data as `nodes (entities)`, `edges (relationships)`, and `properties`. This model is ideal for highly interconnected data, allowing efficient traversal of relationships.

**DB Examples:**
*   **Neo4j** – The most popular graph database with a powerful query language (Cypher).
*   **ArangoDB** – A multi-model database supporting graphs, documents, and key-value storage.

**Use Cases:**
*   **Social Networks** – Mapping friendships, followers, and interactions.
*   **Fraud Detection** – Identifying suspicious patterns in financial transactions.
*   **Recommendation Engines** – Suggesting products or content based on relationships.

---
<div class="page-break"></div>

## 3. Advantages & Limitations of NoSQL

### 3.1 Advantages
✓ **Scalability**: Handles large-scale data efficiently.
✓ **Flexibility**: No rigid schema, easy to modify.
✓ **Performance**: Optimized for read/write-heavy workloads.
✓ **High Availability**: Built-in replication and fault tolerance.

### 3.2 Limitations
*   **No Standard Query Language**: Each NoSQL DB has its own query method.
*   **Less Mature**: Fewer tools and community support compared to SQL.
*   **Eventual Consistency**: Some NoSQL DBs sacrifice consistency for speed.

---
<div class="page-break"></div>

## Using PostgreSQL as a NoSQL Database

Although PostgreSQL is a `relational database (RDBMS)`, it has powerful features that allow it to function like a `NoSQL database` by storing and querying unstructured or semi-structured data. Below are the key methods to use PostgreSQL in a NoSQL-like way.

### 1. Using JSON/JSONB Data Types for Document Store
PostgreSQL supports `JSON (text-based)` and `JSONB (binary, more efficient)` for storing schema-less data.

#### 1.1 Creating a Table with JSON/JSONB
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    attributes JSONB -- or JSON
);
```

#### 1.2 Inserting JSON Data
```sql
INSERT INTO products (name, attributes)
VALUES (
    'Smartphone',
    '{"brand": "Samsung", "color": "black", "specs": {"RAM": "8GB", "storage": "128GB"}}'
);

INSERT INTO products (name, attributes) VALUES
('Smartphone', '{"brand": "Samsung", "color": "black", "specs": {"RAM": "8GB", "storage": "128GB"}}'),
('Laptop', '{"brand": "Dell", "color": "silver", "specs": {"RAM": "16GB", "storage": "512GB", "GPU": "NVIDIA RTX 3050"}}'),
('Tablet', '{"brand": "Apple", "color": "space gray", "specs": {"RAM": "4GB", "storage": "64GB"}}'),
('Smartwatch', '{"brand": "Garmin", "color": "black", "specs": {"battery": "7 days", "waterproof": "50m"}}'),
('Headphones', '{"brand": "Sony", "color": "blue", "specs": {"type": "wireless", "battery": "30 hours"}}');

-- TVs with different panel technologies
INSERT INTO products (name, attributes) VALUES
('OLED C3', '{"brand": "LG", "color": "black", "dimensions": {"withStand": "83.4 x 145.1 x 31.7 cm"}, "specs": {"size": "65-inch", "type": "OLED", "refreshRate": "120Hz", "smartTV": true}}'),
('QN90C', '{"brand": "Samsung", "color": "titan gray", "dimensions": {"withStand": "88.1 x 145.7 x 27.9 cm"}, "specs": {"size": "75-inch", "type": "QLED", "refreshRate": "144Hz", "smartTV": true, "gamingFeatures": ["FreeSync", "Game Bar"]}}');

-- Laptops with different configurations
INSERT INTO products (name, attributes) VALUES
('MacBook Air M2', '{"brand": "Apple", "color": "space gray", "specs": {"chip": "M2", "RAM": "8GB", "storage": "256GB", "display": "13.6-inch"}}'),
('MacBook Pro 14"', '{"brand": "Apple", "color": "silver", "specs": {"chip": "M3 Pro", "RAM": "18GB", "storage": "512GB", "display": "14.2-inch", "ports": ["HDMI", "SDXC"]}}');
```

#### 1.3 Querying JSON Data

**Extracting Fields**
```sql
-- Get the brand of all products
SELECT name, attributes->>'brand' AS brand FROM products;
```

**Filtering with JSON Path**
```sql
-- Find all black-colored smartphones
SELECT name FROM products WHERE attributes->>'color' = 'black';
```
**Querying Nested JSON**
```sql
-- Find products with 8GB RAM
SELECT name FROM products WHERE attributes->'specs'->>'RAM' = '8GB';
```

**JSONB-Specific Operators**
```sql
-- Check if a key exists
SELECT name FROM products WHERE attributes ? 'brand';
```

---
<div class="page-break"></div>

### 2. Using Arrays & HStore (Key-Value Store)

#### 2.1 Arrays in PostgreSQL
PostgreSQL supports `arrays` for storing lists.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    tags TEXT[]
);

INSERT INTO users (name, tags)
VALUES ('Alice', ARRAY['admin', 'premium']);

INSERT INTO users (name, tags) VALUES
('Bob', ARRAY['verified']),
('Charlie', ARRAY[]),
('Dana', ARRAY['moderator', 'contributor']),
('Eve', NULL);

-- Find users with 'admin' tag
SELECT name FROM users WHERE 'admin' = ANY(tags);

-- Find all users with 'admin' or 'superuser' tags
SELECT name FROM users WHERE tags && ARRAY['admin', 'contributor'];

-- Count users by tag (using unnest)
SELECT tag, COUNT(*) as user_count
FROM users, unnest(tags) as tag
GROUP BY tag
ORDER BY user_count DESC;
```

**Note**: The `UNNEST` function in PostgreSQL is used to `expand an array into a set of rows`, effectively "flattening" the array so you can work with each element individually.

```sql
-- Find users with exactly 2 tags
SELECT name FROM users WHERE array_length(tags, 1) = 2;

-- Update: Add a tag to specific users
UPDATE users
SET tags = array_append(tags, 'verified')
WHERE name IN ('Alice', 'Charlie');
```

#### 2.2 HStore Extension (Key-Value Store)
Enable the `hstore` extension for a NoSQL-like key-value store:

```sql
CREATE EXTENSION IF NOT EXISTS hstore;

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INT,
    data HSTORE
);

INSERT INTO profiles (user_id, data)
VALUES (1, 'email=>alice@example.com, age=>25, premium=>true');

INSERT INTO profiles (user_id, data) VALUES
(1, '"email"=>"alice@example.com", "age"=>"28", "premium"=>"true"'),
(2, '"email"=>"bob@example.com", "age"=>"32", "newsletter"=>"true"'),
(3, '"email"=>"charlie@example.com", "age"=>"25", "premium"=>"false"'),
(4, '"email"=>"dana@example.com", "age"=>"41", "admin"=>"true"'),
(5, '"email"=>"eve@example.com", "age"=>"19"'); -- Minimal data

-- Query by key
SELECT user_id FROM profiles WHERE data->'premium' = 'true';
```

---
<div class="page-break"></div>

## 3. Comparison: PostgreSQL vs. NoSQL Databases

| Feature         | PostgreSQL (NoSQL Mode) | MongoDB (Document Store) | Redis (Key-Value) |
|-----------------|---------------------------|--------------------------|-------------------|
| **Data Model**    | JSON/JSONB, HStore      | BSON (Binary JSON)       | Key-Value Pairs   |
| **Query Language**| SQL + JSON operators    | MongoDB Query Language   | Simple commands   |
| **Scalability**   | Vertical + Read Replicas| Horizontal Sharding      | In-Memory Cluster |
| **Best For**      | Hybrid SQL/NoSQL needs  | Pure document storage    | Caching, Queues   |