// Script to create Charts base on Json data
function bacteriaon() {
    // Take the info selected
    var dataselect = d3.select('#selDataset');
    d3.json("samples.json").then(function(samplesData){
        var bacterianame = samplesData.names;
        dataselect.selectAll('option')
            .data(bacterianame)
            .enter()
            .append('option')
            .attr('value', d => d)
            .text(d => d);
        // First info to load
        var firstbacteria = bacterianame[0];
        charting(firstbacteria);
        infobacteria(firstbacteria);
    }).catch(error => console.log(error));
};
// Plot Changing with dropdown
function optionChanged(bacterianew){charting(bacterianew);infobacteria(bacterianew);};
// Building Bar Chart and Bubble Chart
function charting(id) {
    d3.json("samples.json").then(function(samplesData){
        var bacfilter = samplesData.samples.filter(sample => sample.id == id);
        var result = bacfilter[0];
        BacteriaDS = [];
        for (cont=0; cont<result.sample_values.length; cont++){
            BacteriaDS.push({
                id: `OTU ${result.otu_ids[cont]}`,
                value: result.sample_values[cont],
                label: result.otu_labels[cont]
            });
        }
        // Top 10 data in descending order
        var Sorted = BacteriaDS.sort(function sortFunction(a,b){return b.value - a.value;}).slice(0,10);
        var reversed = Sorted.sort(function sortFunction(a,b){return a.value - b.value;})
        // Bar Chart
        var colors = ['#B0C4DE', '#ADD8E6', '#B0C4DE', '#ADD8E6', '#B0C4DE', '#ADD8E6', '#B0C4DE', '#ADD8E6', '#B0C4DE', '#ADD8E6']
        var traceBar = {
            type: "bar",
            orientation: 'h',
            x: reversed.map(row=> row.value),
            y: reversed.map(row => row.id),
            text: reversed.map(row => row.label),
            mode: 'markers',
            marker: {color: colors}
          };
        var Bardata = [traceBar];
        var Barlayout = {
            title: `<span style='font-size:1em; color:#00008B'><b>Top 10 Bacteria Cultures Found <b></span>`,
            xaxis: {autorange: true},
            yaxis: {autorange: true},
            width: 500,
            height: 500
          };
        Plotly.newPlot("bar", Bardata, Barlayout);
        // Bubble Chart
        var traceBubble = {
            x: result.otu_ids,
            y: result.sample_values,
            mode: 'markers',
            marker: {size: result.sample_values, color: result.otu_ids, colorscale: 'Blues'},
            text: result.otu_labels
        };
        var Bubbledata = [traceBubble]
        var Bubblelayout = {
            title: `<span style='font-size:1em; color:#00008B'><b>Bacteria Cultures Per Sample<b></span>`,
            xaxis: {title:'OTU ID'},
            yaxis: {title: 'Sample values'},
            width: window.width
        };
        Plotly.newPlot('bubble', Bubbledata, Bubblelayout);
    }).catch(error => console.log(error));
}
// Cleaning up the demographic keys
function bactcleaning(str){
    return str.toLowerCase().split(' ').map(letter => {
        return (letter.charAt(0).toUpperCase() + letter.slice(1));
    }).join(' ');
}
// Info Bacteria
function infobacteria(id) {
    d3.json('samples.json').then(function(samplesData){
        var bacfilter = samplesData.metadata.filter(sample => sample.id == id);
        var selection = d3.select('#sample-metadata');
        selection.html('');
        Object.entries(bacfilter[0]).forEach(([key,value]) => {
            selection.append('h5')
                .text(`${bactcleaning(key)}: ${value}`);
        });
        // Gauge Chart 
        var Gaugechart = {
            type: 'indicator',
            mode: 'gauge+number',
            title: {text: `<span style='font-size:0.8em; color:#00008B'><b>Belly Button Washing Frequency</span>`},
            subtitle: {text: `Scrubs per week`},
            domain: {x: [0,5],y: [0,1]},
            value: bacfilter[0].wfreq,
            gauge: {
                axis: {range: [null, 9]},
                bar: { color: "darkblue" },
                steps: [
                    {range: [0,1], color: '#B0C4DE'},
                    {range: [1,2], color: '#ADD8E6'},
                    {range: [2,3], color: '#B0C4DE'},
                    {range: [3,4], color: '#ADD8E6'},
                    {range: [4,5], color: '#B0C4DE'},
                    {range: [5,6], color: '#ADD8E6'},
                    {range: [6,7], color: '#B0C4DE'},
                    {range: [7,8], color: '#ADD8E6'},
                    {range: [8,9], color: '#B0C4DE'}
                ],
                threshold: {
                    line: {color: '#663399', width: 4},
                    thickness: 0.50,
                    value: bacfilter[0].wfreq
                }
            }
        };
        var Gaugedata = [Gaugechart];
        var Gaugelayout = {
            width: 350,
            height: 350,
            margin: {t: 25, r:10, l:25, b:25}
        };
        Plotly.newPlot('gauge', Gaugedata, Gaugelayout);
    }).catch(error => console.log(error));
}
bacteriaon();
