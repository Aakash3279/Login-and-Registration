import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import pg from "pg";


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;


app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, 
  })
);


app.use(passport.initialize());
app.use(passport.session());


const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect().catch((err) => console.error("Error connecting to database:", err));


passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid credentials" });
        }
      } else {
        return done(null, false, { message: "User not found" });
      }
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});


app.post("/api/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ user: { id: user.id, email: user.email } });
    });
  })(req, res, next);
});

app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).send({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );

    const user = result.rows[0];
    req.login(user, (err) => {
      if (err) return res.status(500).send({ message: "Error logging in after registration" });
      res.redirect("/index");
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error signing up" });
  }
});



app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets", {
      title: "Secrets Page", 
      description: "I Love To Travel", 
      services: ["Packing", "Planning", "Transporting", "Exploring"], 
      
      
      sections: [ 
        {
          title: "Support",
          links: ["FAQs", "Contact Us", "Track Your Journey"]
        },
        {
          title: "Services",
          links: ["Budget Planning", "Office Relocation", "Packing Services"]
        }
      ]
    });
  } else {
    res.redirect("/login"); 
  }
});


app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.redirect("http://localhost:5173/login"); 
  });
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
