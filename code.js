//Temperature is measured in Fahrenheit
//Light is measured in a scale from 0-1023, with 0 = no light and 1023 = 1500 lux
//Water timer is an hours, minutes, and seconds timer

//Begins at start screen
setScreen("Start_Screen");

//Buttons that change screen
onEvent("Start_Button", "click", function() {
  setScreen("Temperature_Screen");
  minimum_temp_input();
  maximum_temp_input();
});
onEvent("Temp_Next", "click", function() {
  setScreen("Light_Screen");
  minimum_light_input();
  maximum_light_input();
});
onEvent("Light_Next", "click", function() {
  setScreen("Watering_Timer_Screen");
});
onEvent("Watering_Timer_Next", "click", function() {
  setScreen("Main_Screen");
  colorLeds[0].on();
  colorLeds[1].on();
  colorLeds[2].on();
  temperature_update();
  light_update();
  clock();
});
onEvent("Temp_Back", "click", function() {
  setScreen("Start_Screen");
});
onEvent("Light_Back", "click", function() {
  setScreen("Temperature_Screen");
});
onEvent("Watering_Timer_Back", "click", function() {
  setScreen("Light_Screen");
});
onEvent("Reset_Button", "click", function() {
  setScreen("Start_Screen");
  setText("Min_Temp_Input", "");
  setText("Max_Temp_Input", "");
  setText("Min_Light_Input", "");
  setText("Max_Light_Input", "");
  setText("Watering_Timer_Input", "");
  temperature_log = [];
  light_log = [];
  setText("Temp_Log_List", "List Of Extreme Temperature Levels Will Be Displayed Here");
  setText("Light_Log_List", "List Of Extreme Light Levels Will Be Displayed Here");
});
onEvent("Log_Button", "click", function() {
  setScreen("Log_Select_Screen");
});
onEvent("Temp_Log_Button", "click", function() {
  setScreen("Temp_Log_Screen");
});
onEvent("Light_Log_Button", "click", function() {
  setScreen("Light_Log_Screen");
});
onEvent("Back_To_Main", "click", function() {
  setScreen("Main_Screen");
});
onEvent("Temp_Log_Back", "click", function() {
  setScreen("Log_Select_Screen");
});
onEvent("Light_Log_Back", "click", function() {
  setScreen("Log_Select_Screen");
});


//Getting Text From Temperature Inputs
var min_temp;
function minimum_temp_input() {
  onEvent("Min_Temp_Input", "change", function(){
     min_temp = Number(getText("Min_Temp_Input"));
  });
}
var max_temp;
function maximum_temp_input() {
  onEvent("Max_Temp_Input", "change", function(){
     max_temp = Number(getText("Max_Temp_Input"));
  });
}
var current_temperature;
var temperature_log = [];
var warning_temp = false; 
var start; 
var elapsed; 
var logCount = 0; 

//Temperature Log Timer
function warning_temp_log() {
  elapsed = new Date().getTime() - start;
  
 if(warning_temp){ 
    if (logCount == 0){ 
      temperature_log.push(String(current_temperature));
      setText("Temp_Log_List", temperature_log[temperature_log.length - 1]);
      warning_temp = false;
    }
    else if (logCount > 0 && elapsed < 90) {
      temperature_log.push(String(current_temperature));
      setText("Temp_Log_List", temperature_log[temperature_log.length - 1]);
      warning_temp = false;
    }  
     else if (logCount > 0 && elapsed > 90) {
      start = new Date().getTime();
      logCount = 0;
    }
    else {
      warning_temp = false;
    }
  }
}

//Temperature Value (Update, determine LED color, image, and add to log)
function temperature_update() {
  timedLoop(50, function() {
    current_temperature = tempSensor.F;
    setProperty("Temperature_Level", "text", current_temperature + " °F");
  });
  start = new Date().getTime();
  console.log(start);
  timedLoop(50, function() {
    if (Number(current_temperature) > max_temp){
      colorLeds[0].color("red");
      buzzer.frequency(250, 100);
      setProperty("Temp_Image", "image", "assets/Extreme-Temp-Img.png");
      warning_temp = true;
      logCount++;
      warning_temp_log();
    } else if (Number(current_temperature) < min_temp){
      colorLeds[0].color("red");
      buzzer.frequency(250, 100);
      setProperty("Temp_Image", "image", "assets/low-temp-img.png");
      warning_temp = true;
      logCount++;
      warning_temp_log();
    } else{
      colorLeds[0].color("green");
      setProperty("Temp_Image", "image","assets/Optimimum-Temp-IMG.png");
      }
  });
}

//Getting Text From Light Inputs
var min_light;
function minimum_light_input() {
  onEvent("Min_Light_Input", "change", function(){
     min_light = Number(getText("Min_Light_Input"));
  });
}
var max_light;
function maximum_light_input() {
  onEvent("Max_Light_Input", "change", function(){
     max_light = Number(getText("Max_Light_Input"));
  });
}

var current_light;
var light_log = [];
var warning_light = false; 
var start_2; 
var elapsed_2; 
var logCount_2 = 0; 

//Light Log Timer
function warning_light_log() {
  elapsed_2 = new Date().getTime() - start_2;
  
  
 if(warning_light){ 
    if (logCount_2 == 0){ 
      light_log.push(String(current_light));
      setText("Light_Log_List", light_log[light_log.length - 1]);
      warning_light = false;
    }
    else if (logCount_2 > 0 && elapsed_2 < 90) {
      light_log.push(String(current_light));
      setText("Light_Log_List", light_log[light_log.length - 1]);
      warning_light = false;
    }  
     else if (logCount_2 > 0 && elapsed_2 > 90) {
      start_2 = new Date().getTime();
      logCount_2 = 0;
    }
    else {
      warning_light = false;
    }
  }
}

//Light Value (Update, determine LED color, image, and add to log)
function light_update() {
  timedLoop(50, function() {
    current_light = lightSensor.value;
    setProperty("Light_Level", "text", current_light);
  });
  start_2 = new Date().getTime();
  timedLoop(50, function() {
    if (Number(current_light) > max_light){
      colorLeds[1].color("red");
      buzzer.frequency(250, 100);
      setProperty("Light_Image", "image", "assets/EXTREME-LIGHT.png");
      warning_light = true;
      logCount_2++;
      warning_light_log();
      console.log("reached");
    } else if (Number(current_light) < min_light){
      colorLeds[1].color("red");
      buzzer.frequency(250, 100);
      setProperty("Light_Image", "image", "assets/LOW-LIGHT.png");
      warning_light = true;
      logCount_2++;
      warning_light_log();
    } else{
      colorLeds[1].color("green");
      setProperty("Light_Image", "image", "assets/OPTIMUM-LIGHT.png");
    }
  });
}

//Watering Timer (Update and determine LED color)
var myTimer;
function clock() {
  
    myTimer = setInterval(myClock, 1000); 
    
    var clockInput = getProperty("Watering_Timer_Input", "value"); 
    var c = clockInput * 3600; //converting the number to a value that's interpretted as hours
    var clockTime =c.toString();

    function myClock() {
       setProperty("Watering_Status", "text", clockTime.toHHMMSS());
        --c;
        if (c < 0) {
            clearInterval(myTimer);
            colorLeds[2].color("red");
            buzzer.frequency(250, 100);
            setProperty("Watering_Image", "image", "assets/empty-water.png");
            stopTimedLoop();
        }
        else{
          clockTime =c.toString();
          colorLeds[2].color("green");
        }
    }
    var water_image_threshold = c / 2;
    function water_image() {
      timedLoop(1000, function(){
        if (c > water_image_threshold){
         setProperty("Watering_Image", "image", "assets/Full-water.png");
      } else if (c <= water_image_threshold && c > 0){
        setProperty("Watering_Image", "image", "assets/half-water.png");
      } else {
        setProperty("Watering_Image", "image", "assets/empty-water.png");
      }
      });
    }
    onEvent("Reset_Button", "click", function() {
      c = 0;
    });
    water_image();
    String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
    };
    onBoardEvent(buttonL, "down", function() {
      if (c <= 0) {
        clock();
        colorLeds[2].color("green");
        temperature_update();
        light_update();
      }
    });
}