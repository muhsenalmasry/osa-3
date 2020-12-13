import React from 'react'

const FailNotification = ({message}) => {
if(message === null) {
    return null
}

return (
    <div className='fail'>
        {message}
    </div>
)
}

export default FailNotification