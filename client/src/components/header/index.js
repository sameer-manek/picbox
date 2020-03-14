import React, {Component} from 'react'

const styles = {
    header: {
        backgroundColor: "#DEDEDE",
        display: "block",
        padding: "30px 0",
        boxSizing: "border-box",
        textAlign: "center"
    },

    title: {
        fontSize: "3rem",
        textAlign: "center",
        fontWeight: "900"
    }
}

class Header extends Component
{
    render()
    {
        return (
            <div style={styles.header}>
                <h1 style={styles.title} >Welcome to picbox</h1>
            </div>
        )
    }
}

export default Header