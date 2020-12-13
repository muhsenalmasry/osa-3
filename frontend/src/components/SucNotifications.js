import React from 'react'

const SucNotification = ({message}) => {
if(message === null){
    return null
}

return(
    <div className="success">
        {message}
    </div>
)
}

export default SucNotification