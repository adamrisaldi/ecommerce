import express from "express";
import pg from "pg";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "ecommerce",
    password: "postgres",
    port: 5000,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

//--------------------USER-----------------------//
//register
app.post("/api/register", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
        const check = await db.query("SELECT * FROM users WHERE email VALUES $1,", [email]);
        if (check.rows.length > 0) {
            res.send("Email sudah terdaftar.");
        } else {
            const result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, password]);
            res.send("Berhasil register");
        }
    } catch (err) {
        console.log(err);
    }
});

//login
app.post("/api/login/", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    try{
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedPassword = user.password;
            if (password === storedPassword) {
                res.send("Login berhasil.");
                console.log(storedPassword);
            } else {
            res.send("Password salah");
            }
        } else {
        res.send("User belum terdaftar");
        }
    } catch (err) {
        console.log(err);
    }
});

//edit user
app.patch("/api/user/:userId", async (req, res) => {
    const id = req.params.userId;
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;
    const gender = req.body.gender;
    const dateOfBirth = req.body.dateOfBirth;
    const createdAt = req.body.createdAt;
    const countryCode = req.body.countryCode;
    try{
        await db.query("UPDATE users SET fullname = ($1) WHERE id = $2", [fullname, id]);
        await db.query("UPDATE users SET email = ($1) WHERE id = $2", [email, id]);
        await db.query("UPDATE users SET password = ($1) WHERE id = $2", [password, id]);
        await db.query("UPDATE users SET gender = ($1) WHERE id = $2", [gender, id]);
        await db.query("UPDATE users SET date_of_birth = ($1) WHERE id = $2", [dateOfBirth, id]);
        await db.query("UPDATE users SET created_at = ($1) WHERE id = $2", [createdAt, id]);
        await db.query("UPDATE users SET country_code = ($1) WHERE id = $2", [countryCode, id]);
        res.send("Update berhasil");
    } catch (error) {
        res.status(404).send(error.message);
    };
});

//-------------------MERCHANT---------------//
//tampil semua merchant
app.get("/api/merchant", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM merchants");
        const merchants = result.rows;
        res.send({merchants});
    } catch (error) {
        res.status(404).send(error.message);
    };
});

//tampil detail merchant
app.get("/api/merchant/:merchantId", async (req, res) => {
    const id = req.params.merchantId;
    try{
        const result = await db.query("SELECT * FROM merchants WHERE id = $1", [id]);
        const merchants = result.data;
        res.send({merchants});
    } catch (error) {
        res.status(404).send(error.message);
    }
});

//tambah merchant
app.post("/api/merchant/:merchantId", async (req, res) => {
    const adminId = req.body.adminId;
    const merchantName = req.body.merchantName;
    const countryCode = req.body.countryCode;
    const createdAt = req.body.createdAt;
    try{
        await db.query("INSERT INTO merchants (admin_id, merchant_name, country_code, created_at) VALUES ($1, $2, $3, $4)", [adminId, merchantName, countryCode, createdAt]);
        res.send("Tambah berhasil");
    } catch (err) {
        console.log(err);
    };
});

//edit merchant
app.patch("/api/merchant/:merchantId", async (req, res) => {
    const id = req.params.merchantId;
    const adminId = req.body.adminId;
    const merchantName = req.body.merchantName;
    const countryCode = req.body.countryCode;
    const createdAt = req.body.createdAt;
    try{
        await db.query("UPDATE merchants SET admin_id = ($1) WHERE id = $2", [adminId, id]);
        await db.query("UPDATE merchants SET merchant_name = ($1) WHERE id = $2", [merchantName, id]);
        await db.query("UPDATE merchants SET country_code = ($1) WHERE id = $2", [countryCode, id]);
        await db.query("UPDATE merchants SET created_at = ($1) WHERE id = $2", [createdAt, id]);
        res.send("Update berhasil");
    } catch (error) {
        res.status(404).send(error.message);
    };
});

//hapus merchant
app.delete("/api/merchant/:merchantId", async (req, res) => {
    const id = req.params.merchantId;
    try{
        await db.query("DELETE FROM merchants WHERE id = $1", [id]);
        res.send("Hapus berhasil");
    } catch (error) {
        res.status(404).send(error.message);
    };
});

//----------------------ORDER--------------------//
//tampil internal order
app.get("/api/internal/orders", async (req, res) => {
    try{
        const result = await db.query("SELELCT status,  FROM orders");
        const orders = result.rows;
        res.send({orders});
    } catch (error) {
        res.status(404).send(error.message);
    };
});

//tampil order
app.get("/api/orders", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM orders");
        const orders = result.rows;
        res.send({orders});
    } catch (error) {
        res.status(404).send(error.message);
    };
});

//tambah order
app.post("/api/order/:orderId", async (req, res) => {
    const userId = req.body.userId;
    const createdAt = req.body.createdAt;
    try{
        await db.query("INSERT INTO orders (user_id, created_at) VALUES ($1, $2)", [userId, createdAt]);
        res.send("Tambah berhasil");
    } catch (err) {
        console.log(err);
    };
});

//update status order
app.patch("/api/order/:orderId", async (req, res) => {
    const id = req.params.orderId
    const status = req.body.status;
    try{
        await db.query("UPDATE orders SET status = ($1) WHERE id = $2", [status, id]);
        res.send("Update berhasil");
    } catch (error) {
        res.status(404).send(error.message);
    };
});

//tampil detail order
app.get("/api/order/items/:orderId", async (req, res) => {
    const id = req.params.orderId;
    try{
        const result = await db.query("SELECT * FROM orders WHERE id = $1", [id]);
        const orders = result.data;
        res.send({orders});
    } catch (error) {
        res.status(404).send(error.message);
    };
});

//------------------PRODUCTS-----------------//
//tampil semua product
app.get("/api/products", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM products");
        const products = result.rows;
        res.send({products});
    } catch (error) {
        res.status(404).send(error.message);
    };
});

//tampil detail product
app.get("/api/product/:productId", async (req, res) => {
    const id = req.params.productId;
    try{
        const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);
        const products = result.data;
        res.send({products});
    } catch (error) {
        res.status(404).send(error.message);
    };
});

//tambah product
app.post("/api/products/:productsId", async (req, res) => {
    const name = req.body.productsId;
    const merchantsId = req.body.merchantId;
    const price = req.body.price;
    const status = req.body.status;
    const createdAt = req.body.createdAt;
    const categoryId = req.body.categoryId;
    try{
        await db.query("INSERT INTO orders (name, merchants_id, price, status, created_at, category_id) VALUES ($1, $2, $3, $4, $5, $6)", [name, merchantsId, price, status, createdAt, categoryId]);
        res.send("Tambah berhasil");
    } catch (err) {
        console.log(err);
    };
});

//edit product
app.patch("/api/products/:productId", async (req, res) => {
    const id = req.params.productId;
    const name = req.body.name;
    const merchantsId = req.body.merchantId;
    const price = req.body.price;
    const status = req.body.status;
    const createdAt = req.body.createdAt;
    const categoryId = req.body.categoryId;
    try{
        await db.query("UPDATE products SET name = ($1) WHERE id = $2", [name, id]);
        await db.query("UPDATE products SET merchant_id = ($1) WHERE id = $2", [merchantsId, id]);
        await db.query("UPDATE products SET price = ($1) WHERE id = $2", [price, id]);
        await db.query("UPDATE products SET status = ($1) WHERE id = $2", [status, id]);
        await db.query("UPDATE products SET created_at = ($1) WHERE id = $2", [createdAt, id]);
        await db.query("UPDATE products SET category_id = ($1) WHERE id = $2", [categoryId, id]);
        res.send("Update berhasil");
    } catch (error) {
        res.status(404).send(error.message);
    };
});

//hapus product
app.delete("/api/products/:productsId", async (req, res) => {
    const id = req.params.productsId;
    try{
        await db.query("DELETE FROM products WHERE id = $1", [id]);
        res.send("Hapus berhasil");
    } catch (error) {
        res.status(404).send(error.message);
    };
});

//----------------CATEGORIES-----------------//
//tampil semua category
app.get("/api/categories", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM categories");
        const categories = result.rows;
        res.send({categories});
    } catch (error) {
        res.status(404).send(error.message);
    };
});

//tampil detail category
app.get("/api/categories/:categoriesId", async (req, res) => {
    const id = req.params.categoriesId;
    try{
        const result = await db.query("SELECT * FROM categories WHERE id = $1", [id]);
        const categories = result.data;
        res.send({categories});
    } catch (error) {
        res.status(404).send(error.message);
    };
});

//tambah category
app.post("/api/categories/:categoryId", async (req, res) => {
    const catName = req.body.catName;
    const parentId = req.body.parentId;
    try{
        await db.query("INSERT INTO categories (cat_name, parent_id) VALUES ($1, $2)", [catNamename, parentId]);
        res.send("Tambah berhasil");
    } catch (err) {
        console.log(err);
    };
});

//edit category
app.patch("/api/categories/:categoryId", async (req, res) => {
    const id = req.params.categoryId;
    const catName = req.body.catName;
    const parentId = req.body.parentId;
    try{
        await db.query("UPDATE categories SET cat_name = ($1) WHERE id = $2", [catName, id]);
        await db.query("UPDATE categories SET parent_id = ($1) WHERE id = $2", [parentId, id]);
        res.send("Update berhasil");
    } catch (error) {
        res.status(404).send(error.message);
    };
});

//-----------------COUNTRIES---------------//
//tampil countries
app.get("/api/countries", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM countries");
        const countries = result.rows;
        res.send({countries});
    } catch (error) {
        res.status(404).send(error.message);
    };
});

app.listen(port, () => {
    console.log('Server is running on port 3000');
});