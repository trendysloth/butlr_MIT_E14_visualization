var data = [
    {
        name: "A",
        values: [
            {date: "Angel", price: "5000000"},
            {date: "Seed", price: "15000000"},
            {date: "Pre-A", price: "30000000"},
            {date: "A", price: "60000000"},
            {date: "B", price: "120000000"},
            {date: "C", price: "1000000000"}
        ]
    },
    {
        name: "B",
        values: [
            {date: "Angel", price: "3000000"},
            {date: "Seed", price: "skipped"}, //skipped
            {date: "Pre-A", price: "18000000"},
            {date: "A", price: "200000000"},
            {date: "B", price: "500000000"},
            {date: "C", price: "2000000000"}
        ]
    },
    {
        name: "C",
        values: [
            {date: "Angel", price: "skipped"},
            {date: "Seed", price: "skipped"},
            {date: "Pre-A", price: "60000000"},
            {date: "A", price: "120000000"},
            {date: "B", price: "200000000"},
            {date: "C", price: "500000000"}
        ]
    },
    {
        name: "D",
        values: [
            {date: "Angel", price: "1000000"},
            {date: "Seed", price: "10000000"},
            {date: "Pre-A", price: "skipped"},
            {date: "A", price: "30000000"},
            {date: "B", price: "100000000"},
            {date: "C", price: "not there yet"}
        ]
    },
    {
        name: "E",
        values: [
            {date: "Angel", price: "2000000"},
            {date: "Seed", price: "skipped"},
            {date: "Pre-A", price: "36000000"},
            {date: "A", price: "not there yet"},
            {date: "B", price: "not there yet"},
            {date: "C", price: "not there yet"}
        ]
    }
];

let y_values = []
let company_names = []
data.forEach(function(d) {
    // console.log(d)
    d.values.forEach(function(datapoint) {
        if (parseInt(datapoint.price)) {
            y_values.push(parseInt(datapoint.price))
        } 
        
        // else {
        //     y_values.push(0)
        // }
        
    })
    company_names.push(d.name)
})
// console.log(y_values, d3.extent(y_values))

let company_list = []
let total_sum = 0
let sub_sums = []
let pie_chart_data = []
data.forEach(function(d) {
    // console.log(d.name)
    // y_values[d.name] = []
    sub_sum = 0
    d.values.forEach(function(value) {
        if (parseInt(value.price)) {
            sub_sum = sub_sum + parseInt(value.price)
        } 
    })
    sub_sums.push(sub_sum)
    company_list.push(d.name)
    total_sum = total_sum + sub_sum
    // y_values.push(sub_sum)
})
// console.log(y_values)
sub_sums.forEach(function(d, i) {
    // pie_chart_data.push([d, total_sum])
    let company_valuation = {age: company_list[i], population:sub_sums[i]}
    let total_valuation = {age: "total", population: total_sum}
    pie_chart_data.push([company_valuation, total_valuation])
})
// console.log(pie_chart_data)


  
// var width = 1000;
// var height = 500;
// console.log(window.innerWidth, window.innerHeight)
var margin = {top: 50, right: 50, bottom: 50, left: 100}
var width = window.innerWidth - margin.left - margin.right
var height = window.innerHeight - margin.top - margin.bottom

var radius = Math.min(width, height) / 6
var duration = 250;

var lineOpacity = "0.6";
var lineOpacityHover = "0.80";
var otherLinesOpacityHover = "0.1";
var lineStroke = "4px";
var lineStrokeHover = "6px";

var circleOpacity = '0.85';
var circleOpacityOnLineHover = "0.25"
var circleRadius = 3;
var circleRadiusHover = 10;

/* Scale */
var xScale = d3.scaleBand().domain(['Angel', 'Seed', 'Pre-A', 'A', 'B', 'C']).range([0, width]); // output
var yScale = d3.scaleLog().domain(d3.extent(y_values)).range([height, 0]);
// console.log()
var rScale = d3.scaleLog().domain(d3.extent(y_values)).range([5, 20]);
// var rScale2 = d3.scaleLinear().domain(d3.extent(y_values)).range([0, 5]);
var color = d3.scaleOrdinal(d3.schemeCategory10)

// var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);





// /* Add SVG */
var svg = d3.select("#chart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append('g')
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


/* Add line into SVG */
var line = d3.line()
.x(d => xScale(d.date))
.y(function(d) {
    // console.log(d.price, parseInt(d.price), yScale(0), yScale(d.price))
    if (d.price !== 'skipped' || d.price !== 'not there yet') {
        return yScale(d.price)
    } 
})

let lines = svg.append('g')
.attr('class', 'lines')



lines.selectAll('.line-group')
.data(data).enter()
.append('g')
// .attr("transform", "translate(" + xScale.bandwidth() / 2 + ",0)")
.attr('class', 'line-group')  

.on("mouseover", function(d, i) {
    svg.append("text")
        .attr("class", "title-text")
        .style("fill", color(i))        
        .text('[company_' + d.name + ']')
        .attr("text-anchor", "middle")
        .attr("x", (width - margin.left - margin.right)/2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
    })
.on("mouseout", function(d) {
    svg.select(".title-text").remove();
})
.append('path')
.attr('class', 'line')  

.attr('d', function(d, i) {
    // if (d)
    // console.log(d.values)
    return line(d.values.filter(item => (item.price !== 'not there yet') && (item.price !== 'skipped')))
    // return line(d.values)
})
.style('stroke', (d, i) => color(i))
.style("stroke-width", lineStroke)
.style('opacity', lineOpacity)
.on("mouseover", function(d) {
    d3.selectAll('.line')
      .style('opacity', otherLinesOpacityHover);
    d3.selectAll('.circle')
      .style('opacity', circleOpacityOnLineHover);
    d3.select(this)
        .style('opacity', lineOpacityHover)
        .style("stroke-width", lineStrokeHover)
        .style("cursor", "pointer");
    })
.on("mouseout", function(d) {
    d3.selectAll(".line")
      .style('opacity', lineOpacity);
    d3.selectAll('.circle')
      .style('opacity', circleOpacity);
    d3.select(this)
      .style("stroke-width", lineStroke)
      .style("cursor", "none");
    })
.attr("transform", "translate(" + xScale.bandwidth() / 2 + ",0)");


var e_14_total = 0
var pie_chart_data_2 = []


/* Add circles in the line */
lines.selectAll("circle-group")
.data(data, function(d, i) {
    for (let i = 0; i < d.values.length; i ++) {
        if (d.values[i].price !== 'skipped' && d.values[i].price !== 'not there yet') {
            e_14_total = e_14_total + parseInt(d.values[i].price)
        }
    }
    let curr_obj = {age: "total", population: e_14_total}

    for (let i = 0; i < d.values.length; i ++) {
        // console.log(d.values[i].date)
        if (d.values[i].price !== 'skipped' && d.values[i].price !== 'not there yet') {
            e_14_total = e_14_total + parseInt(d.values[i].price)
            pie_chart_data_2.push([{age: d.name, phrase: d.values[i].date, population: parseInt(d.values[i].price)}, curr_obj])
        }
    }
    // console.log(e_14_total, pie_chart_data_2)
})

.enter()
.append("g")
.style("fill", function(d, i) {
    // console.log('color', color(i), d)
    // return color(i)
    if (d.price !== 'skipped' || d.price !== 'not there yet') {
        // console.log(yScale(d.price))
        return color(i)
    }
})
.selectAll("circle")
.data(d => d.values)
.enter()
.append("g")
.attr("class", "circle")  
// .on("mouseover", function(d) {
//     d3.select(this)     
//         .style("cursor", "pointer")
//         .append("text")
//         .attr("class", "text")
//         // .text(d.price)
//         .attr("x", d => xScale(d.date) + 5)
//         .attr("y", function(d){
            
//             if (d.price === 'skipped' || d.price === 'not there yet') {
//                 // console.log(yScale(d.price))
//                 // return yScale(0) - 10  
//                 continue;
//             } else {
//                 // console.log('skipped', yScale(0))
//                 return yScale(d.price) - 10
//             }

//         });
//     })
// .on("mouseout", function(d) {
//     d3.select(this)
//         .style("cursor", "none")  
//         .transition()
//         .duration(duration)
//         .selectAll(".text").remove();
//     })
.append("circle")
.attr("cx", function(d, i) {
    // console.log(i, data.length, xScale(d.date))
    return xScale(d.date)
})
.attr("cy", function(d, i) {
    if (d.price !== 'skipped' || d.price !== 'not there yet') {
        return yScale(d.price)
    }
})
.attr("r", function(d, i) {
    if (d.price !== 'skipped' || d.price !== 'not there yet') {
        // console.log(yScale(d.price))
        // return 0
        return rScale(d.price)
    }
    
})
.style('opacity', circleOpacity)
.on("mouseover", function(d) {
    d3.select(this)
    .transition()
    .duration(duration)
    .attr("r", circleRadiusHover);
})
.on("mouseout", function(d) {
    d3.select(this) 
    .transition()
    .duration(duration)
    .attr("r", function(d) {
        // yScale(d.price)
        if (d.price !== 'skipped' || d.price !== 'not there yet') {
            return rScale(d.price)
        }
    });  
})
.attr("transform", "translate(" + xScale.bandwidth() / 2 + ",0)");

/* Add Axis into SVG */
var xAxis = d3.axisBottom(xScale).ticks(5);
var yAxis = d3.axisLeft(yScale).ticks(5);


svg.append("g")
.append('text')
.attr("x",(width - margin.left - margin.right)/2)
.attr("y", 0)
.text('start-up valuation growth')
.attr("text-anchor", "middle")


svg.append("g")
.attr("class", "x axis")
.attr("transform", `translate(0, ${height})`)
.call(xAxis)
.append('text')
.attr("x", width - 20)
.attr("y", 15)
// .attr("transform", "rotate(-90)")
.attr("fill", "#000")
.text("Stages");

svg.append("g")
.attr("class", "y axis")
.call(yAxis)
.append('text')
.attr("y", 15)
.attr("transform", "rotate(-90)")
.attr("fill", "#000")
.text("Valuation");

// console.log(pie_chart_data)


// var arcOver = d3.arc().outerRadius(rScale(e_14_total));
function arcOver(d) {
    return d3.arc().outerRadius(rScale(d[1].population));
}


var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.population; });

function path(d) {
    return d3.arc()
        .outerRadius(rScale(d[0].population))
        .innerRadius(0)
        // .attr("stroke", "0.5px")
} 
  

var label = d3.arc()
    .outerRadius(rScale(e_14_total) - 40)
    .innerRadius(rScale(e_14_total) - 40);


pie_chart_data_2.forEach(function(d, i) {
    console.log(d[0].age)
    var arc = svg
        .append("g")
        .attr("transform", "translate(" + parseFloat(xScale(d[0].phrase) + xScale.bandwidth() / 2) + "," + yScale(d[0].population) + ")")
        .selectAll(".arc-" + d[0].age)
        .data(pie(pie_chart_data_2[i]))
        .enter().append("g")
        .attr("class", "arc-" + d[0].age)
        .attr("opacity", circleOpacity)
        .on("mouseenter", function(d) {
            // console.log(d3.select(this))
            d3.select(this)
            //    .attr("stroke", function(d) {
            //         if ((d.data.age) !== 'total') {
            //             return color(i); 
            //         } else {
            //             return 'lightgrey'
            //         }
            //    })
               .transition()
               .duration(1000)
               .attr("d", arcOver)             
            //    .attr("stroke-width", 10);
            // d3.select(this)
            //     .transition()
            //     .attr("r", rScale(5010000000) *2);
        })
        .on("mouseleave", function(d) {
            d3.select(this)
               .transition()            
               .attr("d", arc)
               .attr("stroke","none");
        });;

        
        
    arc.append("path")
        .attr("d", path(d))
        // .attr('class', 'line')  

        .attr("fill", function(d) { 
            // console.log(color(d.data.age), d.data, i)
            // console.log(d.data.age !== 'total')
            if ((d.data.age) !== 'total') {
                // console.log(["A", "B", "C", "D", "E"].indexOf(d.data.age))
                return color(company_names.indexOf(d.data.age)); 
            } else {
                return 'lightgray'
            }
    
        })
    
    var formatComma = d3.format(","),
        formatDecimal = d3.format(".1f"), 
        formatDecimalComma = d3.format(",.2f"),
        formatSuffix = d3.format("s"),
        formatSuffixDecimal1 = d3.format(".1s"),
        formatSuffixDecimal2 = d3.format(".2s"),
        formatMoney = function(d) { return "$" + formatDecimalComma(d); },
        formatPercent = d3.format(",.2%");


    arc.append("text")
    // .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
    .attr("dx", function(d) {
        // console.log(rScale(d.data.population) * -0.5)
        return rScale(e_14_total) * 3
        
    })
    .text(function(d) { 
        // console.log(d.data.age)
        // console.log(d.data, d.data.population)
        if ((d.data.age) !== 'total') {
            // console.log(formatSuffixDecimal2(parseInt(d.data.population)))
            return formatMoney(parseInt(d.data.population))
        }
    })
    .attr("font-size", "8px")
    .attr("text-anchor", "middle")
    .attr("fill", function(d) { 
        return color(company_names.indexOf(d.data.age))
    })
    
})


