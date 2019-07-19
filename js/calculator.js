window.addEventListener("DOMContentLoaded", init);

//initialise state variables
const defaultOp = { 
	name: "+",
	operator: add,
	value: ""
};
const calculator_state = {
	operations: [{ ...defaultOp }],
	elements: {
		output: undefined
	}
};

function init(){

	//grab DOM stuff
	const numbers     = document.getElementsByClassName("number button");
	const output      = document.getElementById("output");
	const clear       = document.getElementById("clear");
	const addBtn      = document.getElementById("add");
	const subBtn      = document.getElementById("subtract");
	const multiplyBtn = document.getElementById("multiply");
	const divideBtn   = document.getElementById("divide");
	const submitBtn   = document.getElementById("submit");

	//add elements to the state
	calculator_state.elements.output = output;

	//bind update functions to the state
	updateOutput    = updateOutput.bind(true, calculator_state);
	updateCurrentOp = updateCurrentOp.bind(true, calculator_state);
	clearOutput     = clearOutput.bind(true, calculator_state);
	calculate       = calculate.bind(true, calculator_state);

	//build operator functions
	const addOperation      = setCurrentOperation.bind(true, calculator_state, "add");
	const subtractOperation = setCurrentOperation.bind(true, calculator_state, "subtract");
	const multiplyOperation = setCurrentOperation.bind(true, calculator_state, "multiply");
	const divideOperation   = setCurrentOperation.bind(true, calculator_state, "divide");

	//add number-button listeners
	for(let number of numbers){
		number.addEventListener("click", updateCurrentOp);
	}

	//add function event listeners
	clear.addEventListener("click", clearOutput);
	submitBtn.addEventListener("click", calculate);

	//add operator event listeners
	addBtn.addEventListener("click", addOperation);
	subBtn.addEventListener("click", subtractOperation);
	multiplyBtn.addEventListener("click", multiplyOperation);
	divideBtn.addEventListener("click", divideOperation);
}//init

function updateCurrentOp(state, event){
	event.preventDefault();

	const { 
		value: number // (number) data-value of the clicked number button
	} = event.target.dataset;

	const [ currentOp ]        = state.operations;
	const { value: currentNo } = currentOp;
	const newNumber            = `${currentNo}${number}`;

	currentOp.value = newNumber;

	updateOutput();
}//updateCurrentOp

function updateOutput(state, event){
	
	const {
		operations,
		elements: { output }
	} = state;

	let operationString = "";
	for(let index = operations.length-1; index > -1; index--){
		const operation = operations[index];
		const { value, name } = operation;

		operationString += `${name}${value}`;		
		
	}

	output.innerText = `${operationString}`;
}//updateOutput

function clearOutput(state, event){
	event.preventDefault();

	state.operations = [{ ...defaultOp }];

	updateOutput();
}//clearOutput

function setCurrentOperation(state, key, event){

	event.preventDefault();

	const {
		currentNo = "0",
		operations, 
		elements: { 
			output: outputEl
		} 
	} = state;

	let operation;

	switch(key){
		case "add": {
			operation = {
				value: "",
				operator: add,
				name: "+"
			};	
			break;
		};

		case "subtract": {
			operation = {
				value: "",
				operator: subtract,
				name: "-"
			};	
			break;
		};

		case "multiply": {
			operation = {
				value: "",
				operator: multiply,
				name: "*"
			}
			break;
		};

		case "divide": {
			operation = {
				value: "",
				operator: divide,
				name: "/"
			}
			break;
		};
	}

	if(!operations[0].value){
		operations[0] = operation;
	} else {
		//add the new operation to the queue
		operations.unshift(operation);	
	}
	

	//update the output with the new info
	updateOutput();
}//setCurrentOperation

function add(currentValue = 0, additionalValue = 0){
	const result = parseInt(currentValue) + parseInt(additionalValue);
	return result;
}//add

function subtract(currentValue = 0, additionalValue = 0){
	const result = parseInt(currentValue) - parseInt(additionalValue);
	return result;
}//subtract

function multiply(currentValue = 1, additionalValue = 1){
	const result = parseInt(currentValue) * parseInt(additionalValue);
	return result;
}//multiply

function divide(currentValue = 1, additionalValue = 1){
	const result = parseInt(currentValue) / parseInt(additionalValue);
	return result;
}//divide

function calculate(state, event){

	//prevent reload
	event.preventDefault();

	const { operations } = state;

	//increment index by two, as we're already checking the 'next' value inside the loop
	let total;
	for(let index = operations.length - 1; index > -1; index--){

		const operation           = operations[index];
		const { value, operator } = operation;
		const runningTotal        = operator(total, value);

		total = runningTotal;
	}

	// create a new initial operation
	state.operations = [{
		value: total,
		operator: total > 0 ? add : subtract,
		name: total > 0 ? "+" : "-"
	}];

	//update the output no. with the total
	updateOutput();
}//calculate