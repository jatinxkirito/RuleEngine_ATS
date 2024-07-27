const assert = require("assert");
const sinon = require("sinon");
const { createRule, evaluateRule, combineRules } = require("../ruleEngine");
describe("Rule engine tests", () => {
  describe("Create and evaluvate rules test", () => {
    it("RULE 1: ((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)", async () => {
      const ruleString =
        "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)";
      const Node = createRule(ruleString);

      // assert(Node);
      const data1 = {
        age: 35,
        department: "Marketing",
        salary: 60000,
        experience: 3,
      };
      const r1 = await evaluateRule(Node, data1);
      const data2 = {
        age: 35,
        department: "Sales",
        salary: 60000,
        experience: 3,
      };
      const r2 = await evaluateRule(Node, data2);
      assert.equal(r1, false);
      assert.equal(r2, true);
    });
    it("RULE 2: ((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)", async () => {
      const ruleString =
        "((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)";
      const Node = createRule(ruleString);

      // assert(Node);
      const data1 = {
        age: 35,
        department: "Marketing",
        salary: 60000,
        experience: 3,
      };
      const r1 = await evaluateRule(Node, data1);
      const data2 = {
        age: 35,
        department: "Sales",
        salary: 60000,
        experience: 3,
      };
      const r2 = await evaluateRule(Node, data2);
      assert.equal(r1, true);
      assert.equal(r2, false);
    });
  });
  describe("Combine rules and evaluate", () => {
    it("Case 1: ((age > 30 AND department = 'Marketing')) + (salary > 20000 OR experience > 5)", async () => {
      const Node = combineRules([
        "((age > 30 AND department = 'Marketing'))",
        " (salary > 20000 OR experience > 5)",
      ]);

      // assert(Node);
      const data1 = {
        age: 35,
        department: "Marketing",
        salary: 60000,
        experience: 3,
      };
      const r1 = await evaluateRule(Node, data1);
      const data2 = {
        age: 35,
        department: "Sales",
        salary: 60000,
        experience: 3,
      };
      const r2 = await evaluateRule(Node, data2);
      assert.equal(r1, true);
      assert.equal(r2, false);
    });
    it("Case 2: ((age > 30 AND department = 'Marketing')) + (salary > 20000) +  (experience > 5)", async () => {
      const Node = combineRules([
        "((age > 30 AND department = 'Marketing'))",
        "(salary > 20000)",
        "(experience > 5)",
      ]);

      // assert(Node);
      const data1 = {
        age: 35,
        department: "Marketing",
        salary: 60000,
        experience: 3,
      };
      const r1 = await evaluateRule(Node, data1);
      const data2 = {
        age: 35,
        department: "Sales",
        salary: 60000,
        experience: 3,
      };
      const r2 = await evaluateRule(Node, data2);
      assert.equal(r1, false);
      assert.equal(r2, false);
    });
  });
});
