$(document).ready(function() {
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
                formatter: function(value) {
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
        });
    });
});
