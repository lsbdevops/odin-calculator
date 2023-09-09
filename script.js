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

function display(character) {
    document.querySelector(".display").textContent += character;
}

function storeNumber(event) {
    number = event.target.dataset.number;
    if (number) {
        display(number);
        return number;
    }
}

let firstNumber = "";
let secondNumber = "";
let operator = "";
let storeFirstNumber = true;

// Create an event listener for all number buttons on the calculator.
const buttons = document.querySelectorAll(".number.button");
buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
        if (storeFirstNumber) {
            firstNumber += storeNumber(event);
        }
        else {
            secondNumber += storeNumber(event);
        }
    })
})