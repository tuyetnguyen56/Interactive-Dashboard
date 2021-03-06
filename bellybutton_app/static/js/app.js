function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    var url = `/metadata/${sample}`;
    d3.json(url).then(function(sample) {

    // Use d3 to select the panel with id of `#sample-metadata`
    var sample = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
      sample.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function ([key, value]) {
      var row = sample.append("p");
      row.text(`${key}: ${value}`);
  });
  }  
)};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = `/samples/${sample}`;
    d3.json(url).then(function(data) {

    // @TODO: Build a Bubble Chart using the sample data
    var x_val = data.otu_ids;
    var y_val = data.sample_values;
    var size = data.sample_values;
    var colors = data.otu_ids; 
    var t_val = data.otu_labels;
    
    var bubble_data = [{
      x: x_val,
      y: y_val,
      text: t_val,
      type: 'scatter',
      mode: 'markers',
      marker: {
        color: colors,
        colorscale: 'YlGnBu',
        size: size
      } 
    }];

    var layout = {
      xaxis: {
        title: {
          text: 'OTU ID'
        }  
      },
      yaxis: {
        title: {
          text: 'Sample Count'
        }  
      },      
    
    }

    Plotly.newPlot('bubble', bubble_data, layout);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(url).then(function(data) {  
    var p_val = data.sample_values.slice(0, 10);
    var p_labels = data.otu_ids.slice(0, 10);
    var p_hovertext = data.otu_labels.slice(0, 10);
    
    var pie_data = [{
      values: p_val,
      labels: p_labels,
      hovertext: p_hovertext,
      type: 'pie'  
    }];

    var pie_layout = {
      title: "Top 10 Samples",
    };
    
    Plotly.newPlot("pie", pie_data, pie_layout);
   });
  });  
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
