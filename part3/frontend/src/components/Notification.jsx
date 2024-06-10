import '../index.css'
const Notification = ({isAdded, message}) => {
    if (message === null) {
        return null
    }

    return (
        <div className={isAdded ? 'addedNotification' : 'errorNotification'}>
            {message}
        </div>
    )
}

export default Notification