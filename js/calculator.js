window.addEventListener("DOMContentLoaded", init);

//initialise state variables
const calculator_state = {
	output: "",
	elements: {
		output: undefined,
		operator: undefined,
		buttons: {
			clear: undefined,
			numbers: {}
		}
	}
};

function init(){

	//grab DOM stuff
	const numbers = document.getElementsByClassName("number button");
	const output  = document.getElementById("output");
	const clear   = document.getElementById("clear");
	const add     = document.getElementById("add");

	//add elements to the state
	calculator_state.elements.output          = output;
	calculator_state.elements.buttons.numbers = numbers;
	calculator_state.elements.buttons.clear   = clear;
	calculator_state.elements.buttons.add     = add;

	//bind update functions to the state
	updateOutput = updateOutput.bind(true, calculator_state);
	clearOutput  = clearOutput.bind(true, calculator_state);

	//add number-button listeners
	for(let number of numbers){
		number.addEventListener("click", updateOutput);
	}

	//add clear event listeners
	clear.addEventListener("click", clearOutput);
}//init

function updateOutput(state, event){
	event.preventDefault();

	const { 
		value: number // (number) data-value of the clicked number button
	} = event.target.dataset;

	const {
		output, // (number) current numerical value of output display
		elements: { 
			output: outputEl // (HTMLElement) <output> ui element to flush results to
		}
	} = state;

	const newOutput = output + number;

	state.output       = newOutput;
	outputEl.innerText = newOutput;
}//updateOutput

function clearOutput(state, event){
	event.preventDefault();

	state.output = "";
	state.elements.output.innerText = "";
}//clearOutput

function add(){

}//add