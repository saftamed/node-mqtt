const mongoose = require("mongoose");

const MachineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true ,unique: true},
    position: { type: String },
    ref: { type: String,unique: true },
    cat: { type: String },
    tasks:
    [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Machine", MachineSchema);