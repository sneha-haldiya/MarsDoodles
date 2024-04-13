const getDate = () => {
    return `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`;
}

export default getDate;