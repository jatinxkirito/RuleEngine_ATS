// ruleEngine.js

class Node {
  constructor(nodeType, value = null, left = null, right = null) {
    this.type = nodeType; // "operator" or "operand"
    this.value = value; // Operator (AND/OR) or operand value
    this.left = left; // Left child
    this.right = right; // Right child
  }

  toString() {
    if (this.type === "operator") {
      return `(${this.left}${this.value}${this.right})`;
    } else {
      return this.value;
    }
  }
}
function printRule(rule) {
  if (!rule) return;
  console.log("(");
  if (rule.left) printRule(rule.left);
  console.log(rule.value);
  if (rule.right) printRule(rule.right);
  console.log(") ");
}
function createRule(ruleString) {
  // Tokenize the rule string
  ruleString = "(" + ruleString + ")";
  const tokens = ruleString.match(/\(|\)|AND|OR|[^()\s]+/g);

  //console.log(tokens);

  if (tokens.length < 3) throw new Error("Invalid rule format");
  const validOperators = new Set(["AND", "OR"]);
  const validComparisons = new Set(["=", "!=", ">", "<", ">=", "<="]);
  let operators = [];
  let equation = [];
  let operand = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] == "(") {
      operators.push(tokens[i]);
    } else if (tokens[i] == ")") {
      if (operators.length == 0) throw new Error("Invalid rule format");

      let op = operators.pop();
      if (op == "(") continue;
      let b = operators.pop();
      if (b != "(") throw new Error("Invalid rule format");
      //console.log(op);
      if (!validOperators.has(op)) throw new Error("Invalid rule format");

      if (equation.length < 2) throw new Error("Invalid rule format");
      let right = equation.pop();
      let left = equation.pop();
      equation.push(new Node("operator", op, left, right));
    } else if (validOperators.has(tokens[i])) {
      operators.push(tokens[i]);
    } else if (validComparisons.has(tokens[i])) {
      if (i == tokens.length - 2) throw new Error("Invalid rule format");
      if (operand.length == 0) throw new Error("Invalid rule format");
      const op = tokens[i];
      const l = operand.pop();
      ++i;
      let r = tokens[i];

      if (
        !isNaN(r) ||
        (r.length > 2 && r[0] == "'" && r[r.length - 1] == "'")
      ) {
        if (isNaN(r)) r = r.substring(1, r.length - 1);
        equation.push(new Node("operand", l + op + r));
      } else throw new Error("Invalid rule format");
    } else if (
      !isNaN(tokens[i]) ||
      (tokens[i].length > 2 &&
        tokens[i][0] == "'" &&
        tokens[i][tokens[i].length - 1] == "'")
    )
      throw new Error("Invalid rule format");
    else {
      if (operand.length > 0) throw new Error("Invalid rule format");
      operand.push(tokens[i]);
    }
  }

  if (operators.length > 0 || operand.length > 0 || equation.length != 1)
    throw new Error("Invalid rule format");
  //console.log(equation[0]);
  //printRule(equation[0]);
  return equation[0];
}
function countNodes(node) {
  if (!node) return 0;
  if (node.type === "operand") return 1;
  return 1 + countNodes(node.left) + countNodes(node.right);
}
function combineRules(rules) {
  if (rules.length === 0) {
    return null;
  }

  const astRules = rules.map((rule) => {
    //console.log(rule);
    return createRule(rule);
  });

  // Sort rules by complexity (number of nodes) to optimize evaluation order (to get a more balanced tree)
  astRules.sort((a, b) => countNodes(b) - countNodes(a));

  // Rebuild the tree
  return astRules.reduce((acc, rule) => {
    return new Node("operator", "AND", acc, rule);
  });
}

async function evaluateRule(root, data) {
  if (!root) return true;

  if (root.type === "operand") {
    // Parse and evaluate the condition
    const [attribute, operator, value] = root.value.split(
      /\s*(=|!=|>|<|>=|<=)\s*/
    );
    const actualValue = data[attribute];
    //console.log(root.value, actualValue);
    if (!actualValue) {
      return false;
    }
    switch (operator) {
      case "=":
        return actualValue == value;
      case "!=":
        return actualValue != value;
      case ">":
        return parseFloat(actualValue) > parseFloat(value);
      case "<":
        return parseFloat(actualValue) < parseFloat(value);
      case ">=":
        return parseFloat(actualValue) >= parseFloat(value);
      case "<=":
        return parseFloat(actualValue) <= parseFloat(value);
      default:
        throw new Error("Invalid operator");
    }
  } else if (root.type === "operator") {
    //console.log(root.value);
    if (root.value === "AND") {
      return Promise.all([
        evaluateRule(root.left, data),
        evaluateRule(root.right, data),
      ]).then((values) => {
        return values[0] & values[1];
      });
    } else if (root.value === "OR") {
      return Promise.all([
        evaluateRule(root.left, data),
        evaluateRule(root.right, data),
      ]).then((values) => {
        return values[0] | values[1];
      });
    }
  }

  throw new Error("Invalid node type");
}

module.exports = {
  Node,
  createRule,
  combineRules,
  evaluateRule,
  printRule,
};
