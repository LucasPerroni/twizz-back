<p align="center">
  <h1 align="center">
    Twizz
  </h1>
</p>

## 💻 Technologies and Tools

- REST APIs
- Node.js
- TypeScript
- PostgreSQL

---

## 🏁 Usage

```bash
$ git clone https://github.com/LucasPerroni/twizz-back.git

$ cd twizz-back

$ npm install

$ npm run dev
```

---

## 🚀 API:

```yml
POST /sign-up
    - Route to sign up a new user
    - headers: {}
    - body: {
        "name": "Lorem ipsum",
        "email": "lorem@gmail.com",
        "password": "loremipsum",
        "image": "https://..."
    }
```

```yml
POST /sign-in
    - Route to sign in
    - headers: {}
    - body: {
        "email": "lorem@gmail.com",
        "password": "loremipsum"
    }
```

```yml
POST /deck (authenticated)
    - Route to create a deck
    - headers: { "Authorization": "Bearer $token" }
    - body: {
        "name": "loremipsum",
        "userId": x,
        "questions": [{
          "question": "loremipsum",
          "answer": "loremipsum",
          "image": "https://..." | null
        }]
    }
```
