import { useState } from 'react';
import './App.css';
import FC_insertData from './FuncComps/FC_insertData';
import FC_previousResults from './FuncComps/FC_previousResults';
import { Switch } from '@mui/material';

function App() {
  const [showInsertData, setShowInsertData] = useState(true);
  
  const handleSwitchChange = () => {
    setShowInsertData(!showInsertData);
  };
  
  return (
    <>
      <div className="switch-container" style={{ backgroundColor: '#121212', color: '#fff', padding: '10px', textAlign: 'center' }}>
        <label className="switch-label">Previous Results</label>
        <Switch
          checked={showInsertData}
          onChange={handleSwitchChange}
          color="primary"
        />
        <label className="switch-label">Insert Data</label>
      </div>
      <div style={{ backgroundColor: '#121212', color: '#fff', minHeight: '100vh', padding: '0 5em' }}>
        {showInsertData ? <FC_insertData /> : <FC_previousResults />}
      </div>
    </>
  );
}

export default App;
