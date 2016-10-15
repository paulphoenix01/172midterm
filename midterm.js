var http = require('http');
var repl = require('repl');
var request = require('superagent');
var __ = require('underscore');
var url = "https://api.coinbase.com/v1/currencies/exchange_rates";



var replPrompt = repl.start({
	prompt: "Paul-Coinbase >", 
	ignoreUndefined: true,
	eval: eval});
function eval(cmd, context, file, callback){
	var cmd_list = cmd.split(" ");
	var execute = cmd_list[0].trim();
	console.log("Execute: " + execute);
			
	
	if(execute==='BUY'){return BUY(cmd_list);}
	if(execute==='SELL'){
		
	}
	if(execute==='ORDERS'){return ORDERS();}

	
	

	callback(null);
}

function current_exchange(amount, currency){
	console.log("Amount = " + amount);
	console.log("currentcy = " + currency);

	var result = "";
	// Update new API Json
	request.get(url)
	  .set('Accept', 'application/json')
          .end(function(error, response){
		var xjson = response.body;
		//console.log(xjson);
		if(currency != null){
		  var btc_per_curr = "btc_to_" + currency; 
		  var curr_per_btc = currency + "_to_btc";
		  var rate_btc_curr = find_rate(xjson, btc_per_curr);
		  var rate_curr_btc = find_rate(xjson, curr_per_btc);
		  console.log(rate_btc_curr + " " + btc_per_curr);
		  console.log(rate_curr_btc + " " + curr_per_btc);
		}});
 	
	return result;

}

var find_rate = function(json, unit){
	//return __.filter(json, function(data){ return data.unit;}); 
	//console.log(unit);	
	//console.log(json[unit]);
	return json[unit];
}

var BUY = function(args){
	console.log("BUY function");
	if(args[2] != null){	
	  current_exchange(args[1], args[2].trim().toLowerCase());
 	}
	
}

var SELL = function(){
	console.log("SELL function");}

var ORDERS = function(){
	console.log( "ORDERS function");}

//replPrompt.context.BUY = BUY;
//replPrompt.context.SELL = SELL;
//replPrompt.context.ORDERS = ORDERS;

