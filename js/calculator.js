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
	const numbers   = document.getElementsByClassName("number button");
	const output    = document.getElementById("output");
	const clear     = document.getElementById("clear");
	const addBtn    = document.getElementById("add");
	const subBtn    = document.getElementById("subtract");
	const submitBtn = document.getElementById("submit");

	//add elements to the state
	calculator_state.elements.output          = output;

	//bind update functions to the state
	updateOutput    = updateOutput.bind(true, calculator_state);
	updateCurrentOp = updateCurrentOp.bind(true, calculator_state);
	clearOutput     = clearOutput.bind(true, calculator_state);
	calculate       = calculate.bind(true, calculator_state);

	//build operator functions
	const addOperator      = setCurrentOperator.bind(true, calculator_state, "add");
	const subtractOperator = setCurrentOperator.bind(true, calculator_state, "subtract");
	
	//add number-button listeners
	for(let number of numbers){
		number.addEventListener("click", updateCurrentOp);
	}

	//add function event listeners
	clear.addEventListener("click", clearOutput);
	submitBtn.addEventListener("click", calculate);

	//add operator event listeners
	addBtn.addEventListener("click", addOperator);
	subBtn.addEventListener("click", subtractOperator);
}//init

function updateCurrentOp(state, event){
	event.preventDefault();

	const { 
		value: number // (number) data-value of the clicked number button
	} = event.target.dataset;

	const [ currentOp ] = state.operations;
	const { value: currentNo } = currentOp;
	const newNumber = `${currentNo}${number}`;

	currentOp.value = newNumber;

	console.log(currentOp.value, { newNumber, currentNo });

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

function setCurrentOperator(state, key, event){

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
		}
	}

	//add the new operation to the queue
	operations.unshift(operation);

	//update the output with the new info
	updateOutput();
}//setCurrentOperator

function add(currentValue = 0, additionalValue = 0){
	const result = parseInt(currentValue) + parseInt(additionalValue);
	return result;
}//add

function subtract(currentValue = 0, additionalValue = 0){
	const result = parseInt(currentValue) - parseInt(additionalValue);
	return result;
}//subtract

function calculate(state, event){

	//prevent reload
	event.preventDefault();

	const { operations } = state;

	//increment index by two, as we're already checking the 'next' value inside the loop
	let total = 0;
	for(let operation of operations){

		const { value, operator } = operation;
		const runningTotal = operator(total, value);

		total = runningTotal;
		
	}

	// create a new initial operation
	state.operations = [{
		value: total,
		operator: total > 0 ? add : subtract,
		name: total > 0 ? "+" : "-"
	}];

	// //update the output no. with the total
	// state.currentNo  = total;
	updateOutput();
}//calculate