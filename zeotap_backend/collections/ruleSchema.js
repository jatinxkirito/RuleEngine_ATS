const mongoose = require("mongoose");

// Define a schema for the Node structure
const NodeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["operator", "operand"],
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  left: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  right: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
});

// Define the main Rule schema
const RuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: [true, "Name must be unique"],
  },
  description: {
    type: String,
    default: "",
  },
  ruleString: {
    type: String,
    required: true,
  },
  ast: {
    type: NodeSchema,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const Rule = mongoose.model("Rule", RuleSchema);

module.exports = Rule;
