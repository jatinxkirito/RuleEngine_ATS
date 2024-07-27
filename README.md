# Rule Engine with AST

This is a Rule Engine with AST. It is an implementation of Rule Engine with AST in Javascript. It is a rule engine that uses AST to evaluate JSON data against a given rule string or multiple rule strings that are combined into a single AST and then evaluates the JSON data against the AST. It can be used to perform the following tasks:

1. Create a new AST from a given rule string
2. Combine multiple rule strings into a single AST
3. Evaluate a JSON data against the AST

## Data Structure and Database schema

### Data Structure

I used a node with left and right pointer to create a tree like structure for easy evaluation.

It is basically of two types:

1. Operator:

```bash
{
  "type": "operator",
  "left": Node,
  "right": Node,
  "value": string ("AND" or "OR")
}
```

2. Operand(leaf node):

```bash
{
  "type": "operand",
  "left": null,
  "right": null,
  "value": string (e.g. "Salary>50000")
}
```

### Database schema

Rule:

```bash
{
  "name": string,
  "description": string,
  "ruleString": string(e.g. "(age > 30 AND department = 'Marketing')"),
  "ast": Node,
  "createdAt": date,
  "updatedAt": date,
}
```

## Features

Some features of the RuleEngine:

1. Parsed the rule string in **Linear Time**
2. Implemented **error handling** in Rule string parsing like invalid syntax and invalid type comparison.
3. Used **promise** in rule evaluation for parallel processing to **fasten** the process

## Usage

1. Run git clone in terminal
   ```bash
    git clone https://github.com/jatinxkirito/RuleEngine_ATS.git
   ```
2. In zeotap_backend folder

   - Create config.env file with following content
     ```bash
      DATABASE_LINK="Your MongoDB database link"
     ```
   - Run following in terminal
     ```bash
       npm install
       npm start
     ```

3. In zeotap_frontend folder

   - Run following in terminal
     ```bash
       npm install
       npm run dev
     ```

4. Open [ http://localhost:5173]() in you browser

5. To run tests, go to zeotap_backend folder and run following command in terminal

   ```bash
    mocha --file test/testSetup.js test/**/*.test.js
   ```
