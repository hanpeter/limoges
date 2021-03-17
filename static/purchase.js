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

    $('#addPurchaseButton').click(() => {
        let purchaseDate = $('#addPurchaseModal input#purchaseDate').val();
        let cost = $('#addPurchaseModal input#cost').val();
        cost = cost ? Number(cost) : 0;
        let purchaser = $('#addPurchaseModal select#purchaser').val();

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
            $('#addPurchaseModal').modal('hide');
        });
    });
});
