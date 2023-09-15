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
        case "×":
            return multiply(firstNumber, secondNumber);
        case "÷":
            return divide(firstNumber, secondNumber);
    }
}

function updateDisplay(result) {
    // Get display elements.
    const lowerDisplay = document.querySelector(".display-lower"); 
    const upperDisplay = document.querySelector(".display-upper"); 

    // Check if user has divided by zero (note: infinity may be a string or number).
    if (calculator.firstNumber === "Infinity" || result === "Infinity") {
        lowerDisplay.textContent = "Error: Cannot divide by zero!";
        upperDisplay.textContent = "";
    }
    else if (!calculator.operator) {
        lowerDisplay.textContent = `${calculator.firstNumber}`;
        upperDisplay.textContent = "";
    }
    else if (!calculator.secondNumber) {
        upperDisplay.textContent = `${calculator.firstNumber} ${calculator.operator}`;
        lowerDisplay.textContent = "";
    }
    else if (!result) {
        lowerDisplay.textContent = `${calculator.secondNumber}`;
    }
    else if (result) {
        upperDisplay.textContent = `${calculator.firstNumber} ${calculator.operator} ${calculator.secondNumber} =`
        lowerDisplay.textContent = `${result}`;
    }

}

function getButtonValue(event) {
    return event.target.dataset.value;
}

function updateNumberVariable(event) {
    const buttonValue = getButtonValue(event);

    // If the button value is 0, do not add an additional zero if zero is the only number stored.
    if ((buttonValue === "0") && (calculator.firstNumber === "0" || calculator.secondNumber == "0")) {
        return;
    }

    if (!calculator.firstNumberStored) {
        // If the number length exceeds the display area (i.e, 14 numbers), do not allow any further numbers
        // to be stored.
        if (calculator.firstNumber.length >= 14) {
            return
        }
        // Check if the current number is zero only, if so replace with this with the current number input.
        else if (calculator.firstNumber === "0" && buttonValue != ".") {
            calculator.firstNumber = buttonValue;
        }
        // Add leading 0 if decimal point is input with no prior number input.
        else if (!calculator.firstNumber && buttonValue === ".") {
            calculator.firstNumber = "0" + buttonValue;
        }
        // Otherwise, concatenate the value.
        else {
            calculator.firstNumber += buttonValue;
        }
    }
    else if (!calculator.resultStored) {
        if (calculator.secondNumber.length >= 14) {
            return
        }
        else if (calculator.secondNumber === "0" && buttonValue != ".") {
            calculator.secondNumber = buttonValue;
        }
        else if (!calculator.secondNumber && buttonValue === ".") {
            calculator.secondNumber = "0" + buttonValue;
        }
        else {
            calculator.secondNumber += buttonValue;
        }
    }
    // If number button is pressed directly after result is displayed,
    // start a new calculation with the number input.
    else {
        resetCalcVariables(true);
        calculator.firstNumber = buttonValue;
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
        calculator.firstNumber = "0";
        calculator.firstNumberStored = false;
        calculator.operatorLocked = false;
    }

}

function round(numberString, maxLength) {
    let beforeDecimal;
    let afterDecimal; 
    let exponential;

    if (numberString.search(/\./) === -1) {
        beforeDecimal = numberString;
    }
    else {
        // Use a regex to get the digits before and after the decimal point.
        [,beforeDecimal, afterDecimal, exponential] = /(\d+)(\.\d+)(e\+\d\d)?/.exec(numberString);
    }

    // Check if the digits before the decimal are greater than the overflow limit. 
    if (beforeDecimal.length > maxLength) {
        // Remove required number of trailing digits (ensure an additional removed to account for 
        // exponential format characters).
        let reducedNumber = beforeDecimal / Math.pow(10, ((5 + beforeDecimal.length) - maxLength));
        reducedNumber = Math.round(reducedNumber);
        reducedNumber *= Math.pow(10, ((5 + beforeDecimal.length) - maxLength));

        // Return number in exponential form.
        return Number(reducedNumber).toExponential();
    }
    else {
        // Round the after decimal digits to the maximum allowable number of digits.
        const exponentialCharacters = (exponential) ? 4 : 0;
        let roundedDecimal = parseFloat(afterDecimal).toFixed(maxLength - beforeDecimal.length
            - exponentialCharacters);

        // Join back the number, ensure any trailing zeros are removed and return as a string.
        let roundedNumber = parseFloat(beforeDecimal + roundedDecimal.slice(1));
        roundedNumber = roundedNumber.toString();

        if (exponential) {
            roundedNumber += exponential;
        }

        return roundedNumber;
    }
}

function getResult(operator, firstNumber, secondNumber) {
    // Check that the full expression exists before finding the result.
    if (operator && firstNumber && secondNumber) {
        // If either number ends with a decimal point, update the number by concatenating a zero at the end.
        if (firstNumber.slice(-1) === ".") {
            calculator.firstNumber += "0";
        }
        if (secondNumber.slice(-1) === ".") {
            calculator.secondNumber += "0";
        }

        // Get and print the result of expression - convert string variables to numbers. Return the result as a string.
        let result = operate(operator, +firstNumber, +secondNumber).toString();

        // Ensure result does not overflow the calculator (maximum 14 characters including decimal) 
        // - round result if required.
        if (result.length > 13) {
           result = round(result.toString(), 14); 
        }

        updateDisplay(result)

        // Reset second number, operator and decimal boolean variables.
        resetCalcVariables(false);

        // Convert result back to a string so string methods may be used. Confirm result was stored.
        return [result, true];    
    }

    // Otherwise return first number unchanged.
    return [firstNumber, calculator.firstNumberStored];
}

function deleteFromDisplay() {
    if (calculator.firstNumber === "Infinity") {
        return;
    }

    // Check if the character to be deleted is a decimal point, and if so switch decimal present boolean.
    const currentDisplay = `${calculator.firstNumber}${calculator.operator}${calculator.secondNumber}`;
    if (currentDisplay.slice(-1) === ".") {
        calculator.decimalPresent = false;
    }

    // Check which variable needs to be targetted for deletion.
    if (!calculator.firstNumberStored) {
        if (!(calculator.firstNumber === "0")) {
            calculator.firstNumber = calculator.firstNumber.slice(0, -1);
        }
        // If last digit is erased, replace with a zero.
        if (calculator.firstNumber === "") {
            calculator.firstNumber = "0";
        }
    }
    else if (calculator.secondNumber) {
        if (!(calculator.secondNumber === "0")) {
            calculator.secondNumber = calculator.secondNumber.slice(0, -1);
        }
    }
    else {
        calculator.operator = "";
        // Allow for first number to be erased with the next backspace.
        calculator.firstNumberStored = false;
    }
}

// Declare initial values for variables required in an object.
const calculator = {
    firstNumber: "0",
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

const deleteButton = document.querySelector("#delete");
deleteButton.addEventListener("click", () => {
    deleteFromDisplay();
    updateDisplay();
})