displayDiv = $('#display');
buttonsDiv = $('#buttons');
cityButtonArray = [];

init();
// Here we run our AJAX call to the OpenWeatherMap API
$('#search').on('click', getWeather)

function getWeather(e){
    // console.log($(e.target).attr('class'))
    // console.log(e.target.value);
    var city = '';

console.log(e)
    if(e == undefined){
        city =cityButtonArray[0]
    } else if(e.target.value == "search"){
        city = $("#city").val()
    } else if($(e.target).attr('class') == "city"){
        city= e.target.value
    } else {
        alert("help!");
    }
    // if(e.target.value == "search"){
    //     city = $("#city").val()
    // } else if ($(e.target).attr('class') == "city"){
    //     city= e.target.value
    // } else( city = cityButtonArray[i])
    
    var formattedCity = city.replace(" ", "+")

    // console.log(formattedCity)
    var APIKey = "166a433c57516f51dfab1f7edaed8413";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
                    formattedCity + "&appid=" + APIKey;
    
    // console.log(queryURL);

    //making the ajax call to get data from the API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function(response) {
            
            //adding to the city button array
            console.log(cityButtonArray);
            cityButtonArray.unshift(response.name);
            // console.log(cityButtonArray);
        
            // Log the resulting object
            console.log(response);

            //this is adding content to the page
            displayDiv.html('');
            temperature = Math.round((response.main.temp - 273.15) * 1.80 + 32)
            displayDiv.html('<h5 id="name">'+response.name+'</h5>');
            displayDiv.append("<p id=tempeature> Temperature: "+temperature+" \xB0F </p>");
            displayDiv.append("<p id=humidity> Humidity: "+response.main.humidity+" % </p>");
            displayDiv.append("<p id=windspeed> Wind Speed: "+response.wind.speed+" mph </p>");


            // Getting the UV index
            var lon = response.coord.lon;
            var lat = response.coord.lat;

            var UVqueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid="+
                    APIKey+"&lat=" + lat + "&lon=" + lon

            $.ajax({
                url: UVqueryURL,
                method: "GET"
            })
                .then(function(response) {
                    // console.log(response.value);
                    displayDiv.append("<p id=UVelement> UV index: </p>")
                    $('#UVelement').append("<button id=UVIndex>"+response.value+"</button>")

                    //setting the color of the UV index
                    if(response.value < 3){
                        $('#UVIndex').css("background", "green");
                    }
                    if(response.value-3 < 3){
                        $('#UVIndex').css("background", "yellow");
                    } else{
                        $('#UVIndex').css("background", "red");
                    }
                    renderButtons();
                })

        })
        //now were going to try to get forecast data
        // console.log("hit");

        ForcastQueryURL= "https://api.openweathermap.org/data/2.5/forecast/daily?q="+
            formattedCity+"&cnt=5&appid="+APIKey

        $.ajax({
            url: ForcastQueryURL,
            method: "GET"
        })
            // We store all of the retrieved data inside of an object called "response"
            .then(function(response) {

                $('.forecast').text('');
                console.log(moment().add(1,'days').format("MMM Do YY"));

                for(i=0;i<5;i++){
                    date = moment().add(1+i,'days').format("MMM Do YYYY")
                    temp = Math.round((response.list[i].temp.day -273.15) * 1.8 + 32)
                    $(".forecast").eq(i).append("<p id=date>"+date+"</p>").append("<p id=temperature> Temp: "+temp+" \xB0F </p>").append("<p id=humidity> Humidity: "+response.list[i].humidity+" % </p>");

                }
                console.log(response);
                console.log(response.list[0].temp.day)
                futureTemp = Math.round((response.list[0].temp.day - 273.15) * 1.80 + 32);
                console.log(futureTemp);
                console.log(response.list[0].humidity);
            })
        
}

function renderButtons(){

    var uniqueCityArray = new Set(cityButtonArray);

    cityButtonArray = [...uniqueCityArray];

    localStorage.setItem("Cities",JSON.stringify(cityButtonArray));

    buttonsDiv.html('');

    for(i=0; i < cityButtonArray.length; i++){

        buttonsDiv.append("<button class=city value="+cityButtonArray[i]+">"+cityButtonArray[i]+"</button>"+"<br>");
    }

    $(".city").css("margin-bottom", ".5em");
    $(".hide").css("visibility", "visible");

    $('.city').on('click', getWeather);

    console.log(JSON.parse(localStorage.getItem('Cities')));

}

function init(){
    cityButtonArray = JSON.parse(localStorage.getItem('Cities'));
    console.log(cityButtonArray);

    if( cityButtonArray == null){
        cityButtonArray = [];
    }
    console.log(cityButtonArray)

    getWeather();

}
