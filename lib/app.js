"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const fs_1 = __importDefault(require("fs"));
const promises_1 = require("fs/promises");
const bcrypt_1 = __importDefault(require("bcrypt"));
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// path.join()
// view engine setup m
// app.set('view engine', 'ejs');
app.use(express_1.default.json());
app.use(express_1.default.static("views"));
app.use("/views", express_1.default.static(path_1.default.join(__dirname + "/views")));
app.use("/image", express_1.default.static(path_1.default.join(__dirname + "/views/image")));
//app.use("/s", express.static(path.join(__dirname + "views/image")));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.sendFile("/Users/decagon/Downloads/week-6-node-practice-2/views/HomePage.html");
    }
    catch (error) {
        res.status(400),
            () => {
                res.send(error);
            };
    }
}));
app.get("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.sendFile("/Users/decagon/Downloads/week-6-node-practice-2/views/login.html");
    }
    catch (error) {
        res.status(400),
            () => {
                res.send(error);
            };
    }
}));
app.get("/dashboard/:mail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Email = req.params.mail;
        const authorArr = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "/database.json"), "utf-8"));
        const user = authorArr.find((user) => user.email === Email);
        var details = user.books;
        res.sendFile("/Users/decagon/Downloads/week-6-node-practice-2/views/dashboard.html");
    }
    catch (error) {
        res.status(404).send("error");
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("login");
        const passW = req.body.password;
        const mail = req.body.email;
        console.log(req.body.email);
        let authorArr = [];
        authorArr = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "/database.json"), "utf-8"));
        const auth = authorArr.find((user) => user.email === mail);
        console.log(auth);
        const match = yield bcrypt_1.default.compare(passW, auth.password);
        console.log(auth.password);
        if (match) {
            res.redirect(`/dashboard/${mail}`);
        }
        else {
            res.send("Incorrect Password");
            return;
            // return;
        }
    }
    catch (error) {
        res.send(error);
    }
}));
app.post("/dashboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let book = "";
        // if (!fs.existsSync(path.join(__dirname, ".bookDb.json")))
    }
    catch (error) { }
}));
app.post("/newBookForm", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Email = req.params.mail;
        const { name, isPublished, datePublished, serialNumber } = req.body;
        const authorArr = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "/database.json"), "utf-8"));
        const currentAuthor = authorArr.find((author) => author.email === Email);
        const otherAuthors = authorArr.filter((author) => author.email !== Email);
        const newBook = {
            id: authorArr.length + 1,
            name,
            isPublished,
            datePublished,
            serialNumber,
        };
        currentAuthor.books.push(newBook);
        otherAuthors.push(currentAuthor);
        fs_1.default.writeFile(path_1.default.join(__dirname, "/database.json"), JSON.stringify(otherAuthors, null, 3), "utf8", (err) => {
            if (err) {
                res.send({ message: "error" });
            }
            else {
                res.redirect("/dashboard");
            }
        });
        res.status(200).json({
            newBook,
        });
    }
    catch (error) {
        console.log(error);
    }
}));
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashed = yield bcrypt_1.default.hash(req.body.password, 10);
        const author = {
            id: 1,
            author: req.body.name,
            dateRegistered: new Date(),
            age: req.body.age,
            email: req.body.email,
            password: hashed,
            address: req.body.address,
            books: [
                {
                    id: 1,
                    name: "",
                    isPublished: false,
                    datePublished: new Date(),
                    serialNumber: 0,
                },
            ],
        };
        let authorArr = [];
        authorArr = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "/database.json"), "utf-8"));
        // authorArr = JSON.parse(data)
        authorArr.push(author);
        fs_1.default.writeFile(path_1.default.join(__dirname, "/database.json"), JSON.stringify(authorArr, null, 3), "utf8", (err) => {
            if (err) {
                res.send({ message: "error" });
            }
            else {
                res.redirect("/login");
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}));
// app.post('/api/books', async(req:Request, res:Response, next:NextFunction) => {
//     try {
//         let book : string= req.body
//         if(!fs.existsSync(path.join(__dirname,"/database.json"))){
//             let books = []
//             books.push(book);
//             const { author, dateRegistered, age, email, password, address} = req.body;
//         const id = books.length +1
//             await writeFile(`${__dirname}/database.json`,JSON.stringify(books))}
//             else{
//                     const booksStrings =  await readFile(path.join(__dirname,"/database.json"),'utf8')
//                     const booksArray = JSON.parse(booksStrings)
//                     booksArray.push(book)
//                     await writeFile(`${__dirname}/database.json`,JSON.stringify(booksArray))
//                 }
//                 res.status(200).send({message:"book created successfully"})
//     } catch (error) {
//         res.status(403).send({message:"could add book to the database"})
//     }
// })
// app.get('/api/books/:id', async (req:Request, res:Response) =>{
//     try {
//      const booksStrings =  await readFile(path.join(__dirname,"/database.json"),'utf8')
//     const booksArray = JSON.parse(booksStrings)
//     let books = booksArray.find((book : any) => book.id === parseInt(req.params.id));
//     if(!books) res.status(404).send('book id not found');
//     res.send(books);
//     } catch (error) {
//         res.status(404).send("book not found")
//     }
// });
// app.get('/',()=>{
//     console.log('tester')
// })
app.put("/api/books/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userData = req.body;
        const booksStrings = yield (0, promises_1.readFile)(path_1.default.join(__dirname, "/database.json"), "utf8");
        const booksArray = JSON.parse(booksStrings);
        let books = booksArray.find((book) => book.id === req.params.id);
        let index = booksArray.findIndex((book) => book.id === req.params.id);
        // if(!books) res.status(404).send(`${books} not found`)
        if (books) {
            booksArray[index] = Object.assign(Object.assign({}, books), userData);
            console.log(booksArray);
            fs_1.default.writeFile(path_1.default.join(__dirname, "/database.json"), JSON.stringify(booksArray, null, 2), "utf8", (err) => {
                if (err)
                    console.error(err);
                res.status(202).send(`${JSON.stringify(books)} updated successfully`);
            });
        }
    }
    catch (error) {
        console.log("Enter an existing book id");
    }
}));
// // app.delete('/api/books/:id', async (req:Request, res:Response)=> {
//     const booksStrings =  await readFile(path.join(__dirname,"/database.json"),'utf8')
//     const booksArray = JSON.parse(booksStrings);
//     let books = booksArray.find((book : any) => book.id === req.params.id);
//     if (books) {
//         booksArray.splice(booksArray.indexOf(books), 1);
//         fs.writeFile(path.join(__dirname,"/database.json"), JSON.stringify(booksArray, null, 2), 'utf8',(err) =>{
//            if (err) {
//             return res.status(500).send('an error occured')
//            } res.send(booksArray)
//         })
//  }else{
//     if (!books) res.status(404).send('book not found')
//  }
// // });
const port = process.env.port || 3005;
app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});
module.exports = app;
