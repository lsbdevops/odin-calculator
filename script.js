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

function display(character, type) {
    // Get display element.
    const display = document.querySelector(".display");

    // If the character is a number, or an operator and an operator is not currently displayed, 
    // concatenate the character to the displayed text.
    if ((type === "number") || (type === "operator" && storeFirstNumber)) {
        display.textContent += character;
    }
    // Otherwise, the character is an operator and needs to 'overwrite' the currently displayed operator.
    else {
        display.textContent = display.textContent.slice(0, -1) + character;
    }
}

function storeNumber(event) {
    const number = event.target.dataset.number;
    // Confirm a character was returned, update display and return value.
    if (number) {
        display(number, "number");
        return number;
    }
}

function storeOperator(event) {
    const operator =  event.target.dataset.operator;
    // Confirm a character was returned, update display and return value.
    if (operator) {
        display(operator, "operator");
        return operator;
    }
}

let firstNumber = "";
let secondNumber = "";
let operator = "";
let storeFirstNumber = true;

// Create an event listener for all number buttons on the calculator.
const numberButtons = document.querySelectorAll(".number.button");
numberButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        if (storeFirstNumber) {
            firstNumber += storeNumber(event);
        }
        else {
            secondNumber += storeNumber(event);
        }
    })
})

// Create an event listener for all operator buttons on the calculator.
const operatorButtons = document.querySelectorAll(".operator.button");
operatorButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        operator = storeOperator(event);

        // Update boolean so the second number will be stored.
        storeFirstNumber = false;
    })
})