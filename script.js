function add(x, y) {
    return x + y;
}

function subtract(x, y) {
    return x - y;
}

function multiply(x, y) {
    return x * y;
}

function divide(x, y) {
    return x / y;
}

function operate(operator, firstNumber, secondNumber) {
    // Check the operator variable and return the result of the associated function/operation.
    switch(operator) {
        case "+":
            return add(firstNumber, secondNumber);
        case "-":
            return subtract(firstNumber, secondNumber);
        case "*":
            return multiply(firstNumber, secondNumber);
        case "/":
            return divide(firstNumber, secondNumber);
    }
}

function updateDisplay() {
    // Get display element.
    const display = document.querySelector(".display"); 

    // Check if user has divided by zero.
    if (calculator.firstNumber === "Infinity") {
        display.textContent = "Error: Cannot divide by zero!";
    }
    // Update the display text with the current input.
    else display.textContent = `${calculator.firstNumber} ${calculator.operator} ${calculator.secondNumber}`;
}

function getButtonValue(event) {
    return event.target.dataset.value;
}

function updateNumberVariable(event) {
    if (!calculator.firstNumberStored) {
        calculator.firstNumber += getButtonValue(event);
    }
    else if (!calculator.resultStored) {
        calculator.secondNumber += getButtonValue(event);
    }
    // If number button is pressed directly after result is displayed,
    // start a new calculation with the number input.
    else {
        resetCalcVariables(true);
        calculator.firstNumber += getButtonValue(event);
    }
}

function updateOperatorVariable(event) {
    // If there's an input for both first and second numbers in the expression, evaluate
    // the result first.
    if (calculator.firstNumber && calculator.secondNumber) {
        [calculator.firstNumber, calculator.resultStored] = getResult(calculator.operator, 
            calculator.firstNumber, calculator.secondNumber);
    }
    if (calculator.firstNumber && !calculator.secondNumber && !calculator.operatorLocked) {
        calculator.operator = getButtonValue(event);

        // Update boolean to indicate first number has been stored.
        calculator.firstNumberStored = true;

        // Reset boolean to indicate result is no longer stored.
        calculator.resultStored = false;

        // Reset boolean to indicate a decimal point is no longer stored.
        calculator.decimalPresent = false;
    }
}

function resetCalcVariables(fullReset) {
    calculator.secondNumber = "";
    calculator.operator = "";
    calculator.decimalPresent = false;

    if (fullReset) {
        calculator.firstNumber = "";
        calculator.firstNumberStored = false;
        calculator.operatorLocked = false;
    }

}

function getResult(operator, firstNumber, secondNumber) {
    // Check that the full expression exists before finding the result.
    if (operator && firstNumber && secondNumber) {
        // If either number ends with a decimal point, update the number by concatenating a zero at the end.
        if (firstNumber.slice(-1) === ".") {
            firstNumber += "0";
        }
        if (secondNumber.slice(-1) === ".") {
            secondNumber += "0";
        }

        // Get and print the result of expression - convert string variables storing to numbers.
        const result = operate(operator, +firstNumber, +secondNumber);
        
        // Reset second number, operator and decimal boolean variables.
        resetCalcVariables(false);

        // Convert result back to a string so string methods may be used. Confirm result was stored.
        return [result.toString(), true];    
    }

    // Otherwise return first number unchanged.
    return firstNumber;
}

// Declare initial values for variables required in an object.
const calculator = {
    firstNumber: "",
    secondNumber: "",
    operator: "",
    firstNumberStored: false,
    resultStored: false,
    operatorLocked: false,
    decimalPresent: false,
}

// Create an event listener for all number buttons on the calculator.
const numberButtons = document.querySelectorAll(".number.button");
numberButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        updateNumberVariable(event);
        updateDisplay();
    })
})

// Create an event listener for all operator buttons on the calculator.
const operatorButtons = document.querySelectorAll(".operator.button");
operatorButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        updateOperatorVariable(event);
        updateDisplay();
    })
})

const equalsButton = document.querySelector("#equals");
equalsButton.addEventListener("click", () => {
        // Allow carryover of result to first number variable and update display.
        [calculator.firstNumber, calculator.resultStored] = getResult(calculator.operator, 
            calculator.firstNumber, calculator.secondNumber);
        updateDisplay();

        // If divided by zero, do not allow any further operators to be typed.
        if (calculator.firstNumber === "Infinity") {
            calculator.operatorLocked = true;
        }
})

const clearButton = document.querySelector("#clear");
clearButton.addEventListener("click", () => {
    // Reset the calculation variables, and clear display.
    resetCalcVariables(true);
    updateDisplay();
})


const decimalButton = document.querySelector("#decimal");
decimalButton.addEventListener("click", (event) => {
    // Confirm no decimal point is already present in the current number.
    if (!calculator.decimalPresent) {
        updateNumberVariable(event);
        updateDisplay();
        calculator.decimalPresent = true;
    }
})