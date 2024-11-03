import React, { useState, useEffect } from 'react';
import CFun from '../../../C/CFun'

function TestPage(props: any) {

 const [num1, setNum1] = useState<any>(0)
 const [num2, setNum2] = useState<any>(0)
 const [result, setResult] = useState<any>(0)

 useEffect(() => {
  if (num1 && num2) {
    // const res = window.$CFun._add(num1, num2)
    const res = window.$CFun.ccall('add', 'number', ['number', 'number'], [num1, num2])
    setResult(res)
  }
 }, [num1, num2])
 return (
  <>
  <input type="number" value={num1} onChange={(e:any) => setNum1(e.target.value)} />
  +
  <input type="number" value={num2} onChange={(e:any) => setNum2(e.target.value)} />
  =
  <p style={{'display': 'inline'}}>{result}</p>
  </>
 )
}
export default TestPage