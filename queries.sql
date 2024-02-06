CREATE TABLE users (
    id INT PRIMARY KEY,
    fullname VARCHAR,
    email VARCHAR,
    password VARCHAR,
    gender VARCHAR,
    date_of_birth VARCHAR,
    created_at VARCHAR,
    country_code INT
);

CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id  INT NOT NULL,
    status VARCHAR,
    created_at VARCHAR
);

CREATE TABLE merchants (
    id INT PRIMARY KEY,
    admin_id INT,
    merchant_name VARCHAR,
    country_code INT,
    created_at VARCHAR
);

CREATE TABLE countries (
    code INT PRIMARY KEY,
    name VARCHAR,
    continent_name VARCHAR
);

CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT
);

CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR,
    merchants_id INT NOT NULL,
    price INT,
    status VARCHAR,
    created_at VARCHAR,
    category_id INT
);

CREATE TABLE categories (
    id INT PRIMARY KEY,
    cat_name VARCHAR,
    parent_id INT
);