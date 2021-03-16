$(document).ready(function () {
    'use strict';

    const celadonUrl = '//phan-celadon.herokuapp.com';
    const dollarFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    $.ajax({
        method: 'GET',
        url: celadonUrl + '/item',
        dataType: 'json',
    }).done(function (data) {
        $('#table').bootstrapTable({
            pagination: true,
            search: true,
            columns: [{
                field: 'id',
                title: 'Item SKU',
                align: 'left',
                sortable: true,
            }, {
                field: 'brand',
                title: 'Brand',
                align: 'left',
                escape: true,
                sortable: true,
            }, {
                field: 'name',
                title: 'Name',
                align: 'left',
                escape: true,
                sortable: true,
            }, {
                field: 'cost',
                title: 'Unit Cost',
                align: 'right',
                sortable: true,
                searchable: false,
                formatter: function (value) {
                    return dollarFormatter.format(value);
                },
            }, {
                field: 'quantity',
                title: 'Quantity',
                align: 'right',
                sortable: true,
                searchable: false,
            }],
            data: data,
            buttons: function() {
                return {
                    btnAdd: {
                        text: 'Add',
                        icon: 'fa-plus',
                        event: function () {
                            $('#addPurchaseModal').modal('show');
                        },
                    }
                };
            },
            showColumns: true,
            showPaginationSwitch: true,
            showButtonText: true,
        });
    });

    $.ajax({
        method: 'GET',
        url: celadonUrl + '/purchaser',
        dataType: 'json',
    }).done(function (data) {
        $(data).each(function (index, purchaser) {
            $('select#purchaser').append($('<option>', {
                value: purchaser.id,
                text: purchaser.name,
            }));
        });
    });

    $('#addPurchaseButton').click(function () {
        let purchaseDate = $('#addPurchaseModal input#purchaseDate').val();
        let cost = $('#addPurchaseModal input#cost').val();
        cost = cost ? Number(cost) : 0;
        let purchaser = $('#addPurchaseModal select#purchaser').val();

        $.ajax({
            method: 'POST',
            url: celadonUrl + '/purchase',
            data: JSON.stringify({
                purchase_date: purchaseDate,
                cost: cost,
                purchaser_id: purchaser,
                items: [],
            }),
            contentType: 'application/json',
        }).done(function () {
            console.log('New purchase added');
            $('#addPurchaseModal').modal('hide');
        });
    });
});
