$(document).ready(() => {
    'use strict';

    const dollarFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    let celadonUrl;

    $('#purchase-table').bootstrapTable({
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
                    url: celadonUrl + '/purchase',
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
            title: 'Purchase ID',
            align: 'left',
            sortable: true,
        }, {
            field: 'purchase_date',
            title: 'Purchase Date',
            align: 'left',
            escape: true,
            sortable: true,
        }, {
            field: 'purchaser_name',
            title: 'Purchaser',
            align: 'left',
            escape: true,
            sortable: true,
        }, {
            field: 'cost',
            title: 'Cost',
            align: 'right',
            sortable: true,
            searchable: false,
            formatter: (value) => {
                return dollarFormatter.format(value);
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
