import React from 'react'

const Persons = (props) => {
    

    return (
        <div>
            <p>
                {props.person.name} {props.person.number}
                <button className="button" onClick={props.handleClick}>delete</button>
            </p>
        </div>
    )
}

export default Persons