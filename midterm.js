//var http = require('http');
var repl = require('repl');
var request = require('superagent');
var __ = require('underscore');
var url = "https://api.coinbase.com/v1/currencies/exchange_rates";

// REPL prompt with eval = my customized PaulEval()
var replPrompt = repl.start({
	prompt: "Paul-Coinbase >", 
	ignoreUndefined: true,
	eval: PaulEval});

// My Customized Eval() used for repl
function PaulEval(cmd, context, file, callback){
	var cmd_list = cmd.split(" ");	
	var execute = cmd_list[0].trim().toUpperCase(); // BUY || SELL || ORDER
	
	// EXECUTE based on the command. Args = command_list
	if(execute==='BUY'){return BUY(cmd_list);}
	if(execute==='SELL'){return SELL(cmd_list);}
	if(execute==='ORDERS'){return ORDERS();}

	return;	
}

// Currency Exchange based on the Rate from the API
function currency_exchange(amount, currency, action){
	var order = action + " " + amount + " " + currency + " ";
	// Update new API Json
	request.get(url)
	  .set('Accept', 'application/json')
          .end(function(error, response){
		var xjson = response.body; // JSON file
		
		if(currency != null){ // Double check if currency != null
		  // Convert Unit
		  var unit_btc_curr = "btc_to_" + currency; 
		  var unit_curr_btc = currency + "_to_btc";
		  
		  // Rate of BTC per Currency && Currency per BTC
		  var rate_btc_curr = find_rate(xjson, unit_btc_curr);
		  var rate_curr_btc = find_rate(xjson, unit_curr_btc);
		  
		  // Display exchange Rate
		  console.log("\n***Current Exchange Rates***");
		  console.log(rate_btc_curr + " " + unit_btc_curr);
		  console.log(rate_curr_btc + " " + unit_curr_btc + "\n");
			
		  // Display order to screen
		  var display = "Order to " + order + " worth of BTC queued @ "
		+ rate_btc_curr + " " + "BTC/" + currency.toUpperCase() + " ("
		+ rate_curr_btc + " BTC)"; 
		
		  console.log(display);
		}});
 			
	return;

}

// Find the Rate as KEY in the Json file. Return Value.
var find_rate = function(json, unit){
	return json[unit];
}

// Check If The Currency is Valid, and do currency exchange. 
function checkCurrencyValid(currency,action, amount){
	var isValid = false;	// default is NOT valid
	
	request.get('https://api.coinbase.com/v1/currencies')
          .set('Accept', 'application/json')
          .end(function(error, response){
		var check_json = response.body
		__.filter(check_json,
			 function(error, index){
			   if(check_json[index][1] === currency){
			       isValid = true;
			       // Do Currency Exchange when valid is confirmed
				currency_exchange(amount, currency.toLowerCase()                                , action);

				return;
			    }			
			  }	
		);
		// If not valid, display error.
		if(isValid === false){ 
		  console.log("No known exchange rate for BTC/" 
				+ currency + ". Order failed");
		}
	});	

	return;
}

// BUY function with args = command list
// args[0] = action command = BUY ( BUY || SELL || ORDERS )
// args[1] = amount
// args[2] = currency (optional)
function BUY(args){
	var amount = args[1].trim();
	var action = args[0].trim().toUpperCase();

	if(args[2] != null){	
 	  var currency = args[2].trim().toUpperCase();
	  checkCurrencyValid(currency, action, amount);
	}
	else if(args[2] == null){
	  if(args[1] > 0){
		var display = "Order to " + action + " " 
			+ amount + " BTC queued";
	  	console.log(display);
	  }
	  else{
	    console.log("Invalid or No Amount specified. Please try again!");
	  }
	}
	
	return;		
}

// SELL function with args = command list
// args[0] = action command = SELL ( BUY || SELL || ORDERS )
// args[1] = amount
// args[2] = currency (optional)
function SELL(args){
        var amount = args[1].trim();
        var action = args[0].trim().toUpperCase();

        if(args[2] != null){ 
          var currency = args[2].trim().toUpperCase();
          checkCurrencyValid(currency, action, amount);
        }
        else if(args[2] == null){
          if(args[1] > 0){
                var display = "Order to " + action + " " 
			+ amount + " BTC queued";
                console.log(display);
          }
          else{
            console.log("Invalid or No Amount specified. Please try again!");
          }
        }

        return;
}

var ORDERS = function(){
	console.log( "ORDERS function");}





