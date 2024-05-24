const getDate = () => {
    return `${new Date(Date.now()).getHours() < 10 ? "0" + new Date(Date.now()).getHours() : new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes() < 10 ? "0" + new Date(Date.now()).getMinutes() : new Date(Date.now()).getMinutes()}`;
}

export default getDate;