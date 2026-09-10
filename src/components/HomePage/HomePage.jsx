import { useState } from 'react'
import Button from '@mui/material/Button';
import "./HomePage.css";
import { backgroundColor } from '@mui/system';

const HomePage = ({handleClick, fileName, handleFileUpload, eight, fullTest}) => {
    
    

    return (
        <div className="HomePage">
            <h1 className="HomePage-title">העלה את קובץ הגיחה לניתוח - שמינייה כפולה</h1>
            <div className='buttons'>
                <button className='full-test btn' onClick={fullTest}>לגיחה השלמה</button>
                <button className='eight btn' onClick={eight}>לשמינייה</button>
            </div>
            <div className="upload-files">
                {fileName && (
                    <p>{fileName}</p>
                )}

                <label htmlFor="file" className="upload-btn">בחר קובץ</label>
                <input type="file" id="file" name="file" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e)} accept=".xlsx, .xls" />
                
            </div>
             
            <Button variant="outlined" size="large" className="analyze-btn" onClick={() => handleClick()}>
                <span>נתח את הקובץ</span>
            </Button>
        </div> 
    
    )
}

export default HomePage