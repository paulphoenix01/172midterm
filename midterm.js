var repl = require('repl');
var request = require('superagent');
var __ = require('underscore');
var csv = require('fast-csv');
var fs = require('fs');
var url = "https://api.coinbase.com/v1/currencies/exchange_rates";

var orders_list = [];

// Get the json for currency unit
var currency_unit =  request.get('https://api.coinbase.com/v1/currencies')
          		.set('Accept', 'application/json')
          		.end(function(error, response){
               		currency_unit = response.body;});
	

// REPL prompt with eval = my customized PaulEval()
var replPrompt = repl.start({
	prompt: "Paul-Coinbase> ", 
	ignoreUndefined: true,
	eval: PaulEval});

// My Customized Eval() used for repl
function PaulEval(cmd, context, file, callback){
	var cmd_list = cmd.split(" ");	
	var execute = cmd_list[0].trim().toUpperCase(); // BUY || SELL || ORDER
	
	// EXECUTE based on the command. Args = command_list
	switch(execute){
	  case "BUY": BUY(cmd_list); break;
	  case "SELL": SELL(cmd_list); break;
	  case "ORDERS": ORDERS(); break;
	}

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
		  console.log(rate_btc_curr + " " + unit_btc_curr + 
		  "	<=>	" + rate_curr_btc + " " + unit_curr_btc + "\n");
			
		  // Display order to screen
		  var display = "Order to " + order + " worth of BTC queued @ "
		+ rate_btc_curr + " " + "BTC/" + currency.toUpperCase() + " ("
		+ rate_curr_btc + " BTC)\n"; 
		
		  addOrder(action, amount, currency);
		  console.log(display);
		}});
 			
	return;

}

function addOrder(action, amount, currency){
	var curr = "BTC"
	if(currency != null){ curr = currency;}

	var newOrder = {
				'timestamp': new Date(),
				'action': action.toUpperCase(),
				'amount': amount,
				'currency': curr.toUpperCase(),
				'status': 'UNFILLED'
	}
	orders_list.push(newOrder);
} 


// Find the Rate as KEY in the Json file. Return Value.
function find_rate(json, unit){
	return json[unit];
}

// Check If The Currency is Valid, and do currency exchange. 
function checkCurrencyValid(currency,action, amount){
	var isValid = false;	// default is NOT valid
	
	__.filter(currency_unit,
		 function(error, index){
		    if(currency_unit[index][1] === currency){
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
		+ currency + ". Order failed\n");
	}
	return;
};	

	


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
			+ amount + " BTC queued\n";
		addOrder(action, amount, null);
	  	console.log(display);
	  }
	  else{
	    console.log("Invalid or No Amount specified. Please try again!\n");
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
			+ amount + " BTC queued\n";
		addOrder(action, amount, null);
                console.log(display);
          }
          else{
            console.log("Invalid or No Amount specified. Please try again!\n");
          }
        }

        return;
}

// ORDERS Function
// Display Current Orders with Descending order
// Save into CVS file 
function ORDERS(args){
	var csvStream = csv.format({headers:true,quoteHeaders:true}),
	writeableStream = fs.createWriteStream("orders.csv");
	writeableStream.on("finish",function(){console.log("ORDERS list saved to orders.csv successfully!.")});
	csvStream.pipe(writeableStream);

	console.log("\n === CURRENT ORDERS === ");

	__.each(orders_list, 
		function(err, index){
		  order = orders_list[index];
		  display = order.timestamp + " : " + order.action + " " 
		+ order.amount + " " + order.currency + " : " + order.status;	 		  
		  console.log(display);

		  csvStream.write({time: order.timestamp, action: order.action, 
				amount: order.amount, 
				currency: order.currency, status: order.status})
		 })

	csvStream.end();	
	
}





