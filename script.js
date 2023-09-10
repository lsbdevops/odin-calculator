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

function updateDisplay(operator, firstNumber, secondNumber) {
    // Get display element.
    const display = document.querySelector(".display"); 

    // Update the display text with the current input.
    display.textContent = `${firstNumber} ${operator} ${secondNumber}`;
}

function getButtonValue(event) {
    const buttonValue = event.target.dataset.value;

    // Check if the input is a decimal point and confirm no decimal point is already present.
    if (buttonValue === "." && decimalPresent) return "";

    // If the input is a decimal point, update the boolean variable.
    if (buttonValue === ".") decimalPresent = true;

    return buttonValue;
}

function resetCalcVariables() {
    firstNumber = "";
    secondNumber = "";
    operator = "";
    firstNumberStored = false;
    operatorLocked = false;
    decimalPresent = false;
    updateDisplay(operator, firstNumber, secondNumber);
}

function getResult() {
    // Check that the full expression exists before finding the result.
    if (operator && firstNumber && secondNumber) {
        // If either number ends with a decimal point, update the number by concatenating a zero at the end.
        if (firstNumber.slice(-1) === ".") firstNumber += "0";
        if (secondNumber.slice(-1) === ".") secondNumber += "0";

        // Get and print the result of expression - convert string variables storing numbers to numbers.
        const result = operate(operator, +firstNumber, +secondNumber);
        updateDisplay(operator, firstNumber, secondNumber);
        
        // Reset second number and operator variables
        secondNumber = "";
        operator = "";
        resultStored = true;
        decimalPresent = false;

        // Convert result back to a string so string methods may be used.
        return result.toString();    
    }

    // Otherwise return first number unchanged.
    return firstNumber;
}


let firstNumber = "";
let secondNumber = "";
let operator = "";
let firstNumberStored = false;
let resultStored = false;
let operatorLocked = false;
let decimalPresent = false;

// Create an event listener for all number buttons on the calculator.
const numberButtons = document.querySelectorAll(".number.button");
numberButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        if (!firstNumberStored) {
            firstNumber += getButtonValue(event);
        }
        else if (!resultStored) {
            secondNumber += getButtonValue(event);
        }
        // If number button is pressed directly after result is displayed,
        // start a new calculation with the number input.
        else {
            resetCalcVariables();
            firstNumber += getButtonValue(event);
        }

        updateDisplay(operator, firstNumber, secondNumber);
    })
})

// Create an event listener for all operator buttons on the calculator.
const operatorButtons = document.querySelectorAll(".operator.button");
operatorButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        // If there's an input for both first and second numbers in the expression, evaluate
        // the result first.
        if (firstNumber && secondNumber) {
            firstNumber = getResult();
        }
        if (firstNumber && !secondNumber && !operatorLocked) {
            operator = getButtonValue(event);

            // Update boolean to indicate first number has been stored.
            firstNumberStored = true;

            // Reset boolean to indicate result is no longer stored.
            resultStored = false;

            // Reset boolean to indicate a decimal point is no longer stored.
            decimalPresent = false;
        }

        updateDisplay(operator, firstNumber, secondNumber);
    })
})

const equalsButton = document.querySelector("#equals");
equalsButton.addEventListener("click", () => {
        // Allow carryover of result to first number variable, and reset second number to prepare 
        // for next sequential expression.
        firstNumber = getResult();
        updateDisplay(operator, firstNumber, secondNumber);

        // If divided by zero, do not allow any further operators to be typed.
        if (firstNumber === Infinity) operatorLocked = true;
})

const clearButton = document.querySelector("#clear");
clearButton.addEventListener("click", () => {
    // Reset the calculation variables, and clear display.
    resetCalcVariables();
})
