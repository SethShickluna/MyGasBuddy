//const secrets = fetch("./secrets.local.json").then(response => {return console.log(response.body);}); 
const URL = "https://fuel-v2.cc.api.here.com/" 
const API_KEY = "YOUR_API_KEY"

let currentDevice = null; 

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
				let deviceInfo = result[0]; 
				api.call("GetAddresses", {
					"coordinates":[{"x":deviceInfo.longitude,"y":deviceInfo.latitude}]
				},function(addressData){
					generateTable(deviceInfo,addressData[0]); 
					getFuelData(deviceInfo); 
				})
			}, 
			function(error){
				alert(error.message);
			}); 
		}
		refreshPage = function() {
			let element = document.getElementById("vehicle-dropdown");
			while(element.firstChild){
				element.removeChild(element.lastChild);
			}
			api.call("Get", {
				"typeName": "Device"
			}, function(result) {
				currentDevice = result[0]; 
				generateVehicleList(result)
			}, function(error) {
				alert(error.message);
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
async function getFuelData(deviceStatus){ 
	let range = 1000; //TODO: make this an input note (this is in meters)
	let apiCall = `${URL}fuel/stations.xml?prox=${deviceStatus.latitude},${deviceStatus.longitude},${range}&apiKey={${API_KEY}}`; 
	httpGetAsync(apiCall, function(response){
		console.log(response); 
	})
}

function httpGetAsync(url, callback) {
	let xmlHttpReq = new XMLHttpRequest();
	xmlHttpReq.onreadystatechange = function () {
		if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200)
		callback(xmlHttpReq.responseText);
	}

	xmlHttpReq.open("GET", url, true); // true for asynchronous 
	xmlHttpReq.send(null);
}



/*
	- table is formatted (Name, Long, Lat, Location)
*/ 
function generateTable(vehicleData, vehicleAddress){
	let body = document.getElementById("device-table-body"); 
	
	if(body.firstChild){
		body.removeChild(body.firstChild);
	}
	
	let tr = document.createElement("tr");
	let th1 = document.createElement("th")
	th1.textContent = currentDevice.name; 
	let th2 = document.createElement("th")
	th2.textContent = vehicleData.latitude;
	let th3 = document.createElement("th")
	th3.textContent = vehicleData.longitude;
	let th4 = document.createElement("th")
	th4.textContent = vehicleAddress.formattedAddress;
	
	tr.appendChild(th1);
	tr.appendChild(th2);
	tr.appendChild(th3);
	tr.appendChild(th4);
	body.appendChild(tr);
}
