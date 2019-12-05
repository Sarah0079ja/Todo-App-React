import React from 'react';
// import Header from './components/Header';

function Header() {
    return (
        <header style={headerStyle}>
            <h1>TodoList</h1>
        </header>
    )
}

const headerStyle = {
    background: 'blue',
    color: '#fff',
    textAlign: 'center',
    padding: '10px',
}



export default Header;