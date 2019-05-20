var data = []
var flatten_data = []
var flatten_e14_data = []
let r_values = []
let y_values = []
let company_names = []


var formatSuffixDecimal1 = d3.format(".1s"),
    formatSuffixDecimal2 = d3.format(".2s")
    formatPercent = d3.format(",.2%");

d3.csv("js/e14participation.csv", function(datapoints) {
    datapoints.forEach(function(d) {
        var current = {
            name: d.Valuation,
            values: [
                { stage: "Angel", evaluation: d.Angel },
                { stage: "SEED", evaluation: d["SEED"] },
                { stage: "PRE A", evaluation: d["PRE A"] },
                { stage: "B", evaluation: d.B },
                { stage: "C", evaluation: d.C },
            ]
        }
        flatten_data.push(
            { name: d.Valuation, stage: "Angel", evaluation: d.Angel },
            { name: d.Valuation, stage: "SEED", evaluation: d["SEED"] },
            { name: d.Valuation, stage: "PRE A", evaluation: d["PRE A"] },
            { name: d.Valuation, stage: "B", evaluation: d.B },
            { name: d.Valuation, stage: "C", evaluation: d.C },
        )
        flatten_e14_data.push(
            { name: d.Valuation, stage: "Angel", evaluation: d["Angel(e14)"] },
            { name: d.Valuation, stage: "SEED", evaluation: d["SEED(e14)"] },
            { name: d.Valuation, stage: "PRE A", evaluation: d["PRE A(e14)"] },
            { name: d.Valuation, stage: "B", evaluation: d["B(e14)"] },
            { name: d.Valuation, stage: "C", evaluation: d["C(e14)"] }
        )
        data.push(current);

        if (!company_names.includes(d.Valuation)) {
            company_names.push(d.Valuation)
        }
    })

    flatten_data.forEach(function(d) {
        if (parseInt(d.evaluation)) {
            y_values.push(parseInt(d.evaluation))
        }
    })
    flatten_e14_data.forEach(function(d) {
        if (parseInt(d.evaluation)){
            r_values.push(parseInt(d.evaluation))
        } else {
            r_values.push(0)
        }
    })

    var margin = {top: 50, right: 50, bottom: 50, left: 100}
    var width = window.innerWidth - margin.left - margin.right
    var height = window.innerHeight - margin.top - margin.bottom

    var lineOpacity = "1.0";
    var lineOpacityHover = "1.0";
    var otherLinesOpacityHover = "1.0";
    var lineStroke = "4px";
    var lineStrokeHover = "6px";
    var circleOpacity = '1.0';
    var circleOpacityOnLineHover = "1.0"

    /* Scale */
    var xScale = d3.scaleBand().domain(['Angel', 'SEED', 'PRE A', 'A', 'B', 'C']).range([0, width]); 
    var yScale = d3.scaleLog().domain(d3.extent(y_values)).range([height, 0]);
    var rScale = d3.scaleLinear().domain(d3.extent(r_values)).range([10, 25]);
    var color = d3.scaleOrdinal(d3.schemeCategory10).domain(company_names)

    /* Add SVG */
    var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /* Add line into SVG */
    var line = d3.line().x(function(d) { return xScale(d.stage) })
                        .y(function(d) {
                            if (d.evaluation !== '0' && d.evaluation !== 'NOT THERE YET') {
                                return yScale(d.evaluation)
                            } 
                        })

    let lines = svg.append('g').attr('class', 'lines')
    lines.selectAll('.line-group')
    .data(data).enter()
    .append('g')
    .attr('class', 'line-group')  
    .on("mouseover", function(d, i) {
        svg.append("text")
            .attr("class", "title-text")
            .style("fill", color(d.name))        
            .text('company_' + d.name)
            .attr("text-anchor", "middle")
            .attr("x", (width - margin.left - margin.right)/2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
        })
    .on("mouseout", () => svg.select(".title-text").remove())
    .append('path')
    .attr('class', 'line')  
    .attr('d', function(d) {
        return line(d.values.filter(item => (item.evaluation !== 'NOT THERE YET') && 
                                   (item.evaluation !== "0") && (item.evaluation !== '')))
    })
    .style('stroke', (d) => color(d.name))
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

    /* Add Circles into SVG */
    svg.selectAll("circle")
    .data(flatten_data)
    .enter()
    .append("g")
    .attr("class", "circle")  
    .append("circle")
    .attr("cx", function(d, i) {
        return xScale(d.stage)
    })
    .attr("cy", function(d, i) {
        if (d.evaluation !== '' && d.evaluation !== '0' && d.evaluation !== 'NOT THERE YET') {
            return yScale(d.evaluation)
        }
    })
    .attr("r", function(d, i) {
        if (d.evaluation !== '' && d.evaluation !== '0' && d.evaluation !== 'NOT THERE YET') {
            if (flatten_e14_data[i].evaluation !== 'NOT THERE YET') {
                return rScale(parseInt(flatten_e14_data[i].evaluation))
            } 
        }
    })
    .attr("transform", "translate(" + xScale.bandwidth() / 2 + ",0)")
    .style("fill", function(d, i) {
        return (color(d.name))
    })
    
    /* Add text next to circles */
    svg.selectAll("text")
    .data(flatten_data)
    .enter()
    .append("text")
    .text(function(d, i) {
        if (d.evaluation !== '' &&  d.evaluation !== '0' && d.evaluation !== 'NOT THERE YET') {
            let tmp = parseInt(flatten_e14_data[i].evaluation) / parseInt(d.evaluation)
            if (parseInt(d.evaluation) >= 1000000000) {
                return (d.evaluation / 1000000000) + '000M' + " [" + formatPercent(tmp) + "]"
            }
            return formatSuffixDecimal2(d.evaluation) + " [" + formatPercent(tmp) + "]"
        }
    })
    .attr("x", function(d) {
        if (d.evaluation !== '' && d.evaluation !== '0' && d.evaluation !== 'NOT THERE YET') {
            return xScale(d.stage)
        }
    })
    .attr("y", function(d) {
        if (d.evaluation !== '' && d.evaluation !== '0' && d.evaluation !== 'NOT THERE YET') {
            return yScale(parseInt(d.evaluation))
        }
    })
    .attr("font_family", "sans-serif")  // Font type
    .attr("font-size", "11px")  // Font size
    .attr("fill", function(d) { 
        return 'black'
    })
    .attr("transform", "translate(" + xScale.bandwidth() * 0.62 + "," + "0)");

    /* Add text inside circles */
    svg.selectAll('#e14')
    .data(flatten_data)
    .enter() 
    .append("text")
    .text(function(d, i) {
        if (d.evaluation !== '' &&  d.evaluation !== '0' && d.evaluation !== 'NOT THERE YET') {
            if (flatten_e14_data[i].evaluation !== '0') {
                return formatSuffixDecimal1(flatten_e14_data[i].evaluation)
            }
        }
    })
    .attr("x", function(d) {
        if (d.evaluation !== '' && d.evaluation !== '0' && d.evaluation !== 'NOT THERE YET') {
            return xScale(d.stage)
        }
    })
    .attr("y", function(d) {
        if (d.evaluation !== '' && d.evaluation !== '0' && d.evaluation !== 'NOT THERE YET') {
            return yScale(parseInt(d.evaluation))
        }
    })
    .attr("dy", "2px")
    .attr("font_family", "sans-serif")
    .attr("font-size", "9px")
    .attr("fill", function(d) { 
        return 'white'
    })
    .attr("text-anchor", "middle")
    .attr("transform", function(d, i) {
        return "translate(" + xScale.bandwidth() * 0.5 + "," + "0)"
    })
    
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