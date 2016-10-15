//var http = require('http');
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

	
	return;	

	// callback(null);
}

function current_exchange(amount, currency, action){
	console.log("Amount = " + amount);
	console.log("currentcy = " + currency);

	var result = "";
	var order = action + " " + amount + " " + currency + " ";
	// Update new API Json
	request.get(url)
	  .set('Accept', 'application/json')
          .end(function(error, response){
		var xjson = response.body;
		//console.log(xjson);
		if(currency != null){
		  var unit_btc_curr = "btc_to_" + currency; 
		  var unit_curr_btc = currency + "_to_btc";
		  var rate_btc_curr = find_rate(xjson, unit_btc_curr);
		  var rate_curr_btc = find_rate(xjson, unit_curr_btc);
		  console.log(rate_btc_curr + " " + unit_btc_curr);
		  console.log(rate_curr_btc + " " + unit_curr_btc);
			
		  var display = "Order to " + order + " worth of BTC queued @ "
		+ rate_btc_curr + " " + "BTC/" + currency.toUpperCase() + " ("
		+ rate_curr_btc + " BTC)"; 
		
		  console.log(display);
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
	  current_exchange(args[1].trim(), args[2].trim().toLowerCase(), "BUY");
 	}
	else if(args[2] == null){
	  if(args[1] > 0){
		var display = "Order to BUY " + args[1].trim() + " BTC queued";
	  	console.log(display);
	  }else{
	  	console.log("Invalid or No Amount specified. Please try again!");
	  }
	}
	
	return;		
}

var SELL = function(){
	console.log("SELL function");}

var ORDERS = function(){
	console.log( "ORDERS function");}

//replPrompt.context.BUY = BUY;
//replPrompt.context.SELL = SELL;
//replPrompt.context.ORDERS = ORDERS;

