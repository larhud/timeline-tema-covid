(function ($) {
    $(document).ready(function () {
        let containerPaginas = $('#paginas');
        let containerFontes = $('#lista-de-fontes');
        // Atribui o evento para os elementos criados dinâmicamente
        containerPaginas.on('click', "[id^='page-id-']", function () {
            let children = containerPaginas.children();
            // Retorna a li do elemento a
            let element = $(this).parent();
            let ind = children.index(element);
            page_click(ind + 1);
        });

        containerFontes.on('click', '.fonte-item', function () {
            // Atribui a seleção no campo de filtro de veículo
            $('#veiculo').val($(this).text());
            // Fecha a lista
            $('#btn-fonte').click();
            // Executa a busca
            $('#btn-busca').click();
        });

        function page_click(pagina) {
            $.get(window.url_lista_de_fontes, {page: pagina}, function (data) {

                if (!containerPaginas.children().length) {
                    let num_paginas = data.paginas;

                    for (let i = 1; i <= num_paginas; i++) {
                        containerPaginas.append(
                            '<li class="page-item"><a class="page-link" href="#" id="page-id-' + i + '">' + i + '</a></li>'
                        );
                    }
                }
                // Torna a página atual ativa
                containerPaginas.children().removeClass('active');
                $('#page-id-' + pagina).parent().addClass('active');
                // Monta lista de fontes
                containerFontes.empty();

                data.lista.forEach(function (item) {
                    containerFontes.append(
                        '<div class="col-md-3"><a href="#select" class="fonte-item">' + item + '</a></div>'
                    );
                });
            });
        }

        // Preenche a lista da primeira página
        page_click(1);
    });
})(jQuery);