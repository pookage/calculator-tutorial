window.addEventListener("DOMContentLoaded", init);

//initialise state variables
const calculator_state = {
	output: "",
	elements: {
		output: undefined,
		clear: undefined,
		buttons: {
			numbers: {}
		}
	}
};

function init(){

	//grab DOM stuff
	const numbers = calculator_state.elements.buttons.numbers = document.getElementsByClassName("number button");
	calculator_state.elements.output = document.getElementById("output");
	calculator_state.elements.clear  = document.getElementById("clear");

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