var data = []
var flatten_data = []
var e14_participation_data = []
var flatten_e14_data = []

var accum_e14 = []

var formatComma = d3.format(","),
    formatDecimal = d3.format(".1f"), 
    formatDecimalComma = d3.format(",.2f"),
    formatSuffix = d3.format("s"),
    formatSuffixDecimal1 = d3.format(".1s"),
    formatSuffixDecimal2 = d3.format(".2s"),
    formatMoney = function(d) { return "$" + formatDecimalComma(d); },
    formatPercent = d3.format(",.2%");


d3.csv("js/e14participation.csv", function(datapoints) {
    // console.log(datapoints)
    datapoints.forEach(function(d) {
        var current = {
            name: d.Valuation,
            values: [
                { date: "Angel", price: d.Angel },
                { date: "SEED", price: d["SEED"] },
                { date: "PRE A", price: d["PRE A"] },
                { date: "B", price: d.B },
                { date: "C", price: d.C },
            ]
        }
        var e14_current = {
            name: d.Valuation,
            values: [
                { date: "Angel", price: d["Angel(e14)"] },
                { date: "SEED", price: d["SEED(e14)"] },
                { date: "PRE A", price: d["PRE A(e14)"] },
                { date: "B", price: d["B(e14)"] },
                { date: "C", price: d["C(e14)"] },
            ]
        }

        accum_e14.push(
            { name: d.Valuation, date: "Angel", price: parseInt(d["Angel(e14)"]) },
            { name: d.Valuation, date: "SEED", price: parseInt(d["Angel(e14)"]) + parseInt(d["SEED(e14)"]) },
            { name: d.Valuation, date: "PRE A", price: parseInt(d["Angel(e14)"]) + parseInt(d["SEED(e14)"]) + parseInt(d["PRE A(e14)"]) },
            { name: d.Valuation, date: "B", price: parseInt(d["Angel(e14)"]) + parseInt(d["SEED(e14)"]) + parseInt(d["PRE A(e14)"]) + parseInt(d["B(e14)"]) },
            { name: d.Valuation, date: "C", price: parseInt(d["Angel(e14)"]) + parseInt(d["SEED(e14)"]) + parseInt(d["PRE A(e14)"]) +parseInt( d["B(e14)"]) + parseInt(d["C(e14)"]) },
        )

        flatten_data.push(
            { name: d.Valuation, date: "Angel", price: d.Angel },
            { name: d.Valuation, date: "SEED", price: d["SEED"] },
            { name: d.Valuation, date: "PRE A", price: d["PRE A"] },
            { name: d.Valuation, date: "B", price: d.B },
            { name: d.Valuation, date: "C", price: d.C },
        )
        flatten_e14_data.push(
            { name: d.Valuation, date: "Angel", price: d["Angel(e14)"] },
            { name: d.Valuation, date: "SEED", price: d["SEED(e14)"] },
            { name: d.Valuation, date: "PRE A", price: d["PRE A(e14)"] },
            { name: d.Valuation, date: "B", price: d["B(e14)"] },
            { name: d.Valuation, date: "C", price: d["C(e14)"] }
        )
        data.push(current);
        e14_participation_data.push(e14_current);
    })

    let r_values = []
    let y_values = []
    let company_names = []
    data.forEach(function(d) {
        d.values.forEach(function(datapoint) {
            if (parseInt(datapoint.price)) {
                y_values.push(parseInt(datapoint.price))
            } 
        })
        company_names.push(d.name)
    })

    flatten_e14_data.forEach(function(d) {
        if (parseInt(d.price)){
            r_values.push(parseInt(d.price))
        } else {
            r_values.push(0.000001)
        }
    })
    console.log(e14_participation_data)

    let company_list = []
    let total_sum = 0
    let sub_sums = []
    let pie_chart_data = []

    let accum_sum = []
    data.forEach(function(d) {
        sub_sum = 0
        d.values.forEach(function(value) {
            if (parseInt(value.price)) {
                sub_sum = sub_sum + parseInt(value.price)
            } 
        })
        sub_sums.push(sub_sum)
        company_list.push(d.name)
        total_sum = total_sum + sub_sum
    })
    sub_sums.forEach(function(d, i) {
        let company_valuation = {age: company_list[i], population:sub_sums[i]}
        let total_valuation = {age: "total", population: total_sum}
        pie_chart_data.push([company_valuation, total_valuation])
    })

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
    var circleRadiusHover = 25;


    console.log(d3.extent(r_values))
    /* Scale */
    var xScale = d3.scaleBand().domain(['Angel', 'SEED', 'PRE A', 'A', 'B', 'C']).range([0, width]); // output
    var yScale = d3.scaleLog().domain(d3.extent(y_values)).range([height, 0]);
    var rScale = d3.scaleLinear().domain(d3.extent(r_values)).range([10, 25]);
    var color = d3.scaleOrdinal(d3.schemeCategory10)

    // /* Add SVG */
    var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /* Add line into SVG */
    var line = d3.line()
    .x(function(d) {
        return xScale(d.date)
    })
    .y(function(d) {
        if (d.price !== '0' && d.price !== 'NOT THERE YET') {
            return yScale(d.price)
        } 
    })

    let lines = svg.append('g')
    .attr('class', 'lines')

    lines.selectAll('.line-group')
    .data(data).enter()
    .append('g')
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
        return line(d.values.filter(item => (item.price !== 'NOT THERE YET') && 
                                   (item.price !== "0") && (item.price !== '')))
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
    // svg.selectAll("circle")
    // .data(data, function(d, i) {
    //     for (let i = 0; i < d.values.length; i ++) {
    //         if (d.values[i].price !== '0' && d.values[i].price !== 'NOT THERE YET') {
    //             e_14_total = e_14_total + parseInt(d.values[i].price)
    //         }
    //     }
    //     let curr_obj = {age: "total", population: e_14_total}

    //     for (let i = 0; i < d.values.length; i ++) {
    //         // console.log(d.values[i].date)
    //         if (d.values[i].price !== '0' && d.values[i].price !== 'NOT THERE YET') {
    //             e_14_total = e_14_total + parseInt(d.values[i].price)
    //             pie_chart_data_2.push([{age: d.name, phrase: d.values[i].date, population: parseInt(d.values[i].price)}, curr_obj])
    //         }
    //     }
    // })
    // .enter()
    // .append("g")
    // .style("fill", function(d, i) {
    //     if (d.price !== '0' && d.price !== 'NOT THERE YET') {
    //         return color(i)
    //     }
    // })
    // .selectAll("circle")
    // .data(d => d.values)
    // .enter()
    // .append("g")
    // .attr("class", "circle")  
    // .append("circle")
    // .attr("cx", function(d, i) {
    //     console.log(d)
    //     return xScale(d.date)
    // })
    // .attr("cy", function(d, i) {
    //     if (d.price !== '' && d.price !== '0' && d.price !== 'NOT THERE YET') {
    //         return yScale(d.price)
    //     }
    // })
    // .attr("r", function(d, i) {
    //     console.log(d)
    //     // if (d.price !== '' && d.price !== '0' && d.price !== 'NOT THERE YET') {
    //     //     if (flatten_e14_data[i].price !== '0' && flatten_e14_data[i].price !== 'NOT THERE YET') {
    //     //         return rScale(parseInt(flatten_e14_data[i].price))
    //     //     } 
    //     //     if (flatten_e14_data[i].price === '0') {
    //     //         return rScale(parseInt(0.000001))
    //     //     }
    //     // }
    // })
    // .style('opacity', circleOpacity)
    // .on("mouseover", function(d) {
    //     d3.select(this)
    //     .transition()
    //     .duration(duration)
    //     .attr("r", circleRadiusHover);
    // })
    // .on("mouseout", function(d) {
    //     d3.select(this) 
    //     .transition()
    //     .duration(duration)
    //     .attr("r", function(d, i) {
    //         // yScale(d.price)
    //         if (d.price !== '' && d.price !== '0' && d.price !== 'NOT THERE YET') {
    //             if (flatten_e14_data[i].price !== '0' && flatten_e14_data[i].price !== 'NOT THERE YET') {
    //                 return rScale(parseInt(flatten_e14_data[i].price))
    //             } else {
    //                 return rScale(parseInt(0.000001))
    //             }
                
    //         }
    //     });  
    // })
    // .attr("transform", "translate(" + xScale.bandwidth() / 2 + ",0)")
    
    // console.log(flatten_data)
    svg.selectAll("circle")
    .data(flatten_data)
    .enter()
    .append("g")
    .attr("class", "circle")  
    .append("circle")
    .attr("cx", function(d, i) {
        console.log(d)
        return xScale(d.date)
    })
    .attr("cy", function(d, i) {
        if (d.price !== '' && d.price !== '0' && d.price !== 'NOT THERE YET') {
            return yScale(d.price)
        }
    })
    .attr("r", function(d, i) {
        console.log(d, flatten_e14_data[i])
        if (d.price !== '' && d.price !== '0' && d.price !== 'NOT THERE YET') {
            if (flatten_e14_data[i].price !== '0' && flatten_e14_data[i].price !== 'NOT THERE YET') {
                return rScale(parseInt(flatten_e14_data[i].price))
            } 
            if (flatten_e14_data[i].price === '0') {
                return rScale(parseInt(0.000001))
            }
        }
    })
    .attr("transform", "translate(" + xScale.bandwidth() / 2 + ",0)")
    


    
    svg.selectAll("text")
    .data(flatten_data)
    .enter()
    .append("text")
    .text(function(d, i) {
        // console.log(accum_e14, flatten_data)
        if (d.price !== '' &&  d.price !== '0' && d.price !== 'NOT THERE YET') {
            let tmp = parseInt(accum_e14[i].price) / parseInt(d.price)

            if (tmp > 1) {
                tmp = 1
            }
            // console.log(tmp, parseInt(d.price))
            // return formatMoney(d.price).toString() + " [" + (d.price / total_sum * 100).toFixed(2).toString() + "%]"
            return formatSuffixDecimal2(d.price).toString() + " [" + (tmp * 100).toFixed(2).toString() + "%]"
        }
    })
    .attr("x", function(d) {
        if (d.price !== '' && d.price !== '0' && d.price !== 'NOT THERE YET') {
            return xScale(d.date)
        }
    })
    .attr("y", function(d) {
        if (d.price !== '' && d.price !== '0' && d.price !== 'NOT THERE YET') {
            return yScale(parseInt(d.price))
        }
    })
    .attr("font_family", "sans-serif")  // Font type
    .attr("font-size", "11px")  // Font size
    .attr("fill", function(d) { 
        return color(company_names.indexOf(d.name))
    })
    .attr("transform", "translate(" + xScale.bandwidth() * 0.75 + "," + "0)");


    var e14 = svg.selectAll('#e14')
    .data(flatten_data)
    .enter() 
    // .attr("class", "e14")
    .append("text")
    .text(function(d, i) {
        if (d.price !== '' &&  d.price !== '0' && d.price !== 'NOT THERE YET') {
            if (flatten_e14_data[i].price !== '0') {
                return formatSuffixDecimal2(flatten_e14_data[i].price)
            }
        }
    })
    .attr("x", function(d) {
        if (d.price !== '' && d.price !== '0' && d.price !== 'NOT THERE YET') {
            return xScale(d.date)
        }
    })
    .attr("y", function(d) {
        if (d.price !== '' && d.price !== '0' && d.price !== 'NOT THERE YET') {
            return yScale(parseInt(d.price))
        }
    })
    .attr("font_family", "sans-serif")  // Font type
    .attr("font-size", "11px")  // Font size
    .attr("fill", function(d) { 
        return 'black'
    })
    .attr("transform", function(d) {
        return "translate(" + xScale.bandwidth() * 0.6 + "," + "0)"
        // if (d.price === '0') {
        //     let tmp = xScale.bandwidth() * 0.5 - rScale(0.000001) * 0.5
        //     return "translate(" + tmp + "," + "0)"
        // } 
        // if (d.price !== 'NOT THERE YET' && d.price !== '0') {
        //     let tmp = xScale.bandwidth() * 0.5 - rScale(d.price) * 0.5
        //     return "translate(" +tmp + "," + "0)"
        // }
    });

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
})