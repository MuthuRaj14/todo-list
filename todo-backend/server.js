const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const cors =require('cors')

app.use(cors())
mongoose
  .connect("mongodb://localhost:27017/mern-app")
  .then(() => {
    console.log("DB Connected ! ");
  })
  .catch((err) => {
    console.log(err);
  });

const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: String,
});

const totdoModel = mongoose.model("Todo", todoSchema);

app.post("/todos", async (req, res) => {
  const { title, description } = req.body;

  try {
    const newTodo = new totdoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await totdoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updatedTodo = await totdoModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).kson({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await totdoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

const port = 8000;
app.listen(port, () => {
  console.log("Server is listening to port" + port);
});
