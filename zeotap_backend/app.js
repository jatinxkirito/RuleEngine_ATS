require("express-async-errors");
const express = require("express");
const cors = require("cors");
const Rule = require("./collections/ruleSchema");
const {
  createRule,
  combineRules,
  evaluateRule,
  printRule,
} = require("./ruleEngine");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.post("/api/create_rule", async (req, res) => {
  const { name, description, ruleString } = req.body;
  try {
    // if (!isValidExpression(ruleString)) {
    //   return res.status(400).json({ error: "Invalid rule expression" });
    // }
    //console.log(name);
    const ast = createRule(ruleString);
    const rule = new Rule({
      name,
      description,
      ruleString,
      ast,
    });
    await rule.save();
    res
      .status(201)
      .json({ message: "Rule created successfully", ruleId: rule._id });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/evaluate_rule", async (req, res) => {
  let { rule, data } = req.body;
  try {
    rule = await Rule.findById(rule);
    const result = await evaluateRule(rule.ast, data);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get("/api/get_rules", async (req, res) => {
  try {
    let rules = await Rule.find({});
    //console.log(rule);
    rules = rules.map((r) => {
      return {
        name: r.name,
        description: r.description,
        ruleString: r.ruleString,
        rule: r._id,
      };
    });
    res.json({ result: rules });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.post("/api/combine_rules", async (req, res) => {
  const { rules, data } = req.body;
  // console.log(rules);
  try {
    const combinedRule = combineRules(rules);
    const result = await evaluateRule(combinedRule, data);
    //printRule(combinedRule);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = app;
