const adminConfig = (token) => {
    return { headers: {'x-access-token': token}};
}

const userConfig = (token) => {
    return { headers: {'user-access-token': token}};
}

export { adminConfig, userConfig }