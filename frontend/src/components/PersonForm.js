import React from 'react'

const PersonForm = (props) => {
    return (
        <div>
            <form onSubmit={props.addPerson}>
            <div>
                name: <input value={props.newName} onChange={props.nameChange} />
            </div>
            <div>
                number: <input value={props.newNumber} onChange={props.numberChange} />
            </div>
            <div>
                <button className="button" type="submit">add</button>
            </div>
      </form>
      </div >
    )
}

export default PersonForm