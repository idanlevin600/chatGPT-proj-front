import { useState } from 'react'
import './App.css'
import FC_insertData from './FuncComps/FC_insertData'
import FC_previousResults from './FuncComps/FC_previousResults'
import { Switch } from '@mui/material'

function App() {
  const [showInsertData, setShowInsertData] = useState(true)
  
  const handleSwitchChange = () => {
    setShowInsertData(!showInsertData)
  }
  
  return (
    <>
      <div className="switch-container">
        <label className="switch-label">Previous Results</label>
        <Switch
          checked={showInsertData}
          onChange={handleSwitchChange}
          color="primary"
        />
        <label className="switch-label">Insert Data</label>
      </div>
      {showInsertData ? <FC_insertData /> : <FC_previousResults />}
    </>
  )
}

export default App
