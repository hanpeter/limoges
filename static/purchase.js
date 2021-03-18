$(document).ready(() => {
    let celadonUrl;

    getConfig().then((data) => {
        celadonUrl = data.celadonUrl;
    }).then(() => {
        $.ajax({
            method: 'GET',
            url: celadonUrl + '/purchaser',
            dataType: 'json',
        }).done((data) => {
            $(data).each((index, purchaser) => {
                $('select#purchaser').append($('<option>', {
                    value: purchaser.id,
                    text: purchaser.name,
                }));
            });
        });
    });

    $('#add-purchase-button').click(() => {
        let purchaseDate = $('#add-purchase-modal input#purchase-date').val();
        let cost = $('#add-purchase-modal input#cost').val();
        cost = cost ? Number(cost) : 0;
        let purchaser = $('#add-purchase-modal select#purchaser').val();

        let configPromise;
        if (!!celadonUrl) {
            let dfd = $.Deferred();
            dfd.resolve();
            configPromise = dfd.promise();
        } else {
            configPromise = getConfig().then((data) => {
                celadonUrl = data.celadonUrl;
            });
        }

        configPromise.then(() => {
            return $.ajax({
                method: 'POST',
                url: celadonUrl + '/purchase',
                data: JSON.stringify({
                    purchase_date: purchaseDate,
                    cost: cost,
                    purchaser_id: purchaser,
                    items: [],
                }),
                contentType: 'application/json',
            });
        }).then(() => {
            $('#add-purchase-modal').modal('hide');
        });
    });
});
