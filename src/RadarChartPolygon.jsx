import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RadarChartPolygon = ({ data, onDrillDown }) => {
    const svgRef = useRef();
    console.log("data", data);

    useEffect(() => {
        const width = 800;
        const height = 800;
        const PolygonSides = data.length;
        const noOfLevels = 6;
        const maxLevel = 6;
        const angleIncr = (2 * Math.PI) / PolygonSides;

        const startAngle = PolygonSides % 2 === 1 ? -Math.PI / 2 : -Math.PI / 2 - (angleIncr / 2);
        let baseRadius = 225;
        const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
        svg.selectAll('*').remove(); // Clear previous SVG content

        const polygonPoints = (cx, cy, r, n, baseAngle) => {
            return Array.from({ length: n }).map((_, i) => {
                const currentAngle = startAngle + i * angleIncr;
                const x = cx + r * Math.cos(currentAngle);
                const y = cy + r * Math.sin(currentAngle);
                return { x, y };
            });
        };

        const getValueRadius = (value) => {
            return (value / maxLevel) * baseRadius;
        };

        let baseAngle = -20;
        let outerMostPoints = [];
        Array.from({ length: noOfLevels + 1 }).forEach((_, i) => {
            console.log("i", i);
            const currentRadius = baseRadius - i * (baseRadius / noOfLevels);
            const points = polygonPoints(width / 2, height / 2, currentRadius, PolygonSides, baseAngle);

            svg.append('polygon')
                .attr('points', points.map(p => `${p.x},${p.y}`).join(' '))
                .attr('stroke', 'purple')
                .attr('fill', 'lightgrey')
                .attr('stroke-width', 1);

            if (i === 0) {
                outerMostPoints = points;
            }

            // Add level value text, starting from inner to outer and move position to the left
            svg.append("text")
                .attr("x", (width / 2) - 20) // Move to the left
                .attr("y", (height / 2) - currentRadius)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .text(`${noOfLevels - i}`);
        });

        const textOffset = 60;
        outerMostPoints.forEach((point, idx) => {
            const a = Math.atan2(point.y - height / 2, point.x - width / 2);
            const tx = point.x + textOffset * Math.cos(a);
            const ty = point.y + textOffset * Math.sin(a);
            svg.append("text")
                .attr("x", tx)
                .attr("y", ty)
                .attr("text-anchor", "middle")
                .style("cursor", "pointer")
                .on("click", () => onDrillDown(data[idx]?.axis))
                .text(data[idx]?.axis.toString());
        });

        // Plot the data points
        const dataPoints = data.map((d, idx) => {
            const radius = getValueRadius(d.value);
            const angle = startAngle + idx * angleIncr;
            return {
                x: width / 2 + radius * Math.cos(angle),
                y: height / 2 + radius * Math.sin(angle)
            };
        });

        // Draw the data polygon and fill with color shade
        svg.append('polygon')
            .attr('points', dataPoints.map(p => `${p.x},${p.y}`).join(' '))
            .attr('stroke', 'blue')
            .attr('fill', 'lightblue')
            .attr('fill-opacity', 0.5)
            .attr('stroke-width', 2);

        // Mark the data points
        dataPoints.forEach(point => {
            svg.append('circle')
                .attr('cx', point.x)
                .attr('cy', point.y)
                .attr('r', 5)
                .attr('fill', 'red');
        });

    }, [data, onDrillDown]);

    return <svg ref={svgRef} />;
};

export default RadarChartPolygon;
