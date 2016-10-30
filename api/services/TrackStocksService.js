/**
* Created by Jack Stenglein on 10/22/16
*/


var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var TEN_DAY_MULTIPLIER = 0.1818;

module.exports = {

    getStockInfo: function(options, cb) {

		//var ticker = options.ticker;
        console.log("Getting URL");
        console.log(options.message);

        var URL = TrackStocksService.getURLForWeeklyInfo("OPK");
        var data = TrackStocksService.httpGetSync(URL);
        //console.log("Data: " + data);
        var closes = TrackStocksService.getClosesForData(data);
        console.log("Closes: " + closes);
        var ema10 = TrackStocksService.getEMA10ForCloses(closes);
        console.log("Ema 10: " + ema10);

        cb();
	},

	getURLForWeeklyInfo: function(stock) {

    console.log("Get URL For Weekly Info: " + stock);

    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

    var url = "http://chart.finance.yahoo.com/table.csv?s=" + stock + "&a=10&b=2&c=1995&d=" + month + "&e=" + day+ "&f=" + year + "&g=w&ignore=.csv";
    console.log("URL: " + url);
    return url;
	},

  getClosesForData: function(data) {

      console.log("Get closes for data.");

      var closes = [];
      var lines = data.split("\n");
      for(i in lines) {
          //console.log(lines[i]);
          var close = lines[i].split(",")[4];
          if(close !== "Close" && close !== "undefined") {
              closes.push(parseFloat(close));
          }
      }

      //console.log(closes);

      //MAY NEED TO REVERSE ORDER OF ARRAY??

      return closes.reverse();
      //TrackStocksService.getEMA10ForCloses(closes);
  },

  getEMA10ForCloses: function(closes) {

      var sum = 0;
      var SMA10 = 0;

      for(var i = 0; i<12; i++) //get SMA10 to use as starting point for EMA10
      {
          console.log("SMA10: " + SMA10);
          var num = closes[i];

          console.log("Num to add: " + num);
          if(! isNaN(num) ) {
              console.log("Add");
              sum += parseFloat(num);
              SMA10 = sum/10;
          }
      }

      var previousEMA10 = SMA10;
      var currentEMA10 = 0;
      var ema10 = [];
      ema10.push(previousEMA10);
      console.log("EMA after calculating SMA: " + ema10);

      for(var i = 11; i<closes.length; i++)
      {
          currentEMA10 = (((closes[i] - previousEMA10) * TEN_DAY_MULTIPLIER) + previousEMA10);
          ema10.push(currentEMA10);
          previousEMA10 = currentEMA10;
      }

      return ema10;
  },

  isGoldenCross: function(prevEMA10, currEMA10, prevEMA20, currEMA20) {
    if( prevEMA10 <= prevEMA20 && currEMA10 > currEMA20 )
      return true;
    else
      return false;
  },

  isDeadCross: function(prevEMA10, currEMA10, prevEMA20, currEMA20) {
    if( prevEMA10 >= prevEMA20 && currEMA10 < currEMA20)
      return true;
    else
      return false;
  },

  httpGetSync: function(URL) {

    console.log("httpGetSync");

    /*var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          console.log("Data: " + xmlHttp.responseText);
          return xmlHttp.responseText;
      }
        //TrackStocksService.getClosesForData(xmlHttp.responseText);
    }

    xmlHttp.open("GET", URL, false); // true for asynchronous
    //xmlHttp.send(null);*/

      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", URL, false ); // false for synchronous request
      xmlHttp.send( null );
      return xmlHttp.responseText;
  }

}