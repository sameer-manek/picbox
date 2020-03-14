import React from 'react'
import spinner from './spinner.gif'

const styles = {
    spinner: {
        height: '300px',
        width: '240px',
        textAlign: 'center'
    },
    spinner_img: {
        margin: '30% 0',
        height: '50px',
    }
}

function Spinner (props)
{
    return (
        <div style={styles.spinner} style={props.style}>
            <img src={spinner} alt="loading.." style={styles.spinner_img} />
        </div>
    )
}

export default Spinner