const mongoose = require("mongoose");

const ProjectBankSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tech: { type: String, required: true },
});

module.exports = mongoose.model("ProjectBank", ProjectBankSchema);