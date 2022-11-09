import express, { Express, Request, Response, NextFunction } from "express";
const app = express();
import path from "path";
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
import fs from "fs";
import { writeFile, readFile } from "fs/promises";
import bcrypt from "bcrypt";

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// const data = require("/Users/apple/Downloads/week-6-node- practice/lib/database.json");

interface Ibook {
  id: Number;
  author: string;
  dateRegistered: Date;
  age: Number;
  email: string;
  password: string;
  address: string;
  books: [
    {
      name: string;
      isPublished: boolean;
      datePublished: Date;
      serialNumber: Number;
    }
  ];
}

// path.join()

// view engine setup m
// app.set('view engine', 'ejs');

app.use(express.json());

app.use(express.static("views"));

app.use("/views", express.static(path.join(__dirname + "/views")));
app.use("/image", express.static(path.join(__dirname + "/views/image")));
//app.use("/s", express.static(path.join(__dirname + "views/image")));
// app.use(express.static(path.join(__dirname,"public")))

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get("/", async (req: Request, res: Response) => {
  try {
    res.sendFile(
      "/views/HomePage.html"
    );
  } catch (error) {
    res.status(400),
      () => {
        res.send(error);
      };
  }
});
app.get("/login", async (req: Request, res: Response) => {
  try {
    res.sendFile(
"/views/login.html"
    );
  } catch (error) {
    res.status(400),
      () => {
        res.send(error);
      };
  }
});

app.get("/dashboard/:mail", async (req: Request, res: Response) => {
  try {
    let Email = req.params.mail;
    const authorArr: Ibook[] = JSON.parse(
      fs.readFileSync(path.join(__dirname, "/database.json"), "utf-8")
    );
    const user = authorArr.find((user) => user.email === Email)!;
    var details = user.books;
    res.sendFile(
      "/views/dashboard.html"
    );
  } catch (error) {
    res.status(404).send("error");
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    // console.log("login");
    const passW = req.body.password;
    const mail = req.body.email;
    console.log(req.body.email);
    let authorArr: Ibook[] = [];
    authorArr = JSON.parse(
      fs.readFileSync(path.join(__dirname, "/database.json"), "utf-8")
    );

    const auth = authorArr.find((user) => user.email === mail)!;
    console.log(auth);

    const match = await bcrypt.compare(passW, auth.password);
    console.log(auth.password);

    if (match) {
      res.redirect(`/dashboard/${mail}`);
    } else {
      res.send("Incorrect Password");
      return;

      // return;
    }
  } catch (error) {
    res.send(error);
  }
});

app.get("/newBookForm", async(req,res)=>{
  try{
    res.sendFile("/views/newBookForm.html")
  }catch(error){
    res.send(error)
  }
})

// app.post("/dashboard", async (req: Request, res: Response) => {
//   try {
//     let book: string = "";
//     // if (!fs.existsSync(path.join(__dirname, ".bookDb.json")))
//   } catch (error) {}
// });

// app.post("/newBookForm", async (req: Request, res: Response) => {
//   try {
//     let Email = req.params.mail;
//     const { name, isPublished, datePublished, serialNumber } = req.body;

//     const authorArr: Ibook[] = JSON.parse(
//       fs.readFileSync(path.join(__dirname, "/database.json"), "utf-8")
//     );

//     const currentAuthor: Ibook = authorArr.find(
//       (author) => author.email === Email
//     )!;
//     const otherAuthors: Ibook[] = authorArr.filter(
//       (author) => author.email !== Email
//     );

//     const newBook = {
//       id: authorArr.length + 1,
//       name,
//       isPublished,
//       datePublished,
//       serialNumber,
//     };

//     currentAuthor.books.push(newBook);
//     otherAuthors.push(currentAuthor);
//     fs.writeFile(
//       path.join(__dirname, "/database.json"),
//       JSON.stringify(otherAuthors, null, 3),
//       "utf8",
//       (err) => {
//         if (err) {
//           res.send({ message: "error" });
//         } else {
//           res.redirect("/dashboard");
//         }
//       }
//     );
//     res.status(200).json({
//       newBook,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

app.post("/", async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const author: Ibook = {
      id: 1,
      author: req.body.name,
      dateRegistered: new Date(),
      age: req.body.age,
      email: req.body.email,
      password: hashed,
      address: req.body.address,
      books: [
        {
          name: "",
          isPublished: false,
          datePublished: new Date(),
          serialNumber: 0,
        },
      ],
    };
    let authorArr: Ibook[] = [];
    authorArr = JSON.parse(
      fs.readFileSync(path.join(__dirname, "/database.json"), "utf-8")
    );
    // authorArr = JSON.parse(data)
    authorArr.push(author);
    fs.writeFile(
      path.join(__dirname, "/database.json"),
      JSON.stringify(authorArr, null, 3),
      "utf8",
      (err) => {
        if (err) {
          res.send({ message: "error" });
        } else {
          res.redirect("/login");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

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
app.put("/api/books/:id", async (req: Request, res: Response) => {
  try {
    let userData = req.body;
    const booksStrings = await readFile(
      path.join(__dirname, "/database.json"),
      "utf8"
    );
    const booksArray = JSON.parse(booksStrings);
    let books = booksArray.find((book: any) => book.id === req.params.id);
    let index = booksArray.findIndex((book: any) => book.id === req.params.id);
    // if(!books) res.status(404).send(`${books} not found`)
    if (books) {
      booksArray[index] = { ...books, ...userData };
      console.log(booksArray);
      fs.writeFile(
        path.join(__dirname, "/database.json"),
        JSON.stringify(booksArray, null, 2),
        "utf8",
        (err) => {
          if (err) console.error(err);
          res.status(202).send(`${JSON.stringify(books)} updated successfully`);
        }
      );
    }
  } catch (error) {
    console.log("Enter an existing book id");
  }
});
 
app.delete('/api/books/:id', async (req:Request, res:Response)=> {
    const booksStrings =  await readFile(path.join(__dirname,"/database.json"),'utf8')
    const booksArray = JSON.parse(booksStrings);
    let books = booksArray.find((book : any) => book.id === req.params.id);

    if (books) {
        booksArray.splice(booksArray.indexOf(books), 1);
        fs.writeFile(path.join(__dirname,"/database.json"), JSON.stringify(booksArray, null, 2), 'utf8',(err) =>{
           if (err) {
            return res.status(500).send('an error occured')
           } res.send(booksArray)
        })

 }else{
    if (!books) res.status(404).send('book not found')
 }
 });

 app.post(

  "/newBookForm",

  async (req: Request, res: Response, next: NextFunction) => {

    try {

      let authorArr: Ibook[] = [];

      authorArr = JSON.parse(

        fs.readFileSync(path.join(__dirname, "/database.json"), "utf-8")

      );

      let bookArr: any [] = [];

      bookArr = JSON.parse(

        fs.readFileSync(path.join(__dirname, "/database.json"), "utf8")

      );

      const book: any = {

        id: authorArr.length + 1,

        name: req.body.name,

        isPublished: req.body.isPublished,

        datePublished: req.body.datePublished,

        serialNumber: req.body.serialNumber,

      };


if (!fs.existsSync(path.join(__dirname, "/database.json"))) {

        let books = [];

        books.push(book);

        const { author, dateRegistered, age, email, password, address } =

          req.body;



        if (req.body.author == author.id) {

          author.books.push(book);

        }

        const id = books.length + 1;

        await writeFile(`${__dirname}/database.json`, JSON.stringify(books));

      } else {

        const booksStrings = await readFile(

          path.join(__dirname, "/database.json"),

          "utf8"

        );     

  const booksArray = JSON.parse(booksStrings);

        booksArray.push(book);

        await writeFile(

          `${__dirname}/database.json`,

          JSON.stringify(booksArray)

        );

      }

      res.status(200).send({

        message: "book created successfully, go to book-page to view books",

      });

    } catch (error) {

      res.status(403).send({ message: "could not add book to the database" });

    }

  }

);


const port = process.env.port || 3005;
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

 export default app;
