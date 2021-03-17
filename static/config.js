let getConfig = () => {
    return $.ajax({
        method: 'GET',
        url: '/config',
    });
};
