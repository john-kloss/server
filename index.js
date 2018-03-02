const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const universities = require("./universities");
const questionSchema = require("./schemas/question");
// sudo service mongod start
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/uniduell");
const _ = require("lodash");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("connected!");
  //mongoose.connection.db.dropDatabase();
});

const Question = mongoose.model("Question", questionSchema);
Question.find({}, (err, res) => console.log(res));

app.post("/university/list", (req, res) => {
  res.send(universities);
});

app.post("/questions/game", (req, res) => {
  Question.find(
    {
      university: req.body.university,
      course: req.body.course,
      subject: req.body.subject
    },
    (err, questions) => {
      if (err) return handleError(err);
      res.send(question);
    }
  );
});

app.post("/questions/courses", (req, res) => {
  Question.find({ university: req.body.university }, (err, questions) => {
    if (err) return handleError(err);
    const courses = questions.reduce((prev, cur) => {
      if (!_.includes(prev, cur.course)) {
        prev.push(cur.course);
      }
      return prev;
    }, []);
    res.send(courses);
  });
});

app.post("/questions/subjects", (req, res) => {
  Question.find(
    { university: req.body.university, course: req.body.course },
    (err, questions) => {
      if (err) return handleError(err);
      const subjects = questions.reduce((prev, cur) => {
        if (!_.includes(prev, cur.subject)) {
          prev.push(cur.subject);
        }
        return prev;
      }, []);
      res.send(subjects);
    }
  );
});

app.post("/questions/add", (req, res) => {
  const question = new Question({
    question: req.body.question,
    answers: req.body.answers,
    course: req.body.course,
    subject: req.body.subject,
    university: req.body.university
  });
  question.save(err => {
    if (err) return handleError(err);
    res.send({}); // TODO: return something
  });
});

app.listen(3000, () => console.log("Server listening on port 3000!"));
