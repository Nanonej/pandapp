"use strict"
var file = 'db/data.json';
var search = "";
var filters = {
	Assassin: true,
	Fighter: true,
	Mage: true,
	Support: true,
	Tank: true,
	Marksman: true,
}

function printData(file) {
	var filteredTags = [];
	for (var tag in filters) {
		if (filters[tag])
			filteredTags.push(tag);
	}
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, false);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4)
			if (rawFile.status === 200 || rawFile.status == 0) {
				var grid = document.getElementById('grid');
				grid.innerHTML = "";
				var lolData = JSON.parse(rawFile.responseText);

				lolData.champions.sort(function(a, b) {
					if(a.name < b.name) return -1;
				    if(a.name > b.name) return 1;
				    return 0;
				});

				for (var i = 0; i < lolData.champions.length; i++) {
					var show = false;
					for (var j = 0; j < lolData.champions[i].tags.length; j++)
						if (filteredTags.includes(lolData.champions[i].tags[j])) {
							show = true;
							break;
						}
					if (show && lolData.champions[i].name.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
						var newDiv = document.createElement('div');
						newDiv.id = lolData.champions[i].id;
						newDiv.className = 'champCell';
						newDiv.innerHTML = '<img src="http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/' + lolData.champions[i].key + '.png"></img>'
						newDiv.innerHTML += '<p>' + lolData.champions[i].name + '</p>';
						grid.appendChild(newDiv);
					}
				}
			}
	}
	rawFile.send(null);
}

var popularity = [];
var hist = [];

function getChartData(file, id) {
	var filteredTags = [];
	for (var tag in filters) {
		if (filters[tag])
			filteredTags.push(tag);
	}
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, false);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4)
			if (rawFile.status === 200 || rawFile.status == 0) {
				var lolData = JSON.parse(rawFile.responseText);
				popularity = [0, 0, 0, 0];
				hist = [0, 0, 0, 0];
				var sum = 0;
				var sum2 = 0;

				for  (var i = 0; i < lolData.matches.length;  i++) {
					if (lolData.matches[i].champion == id) {
						var x = new Date(lolData.matches[i].timestamp * 1000);
						x = x.getFullYear();
						if (lolData.matches[i].lane == "TOP") { popularity[0]++; sum++; }
						if (lolData.matches[i].lane == "JUNGLE") { popularity[1]++; sum++; }
						if (lolData.matches[i].lane == "MID") { popularity[2]++; sum++; }
						if (lolData.matches[i].lane == "BOT") { popularity[3]++; sum++; }
						if (x == 2014) { hist[0]++; sum2++; }
						if (x == 2015) { hist[1]++; sum2++; }
						if (x == 2016) { hist[2]++; sum2++; }
						if (x == 2017) { hist[3]++; sum2++; }
					}
				}
				popularity = popularity.map(function(val) {return Math.round(val * 100 / sum)});
				hist = hist.map(function(val) {return Math.round(val * 100 / sum2)});
			}
	}
	rawFile.send(null);
}

var getDataFromJson = function() {
	printData(file);
	var modal = document.getElementById('modal');
	var content = document.getElementById('modal-content');
	var cell = document.getElementsByClassName("champCell");

	for (var i = 0; i < cell.length; i++) {
		cell[i].onclick = function() {
			modal.style.display = "block";
			content.innerHTML = '<span class="close">&times;</span>';

			getChartData(file, this.getAttribute("id"));

			content.innerHTML += '<canvas id="roleChart" width="400" height="400"></canvas></ br>';
			content.innerHTML += '<canvas id="histChart" width="400" height="400"></canvas>';
			var ctx1 = document.getElementById("roleChart").getContext('2d');
			var roleChart = new Chart(ctx1, {
				type: 'horizontalBar',
				data: {
					labels: ["Top", "Jungler", "Mid", "Bottom"],
					datasets : [{
						label: 'Popularity',
						data : popularity,
						backgroundColor: [
			                'rgba(60,138,189, 0.8)',
							'rgba(60,138,189, 0.8)',
							'rgba(60,138,189, 0.8)',
							'rgba(60,138,189, 0.8)'
			            ]
					}]
				},
				options: {
					responsive: true,
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero:true
							}
						}],
						xAxes: [{
							ticks: {
								min: 0,
								callback: function(value) {
									return value + "%"
								}
							},
							scaleLabel: {
								display: true,
								labelString: "Percentage"
							}
						}]
					}
				}
			});

			var ctx2 = document.getElementById("histChart").getContext('2d');
			var histChart = new Chart(ctx2, {
				type: 'line',
				data: {
					labels: ["2014", "2015", "2016", "2017"],
					datasets : [{
						label: 'Popularity',
						data : hist,
						backgroundColor: [
			                'rgba(60,138,189, 0.8)'
			            ]
					}]
				},
				options: {
					responsive: true,
					scales: {
						yAxes: [{
							ticks: {
								min: 0,
								callback: function(value) {
									return value + "%"
								}
							},
							scaleLabel: {
								display: true,
								labelString: "Percentage"
							}
						}]
					}
				}
			});

			var span = document.getElementsByClassName("close")[0];

			span.onclick = function() {
				modal.style.display = "none";
			}
			window.onclick = function(event) {
				if (event.target == modal) {
					modal.style.display = "none";
				}
			}
		}
	}
}

window.onload = function() {
	getDataFromJson();
}
