$(document).ready(() => {
    'use strict';

    const dollarFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    let celadonUrl;

    let sellItem = (item) => {
        item.quantity--;

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
                method: 'PUT',
                url: celadonUrl + '/item/' + item.id,
                data: JSON.stringify(item),
                contentType: 'application/json',
            });
        }).then((data) => {
            $('#item-table').bootstrapTable('refresh');
        });
    };

    $('#item-table').bootstrapTable({
        ajax: (params) => {
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
                    method: 'GET',
                    url: celadonUrl + '/item',
                    dataType: 'json',
                });
            }).then((data) => {
                params.success(data);
            });
        },
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
            formatter: (value) => {
                return dollarFormatter.format(value);
            },
        }, {
            field: 'quantity',
            title: 'Quantity',
            align: 'right',
            sortable: true,
            searchable: false,
        }, {
            title: 'Actions',
            align: 'center',
            sortable: false,
            searchable: false,
            formatter: (value, row) => {
                let sellBtn = $([
                    '<a href="sell" class="btn btn-secondary">',
                    '<i class="fa fa-shipping-fast"></i>',
                    '</a>',
                ].join(''));

                if (row.quantity < 1) {
                    sellBtn.attr('disabled', 'disabled');
                }

                return $('<div>').append(sellBtn).html();
            },
        }],
        buttons: () => {
            return {
                btnAdd: {
                    text: 'Add',
                    icon: 'fa-plus',
                    event: () => {
                        $('#add-purchase-modal').modal('show');
                    },
                }
            };
        },
        showColumns: true,
        showPaginationSwitch: true,
        showRefresh: true,
        showButtonText: true,
        sortName: 'id',
        sortOrder: 'asc',
    });
});
