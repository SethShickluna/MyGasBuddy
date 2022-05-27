

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
				a.onclick = loadGasData;
				li.appendChild(a);  
				element.appendChild(li);
			}); 
		},
		loadGasData = function(event){
			deviceId = event.target.id; 
			//todo get log data (lat/lon)
			//today gas api call on vehicles last known position
		}
		refreshPage = function() {
			api.call("Get", {
				typeName: "Device"
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
