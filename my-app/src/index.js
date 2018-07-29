import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function CalcButton(props) {
  return (
    <button className="calcButton" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class DigitPad extends React.Component {
  renderCalcButton(i) {
    return <CalcButton 
      value={this.props.padInput[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
        <div className="pad-row">
          {this.renderCalcButton(0)}
          {this.renderCalcButton(1)}
          {this.renderCalcButton(2)}
          {this.renderCalcButton(3)}
        </div>
        <div className="pad-row">
          {this.renderCalcButton(4)}
          {this.renderCalcButton(5)}
          {this.renderCalcButton(6)}
          {this.renderCalcButton(7)}
        </div>
        <div className="pad-row">
          {this.renderCalcButton(8)}
          {this.renderCalcButton(9)}
          {this.renderCalcButton(10)}
          {this.renderCalcButton(11)}
        </div>
        <div className="pad-row">
          {this.renderCalcButton(12)}
          {this.renderCalcButton(13)}
          {this.renderCalcButton(14)}
          {this.renderCalcButton(15)}
        </div>
        <div className="pad-row">
          {this.renderCalcButton(16)}
          {this.renderCalcButton(17)}
          {this.renderCalcButton(18)}
          {this.renderCalcButton(19)}
        </div>
        <div className="pad-row">
          {this.renderCalcButton(20)}
        </div>
      </div>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: '0',
      operator: null,
      operand: null,
    }
  }

  handleClick(i) {
    const input = this.props.padInput[i];
    const result = this.state.result;
    const operator = this.state.operator;
    const operand = this.state.operand;

    let newResult = result;
    let newOperator = operator;
    let newOperand = operand;

    if (input === 'CLEAR') {
      newResult = '0'
      newOperator = null
      newOperand = null
    } else if (isFactorial(input)) {
      newResult = computeFactorial(result)
      newOperator = null
      newOperand = null
    } else if (isSquareRoot(input)) {
      newResult = computeSquareRoot(result)
      newOperator = null
      newOperand = null
    } 
    // apply edits to the primary operand
    else if (operator === null) {
      if (isNumeric(input)) {
        newResult = updateAmount(result, input);
      } else if (isOperator(input)) {
        newOperator = input
      } else if (isDecimalPoint(input)) {
        newResult = addDecimalPoint(result);
      } else if (isSignChange(input)) {
        newResult = switchSign(result)
      }
    } 
    // apply edits to the secondary operand
    else {
      if (isNumeric(input)) {
        newOperand = updateAmount(operand, input);
      } else if (isDecimalPoint(input)) {
        newOperand = addDecimalPoint(operand);
      } else if (isOperator(input)) {
        newOperator = input
      } else if (isSignChange(input)) {
        newOperand = switchSign(operand)
      } else if (isEquals(input)) {
        newResult = compute(result, operator, operand);
        newOperator = null
        newOperand = null
      }
    }
    
    this.setState(
      {
        result: newResult,
        operator: newOperator,
        operand: newOperand,
      }
    );
  }

  render() {
    const numToDisplay = (this.state.operand === null) ? 
    this.state.result : 
    this.state.operand;

    return (
      <div className="calculator">
        <div className="display">
          <div className="status">{numToDisplay}</div>
        </div>
        <div className="button-pad">
          <DigitPad 
            padInput={this.props.padInput} 
            onClick={i => this.handleClick(i)}
          />
        </div>
      </div>
    );
  }
}

// ========================================

const padInput = [
  '√','^','+/-','!',
  1,2,3,'+',
  4,5,6,'-',
  7,8,9,'*',
  '=',0,'.','/',
  'CLEAR'
]

ReactDOM.render(
  <Calculator padInput={padInput} />,
  document.getElementById('root')
);

// ========================================

function isNumeric(n) {
  return !isNaN(n)
}

function isOperator(o) {
  const operators =  ['+', '-', '/', '*', '^'];
  return operators.includes(o);
}

function isEquals(o) {
  return o === '='
}

function isDecimalPoint(o) {
  return o === '.'
}

function isSignChange(o) {
  return o === '+/-'
}

function isSquareRoot(o) {
  return o === '√'
}

function isFactorial(o) {
  return o === '!'
}

function switchSign(n) {
  var strNum = '' + n;

  if (strNum === '0') {
    return strNum
  } else if (strNum.includes('-')) {
    return strNum.substring(1, strNum.length);
  } else {
    return '-' + strNum;
  }
}

function updateAmount(amount, input) {
  if (amount === null || amount === '0') {
    return input;
  }
  return parseFloat('' + amount + input);
}

function addDecimalPoint(result) {
  let strResult = '' + result
  if (!strResult.includes('.')) {
    return strResult + '.';
  }
  return result
}

function compute(result, operator, operand) {
  let resultNum = parseFloat(result)
  let operandNum = parseFloat(operand)

  switch(operator) {
    case '+':
      return '' + (resultNum + operandNum);
    case '-':
      return '' + (resultNum - operandNum);
    case '*':
      return '' + (resultNum * operandNum);
    case '/':
      return '' + (resultNum / operandNum);
    case '^':
      return '' + Math.pow(resultNum, operandNum);
    default:
      return '' + resultNum
  }
}

function computeFactorial(num) {
  if (num < 0) {
    return -1 * computeFactorial(switchSign(num));
  }

  let result = 1;
  for (let i = 1; i <= num; i++) {
    result = result * i
  }
  return result
}

function computeSquareRoot(num) {
  if (num >= 0) {
    return Math.sqrt(num)
  } else {
    return "Don't square root negative numbers please."
  }
}
