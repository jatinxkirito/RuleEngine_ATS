import { useEffect, useState } from "react";

import "./App.css";
import axios from "axios";
function RuleTile({ data }) {
  let { rule, ruleString, name, description } = data;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "70%",
      }}
    >
      <div style={{ width: "100%", textWrap: "wrap", textAlign: "left" }}>
        Name: {name}
      </div>
      <div style={{ width: "100%", textWrap: "wrap", textAlign: "left" }}>
        Description: {description}
      </div>
      <div style={{ width: "100%", textWrap: "wrap", textAlign: "left" }}>
        Rule:{ruleString}
      </div>
      <button
        onClick={async () => {
          try {
            const data = JSON.parse(document.getElementById("data").value);
            const response = await axios.post(
              "http://127.0.0.1:3000/api/evaluate_rule",
              {
                rule,
                data,
              }
            );
            if (response.data.result) window.alert(`${name} is satisfied`);
            else window.alert(`${name} is not satisfied`);
          } catch (e) {
            window.alert(e.message);
          }
        }}
      >
        Check
      </button>
    </div>
  );
}
function App() {
  const [rule_list, setrule_list] = useState([]);
  const [loading, setLoading] = useState(true);
  const [combine, addtoCombine] = useState([]);
  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      axios
        .get("http://127.0.0.1:3000/api/get_rules")
        .then((dt) => {
          console.log(dt);
          setrule_list(dt.data.result);
          setLoading(false);
        })
        .catch((err) => {
          window.alert(err.message);
        });
    }

    return () => {
      ignore = true;
    };
  }, []);
  if (loading) return <div>Loading...</div>;
  // console.log("kd");
  return (
    <div
      style={{
        display: "flex",

        width: "100%",
        flexDirection: "column",
      }}
    >
      <h2>Create Rule</h2>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "left",
        }}
        id="ruleForm"
        onSubmit={async function (e) {
          try {
            e.preventDefault();
            const dat = new FormData(e.target);
            let x = Object.fromEntries(dat);
            console.log(x);
            const res = await axios.post(
              `http://127.0.0.1:3000/api/create_rule`,
              x
            );
            x.rule = res.data.ruleId;
            setrule_list([...rule_list, x]);
            //console.log(res);
          } catch (err) {
            //console.log(err);
            if (err.response.data.error.includes("name"))
              window.alert("Rule name must be unique");
            else window.alert(err.response.data.error);
          }
        }}
      >
        <label for="ruleName">Rule Name:</label>
        <input type="text" id="ruleName" name="name" required />

        <label for="ruleDescription">Rule Description:</label>
        <input type="text" id="ruleDescription" name="description" required />

        <label for="ruleString">Rule Expression:</label>
        <textarea
          id="ruleString"
          name="ruleString"
          rows="10"
          cols="20"
          defaultValue="((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)"
          required
        ></textarea>

        <button type="submit">Create Rule</button>
      </form>
      <h2>Validation Data</h2>
      <textarea
        id="data"
        name="data"
        rows="10"
        cols="20"
        defaultValue={JSON.stringify({
          age: 35,
          department: "Marketing",
          salary: 60000,
          experience: 3,
        })}
        required
      ></textarea>
      <h2>Rules</h2>
      {rule_list.map((data) => {
        return <RuleTile key={data.rule} data={data} />;
      })}
      <h2>Combine Rules</h2>
      <textarea
        id="tempdata"
        name="tempdata"
        rows="10"
        cols="20"
        defaultValue="((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)"
        required
      ></textarea>
      <button
        onClick={() => {
          addtoCombine([...combine, document.getElementById("tempdata").value]);
        }}
      >
        Add to combine rule
      </button>
      {combine.map((rule, i) => {
        return (
          <div style={{ textWrap: "wrap" }}>
            {rule}
            <button
              onClick={() => {
                combine.splice(i, 1);
                addtoCombine([...combine]);
              }}
            >
              Delete
            </button>
          </div>
        );
      })}
      <button
        onClick={async () => {
          try {
            const data = JSON.parse(document.getElementById("data").value);
            const response = await axios.post(
              "http://127.0.0.1:3000/api/combine_rules",
              {
                rules: combine,
                data,
              }
            );
            if (response.data.result)
              window.alert(`Combined rules are satisfied`);
            else window.alert(`Combined rules are not satisfied`);
          } catch (e) {
            window.alert(e.message);
          }
        }}
      >
        Check for combined rules
      </button>
    </div>
  );
}

export default App;
