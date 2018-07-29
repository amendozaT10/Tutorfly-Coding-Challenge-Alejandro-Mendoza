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
        </div>
      </div>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      padInput: [
        1,2,3,'+',
        4,5,6,'-',
        7,8,9,'*',
        '=',0,'.','/',
        'CLEAR'
      ],
      result: 0,
      operator: null,
      operand: null,
    }
  }

  handleClick(i) {
    const input = this.state.padInput[i];
    const result = this.state.result;
    const operator = this.state.operator;
    const operand = this.state.operand;

    let newResult = result;
    let newOperator = operator;
    let newOperand = operand;

    if (operator === null) {
      if (isNumeric(input)) {
        newResult = this.updateNumericAmount(result, input);
      } else if (isOperator(input)) {
        newOperator = input
      } else if (isDecimalPoint(input)) {
        newResult = this.addDecimalPoint(result);
      }
    } else {
      if (isNumeric(input)) {
        newOperand = this.updateNumericAmount(operand, input);
      } else if (isDecimalPoint(input)) {

      } else if (isOperator(input)) {
        newOperator = input
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


  updateNumericAmount(result, input) {
    let newResult;
    let strResult = '' + result

    if (result == null || result === 0) {
      newResult = input;
    } 
    
    else if (strResult.includes('.')) {
      var strNewResult = '';
      strNewResult += result;
      strNewResult += input;
      newResult = parseFloat(strNewResult);
    }

    else {
      var strNewResult = '';
      strNewResult += result;
      strNewResult += input;
      newResult = parseInt(strNewResult);
    }
    return newResult;
  }

  addDecimalPoint(result) {
    let strResult = '' + result
    if (strResult.includes('.')) {
      // do nothing
    } else {
      return parseFloat(strResult)
    }
  }

  render() {
    const padInput = this.state.padInput;

    const numToDisplay = (this.state.operand === null) ? this.state.result : this.state.operand;

    const status = '' + numToDisplay;

    return (
      <div className="calculator">
        <div className="display">
          <div className="status">{status}</div>
        </div>
        <div className="button-pad">
          <DigitPad 
            padInput={padInput} 
            onClick={i => this.handleClick(i)}
          />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);

function isNumeric(n) {
  return !isNaN(n)
}

function isOperator(o) {
  const operators =  ['+', '-', '/', '*'];
  return operators.includes(o);
}

function isEquals(o) {
  return o === '='
}

function isDecimalPoint(o) {
  return o === '.'
}

function compute(result, operator, operand) {
  switch(operator) {
    case '+':
      return result + operand;
    case '-':
      return result - operand;
    case '*':
      return result * operand;
    case '/':
      return result / operand;
  }
}
