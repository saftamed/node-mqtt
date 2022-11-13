const MachineTasksChecker = require("../models/MachineTasksChecker");
const { checkLoginAndAdmin, checkLogin } = require("./userMidelWare");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Machine = require("../models/Machine");

const router = require("express").Router();

router.post("/", checkLogin, async (req, res) => {
    const newMachineTasksChecker = new MachineTasksChecker({...req.body,user:req.user.id});
  
    try {
      const savedMachine = await newMachineTasksChecker.save();  
      res.status(200).json(savedMachine);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  router.delete("/:id",checkLoginAndAdmin, async (req, res) => {
    try {
      await MachineTasksChecker.findByIdAndDelete(req.params.id);
      res.status(200).json("checker has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.put("/:id", checkLoginAndAdmin, async (req, res) => {
  try {
    const updatedcheck = await MachineTasksChecker.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedcheck);
  } catch (err) {
    res.status(500).json(err);
  }
  });




router.get("/", checkLoginAndAdmin,async (req, res) => {  
    try {
      const machineTasks = await MachineTasksChecker.find().sort({createdAt: -1}).limit(5).populate("tasks.task").populate("user").populate("machine");  
      const machines = await Machine.find().select('name'); 
      res.status(200).json({
        machines,
        machineTasks
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.get("/:id",checkLogin, async (req, res) => {  
    try {
      const savedMachine = await MachineTasksChecker.findById(req.params.id).sort({createdAt: -1}).limit(5).populate("tasks.task").populate("user").populate("machine");  
      res.status(200).json(savedMachine);
    } catch (err) {
      res.status(500).json(err);
    }
  });
router.get("/machine/:id",checkLogin, async (req, res) => {  
    try {
      const machineTasks = await MachineTasksChecker.find({machine:req.params.id}).sort({createdAt: -1}).limit(5).populate("tasks.task").populate("user").populate("machine");  
      res.status(200).json({
        machineTasks
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });


  module.exports = router;

