/* Defining Global Variables and Arrays */

var carpark_dataset, carpark_lots, temperature_dataset, temp_lowreadings, 
temp_highreadings, forecast_dataset, forecast_readings, className, 
cpnumber, tempClassName, forecastClassName, forecastAreaFinder, 
cpBoxClassName;

var cpIndexArray = [], cpLots = [], cpname = [], tempAllLowReadings = [], 
tempAllHighReadings = [], areaIndexArray = [], areasForecast = [], 
forecastArea = [], cpIconClassName = [];

$(function(){ // ready function
    displayCarparkLiveData(); // uncomment this
    displayTemperatureLiveData(); // uncomment this
    // displayForecastLiveData(); // uncomment this   
});


function displayCarparkLiveData(){ // 1st Function - Carpark Lots Data
    
    $.ajax({
        url: 'https://api.data.gov.sg/v1/transport/carpark-availability',
        dataType: 'json'
    })

    .done(function(json) { /* same as ready function, when data finishes loading and do something after */
        
        console.log("Carpark Live Data is Loaded Successfully!");

        carpark_dataset = json;
        // console.log(carpark_dataset);
        
        carpark_lots = carpark_dataset.items[0].carpark_data; 
        // storing 2063 array objects
        // console.log(carpark_lots);

        displayCarpark();

    })

    .fail(function() {
        console.log("Sorry, Loading Error occurred when initializing the Carpark Live Data.");
    });
}


function displayTemperatureLiveData(){ // 2nd Function - L/H Temperature Readings Data

    $.ajax({
        /* changed to forecast API (1 day/24 hours) temporarily as 24 hour weather forecast API seems to be down */
        // url: 'https://api.data.gov.sg/v1/environment/24-hour-weather-forecast'
        url: "https://api.weatherapi.com/v1/forecast.json?key=c34b264b98084041860170457222301&q=Singapore&days=31",
        dataType: 'json'

    })

    .done(function(json) { /* same as ready function, when data finishes loading and do something after */
        
        console.log("Temperature Live Data is Loaded Successfully!");

        temperature_dataset = json;
        // console.log(temperature_dataset);

        temp_lowreadings = temperature_dataset.forecast.forecastday[0].day.mintemp_c;

        // temp_lowreadings = temperature_dataset.items[0].general.temperature.low;
        // console.log(temp_lowreadings);

        temp_highreadings = temperature_dataset.forecast.forecastday[0].day.maxtemp_c;

        // temp_highreadings = temperature_dataset.items[0].general.temperature.high;
        // console.log(temp_highreadings);

        displayTemperature();

    })

    .fail(function() {
        console.log("Sorry, Loading Error occurred when initializing the Temperature Live Data.");
    });
}


function displayForecastLiveData(){ // 3rd Function - Forecast Readings Data

    $.ajax({
        /* changed to forecast API (1 hour/6am) temporarily as 2 hour weather forecast API seems to be down */
        // url: 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast',
        url: "https://api.weatherapi.com/v1/forecast.json?key=c34b264b98084041860170457222301&q=Singapore&days=31",
        dataType: 'json'

    })

    .done(function(json) { /* same as ready function, when data finishes loading and do something after */
        
        console.log("Forecast Live Data is Loaded Successfully!");

        forecast_dataset = json;
        // console.log(forecast_dataset);

        forecast_readings = forecast_dataset.forecast.forecastday[0].hour[6].condition.text;

        // forecast_readings = forecast_dataset.items[0].forecasts;
        // console.log(forecast_readings);

        displayForecast();

    })

    .fail(function() {
        console.log("Sorry, Loading Error occurred when initializing the Forecast Live Data.");
    });
}

/* Carpark Name Finder Function */

function carparkLotsChecker(carparkname){
    for (var i=0; i<cpname.length; i++){

        for (var a=0; a<carpark_lots.length; a++) {
            
            if (carparkname[i] == carpark_lots[a].carpark_number) {

                cpIndexArray.push(a);
                // console.log(cpIndexArray + " index position"); // index pos inside

                cpLots.push(carpark_lots[cpIndexArray[i]].carpark_info[0].lots_available);
                // console.log(cpLots); // lots avail inside

            break;

            }
    
            else {
                console.log("No matching carparks found.");
            }
        }

    }

    className = document.getElementsByClassName('lots-available'); 
    /* array-like object of ALL child elements which have 
    same class name(s) -> array does not
    have style attr so need store in VARIABLE */
    // console.log(className); // 8 items

    /* Appending Carpark Lots Number to HTML */

    for (var c=0; c<cpLots.length; c++){

        // console.log(cpLots[c]);
        $(className[c]).append(cpLots[c] + " lots"); // lots

        if(cpLots[c] > 300) { // 300 carpark lots and more
            $(className[c]).addClass("lots-green");
            // console.log("More than 300 lots, carpark was found and a class is added.");
        }

        else if (cpLots[c] > 200) { // 200 to 299 carpark lots
            $(className[c]).addClass("lots-yellow");
            // console.log("200-299 lots, carpark was found and a class is added.");
        }

        else if (cpLots[c] < 199) { // 0 to 199 carpark lots
            $(className[c]).addClass("lots-red");
            // console.log("0-199 lots, carpark was found and a class is added.");
        }
        
        else {
            console.log("Sorry, number of carpark lots was not appended to the html and no class was added.");
        }

    }

}

/* Passing Carpark Names to Array in Live Data API */

function displayCarpark(){

    cpname.push("B6", "B8", "HG97", "HG55", "SK77", "SK69", "TP16", "TP17");
    cpnumber = carparkLotsChecker(cpname);
}

/* Appending Temperature Data to HTML */

function displayTemperature(){

    tempClassName = document.getElementsByClassName("temperature");
    // console.log(tempClassName); // 8 child classes inside parent

    for(var h=0; h<tempClassName.length; h++){

        tempAllLowReadings.push(temp_lowreadings); /* loop 8 times, 
        only use [h] behind if you want to loop through diff 
        index pos in api data */
        // console.log(tempAllLowReadings);
        
        tempAllHighReadings.push(temp_highreadings);
        // console.log(tempAllHighReadings);

        $(tempClassName[h]).append(tempAllLowReadings[h], "-" + tempAllHighReadings[h] + "°c");

        if (tempAllLowReadings[h]<=31 && tempAllLowReadings[h]<=34){
            $(tempClassName[h]).addClass("partly-cloudy");
            // console.log("31-34 degrees today, partly cloudy class was added.")
        }

        else if (tempAllLowReadings[h]<=28 && tempAllLowReadings[h]<=30.9){
            $(tempClassName[h]).addClass("mostly-cloudy");
            // console.log("28-30.9 degrees today, mostly cloudy class was added.")
        }

        else if (tempAllLowReadings[h]<=26 && tempAllLowReadings[h]<=27.9){
            $(tempClassName[h]).addClass("light-showers");
            // console.log("25.9-27.9 degrees today, lightly showers class was added.")
        }

        else if (tempAllLowReadings[h]<=24 && tempAllLowReadings[h]<=25.9){
            $(tempClassName[h]).addClass("thundery-showers");
            // console.log("24-25.9 degrees today, thundery showers class was added.")
        }

        else {
            console.log("Sorry, the relevant class was not added.");
        }

    }
}

/* Region Name Finder Function */

function forecastAreaChecker(areas) {

    for (var d=0; d<areas.length; d++){
        
        for (var e=0; e<forecast_readings.length; e++) {
        
            if(areas[d] == forecast_readings[e].area){
                // console.log("Found relevant matches for the areas.");

                areaIndexArray.push(e);
                // console.log(areaIndexArray); // index pos

                areasForecast.push(forecast_readings[areaIndexArray[d]].forecast);
                // console.log(areasForecast); // forecast for each area

                break;
            }

            else {
                console.log("Sorry, no available matches for the region was found.");
            }

        }
    }

    forecastClassName = document.getElementsByClassName("forecast");
    /* array of child classes under .forecast -> parent */
    // console.log(forecastClassName);

    /* Appending Forecast Data to HTML */

    for (var g=0; g<areasForecast.length; g++) {

        $(forecastClassName[g]).append(areasForecast[g]); // 8 forecast readings
        
        /* changed this temporarily as weather forecast API is down */
        // Sunny, Clear, Partly cloudy, Cloudy, Patchy rain possible
        if(areasForecast[g] == "Sunny" || areasForecast[g] == "Clear" || areasForecast[g] == "Partly cloudy"){
            $(forecastClassName[g]).addClass("partly-cloudy");
            // console.log("Partly cloudy class was added.");
        }

        else if(areasForecast[g] == "Cloudy"){
            $(forecastClassName[g]).addClass("mostly-cloudy");
            // console.log("Mostly cloudy class was added.");
        }

        else if(areasForecast[g] == "Patchy rain possible"){
            $(forecastClassName[g]).addClass("light-showers");
            // console.log("Light showers class was added.");
        }

        // if(areasForecast[g] == "Partly Cloudy (Day)" || areasForecast[g] == "Partly Cloudy (Night)"){
        //     $(forecastClassName[g]).addClass("partly-cloudy");
        //     console.log("Partly cloudy class was added.");
        // }

        // else if(areasForecast[g] == "Mostly Cloudy (Day)" || areasForecast[g] == "Mostly Cloudy (Night)" || areasForecast[g] == "Cloudy"){
        //     $(forecastClassName[g]).addClass("mostly-cloudy");
        //     console.log("Mostly cloudy class was added.");
        // }

        // else if(areasForecast[g] == "Light Rain (Day)" || areasForecast[g] == "Moderate Rain" || areasForecast[g] == "Light Showers" || areasForecast[g] == "Showers" || areasForecast[g] == "Passing Showers"){
        //     $(forecastClassName[g]).addClass("light-showers");
        //     console.log("Light showers class was added.");
        // }

        // else if(areasForecast[g] == "Heavy Rain" || areasForecast[g] == "Heavy Showers" || areasForecast[g] == "Thundery Showers" || areasForecast[g] == "Heavy Thundery Showers" || areasForecast[g] == "Heavy Thundery Showers With Gusty Winds"){
        //     $(forecastClassName[g]).addClass("thundery-showers");
        //     console.log("Thundery showers class was added.");
        // }

        else {
            console.log("Sorry, a class was not added to the current forecast reading.");
        }

    }

}

/* Passing Region Names to Array in Live Data API */

function displayForecast(){
    forecastArea.push("Bedok", "Bedok", "Hougang", "Hougang", "Sengkang", "Sengkang", "Toa Payoh", "Toa Payoh");
    // console.log(forecastArea);
    forecastAreaFinder = forecastAreaChecker(forecastArea);
}




/* Start Scene Manager Code */
$sceneMgr.setStage ('#all');


/* START HOME AND MENU SCENE - PAGE 1 */

$sceneMgr.addScene("#home", 1, "home", {
    startScene: startHome,
    endScene: endHome,
});

cpBoxClassName = document.getElementsByClassName("parent-container");

function hideContainers(){
    for (var k=0; k<=cpBoxClassName.length; k++){
        $(cpBoxClassName[k]).addClass("hide-container");
    }
}

function openNav(){ // menu bar slide out
    $(".side-nav").addClass("clickedon");
    $(".close-button").removeClass("close");
}

function closeNav(){ // close menu bar
    $(".side-nav").removeClass("clickedon");
    $(".close-button").addClass("close");
}

function startHome() {
    
    hideContainers(); // hide carpark info boxes

    $(".menu-imgbox").on("click", openNav);

    $(".home").on("click", closeNav); // link in nav bar
    $(".close-button").on("click", closeNav);

    $('.find-carpark').on('click', () => {$sceneMgr.gotoScene("selectmall")});
    $('.carpark-rules').on('click', () => {$sceneMgr.gotoScene("search")});

}

/* END HOME AND MENU SCENE - PAGE 1 */
     
function endHome() {
    $('.menu-imgbox').off('click');
    $(".close-button").removeClass("close");

    $(".side-nav").removeClass("clickedon");
    gsap.killTweensOf(startHome);
}



/* START SELECT SHOPPING MALL SCENE - PAGE 2 */

$sceneMgr.addScene("#selectmall", 2, "selectmall", {
    startScene: startSelectMall,
    endScene: endSelectMall,
});

function mallSelected(){ // when 1 shopping mall box is clicked, do this
    $(".mall-col").removeClass("col-selected");
    $(this).addClass("col-selected");
}

cpIconClassName.push(".parkingicon-11", ".parkingicon-12", ".parkingicon-8",
".parkingicon-10", ".parkingicon-5", ".parkingicon-6", ".parkingicon-2",
".parkingicon-3"); // storing ALL icon class names in 1 array

function startSelectMall() {

    $('.shoppingmall-parent').on('click', '.mall-col', mallSelected); // when child is clicked

    $('.shopping-mall-col-1').on('click', () => {$sceneMgr.gotoScene("bedoksearch")});
    $('.shopping-mall-col-2').on('click', () => {$sceneMgr.gotoScene("hougangsearch")});
    $('.shopping-mall-col-3').on('click', () => {$sceneMgr.gotoScene("seletarsearch")});
    $('.shopping-mall-col-4').on('click', () => {$sceneMgr.gotoScene("toapayohsearch")});

    $('.selectmenu-imgbox').on('click', () => {$sceneMgr.gotoScene("home")});
}

/* END SELECT SHOPPING MALL SCENE - PAGE 2 */

function endSelectMall() {
    $('.selectmenu-imgbox').off('click');
    gsap.killTweensOf(startSelectMall);
    $(".mall-col").removeClass("col-selected"); // remove selected shopping mall border around the box
}



/* START BEDOK MALL CARPARK SEARCH SCENE - PAGE 3 */

$sceneMgr.addScene("#draggablemap", 3, "bedoksearch", {
    startScene: startBedokSearch, 
    endScene: endBedokSearch,
});

function firstBoxSlideUp(){ // 1st carpark info box function + icon animation

    $(".circle-2").removeClass("circle-selected"); // remove selected circle button color
    $(".circle-1").addClass("circle-selected"); // add selected circle button color

    $(cpIconClassName[0]).addClass("icons-popup"); // icon bounce animation
    $(".1").addClass("pulse"); // icon pulsing animation

    $(cpIconClassName[1]).removeClass("icons-popup");
    $(".2").removeClass("pulse");

    $(cpBoxClassName[1]).addClass("hide-container"); // hide 2nd carpark info box
    $(cpBoxClassName[1]).removeClass("hover-me"); // remove slide in for 2nd carpark info box

    $(cpBoxClassName[0]).addClass("hover-me"); // add slide in

    $(cpBoxClassName[0]).removeClass("hide-container unhover-me hide fade-in swipe-left"); // when clicked again, remove slide out
}

function secondBoxSlideUp(){ // 2nd carpark info box function + icon animation
    $(".circle-1").removeClass("circle-selected");
    $(".circle-2").addClass("circle-selected");

    $(cpIconClassName[0]).removeClass("icons-popup");
    $(".1").removeClass("pulse");

    $(cpIconClassName[1]).addClass("icons-popup");
    $(".2").addClass("pulse");

    $(cpBoxClassName[0]).addClass("hide-container swipe-left"); // hide 1st carpark info box
    $(cpBoxClassName[0]).removeClass("hide hover-me");

    $(cpBoxClassName[1]).removeClass("hide-container unhover-me hide"); // unhide hidden 2nd carpark info box
    $(cpBoxClassName[1]).addClass("hover-me"); // 1st carpark info box to slide in when clicked
}

function openPopUp(){ // pop up box will appear when clicked on 3rd and 4th icons
    $(".allparking-icons").addClass("fade");
    $(".allpopup-cards").addClass("popup-selected");
}

function closePopUp(){ // pop up box will disappear when clicked on close(x) icon
    $(".allparking-icons").removeClass("fade");
    $(".allpopup-cards").removeClass("popup-selected");

    $(".x-button").addClass("close-popup");
}

function changeToFirst(){ // change tab view to 1st carpark info box

    $(".circle-2").removeClass("circle-selected");
    $(".circle-1").addClass("circle-selected");
    
    $(cpIconClassName[0]).addClass("icons-popup");
    $(".1").addClass("pulse");

    $(cpIconClassName[1]).removeClass("icons-popup");
    $(".2").removeClass("pulse");

    $(cpBoxClassName[0]).removeClass("swipe-left hide hide-container");
    $(cpBoxClassName[0]).addClass("fade-in");

    $(cpBoxClassName[1]).addClass("hide-container hide");
    $(cpBoxClassName[1]).removeClass("fade-in");
}

function changeToSecond(){ // change tab view to 2nd carpark info box

    $(".circle-1").removeClass("circle-selected");
    $(".circle-2").addClass("circle-selected");

    $(cpIconClassName[0]).removeClass("icons-popup");
    $(".1").removeClass("pulse");

    $(cpIconClassName[1]).addClass("icons-popup");
    $(".2").addClass("pulse");

    $(cpBoxClassName[0]).addClass("hide-container swipe-left hide");
    $(cpBoxClassName[0]).removeClass("hover-me fade-in");

    $(cpBoxClassName[1]).addClass("hide-container hover-me fade-in");
    $(cpBoxClassName[1]).removeClass("hide-container hide unhover-me");
}

function removeBedokIconAnimation(){ // remove icon animation in the current scene function
    $(".allparking-icons").removeClass("icons-popup");
    $(".1").removeClass("pulse");
    $(".2").removeClass("pulse");
}

function hammerBedok(){ // hammer code for swiping motions for current scene

    $('.parent-container').each(function(){ // class or tagname based selector
        var mc = new Hammer(this); // local variable that can be redefined many times

        mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

        mc.on("swipeleft swiperight swipeup swipedown", function(ev) {

            if (ev.type=="swipeleft"){

                $(".circle-1").removeClass("circle-selected");
                $(".circle-2").addClass("circle-selected");

                $(cpIconClassName[1]).addClass("icons-popup");
                $(".2").addClass("pulse");

                $(cpIconClassName[0]).removeClass("icons-popup");
                $(".1").removeClass("pulse");

                $(cpBoxClassName[0]).addClass("swipe-left hide");
                $(cpBoxClassName[0]).removeClass("fade-in hover-me");
                
                $(cpBoxClassName[1]).removeClass("hide-container hide");
                $(cpBoxClassName[1]).addClass("fade-in");

                console.log("Swipe left is a success!");
            }

            else if (ev.type=="swiperight"){

                $(".circle-2").removeClass("circle-selected");
                $(".circle-1").addClass("circle-selected");

                $(cpIconClassName[1]).removeClass("icons-popup");
                $(".2").removeClass("pulse");

                $(cpIconClassName[0]).addClass("icons-popup");
                $(".1").addClass("pulse");

                $(cpBoxClassName[0]).removeClass("swipe-left hide hide-container");
                $(cpBoxClassName[0]).addClass("fade-in hover-me");

                $(cpBoxClassName[1]).addClass("hide-container hide");
                $(cpBoxClassName[1]).removeClass("fade-in hover-me");

                console.log("Swipe right is a success!");
            }

            else if (ev.type=="swipedown"){

                removeBedokIconAnimation();

                $(cpBoxClassName[1]).removeClass("fade-in");

                $(cpBoxClassName[0]).removeClass("hide-container swipe-left hide hover-me fade-in");

                $(".parent-container").addClass("unhover-me hide"); // relevant carpark info box slide out when swiped down

                console.log("Swipe down is a success!");
            }

            else {
                console.log("Not able to swipe in ANY DIRECTION at all.");
            }
        });
    
    });
}

function startBedokSearch () {

    $(".parkingicon-11").on("click", firstBoxSlideUp); // 1st icon when clicked
    $(".parkingicon-12").on("click", secondBoxSlideUp); // 2nd icon when clicked

    hammerBedok(); // hammer code for current page

    $(".parkingicon-13").on("click", openPopUp); // 3rd icon when clicked
    $(".parkingicon-14").on("click", openPopUp); // 4th icon when clicked
    $(".x-button").on("click", closePopUp);  // close popup when close(x) icon is clicked

    $(".circle-1").on("click", changeToFirst); // when tab circle 1 is clicked
    $(".circle-2").on("click", changeToSecond); // when tab circle 2 is clicked

    $('.arrow-imgbox-1').on('click', () => {$sceneMgr.goPrev("selectmall")});
}

/* END BEDOK MALL CARPARK SEARCH SCENE - PAGE 3 */

function endBedokSearch () {
    $('.arrow-imgbox-1').off('click');
    gsap.killTweensOf(startBedokSearch);

    removeBedokIconAnimation(); // remove ALL icon animations when scene ends

    $(".allparking-icons").removeClass("fade");
    $(".allpopup-cards").removeClass("popup-selected");
    $(".x-button").removeClass("close-popup"); // remove class from close(x) icon

    $(".parent-container").removeClass("hover-me fade-in"); // remove slide in animation class from ALL carpark info boxes
    hideContainers(); // hide ALL carpark info boxes
}



/* START HOUGANG MALL CARPARK SEARCH SCENE - PAGE 4 */

$sceneMgr.addScene("#draggablemap-2", 4, "hougangsearch", {
    startScene: startHougangSearch, 
    endScene: endHougangSearch,
});

function thirdBoxSlideUp(){ // 3rd carpark info box function + icon animation

    $(".circle-4").removeClass("circle-selected");
    $(".circle-3").addClass("circle-selected");

    $(cpIconClassName[2]).addClass("icons-popup"); // icon bounce animation
    $(".3").addClass("pulse"); // icon bounce animation

    $(cpIconClassName[3]).removeClass("icons-popup");
    $(".4").removeClass("pulse");

    $(cpBoxClassName[2]).removeClass("hide-container unhover-me hide fade-in swipe-left"); // unhide 3rd hidden carpark info box
    $(cpBoxClassName[2]).addClass("hover-me"); // add slide in

    $(cpBoxClassName[3]).addClass("hide-container"); // hide 4th carpark info box
    $(cpBoxClassName[3]).removeClass("hover-me"); // remove slide in
}

function fourthBoxSlideUp(){ // 4th carpark info box function + icon animation

    $(".circle-3").removeClass("circle-selected");
    $(".circle-4").addClass("circle-selected");

    $(cpIconClassName[2]).removeClass("icons-popup");
    $(".3").removeClass("pulse");

    $(cpIconClassName[3]).addClass("icons-popup");
    $(".4").addClass("pulse");

    $(cpBoxClassName[2]).addClass("hide-container swipe-left"); // hide 3rd carpark info box
    $(cpBoxClassName[2]).removeClass("hover-me hide");

    $(cpBoxClassName[3]).addClass("hide-container hover-me"); // hide 4th carpark info box
    $(cpBoxClassName[3]).removeClass("hide-container unhover-me hide"); // unhide hidden 4th carpark info box
}

function openPopUp(){ // pop up box will appear when clicked on 7th and 8th icons
    $(".allparking-icons").addClass("fade"); // hide ALL icons
    $(".allpopup-cards").addClass("popup-selected"); // add popup animation
}

function closePopUp(){ // pop up box will disappear when clicked on close(x) icon
    $(".allparking-icons").removeClass("fade"); // hide ALL icons
    $(".allpopup-cards").removeClass("popup-selected"); // remove popup animation

    $(".x-button").addClass("close-popup"); // close popup box
}

function changeToThird(){ // change tab view to 3rd carpark info box
    $(".circle-4").removeClass("circle-selected");
    $(".circle-3").addClass("circle-selected");

    $(cpIconClassName[2]).addClass("icons-popup");
    $(".3").addClass("pulse");

    $(cpIconClassName[3]).removeClass("icons-popup");
    $(".4").removeClass("pulse");

    $(cpBoxClassName[2]).removeClass("swipe-left hide hide-container");
    $(cpBoxClassName[2]).addClass("fade-in");

    $(cpBoxClassName[3]).addClass("hide-container hide");
    $(cpBoxClassName[3]).removeClass("fade-in");
}

function changeToFourth(){ // change tab view to 4th carpark info box
    $(".circle-3").removeClass("circle-selected");
    $(".circle-4").addClass("circle-selected");

    $(cpIconClassName[2]).removeClass("icons-popup");
    $(".3").removeClass("pulse");

    $(cpIconClassName[3]).addClass("icons-popup");
    $(".4").addClass("pulse");

    $(cpBoxClassName[2]).addClass("swipe-left hide");
    $(cpBoxClassName[2]).removeClass("fade-in");
                    
    $(cpBoxClassName[3]).removeClass("hide-container hide");
    $(cpBoxClassName[3]).addClass("fade-in");
}

function removeHougangIconAnimation(){ // remove icon animation in the current scene function
    $(".allparking-icons").removeClass("icons-popup");
    $(".3").removeClass("pulse");
    $(".4").removeClass("pulse");
}

function hammerHougang(){ // hammer code for swiping motions for current scene

    $('.parent-container').each(function(){ // class or tagname based selector
        var mc = new Hammer(this); // local variable that can be redefined many times

        mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

        mc.on("swipeleft swiperight swipeup swipedown", function(ev) {

            if (ev.type=="swipeleft"){

                $(".circle-3").removeClass("circle-selected");
                $(".circle-4").addClass("circle-selected");

                $(cpIconClassName[3]).addClass("icons-popup");
                $(".4").addClass("pulse");

                $(cpIconClassName[2]).removeClass("icons-popup");
                $(".3").removeClass("pulse");

                $(cpBoxClassName[2]).addClass("swipe-left hide");
                $(cpBoxClassName[2]).removeClass("fade-in hover-me");

                $(cpBoxClassName[3]).removeClass("hide-container hide");
                $(cpBoxClassName[3]).addClass("fade-in");

                console.log("Swipe left is a success.");
            }

            else if (ev.type=="swiperight"){

                $(".circle-4").removeClass("circle-selected");
                $(".circle-3").addClass("circle-selected");

                $(cpIconClassName[3]).removeClass("icons-popup");
                $(".4").removeClass("pulse");

                $(cpIconClassName[2]).addClass("icons-popup");
                $(".3").addClass("pulse");

                $(cpBoxClassName[2]).removeClass("swipe-left hide hide-container");
                $(cpBoxClassName[2]).addClass("fade-in hover-me");

                $(cpBoxClassName[3]).addClass("hide-container hide");
                $(cpBoxClassName[3]).removeClass("fade-in hover-me");

                console.log("Swipe right is a success.");
            }

            else if (ev.type=="swipedown"){

                removeHougangIconAnimation();

                $(cpBoxClassName[3]).removeClass("fade-in");

                $(cpBoxClassName[2]).removeClass("hide-container swipe-left hide hover-me fade-in");

                $(".parent-container").addClass("unhover-me hide");

                console.log("Swipe down is a success.");
            }

            else {
                console.log("Not able to swipe in ANY DIRECTION at all.");
            }
        });
    
    });
}

function startHougangSearch () {

    $(".parkingicon-8").on("click", thirdBoxSlideUp); // 5th icon when clicked
    $(".parkingicon-10").on("click", fourthBoxSlideUp); // 6th icon when clicked

    hammerHougang(); // hammer code for current page

    $(".parkingicon-9").on("click", openPopUp); // 7th icon when clicked
    $(".x-button").on("click", closePopUp);  // close popup when close(x) icon is clicked

    $(".circle-3").on("click", changeToThird); // when tab circle 3 is clicked
    $(".circle-4").on("click", changeToFourth); // when tab circle 4 is clicked

    $('.arrow-imgbox-2').on('click', () => {$sceneMgr.gotoScene("selectmall")});
}

/* END HOUGANG MALL CARPARK SEARCH SCENE - PAGE 4 */

function endHougangSearch () {
    $('.arrow-imgbox-2').off('click');
    gsap.killTweensOf(startHougangSearch);

    removeHougangIconAnimation(); // remove ALL icon animations when scene ends

    $(".allparking-icons").removeClass("fade");
    $(".allpopup-cards").removeClass("popup-selected");
    $(".x-button").removeClass("close-popup"); // remove class from close(x) icon

    $(".parent-container").removeClass("hover-me fade-in"); // remove slide in animation class from ALL carpark info boxes
    hideContainers(); // hide ALL carpark info boxes
}



/* START THE SELETAR MALL CARPARK SEARCH SCENE - PAGE 5 */

$sceneMgr.addScene("#draggablemap-3", 5, "seletarsearch", {
    startScene: startSeletarSearch, 
    endScene: endSeletarSearch,
});

function fifthBoxSlideUp(){ // 5th carpark info box function + icon animation

    $(".circle-6").removeClass("circle-selected"); // remove selected circle button color
    $(".circle-5").addClass("circle-selected"); // add selected circle button color

    $(cpIconClassName[4]).addClass("icons-popup"); // icon bounce animation
    $(".5").addClass("pulse"); // icon pulsing animation

    $(cpIconClassName[5]).removeClass("icons-popup");
    $(".6").removeClass("pulse");

    $(cpBoxClassName[4]).removeClass("hide-container unhover-me hide fade-in swipe-left"); // unhide 5th hidden carpark info box
    $(cpBoxClassName[4]).addClass("hover-me"); // add slide in

    $(cpBoxClassName[5]).addClass("hide-container"); // hide 6th carpark info box
    $(cpBoxClassName[5]).removeClass("hover-me"); // remove slide in for 6th carpark info box
}

function sixthBoxSlideUp(){ // 6th carpark info box function + icon animation

    $(".circle-5").removeClass("circle-selected");
    $(".circle-6").addClass("circle-selected");

    $(cpIconClassName[4]).removeClass("icons-popup");
    $(".5").removeClass("pulse");
    
    $(cpIconClassName[5]).addClass("icons-popup");
    $(".6").addClass("pulse");

    $(cpBoxClassName[4]).addClass("hide-container swipe-left"); // hide 5th carpark info box
    $(cpBoxClassName[4]).removeClass("hover-me hide");

    $(cpBoxClassName[5]).addClass("hide-container hover-me"); // hide 6th carpark info box
    $(cpBoxClassName[5]).removeClass("hide-container unhover-me hide"); // unhide hidden 6th carpark info box
}

function openPopUp(){ // pop up box will appear when clicked on 10th icon
    $(".allparking-icons").addClass("fade"); // hide ALL icons
    $(".allpopup-cards").addClass("popup-selected"); // popup animation
}

function closePopUp(){ // pop up box will disappear when clicked on close(x) icon
    $(".allparking-icons").removeClass("fade"); // hide ALL icons
    $(".allpopup-cards").removeClass("popup-selected"); // remove popup animation

    $(".x-button").addClass("close-popup"); // close popup box
}

function changeToFifth(){ // change tab view to 5th carpark info box
    $(".circle-6").removeClass("circle-selected");
    $(".circle-5").addClass("circle-selected");

    $(cpIconClassName[4]).addClass("icons-popup");
    $(".5").addClass("pulse");

    $(cpIconClassName[5]).removeClass("icons-popup");
    $(".6").removeClass("pulse");

    $(cpBoxClassName[4]).removeClass("swipe-left hide hide-container");
    $(cpBoxClassName[4]).addClass("fade-in");

    $(cpBoxClassName[5]).addClass("hide-container hide");
    $(cpBoxClassName[5]).removeClass("fade-in");
}

function changeToSixth(){ // change tab view to 6th carpark info box
    $(".circle-5").removeClass("circle-selected");
    $(".circle-6").addClass("circle-selected");

    $(cpIconClassName[4]).removeClass("icons-popup");
    $(".5").removeClass("pulse");

    $(cpIconClassName[5]).addClass("icons-popup");
    $(".6").addClass("pulse");

    $(cpBoxClassName[4]).addClass("swipe-left hide");
    $(cpBoxClassName[4]).removeClass("fade-in");
                    
    $(cpBoxClassName[5]).removeClass("hide-container hide");
    $(cpBoxClassName[5]).addClass("fade-in");
}

function removeSeletarIconAnimation(){ // remove icon animation in the current scene function
    $(".allparking-icons").removeClass("icons-popup"); // remove icon bounce animation from ALL icons
    $(".5").removeClass("pulse"); // remove icon pulsing animation from 8th icon
    $(".6").removeClass("pulse"); // remove icon pulsing animation from 9th icon
}

function hammerSeletar(){ // hammer code for swiping motions for current scene

    $('.parent-container').each(function(){ // class or tagname based selector
        var mc = new Hammer(this); // local variable that can be redefined many times

        mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

        mc.on("swipeleft swiperight swipeup swipedown", function(ev) {

            if (ev.type=="swipeleft"){

                $(".circle-5").removeClass("circle-selected");
                $(".circle-6").addClass("circle-selected");

                $(cpIconClassName[5]).addClass("icons-popup");
                $(".6").addClass("pulse");

                $(cpIconClassName[4]).removeClass("icons-popup");
                $(".5").removeClass("pulse");

                $(cpBoxClassName[4]).addClass("swipe-left hide");
                $(cpBoxClassName[4]).removeClass("fade-in hover-me");
                                
                $(cpBoxClassName[5]).removeClass("hide-container hide");
                $(cpBoxClassName[5]).addClass("fade-in");

                console.log("Swipe left is a success.");
            }

            else if (ev.type=="swiperight"){

                $(".circle-6").removeClass("circle-selected");
                $(".circle-5").addClass("circle-selected");

                $(cpIconClassName[5]).removeClass("icons-popup");
                $(".6").removeClass("pulse");

                $(cpIconClassName[4]).addClass("icons-popup");
                $(".5").addClass("pulse");

                $(cpBoxClassName[4]).removeClass("swipe-left hide hide-container");
                $(cpBoxClassName[4]).addClass("fade-in hover-me");

                $(cpBoxClassName[5]).addClass("hide-container hide");
                $(cpBoxClassName[5]).removeClass("fade-in hover-me");

                console.log("Swipe right is a success.");
            }

            else if (ev.type=="swipedown"){

                removeSeletarIconAnimation();

                $(cpBoxClassName[5]).removeClass("fade-in");
                $(cpBoxClassName[4]).removeClass("hide-container swipe-left hide hover-me fade-in");
                
                $(".parent-container").addClass("unhover-me hide");

                console.log("Swipe down is a success.");
            }

            else {
                console.log("Not able to swipe in ANY DIRECTION at all.");
            }
        });
    
    });
}

function startSeletarSearch () {

    $(".parkingicon-5").on("click", fifthBoxSlideUp); // 8th icon when clicked
    $(".parkingicon-6").on("click", sixthBoxSlideUp); // 9th icon when clicked

    hammerSeletar(); // hammer code for current page

    $(".parkingicon-7").on("click", openPopUp); // 10th icon when clicked
    $(".x-button").on("click", closePopUp); // close popup when close(x) icon is clicked

    $(".circle-5").on("click", changeToFifth); // when tab circle 5 is clicked
    $(".circle-6").on("click", changeToSixth); // when tab circle 6 is clicked

    $('.arrow-imgbox-3').on('click', () => {$sceneMgr.gotoScene("selectmall")});
}

/* END THE SELETAR MALL CARPARK SEARCH SCENE - PAGE 5 */

function endSeletarSearch () {
    $('.arrow-imgbox-3').off('click');
    gsap.killTweensOf(startSeletarSearch);

    removeSeletarIconAnimation(); // remove ALL icon animations when scene ends

    $(".allparking-icons").removeClass("fade");
    $(".allpopup-cards").removeClass("popup-selected");
    $(".x-button").removeClass("close-popup"); // remove class from close(x) icon

    $(".parent-container").removeClass("hover-me fade-in"); // remove slide in animation class from ALL carpark info boxes
    hideContainers(); // hide ALL carpark info boxes
}



/* START TOA PAYOH MALL CARPARK SEARCH SCENE - PAGE 6 */

$sceneMgr.addScene("#draggablemap-4", 6, "toapayohsearch", {
    startScene: startToaPayohSearch, 
    endScene: endToaPayohSearch,
});

function seventhBoxSlideUp(){ // 7th carpark info box function + icon animation

    $(".circle-8").removeClass("circle-selected"); // remove selected circle button color
    $(".circle-7").addClass("circle-selected"); // add selected circle button color

    $(cpIconClassName[6]).addClass("icons-popup"); // icon bounce animation
    $(".7").addClass("pulse"); // icon pulsing animation

    $(cpIconClassName[7]).removeClass("icons-popup");
    $(".8").removeClass("pulse");

    $(cpBoxClassName[6]).removeClass("hide-container unhover-me hide fade-in swipe-left"); // unhide hidden 7th carpark info box
    $(cpBoxClassName[6]).addClass("hover-me"); // add slide in

    $(cpBoxClassName[7]).addClass("hide-container"); // hide 8th carpark info box
    $(cpBoxClassName[7]).removeClass("hover-me"); // remove slide in for 8th carpark info box
}

function eightBoxSlideUp(){ // 8th carpark info box function + icon animation

    $(".circle-7").removeClass("circle-selected");
    $(".circle-8").addClass("circle-selected");

    $(cpIconClassName[6]).removeClass("icons-popup");
    $(".7").removeClass("pulse");

    $(cpIconClassName[7]).addClass("icons-popup");
    $(".8").addClass("pulse");

    $(cpBoxClassName[6]).addClass("hide-container swipe-left"); // hide 7th carpark info box
    $(cpBoxClassName[6]).removeClass("hover-me hide");

    $(cpBoxClassName[7]).addClass("hide-container hover-me");
    $(cpBoxClassName[7]).removeClass("hide-container unhover-me hide");
}

function openPopUp(){ // pop up box will appear when clicked on 13th icon
    $(".allparking-icons").addClass("fade"); // hide ALL icons
    $(".allpopup-cards").addClass("popup-selected"); // popup animation
}

function closePopUp(){ // pop up box will disappear when clicked on close(x) icon
    $(".allparking-icons").removeClass("fade"); // hide ALL icons
    $(".allpopup-cards").removeClass("popup-selected"); // remove popup animation

    $(".x-button").addClass("close-popup"); // close popup box
}

function changeToSeventh(){ // change tab view to 7th carpark info box
    $(".circle-8").removeClass("circle-selected");
    $(".circle-7").addClass("circle-selected");

    $(cpIconClassName[6]).addClass("icons-popup");
    $(".7").addClass("pulse");

    $(cpIconClassName[7]).removeClass("icons-popup");
    $(".8").removeClass("pulse");

    $(cpBoxClassName[6]).removeClass("swipe-left hide hide-container");
    $(cpBoxClassName[6]).addClass("fade-in");

    $(cpBoxClassName[7]).addClass("hide-container hide");
    $(cpBoxClassName[7]).removeClass("fade-in");
}

function changeToEight(){ // change tab view to 8th carpark info box
    $(".circle-7").removeClass("circle-selected");
    $(".circle-8").addClass("circle-selected");

    $(cpIconClassName[6]).removeClass("icons-popup");
    $(".7").removeClass("pulse");

    $(cpIconClassName[7]).addClass("icons-popup");
    $(".8").addClass("pulse");

    $(cpBoxClassName[6]).addClass("swipe-left hide");
    $(cpBoxClassName[6]).removeClass("fade-in");
                    
    $(cpBoxClassName[7]).removeClass("hide-container hide");
    $(cpBoxClassName[7]).addClass("fade-in");
}

function removeToaPayohIconAnimation(){ // remove icon animation in the current scene function
    $(".allparking-icons").removeClass("icons-popup"); // remove icon bounce animation from ALL icons
    $(".7").removeClass("pulse"); // remove icon pulsing animation from 11th icon
    $(".8").removeClass("pulse"); // remove icon pulsing animation from 12th icon
}

function hammerToaPayoh(){ // hammer code for swiping motions for current scene

    $('.parent-container').each(function(){ // class or tagname based selector
        var mc = new Hammer(this); // local variable that can be redefined many times

        mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

        mc.on("swipeleft swiperight swipeup swipedown", function(ev) {

            if (ev.type=="swipeleft"){

                $(".circle-7").removeClass("circle-selected");
                $(".circle-8").addClass("circle-selected");

                $(cpIconClassName[7]).addClass("icons-popup");
                $(".8").addClass("pulse");

                $(cpIconClassName[6]).removeClass("icons-popup");
                $(".7").removeClass("pulse");

                $(cpBoxClassName[6]).addClass("swipe-left hide");
                $(cpBoxClassName[6]).removeClass("fade-in hover-me");
                                
                $(cpBoxClassName[7]).removeClass("hide-container hide");
                $(cpBoxClassName[7]).addClass("fade-in");

                console.log("Swipe left is a success.");
            }

            else if (ev.type=="swiperight"){

                $(".circle-8").removeClass("circle-selected");
                $(".circle-7").addClass("circle-selected");

                $(cpIconClassName[7]).removeClass("icons-popup");
                $(".8").removeClass("pulse");
 
                $(cpIconClassName[6]).addClass("icons-popup");
                $(".7").addClass("pulse");

                $(cpBoxClassName[6]).removeClass("swipe-left hide hide-container");
                $(cpBoxClassName[6]).addClass("fade-in hover-me");

                $(cpBoxClassName[7]).addClass("hide-container hide");
                $(cpBoxClassName[7]).removeClass("fade-in hover-me");

                console.log("Swipe right is a success.");
            }

            else if (ev.type=="swipedown"){

                removeToaPayohIconAnimation();

                $(cpBoxClassName[7]).removeClass("fade-in");
                $(cpBoxClassName[6]).removeClass("hide-container swipe-left hide hover-me fade-in");

                $(".parent-container").addClass("unhover-me hide");

                console.log("Swipe down is a success.");
            }

            else {
                console.log("Not able to swipe in ANY DIRECTION at all.");
            }
        });
    
    });
}

function startToaPayohSearch () {

    $(".parkingicon-2").on("click", seventhBoxSlideUp); // 11th icon when clicked
    $(".parkingicon-3").on("click", eightBoxSlideUp); // 12th icon when clicked

    hammerToaPayoh(); // hammer code for current page

    $(".parkingicon-1").on("click", openPopUp); // 13th icon when clicked
    $(".parkingicon-4").on("click", openPopUp); // 14th icon when clicked
    $(".x-button").on("click", closePopUp);  // close popup when close(x) icon is clicked

    $(".circle-7").on("click", changeToSeventh); // when tab circle 7 is clicked
    $(".circle-8").on("click", changeToEight); // when tab circle 8 is clicked

    $('.arrow-imgbox-4').on('click', () => {$sceneMgr.gotoScene("selectmall")});
}

/* END TOA PAYOH MALL CARPARK SEARCH SCENE - PAGE 6 */

function endToaPayohSearch () {
    $('.arrow-imgbox-4').off('click');
    gsap.killTweensOf(startToaPayohSearch);

    removeToaPayohIconAnimation(); // remove ALL icon animations when scene ends

    $(".allparking-icons").removeClass("fade");
    $(".allpopup-cards").removeClass("popup-selected");
    $(".x-button").removeClass("close-popup"); // remove class from close(x) icon
    
    $(".parent-container").removeClass("hover-me fade-in"); // remove slide in animation class from ALL carpark info boxes
    hideContainers(); // hide ALL carpark info boxes
}





/* SCENE MANAGER - READY FUNCTION */ // is the same as $(function(){});

$sceneMgr.ready(function () {

    $sceneMgr.start("home"); // start 1st scene, HOME
    
});