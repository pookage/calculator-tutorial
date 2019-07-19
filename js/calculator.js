window.addEventListener("DOMContentLoaded", init);

//initialise state variables
const calculator_state = {
	currentNo: "",
	operations: [],
	elements: {
		output: undefined,
		buttons: {
			clear: undefined,
			submit: undefined,
			numbers: {}
		}
	}
};

function init(){

	//grab DOM stuff
	const numbers   = document.getElementsByClassName("number button");
	const output    = document.getElementById("output");
	const clear     = document.getElementById("clear");
	const addBtn    = document.getElementById("add");
	const submitBtn = document.getElementById("submit");

	//add elements to the state
	calculator_state.elements.output          = output;
	//NOTE: do we need these in the state?
	//TOOD: TIDY UP!
	calculator_state.elements.buttons.numbers = numbers;
	calculator_state.elements.buttons.clear   = clear;
	calculator_state.elements.buttons.add     = addBtn;
	calculator_state.elements.buttons.submit  = submitBtn;

	//bind update functions to the state
	updateOutput = updateOutput.bind(true, calculator_state);
	updateCurrNo = updateCurrNo.bind(true, calculator_state);
	clearOutput  = clearOutput.bind(true, calculator_state);
	calculate    = calculate.bind(true, calculator_state);

	//build operator functions
	const addOperator      = setCurrentOperator.bind(true, calculator_state, "add");
	
	//add number-button listeners
	for(let number of numbers){
		number.addEventListener("click", updateCurrNo);
	}

	//add function event listeners
	clear.addEventListener("click", clearOutput);
	submitBtn.addEventListener("click", calculate);

	//add operator event listeners
	addBtn.addEventListener("click", addOperator);
}//init

function updateCurrNo(state, event){
	event.preventDefault();

	const { 
		value: number // (number) data-value of the clicked number button
	} = event.target.dataset;

	const {
		currentNo, // (string) current numerical value of output display
	} = state;

	const newNo = `${currentNo || ""}${number}`;

	//update current value
	state.currentNo = newNo;

	updateOutput();
}//updateCurrNo

function updateOutput(state, event){
	
	const {
		currentNo,
		operations,
		elements: { output }
	} = state;

	let operationString = "";
	for(let operation of operations){
		const { value, name } = operation;
		operationString += `${value}${name}`;
	}

	output.innerText = `${operationString}${currentNo}`;
}//updateOutput

function clearOutput(state, event){
	event.preventDefault();

	state.currentNo = "";
	state.operations = [];

	updateOutput();

	console.log(state);
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
	if(key === "add"){
		operation = {
			value: parseInt(currentNo),
			operator: add,
			name: "+"
		};
	}
	
	//add the new operation to the queue
	operations.push(operation);

	//reset the current number for the next number
	state.currentNo = "";

	//update the output with the new info
	updateOutput();
}//setCurrentOperator

function add(currentValue = 0, additionalValue = 0){
	const result = parseInt(currentValue) + parseInt(additionalValue);
	return result;
}//add

function calculate(state, event){

	//prevent reload
	event.preventDefault();

	//add the current value to the list of operations
	setCurrentOperator(state, "add", event);

	const { operations } = state;

	//increment index by two, as we're already checking the 'next' value inside the loop
	let total = 0;
	for(let index = 0; index < operations.length; index+=2){

		//get the value and operator for the current task
		const { value, operator }  = operations[index];
		//grab the next value entered 
		const { value: nextValue } = operations[index + 1];

		//apply the operator of the next value
		const calculation = operator(value, nextValue);
		const nextTotal   = total + calculation;

		total = nextTotal;
	}

	//clear the operations now that we've evaluated them
	state.operations = [];

	//update the output no. with the total
	state.currentNo  = total;
	updateOutput();
}//calculate