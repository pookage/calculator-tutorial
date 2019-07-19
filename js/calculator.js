window.addEventListener("DOMContentLoaded", init);

//initialise state variables
const calculator_state = {
	output: "",
	operator: undefined,
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
	clearOutput  = clearOutput.bind(true, calculator_state);

	//build operator functions
	const addOperator      = setCurrentOperator.bind(true, calculator_state, "add");
	// const subtractOperator = setCurrentOperator.bind(true, calculator_state, "subtract");
	
	//add number-button listeners
	for(let number of numbers){
		number.addEventListener("click", updateOutput);
	}

	//add clear event listeners
	clear.addEventListener("click", clearOutput);

	//add operator event listeners
	addButton.addEventListener("click", addOperator);

}//init

function updateOutput(state, event){
	event.preventDefault();

	const { 
		value: number // (number) data-value of the clicked number button
	} = event.target.dataset;

	const {
		output,   // (number) current numerical value of output display
		operator, // (function) current math function to call
		elements: { 
			output: outputEl // (HTMLElement) <output> ui element to flush results to
		}
	} = state;

	let newOutput;
	if(!!operator){
		newOutput      = operator(output, number);
		state.operator = undefined;
	} else {
		newOutput = `${output || ""}${number}`;
	}

	state.output       = newOutput;
	outputEl.innerText = newOutput;
}//updateOutput

function clearOutput(state, event){
	event.preventDefault();

	state.output = undefined;
	state.elements.output.innerText = "";
}//clearOutput

function setCurrentOperator(state, key, event){

	event.preventDefault();

	const { 
		elements: { 
			output: outputEl
		} 
	} = state;

	if(key === "add"){
		state.operator = add;
		outputEl.innerText += "+";
	}

}//setCurrentOperator

function add(currentValue = 0, additionalValue){
	const result = parseInt(currentValue) + parseInt(additionalValue);
	return result;
}//add