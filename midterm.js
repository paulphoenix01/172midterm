var http = require('http');
var repl = require('repl');
var request = require('request');
var __ = require('underscore');

var replPrompt = repl.start({
	prompt: "Paul-Coinbase >", 
	ignoreUndefined: true,
	eval: eval});
function eval(cmd, context, file, callback){
	var cmd_list = cmd.split(" ");
	console.log("Execute: " + cmd_list[0]);
	__.each(cmd_list, function(thecmd){
		console.log(thecmd);});	
	
	if(cmd.trim()==='BUY'){return BUY(cmd_list);}
	if(cmd.trim()==='SELL'){return SELL();}
	if(cmd.trim()==='ORDERS'){return ORDERS();}

	
	

	callback(null);
}

var current_exchange(from, to){
	var url = "https://coinbase.com/api/v1/currencies/exchange_rates";


}
var BUY = function(parameter){
	console.log("BUY function");
	
}

var SELL = function(){
	console.log("SELL function");}

var ORDERS = function(){
	console.log( "ORDERS function");}

//replPrompt.context.BUY = BUY;
//replPrompt.context.SELL = SELL;
//replPrompt.context.ORDERS = ORDERS;

