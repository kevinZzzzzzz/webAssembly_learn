import React, { useState, useEffect } from "react";
import CFun from "../../../C/CFun";

function TestPage(props: any) {
  const [num1, setNum1] = useState<any>(0);
  const [num2, setNum2] = useState<any>(0);
  const [way, setWay] = useState<any>("add");
  const [result, setResult] = useState<any>(0);

  useEffect(() => {
    setResult(0);
    if (num1 && num2) {
      // const res = window.$CFun._add(num1, num2)
      const res = window.$CFun.ccall(
        way,
        "number",
        ["number", "number"],
        [num1, num2]
      );
      console.log(res);
      setResult(res);
    }
  }, [num1, num2, way]);
  return (
    <>
      <input
        type="number"
        value={num1}
        onChange={(e: any) => setNum1(e.target.value)}
      />
      <select value={way} onChange={(e: any) => setWay(e.target.value)}>
        <option value="add">+</option>
        <option value="subtract">-</option>
        <option value="multiply">*</option>
        <option value="divide">/</option>
      </select>
      <input
        type="number"
        value={num2}
        onChange={(e: any) => setNum2(e.target.value)}
      />
      =<p style={{ display: "inline" }}>{result}</p>
    </>
  );
}
export default TestPage;
