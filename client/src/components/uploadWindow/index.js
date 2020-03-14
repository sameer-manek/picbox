import React from 'react'
import './uploadWindow.css'

function UploadWindow (props) {
    return (
        <button className="upload_icon" onClick={() => { props.toggle() }} >
                <i htmlFor="uploads" className="fa fa-upload" style={{fontSize: "22px", fontWeight: "200", lineHeight: "60px", cursor: "pointer", }}></i>
        </button>
    )
}

export default UploadWindow