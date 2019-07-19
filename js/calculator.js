window.addEventListener("DOMContentLoaded", init);

//initialise state variables
const calculator_state = {
	currentNo: "",
	operations: [],
	elements: {
		output: undefined,
		buttons: {
			clear: undefined,
			numbers: {}
		}
	}
};

function init(){

	//grab DOM stuff
	const numbers   = document.getElementsByClassName("number button");
	const output    = document.getElementById("output");
	const clear     = document.getElementById("clear");
	const addButton = document.getElementById("add");

	//add elements to the state
	calculator_state.elements.output          = output;
	calculator_state.elements.buttons.numbers = numbers;
	calculator_state.elements.buttons.clear   = clear;
	calculator_state.elements.buttons.add     = addButton;

	//bind update functions to the state
	updateOutput = updateOutput.bind(true, calculator_state);
	updateCurrNo = updateCurrNo.bind(true, calculator_state);
	clearOutput  = clearOutput.bind(true, calculator_state);

	//build operator functions
	const addOperator      = setCurrentOperator.bind(true, calculator_state, "add");
	// const subtractOperator = setCurrentOperator.bind(true, calculator_state, "subtract");
	
	//add number-button listeners
	for(let number of numbers){
		number.addEventListener("click", updateCurrNo);
	}

	//add clear event listeners
	clear.addEventListener("click", clearOutput);

	//add operator event listeners
	addButton.addEventListener("click", addOperator);

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
		const { lastNo, name } = operation;
		operationString += `${lastNo}${name}`;
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
			lastNo: parseInt(currentNo),
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

function add(currentValue = 0, additionalValue){
	const result = parseInt(currentValue) + parseInt(additionalValue);
	return result;
}//add