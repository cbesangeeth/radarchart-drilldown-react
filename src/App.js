import React, { useState } from 'react';
import RadarChartCircle from './RadarChartCircle';
import RadarChartPolygon from './RadarChartPolygon';

const initialData = [
  { axis: 'A', value: 1.7 },
  { axis: 'B', value: 1.7 },
  { axis: 'C', value: 1.7 },
  { axis: 'D', value: 1.7 },
  { axis: 'E', value: 1.7 }
];

const ADrillDownValues = [
  { axis: 'A.1', value: 0.2 },
  { axis: 'A.2', value: 3.0 },
  { axis: 'A.3', value: 0.3 },
  { axis: 'A.4', value: 4.2 },
  { axis: 'A.5', value: 0.5 }
];

const App = () => {
  const [data, setData] = useState(initialData);
  const [selectedData, setSelectedData] = useState(null);

  const handleDrillDown = (d) => {
    console.log(d)
    if (d === 'A') {
      setData(ADrillDownValues);
      setSelectedData(null); // Clear selected data on drill down
    } else {
      setSelectedData(d);
    }
  };

  return (
    <div className="App">
      <h1>Radar Chart with Drill Down</h1>
      <RadarChartPolygon data={data} onDrillDown={handleDrillDown} />

      <RadarChartCircle data={data} onDrillDown={handleDrillDown} />
      {selectedData && (
        <div>
          <h2>Details for {selectedData.axis}</h2>
          <p>Value: {selectedData.value}</p>
        </div>
      )}
      <button onClick={() => { setData(initialData); setSelectedData(null); }}>Reset</button>
    </div>
  );
};

export default App;
