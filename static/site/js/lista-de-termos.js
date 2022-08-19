(function () {
    $(document).ready(function () {
        function initPaginator(name, order = 'pk') {
            let container = $("#pagination-" + name);

            container.pagination({
                locator: "items",
                pageSize: 4,
                dataSource: window.__lista_de_termos__ + '?order_by=' + order,
                totalNumberLocator: function (data) {
                    // data = retorno da url indicada em dataSource
                    return data.total;
                },
                showPageNumbers: true,
                showPrevious: true,
                showNext: true,
                nextText: 'Próxima <i class="fa-solid fa-arrow-right"></i>',
                prevText: '<i class="fa-solid fa-arrow-left"></i> Anterior',
                showFirstOnEllipsisShow: true,
                showLastOnEllipsisShow: true,
                ajax: {
                    beforeSend: function () {
                        container.prev().html("Loading data...");
                    },
                },
                callback: function (response, pagination) {
                    let dataHtml = '<div class="itens">';

                    $.each(response, function (index, item) {
                        dataHtml +=
                            '<div class="item"><img src="' + item.imagem + '" alt="' + item.termo +
                            '"/><div class="conteudo"><h4>' + item.termo + '</h4>';
                        dataHtml += '<p>' + item.texto + '</p>';
                        dataHtml += '<a href="' + item.url + '">Acessar timeline <i class="fa-solid fa-arrow-right"></i></a></div></div>';
                    });

                    dataHtml += "</div>";

                    container.prev().html(dataHtml);
                },
            });
        }

        let selectOrdem = $('#ordem-termos');

        selectOrdem.change(function () {
            initPaginator('termos', $(this).val());
        });

        selectOrdem.trigger('change');
    });
})(jQuery);

var swiper = new Swiper(".mySwiper", {
    slidesPerView: "auto",
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        paginationClickable: true
    },
});
