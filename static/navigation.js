$(document).ready(() => {
    const hash = $(location).attr('hash');
    let tab;

    switch (hash) {
        case '#purchase':
            tab = $('a#purchase-tab');
            break;
        case '#sale':
            tab = $('a#sales-tab');
            break;
        case '#item':
        default:
            tab = $('a#item-tab');
            break;
    }
    tab.tab('show');
});
