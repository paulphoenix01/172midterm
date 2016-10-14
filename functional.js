var monday = [

        {

            'name'     : 'Write a tutorial',

            'duration' : 180

        },

        {

            'name'     : 'Some web development',

            'duration' : 120

        }

    ];

 

var tuesday = [

        {

            'name'     : 'Keep writing that tutorial',

            'duration' : 240

        },

        {

            'name'     : 'Some more web development',

            'duration' : 180

        },

        {

            'name'     : 'A whole lot of nothing',

            'duration'  : 240

        }

    ];

     

var tasks = [monday, tuesday];

// Code start here
var __ = require('underscore');

//reduce into array of task
var reduced = __.reduce(tasks, function(acc, current){ return acc.concat(current)});

// Change duration into minute with map
var duration = __.map(reduced, function(task){ return task.duration / 60;});

// Filter hour that >= 1
var filter  = __.filter(duration, function(hour){return hour >= 1});

// Sum Up everything with reduce.
var sumup = __.reduce(filter, function(acc,current){ return [(+acc)+(+current)]});

// Find the $ with map
var billing = __.map(sumup, function(sum){ return sum * 20;});

// Format the billing $$$ with map
var formatted_result = __.map(billing, function(money){ return '$' + money.toFixed(2);});

// Get the result as a string, not an array with reduce.
var finalresult = __.reduce(formatted_result, function(result){ return result});

console.log(finalresult);

