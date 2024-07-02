import React, { useState } from 'react';
import RadarChart from './RadarChart';

const initialData = [
  { axis: 'A', value: 42 },
  { axis: 'B', value: 58 },
  { axis: 'C', value: 73 },
  { axis: 'D', value: 91 },
  { axis: 'E', value: 65 }
];

const ADrillDownValues = [
  { axis: 'A.1', value: 32 },
  { axis: 'A.2', value: 8 },
  { axis: 'A.3', value: 23 },
  { axis: 'A.4', value: 1 },
  { axis: 'A.5', value: 35 }
];

const App = () => {
  const [data, setData] = useState(initialData);
  const [selectedData, setSelectedData] = useState(null);

  const handleDrillDown = (d) => {
    if (d.axis === 'A') {
      setData(ADrillDownValues);
      setSelectedData(null); // Clear selected data on drill down
    } else {
      setSelectedData(d);
    }
  };

  return (
    <div className="App">
      <h1>Radar Chart with Drill Down</h1>
      <RadarChart data={data} onDrillDown={handleDrillDown} />
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
