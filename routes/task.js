const Task = require("../models/Task");
const { checkLoginAndAdmin,checkLogin } = require("./userMidelWare");


const router = require("express").Router();

router.post("/",checkLoginAndAdmin, async (req, res) => {
    const newTask = new Task({
      name: req.body.name,
    });
  
    try {
      const savedTask = await newTask.save();  
      res.status(200).json(savedTask);
    } catch (err) {
      res.status(500).json(err);
    }
  });
router.get("/",checkLogin, async (req, res) => {
  
  try {
      const savedTask = await Task.find();
      res.status(200).json(savedTask);
    } catch (err) {
      res.status(500).json(err);
    }
  });
router.get("/last",checkLogin, async (req, res) => {
  
  try {
      const savedTask = await Task.find().limit(5).sort({createdAt: -1});
      res.status(200).json(savedTask);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/search/:s",checkLogin, async (req, res) => {  
    try {
      const savedMachine = await Task.find({ name: { $regex: new RegExp(req.params.s, "i") } }).limit(10);  
      res.status(200).json(savedMachine);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  router.put("/:id",checkLoginAndAdmin, async (req, res) => {
  
    try {
      const updatedUser = await Task.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router;

