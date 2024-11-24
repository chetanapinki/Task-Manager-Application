


import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import mysql from 'mysql';
import path from 'path';
import { index } from './index.js';


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

console.log(__dirname);








const port = process.env.PORT || 3001;



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });


app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
  
  export default app;


const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root',
    database: process.env.DB_NAME || 'task_management_application'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err.message);
    } else {
        console.log('Connected to MySQL database.');
    }
});


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});
app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match!' });
    }
      
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO signup (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`;
        db.query(sql, [firstName, lastName, email, hashedPassword], (err) => {
            if (err) {
                console.error('Error inserting user:', err.message);
                return res.status(500).json({ message: 'Database error.' });
            }
             res.status(201).json({ message: 'User registered successfully!' , redirect: '/login' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing request.'  });
    }
});






app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required!' });
    }

    const sql = `SELECT * FROM signup WHERE email = ?`;
    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ message: 'Database error.' });
        }

        if (result.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err.message);
                return res.status(500).json({ message: 'Error processing request.' });
            }

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password.' });
            }

            res.status(200).json({ message: 'Login successful!', redirect: '/task' });
        });
    });
});


app.get('/task', (req, res) => {
    res.sendFile(path.join(__dirname, 'task.html'));
});
// Add task endpoint
app.post('/addTask', (req, res) => {
    const { taskName, taskDescription } = req.body;

    const sql = `INSERT INTO tasks (task_name, description, created_on) VALUES (?, ?, NOW())`;
    db.query(sql, [taskName, taskDescription], (err) => {
        if (err) {
            console.error('Error adding task:', err.message);
            res.status(500).json({ success: false, message: 'Error adding task.' });
        } else {
            res.status(200).json({ success: true, message: 'Task added successfully!' });
        }
    });
});

// Get tasks endpoint
app.get('/getTasks', (req, res) => {
    const sql = 'SELECT * FROM tasks ORDER BY created_on DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching tasks:', err.message);
            res.status(500).json({ success: false, message: 'Error fetching tasks.' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Search tasks endpoint
app.get('/searchTasks', (req, res) => {
    const searchQuery = req.query.q || '';
    const sql = `
        SELECT * FROM tasks 
        WHERE task_name LIKE ? OR description LIKE ? 
        ORDER BY created_on DESC
    `;
    const likeQuery = `%${searchQuery}%`;
    db.query(sql, [likeQuery, likeQuery], (err, results) => {
        if (err) {
            console.error('Error searching tasks:', err.message);
            res.status(500).json({ success: false, message: 'Error searching tasks.' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Update task endpoint
app.put('/updateTask/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { task_name, description } = req.body;

    const sql = `UPDATE tasks SET task_name = ?, description = ? WHERE task_id = ?`;
    db.query(sql, [task_name, description, taskId], (err, result) => {
        if (err) {
            console.error('Error updating task:', err.message);
            return res.status(500).json({ message: 'Error updating task.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        res.status(200).json({ message: 'Task updated successfully!' });
    });
});

  


  



  // Delete task endpoint
app.delete('/deleteTask/:id', (req, res) => {
    const taskId = parseInt(req.params.id);

    const sql = `DELETE FROM tasks WHERE task_id = ?`;
    db.query(sql, [taskId], (err, result) => {
        if (err) {
            console.error('Error deleting task:', err.message);
            return res.status(500).json({ message: 'Error deleting task.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        res.status(200).json({ message: 'Task deleted successfully!' });
    });
});



app.get(
    "/auth/google/signup",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );
  
  app.get(
    "/auth/google/login",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );
  
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/failure",
    }),
    (req, res) => {
      if (req.query.state === "signup") {
        console.log("Signup successful!");
        res.redirect("/signup-success");
      } else {
        console.log("Login successful!");
        res.redirect("/login-success");
      }
    }
  );
  












// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/signup`);
});

export const server = app;