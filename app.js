const sqlite3 = require('sqlite3').verbose();
const salt = 15;
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const helmet = require("helmet"); 
const express = require("express");
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const session = require('express-session');



const fs = require('fs');

const directoryPath = './.db';

// ディレクトリが存在しない場合、作成する
if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
    console.log(`'${directoryPath}'ディレクトリが作成されました。`);
} else {
    console.log(`'${directoryPath}'ディレクトリは既に存在します。`);
}



const SQLiteStore = require('connect-sqlite3')(session);


app.use(session({
  store: new SQLiteStore({
    db: 'sessions.db', // SQLite3データベースのファイル名
    dir: './.db/',         // データベースファイルの保存場所
    table: 'sessions', // データベース内のセッションテーブル名
    concurrentDB: true, // 複数のリクエストで同時にデータベースへのアクセスを許可
  }),
  secret: process.env.SESSION_SECRET, // セッションの秘密鍵
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // セッションの有効期限を設定(例: 7日間)
}));


const db = new sqlite3.Database('./.db/todos.db');

function create_table(query){
  db.serialize(() => {
    db.run(query, (err) => {
      if (err) {
        console.error('テーブルの作成中にエラーが発生しました:', err.message);
      } else {
        console.log('テーブルが正常に作成されました');
      }
    });
  });
}

// CREATE TABLEのSQLクエリ
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS tasks (
    task_name TEXT NOT NULL,
    user_id TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    priority INTEGER DEFAULT 0,
    deadline DATE DEFAULT NULL,
    task_id TEXT NOT NULL PRIMARY KEY
  )
`;

const users_table_query = `
  CREATE TABLE IF NOT EXISTS users (
    user_name TEXT NOT NULL,
    user_password TEXT NOT NULL,
    user_id TEXT NOT NULL
  )
`;
create_table(createTableQuery);
create_table(users_table_query);

const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();


nextApp.prepare().then(() => {
  
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));


  app.get('/get_tasks', (req, res) => {
    try {
      const user_id = req.session.user_id;
      if (!user_id) {
        return res.status(400).json({ error: 'ユーザーIDがありません' });
      }
  
      db.all("SELECT * FROM tasks WHERE user_id = ?", [user_id], (err, rows) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'データベースエラー' });
        }
  
        // user_idを取り除く
        const tasks = rows.map(task => {
          const { user_id, ...taskWithoutUserId } = task;
          return taskWithoutUserId;
        });
  
        res.json({ tasks: tasks });
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'サーバーエラー' });
    }
  });
  
  
  app.get("/Logout", (req, res) => {
    // user_id = req.session.user_id;
    req.session.destroy();
    res.redirect("/");
  });


  app.post("/signup", (req, res) => {
    const saltRounds = 15;
    const user_name = req.body.user_name;
    const user_password = req.body.password;
  
    console.log(user_name, user_password);
  
    // ユーザーが既に存在するか確認
    db.all("SELECT * FROM users WHERE user_name = ?", [user_name], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).send('データベースエラー');
      }
  
      if (row.length > 0) {
        // ユーザーが既に存在する場合
        return res.status(400).send("このユーザーネームは登録済みです");
      }
  
      // ユーザーが存在しない場合、新しいユーザーを挿入
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashed_password = bcrypt.hashSync(user_password, salt);
      const UUID = crypto.randomUUID();
  
      db.run(
        "INSERT INTO users (user_name, user_password, user_id) VALUES (?, ?, ?)",
        [user_name, hashed_password, UUID],
        (err) => {
          if (err) {
            console.error('ユーザー情報の保存中にエラーが発生しました:', err);
            return res.status(500).send('ユーザー情報の保存中にエラーが発生しました');
          }
  
          res.redirect("/Todo");
        }
      );
    });
  });
  //タスクの追加
  app.use('/add', bodyParser.json());
  app.post('/add', (req, res) => {
    const userId = req.session.user_id;
    if(!userId){
      res.status(403).send("Forbidden");
    }
    const task_name = req.body.taskName;

    const priority = req.body.priority;
    const deadline = req.body["deadline"];
    const UUID = crypto.randomUUID();

    db.run(
      "INSERT INTO tasks (task_name, user_id, priority, deadline, task_id) VALUES (?, ?, ?, ?, ?)",
      [task_name, userId, priority, deadline, UUID],
    )
    res.status(200).send();
  });

  // タスク削除処理
  app.delete('/delete/:task_id', (req, res) => {
    const task_id = req.params.task_id;
  
    if (!task_id) {
      return res.status(400).send("エラーが発生したと思います");
    }
  
    if (!req.session.user_id) {
      return res.status(403).send();
    }
  
    db.run('DELETE FROM tasks WHERE task_id = ?', [task_id], (err, results) => {
      if (err) {
        console.error('Error deleting task:', err);
        return res.status(500).send("Internal Server Error");
      }
  
      res.status(200).send();
    });
  });
  

  app.use('/login', bodyParser.json());
  app.post('/login', (req, res) => {
    const user_name = req.body.user_name;
    const password = req.body.password;
    console.log(user_name, password);
    db.get('SELECT user_password, user_id FROM users WHERE user_name = ?', [user_name], (err, row) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        if (row) {
          const storedPassword = row.user_password;

          if (bcrypt.compareSync(password, storedPassword)) {
            // 認証成功
            req.session.user_id = row.user_id; // セッションにユーザーIDを保存
            res.redirect("/Todo");
          } else {
            // 認証失敗
            res.status(401).send('Unauthorized');
          }
        } else {
          // ユーザーが見つからない場合
          const randomTimeout = Math.floor(Math.random() * (3000 - 3500 + 1)) + 4000;
          console.log(randomTimeout);

          setTimeout(() => {
            res.status(404).send('User not found');
          }, randomTimeout);
          

        }
      }
    });
  });


    // Handle Next.js pages
    app.get('*', (req, res) => {
      return handle(req, res);
    });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
  });
});
