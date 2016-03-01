var five = require("../lib/johnny-five");
var Edison = require("edison-io");
var board = new five.Board({
  io: new Edison()
});

board.on("ready", function() {

  // Plug the Temperature & Humidity sensor
  // module into the Grove Shield's I2C jack
  var multi = new five.Multi({
    controller: "TH02"
  });

  // Plug the LCD module into any of the
  // Grove Shield's I2C jacks.
  var lcd = new five.LCD({
    controller: "JHD1313M1"
  });

  var f, r, g, b = 0;

  multi.on("change", function() {
    console.log("temperature");
    console.log("  celsius           : ", this.temperature.celsius);
    console.log("  fahrenheit        : ", this.temperature.fahrenheit);
    console.log("  kelvin            : ", this.temperature.kelvin);
    console.log("--------------------------------------");

    console.log("Hygrometer");
    console.log("  relative humidity : ", this.hygrometer.relativeHumidity);
    console.log("--------------------------------------");
    
    // Use a simple linear function to determine
    // the RGB color to paint the LCD screen.
    // The LCD's background will change color
    // according to the temperature.
    // Hot -> Moderate -> Cold
    // 122°F ->  77°F  -> 32°F
    // 50°C  ->  25°C  -> 0°C
    // Red ->  Violet  -> Blue
    r = linear(0x00, 0xFF, f, 122);
    g = linear(0x00, 0x00, f, 122);
    b = linear(0xFF, 0x00, f, 122);
        
    // Paint the LCD and print the temperture
    // (rounded up to the nearest whole integer)
    lcd.bgColor(r, g, b).cursor(0, 0).print('Fahrenheit: ' + Math.ceil(f));
  });
});

// [Linear Interpolation](https://en.wikipedia.org/wiki/Linear_interpolation)
function linear(start, end, step, steps) {
  return (end - start) * step / steps + start;
}

// @markdown
// For this program, you'll need:
//
// ![Grove Base Shield v2](http://www.seeedstudio.com/depot/images/product/base%20shield%20V2_01.jpg)
//
// ![Grove - LCD RGB w/ Backlight](http://www.seeedstudio.com/wiki/images/0/03/Serial_LEC_RGB_Backlight_Lcd.jpg)
//
// ![Grove - Temperature & Humidity Sensor (High-Accuracy & Mini)](http://www.seeedstudio.com/wiki/Grove_-_Tempture%26Humidity_Sensor_(High-Accuracy_%26Mini)_v1.0)
//
//
// @markdown