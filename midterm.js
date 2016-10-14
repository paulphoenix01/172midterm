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
	if(execute==='SELL'){return SELL();}
	if(execute==='ORDERS'){return ORDERS();}

	
	

	callback(null);
}

function current_exchange(amount, currency){
	console.log("Amount = " + amount);
	console.log("currentcy = " + currency);
	var unit = "btc";
	var result = "0"
	// Update new API Json
 	var xjson=request.get(url).end(function(err,res){ 
		if(err) throw err; 
		return res;});
	console.log(xjson);
//******************************
		if(currency!=null){
		unit = currency.trim().toLowerCase() + "_to_btc";
		console.log("Unit=" + unit);
		result = find_rate(xjson,unit);
	}
 
	return result;

}

//var find_rate = function(json_file, unit){
//	return __.filter(json_file, function(data){ return data.unit;}); 
// }

var BUY = function(parameter){
	console.log("BUY function");
	current_exchange(parameter[1], parameter[2]);	
}

var SELL = function(){
	console.log("SELL function");}

var ORDERS = function(){
	console.log( "ORDERS function");}

//replPrompt.context.BUY = BUY;
//replPrompt.context.SELL = SELL;
//replPrompt.context.ORDERS = ORDERS;

