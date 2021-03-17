$(document).ready(() => {
    'use strict';

    const dollarFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    let celadonUrl;

    $('#table').bootstrapTable({
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
        }],
        buttons: () => {
            return {
                btnAdd: {
                    text: 'Add',
                    icon: 'fa-plus',
                    event: () => {
                        $('#addPurchaseModal').modal('show');
                    },
                }
            };
        },
        showColumns: true,
        showPaginationSwitch: true,
        showRefresh: true,
        showButtonText: true,
    });
});
