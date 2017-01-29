

//Student Name: Shet,Neha Nilcant and Project Name: Project#2  and Due date: Wednesday October 26

var username = "neha_shet";
var request = new XMLHttpRequest();
var map;
var marker ;
//initMap() which initiates map to a location
var content = '';
var latLan = {lat: 32.75, lng: -97.13};
var formattedAddress = "";
function initMap() {

	//initialize map
	
	//Initialize a mouse click event on map which then calls reversegeocode function
 
    map = new google.maps.Map(document.getElementById('map'), {
         
         //32.75, -97.13
         center: latLan,
          zoom: 17
        });
    
    getInfo(latLan);
    
    
    google.maps.event.addDomListener(map, 'click', function(result1) {

        content = "";
        formattedAddress= "";
        weatherData = "";

        if(marker != null || marker != "")

            marker.setMap(null);
            var latLan = {lat:result1.latLng.lat(),lng:result1.latLng.lng()}
            getInfo(latLan)
    });
}

function getInfo(latLon) {
    
    createMarkerOnMap(latLon);
    reversegeocode(latLon)
}

function createMarkerOnMap(position) {

    marker = createMarker({
        position: position,
        map: map
  });
    
}
// Reserse Geocoding 
function reversegeocode(latLan) {
  
    var xmlRequestObj =  new XMLHttpRequest();
  //get the latitude and longitude from the mouse click and get the address.
  //call geoname api asynchronously with latitude and longitude 
    
    xmlRequestObj.open("GET","https://maps.googleapis.com/maps/api/geocode/json?latlng="+latLan.lat+","+latLan.lng+"&key=AIzaSyB7Bgh0S-U1UHM78fS-XpI1mtT7smrDW10");
    xmlRequestObj.setRequestHeader("Accept","application/json");        
    xmlRequestObj.send(null);
    xmlRequestObj.onreadystatechange = function() {
        if (this.readyState == 4) {
            
            var json = JSON.parse(this.responseText);
            if(json.results.length>0) {
                
                formattedAddress = "<h3> Address Details at ("+latLan.lat+", "+latLan.lng+"): </h3><p>"+json.results[0].formatted_address+"</p>";
                content += "<div><b>[lat, lon] : ["+latLan.lat+", "+latLan.lng+"]</b></div>";
                content += "<div><span><b>Postal Address:<b></span><span>"+json.results[0].formatted_address+"</span></div>";

            } else {
                
                content += "<div><span><b>No Results found </b></span></div>";
                formattedAddress = "No Address details found for (Lat,Lon): ("+latLan.lat+","+latLan.lng+")";
            }
            sendRequest(latLan);
            }
        }
    
    
    
}// end of geocodeLatLng()



function displayResult () {
    
    if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
      
        if(xml.getElementsByTagName("status").length>0) {
            
             content += "<div> <span><b>"+xml.getElementsByTagName("status")[0].getAttribute('message')+" for Weather </b></span></div>";
             weatherData = "<h3>"+xml.getElementsByTagName("status")[0].getAttribute('message')+" for Weather </h3>";
            
        } else {
            
            var temperature = xml.getElementsByTagName("temperature")[0].textContent;
            var windspeed = xml.getElementsByTagName("windSpeed")[0].textContent;
            var clouds = xml.getElementsByTagName("clouds")[0].textContent;
            content += "Weather Details: <div> <span><b>temperature : </b></span><span>"+temperature+"&deg C</span></div>";
            content += "<div> <span><b>windspeed : </b></span><span>"+windspeed+"</span></div>";
            content += "<div> <span><b>clouds : </b></span><span>"+clouds+"</span></div>";
            weatherData = "<h3>Weather Details: </h3><p>Temperature: "+temperature+"&deg C</p><p>Windspeed:"+windspeed+"</p><p> Clouds : "+clouds+"</p>";
        }
        var output = document.getElementById('output');
        var newElement = document.createElement('div');
        newElement.setAttribute('class','content');
        var outputElement = "<div class='content'>"+formattedAddress + weatherData +"</div>";
        output.innerHTML += outputElement;
    
       // output.insertBefore(newElement,output.firstChild);
        
        var infowindow = new google.maps.InfoWindow({
            content: content
        });
        infowindow.open(map, marker);
    }
}

function sendRequest (latlan) {
    
    request.onreadystatechange = displayResult;
    request.open("GET"," http://api.geonames.org/findNearByWeatherXML?lat="+latlan.lat+"&lng="+latlan.lng+"&username="+username);
    request.send(null);
}

function createMarker(options) {
    
    return new google.maps.Marker(options);
  }

window.onload = function() {
    
    document.getElementById('clear').onclick = function(){
        
        document.getElementById('output').innerHTML = "";
    }
}