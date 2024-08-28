
function jsPsych(trials) {
	console.log("Experiment loaded");

	const jsPsych = initJsPsych({
		on_finish: function() {
			jsPsych.data.displayData();
		}
	});
	var timeline = [];

	const images_src = trials.map(function(item) { return item.image_src; })
	var preload = {
		type: jsPsychPreload,
		images: images_src,
		show_detailed_errors : true
	};
	timeline.push(preload);



	var welcome = {
		type: jsPsychHtmlButtonResponse,
		stimulus: "Welcome to the experiment. Press the button to begin.",
		choices: ["Continue"]
	}
	timeline.push(welcome);

	var instructions = {
		type: jsPsychSurveyText,
		preamble: `
			<p><strong>We invite you to participate in a research study on language
			and interpretation.</strong></p>
			<p>We will ask you to rate how true predictions made by a certain
			character feels to you given a set of objects. The experiment should
			last about 10 mins.</p>
			<p>Your participation is voluntary and you can decide to quit the
			experiment at any time.</p>
			<p><strong>However, please note that in order to validate the task, you
			need to complete the experiment and wait until the results are sent
			(this should take only a few seconds).</strong></p>
			<p>Otherwise, we have no way to ensure that you participated at all.</p>
			<p>You will be paid for your participation in this study at the rate
			posted on Prolific.</p>
			<p>Your participation in this study will remain confidential. Your
			individual privacy will be maintained in all published and written data
			resulting from the study.</p>
			<p>For further information on the research project, please contact
			Benjamin Spector <a
			href="mailto:benjamin.spector@ens.psl.eu">benjamin.spector@ens.psl.eu</a></p>
		`,
		css_classes: ['instructions'],
		questions: [
			{prompt: "Enter your Prolific Id:", required : true}
		]
	};
	timeline.push(instructions);



	var instructions = {
		type: jsPsychHtmlButtonResponse,
		stimulus: `
			<h1 id="instructions">Instructions</h1>
			<p>In each trial, you will see a picture containing geometrical shapes.
			Without seeing it, Mary made a prediction regarding this picture. You
			will see Mary’s prediction and you will have to rate how true her
			prediction feels to you given the picture.</p>
			<p>There is no “correct answer”. What we are interested in is your
			intuitive judgment.</p>
		`,
		css_classes: ['instructions'],
		choices: ["Continue"]
	};
	timeline.push(instructions);



	var trial = {
		type: jsPsychSurveyLikert,
		preamble : function()  {
			return `<img src="${jsPsych.timelineVariable("image_src")}">`;
		},
		questions: [
			{
				prompt:  jsPsych.timelineVariable("sentence"), 
				labels: [
					"false", 
					"true",
					"neither"
					],
				required : true 
			}
		]
	};
	var procedure = {
		timeline: [trial],
		timeline_variables : trials,
		randomize_order : true,
	};
	timeline.push(procedure);

	jsPsych.run(timeline);
}

function displayError() {
	document.body.innerHTML += `<p style="color: red;">Error: Failed to load trials.json</p>`;
}

// Create a new XMLHttpRequest object
var xhr = new XMLHttpRequest();

xhr.open('GET', 'trials.json', true);

// Set up a function to handle the response data
xhr.onreadystatechange = function() {
	if (xhr.readyState === 4 && xhr.status === 200) {
		var response = JSON.parse(xhr.responseText);
		jsPsych(response);
	}
};
xhr.onerror = displayError;

// Send the request
xhr.send();
