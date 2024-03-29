/* ------------------------------------------------------------------------------
File: geoMap.js 
------------------------------------------------------------------------------ */

// Define Margin, Width & Height
var margin = {top: 5, right: 5, bottom: 5, left: 5},
    width = 960,//1060 - margin.left - margin.right,
    height = 700;//620 - margin.top - margin.bottom;


// Define Map Projections - D3 API Reference on Geo > Geo Projections
var projection = d3.geo.albersUsa()
    .scale(1000)//(1280)
    .translate([width / 2, height / 2]);
								  
// Define Path
var path = d3.geo.path().projection(projection);

// Define color scale. A range of color to represent different shade of the color
// In this example, we will represent the color Blue in different shades. 


//xxxxxxxx


//var color = d3.scale.quantize()
//    .range(["rgb(161,217,155)","rgb(116,196,118)",
//            "rgb(65,171,93)","rgb(35,139,69)",
//            "rgb(0,90,50)"]);



 // Define Tooltip
 var tooltip = d3.select("body").append("div")
     .attr("class", "tooltip")
								
// Define SVG


// xxxxxxxxx
//var svg = d3.select("body").append("svg")
//    .attr("width", width + margin.left + margin.right)
//    .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");   

	
	
var svg = d3.select("body").append("svg")
	.attr("width", width)
    	.attr("height", height);


 svg.insert("path", ".graticule")
  //    .datum(topojson.feature(us, us.objects.state))
      .attr("class", "land")
      .attr("d", path);
      
  svg.insert("path", ".graticule")
    //  .datum(topojson.mesh(us, us.objects.state, function(a, b) { return a !== b; }))
      .attr("class", "state-boundary")
      .attr("d", path);
      
  d3.csv("https://raw.githubusercontent.com/ZuqhameSkosana/csc_project/master/nodes.csv?token=AKKR7IJGGZ4QGTGWTS4TTDS5M2ZFK")
  	.row(function (d) { return {lat: +d.Lat, lon: +d.Lon, name: d.Name, key: +d.Id, role: +d.proj_role, region: d.Region}; })
 	.get(function(error, rows) {
		var nodes = svg.selectAll("circle")
			.data(rows).enter()
			.append("circle")
			.attr("cx", function(d) { return projection([+d.lon, +d.lat])[0]; })
			.attr("cy", function(d) { return projection([+d.lon, +d.lat])[1]; })
			.attr("r",  function(d) {return d.role*2;})
			.attr("fill", function(d){
				if(d.region == "Midwest") {return "green"}
				else if (d.region == "West") {return "orange"}
				else if (d.region == "South") {return "purple"}
				else {return "steelblue"}
			;})
			.on("mouseover", function(d){d3.select("h2 span").text(d.name)})
		
		d3.csv("https://raw.githubusercontent.com/ZuqhameSkosana/csc_project/master/edges.csv?token=AKKR7IMLVRRFKV26ZXN77725M2ZKA", function(error, edges){
		  
		  var nodesById = d3.map(nodes.data(), function(d){
		    return d.key;
		  });

		  edges.forEach(function(d){
		    
		    var p1 = projection([nodesById.get(d.source).lon, nodesById.get(d.source).lat]),
		        p2 = projection([nodesById.get(d.target).lon, nodesById.get(d.target).lat]);

		    svg.append("line")
		      .attr("x1", p1[0])
		      .attr("x2", p2[0])
		      .attr("y1", p1[1])
		      .attr("y2", p2[1])
		      .style("stroke", "steelblue")
		  });
		  
		});
 	});		
	
	
	
// Load Data
d3.csv("https://raw.githubusercontent.com/ZuqhameSkosana/maps/master/us-pop.csv", function(data) {
   
   //xxxxxxx
   
/*
   color.domain([
        d3.min(data, function(d) { return d.value; }), 
        d3.max(data, function(d) { return d.value; })
    ]);
  */  
    // Load GeoJSON Data
    d3.json("https://raw.githubusercontent.com/ZuqhameSkosana/maps/master/us-states.json", function(json) {
        for (var i = 0; i < data.length; i++) {
            var dataState = data[i].state;
            var dataValue = parseFloat(data[i].value);
            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;
				if (dataState == jsonState) {
				    json.features[j].properties.value = dataValue;
                    break;				
				}
            }		
        }

    // Bind Data 
    svg.selectAll("path")
        .data(json.features)
        .enter()    
        .append("path")
        .attr("class", "state-boundary")
        .attr("d", path)
		
		
        //.style("fill", function(d) { return color(d.properties.value); })
        
		.on("mouseover", function(d) {   
            tooltip.transition()
               .duration(200)
               .style("opacity", .9);
            tooltip.html("<strong>" + d.properties.name + "</strong>" + "<br/>" + "Population: " +
                        (d.properties.value).toLocaleString() + " Million")			
			   .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");		       
        })
        .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
        
    
    });
});




