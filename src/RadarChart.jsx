import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RadarChart = ({ data, onDrillDown }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 500;
    const height = 500;
    const levels = 5;
    const radius = Math.min(width / 2, height / 2);
    const angleSlice = (Math.PI * 2) / data.length;

    const maxValue = Math.max(...data.map(d => d.value));
    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();  // Clear previous SVG content
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Draw the background circles
    g.selectAll('.grid')
      .data(d3.range(1, levels + 1).reverse())
      .enter().append('circle')
      .attr('class', 'grid')
      .attr('r', d => radius / levels * d)
      .style('fill', '#CDCDCD')
      .style('stroke', '#CDCDCD')
      .style('fill-opacity', 0.1);

    // Draw the axes
    const axisGrid = g.selectAll('.axis')
      .data(data)
      .enter().append('g')
      .attr('class', 'axis');

    axisGrid.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('class', 'line')
      .style('stroke', 'grey')
      .style('stroke-width', '2px');

    axisGrid.append('text')
      .attr('class', 'legend')
      .style('font-size', '11px')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => rScale(maxValue * 1.25) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(maxValue * 1.25) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d.axis);

    // Draw the radar chart blobs
    const radarLine = d3.lineRadial()
      .curve(d3.curveLinearClosed)
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice);

    g.append('path')
      .datum(data)
      .attr('d', radarLine)
      .style('fill', '#2E9AFE')
      .style('fill-opacity', 0.6);

    g.selectAll('.radarCircle')
      .data(data)
      .enter().append('circle')
      .attr('class', 'radarCircle')
      .attr('r', 4)
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('fill', '#2E9AFE')
      .style('fill-opacity', 0.8)
      .on('click', (event, d) => onDrillDown(d));  // Pass clicked data point to drill-down handler

  }, [data, onDrillDown]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default RadarChart;
