$(document).ready(() => {
    const dollarFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });


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

    let submitForm = () => {
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

        let items = [];
        $('.add-purchase-item').each((i, elem) => {
            let brand = $(elem).find('.brand').first().val().trim();
            let name = $(elem).find('.name').first().val().trim();
            let cost = $(elem).find('.cost').first().val();
            cost = cost ? Number(cost) : 0;
            let quantity = $(elem).find('.quantity').first().val();
            quantity = quantity ? Number(quantity) : 0;

            items.push({
                brand: brand,
                name: name,
                cost: cost,
                quantity: quantity,
            });
        });

        configPromise.then(() => {
            return $.ajax({
                method: 'POST',
                url: celadonUrl + '/purchase',
                data: JSON.stringify({
                    purchase_date: purchaseDate,
                    cost: cost,
                    purchaser_id: purchaser,
                    items: items,
                }),
                contentType: 'application/json',
            });
        }).then(() => {
            $('#add-purchase-modal').modal('hide');
            $('#item-table').bootstrapTable('refresh');
            $('#purchase-table').bootstrapTable('refresh');
        });
    };

    let calcTotalCost = () => {
        let totalCost = 0.0;
        $('.add-purchase-item').each((i, elem) => {
            let cost = $(elem).find('.cost').first().val();
            cost = cost ? Number(cost) : 0;
            let quantity = $(elem).find('.quantity').first().val();
            quantity = quantity ? Number(quantity) : 0;

            totalCost += cost * quantity;
        });

        $('#add-purchase-modal span#costSpan').text(dollarFormatter.format(totalCost));
        $('#add-purchase-modal input#cost').val(totalCost);
    };

    let trimText = (e) => {
        let old = $(e.target).val();
        $(e.target).val(old.trim());
    };

    let delItem = (e) => {
        let btn = $(e.target);
        $(btn).parents('.form-group').remove();
    };

    $('#add-purchase-form').submit((e) => {
        e.preventDefault();
        submitForm();
    });

    $('#add-purchase-button').click(submitForm);

    $('#new-item').click(() => {
        let brandDiv = $('<div>', {
            class: 'col',
        });
        let brandInput = $('<input>', {
            class: 'form-control brand',
            placeholder: 'Brand',
        });
        brandInput.change(trimText);
        brandDiv.append(brandInput);

        let nameDiv = $('<div>', {
            class: 'col',
        });
        let nameInput = $('<input>', {
            class: 'form-control name',
            placeholder: 'Name',
        });
        nameInput.change(trimText);
        nameDiv.append(nameInput);

        let costDiv = $('<div>', {
            class: 'col input-group',
        });
        costDiv.append(
            $('<div>', {
                class: 'input-group-prepend',
            }).append(
                $('<span>', {
                    class: 'input-group-text',
                    text: '$',
                })
            )
        );
        let costInput = $('<input>', {
            type: 'number',
            class: 'form-control cost',
            step: '0.01',
            placeholder: 'Cost',
        });
        costInput.change(calcTotalCost);
        costDiv.append(costInput);

        let quanDiv = $('<div>', {
            class: 'col',
        });
        let quanInput = $('<input>', {
            type: 'number',
            class: 'form-control quantity',
            step: '1',
            placeholder: 'Quantity',
        });
        quanInput.change(calcTotalCost);
        quanDiv.append(quanInput);

        let trashDiv = $('<div>', {
            class: 'col-sm-1',
        });
        let trashBtn = $('<button>', {
            class: 'btn btn-secondary btn-trash',
        });
        trashBtn.append($('<i>', { class: 'fa fa-trash-alt' }));
        trashBtn.click(delItem);
        trashDiv.append(trashBtn);

        let rootDiv = $('<div>', {
            class: 'form-group',
        });
        rootDiv.append(
            $('<div>', {
                class: 'col-sm-10 offset-sm-2',
            }).append($('<div>', {
                    class: 'form-row add-purchase-item',
                }).append(brandDiv, nameDiv, costDiv, quanDiv, trashDiv)
            )
        );

        $('#add-purchase-form').append(rootDiv);
    });

    $('#add-purchase-form .add-purchase-item .brand').change(trimText);
    $('#add-purchase-form .add-purchase-item .name').change(trimText);
    $('#add-purchase-form .add-purchase-item .cost').change(calcTotalCost);
    $('#add-purchase-form .add-purchase-item .quantity').change(calcTotalCost);
    $('#add-purchase-form .add-purchase-item .btn-trash').click(delItem);
});
