const API_KEY = JSON.parse("secrets.local.json")['GAS_API_KEY']; 
const URL = "fuel-v2.cc.api.here.com/" 

geotab.addin.integrationExample = function(api, state) {
		const generateVehicleList = function(vehicles) {
			//<li><a class="dropdown-item" href="#">Action</a></li>
			let element = document.getElementById("vehicle-dropdown");
			vehicles.forEach(vehicle => {
				let li = document.createElement("li");
				let a = document.createElement("a");
				a.id = vehicle.id;
				a.className = "dropdown-item";
				a.innerText = vehicle.name;
				a.onclick = loadDeviceLogs;
				li.appendChild(a);  
				element.appendChild(li);
			}); 
		},
		loadDeviceLogs = function(event){
			deviceId = event.target.id; 
			/*https://geotab.github.io/sdk/software/api/reference/#DeviceStatusInfo*/ 
			api.call("Get", {
				"typeName":"DeviceStatusInfo", 
				"resultsLimit": 1, 
				"search":{
					"deviceSearch":{
						"id":deviceId
					}
				}
			}, 
			function(result){
				let element = document.getElementById("results-section"); 
				element.innerHTML = result; 

			}, 
			function(error){

			}); 
			//today gas api call on vehicles last known position

		}
		refreshPage = function() {
			api.call("Get", {
				"typeName": "Device"
			}, function(result) {
				generateVehicleList(result)
			}, function(error) {
				console.log(error.message);
			});
		},
		clearOnLeaving = function() {
			let element = document.getElementById("vehicle-dropdown");
			while(element.firstChild){
				element.removeChild(element.lastChild);
			}
		};

	return {
		initialize: function(api, state, callback) {
			callback();
		},
		focus: function(api, state) {
			refreshPage();
		},
		blur: function(api, state) {
			clearOnLeaving();
		}
	}
};

//get the results of the gas API call
async function loadResults(deviceStatus){ 
	let range = 100; 
	let apiCall = `${url}fuel/stations.xml?prox=${deviceStatus['latitude']},${deviceStatus['latitude']},${range}&apiKey={${API_KEY}}}`
	await fetch(apiCall, function(response){
		document.getElementById("results-section").innerHTML += response; 
	})
}

