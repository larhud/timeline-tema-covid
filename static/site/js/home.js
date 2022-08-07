$(function () {
  (function (name) {
    var container = $("#pagination-" + name);
    container.pagination({
      dataSource: [
        {
          titulo: "COVID",
          texto:
            "Linha cronológica (timeline) de informações midiáticas sobre a COVID-19.  O objetivo é produzir...",
          imagem: "time1.png",
          slug: "covid",
        },
        {
          titulo: "Dilma Roussef",
          texto:
            "Linha cronológica (timeline) de informações midiáticas sobre a COVID-19.  O objetivo é produzir...",
          imagem: "time2.png",
          slug: "dilma",
        },
        {
          titulo: "Timeline 1",
          texto:
            "Linha cronológica (timeline) de informações midiáticas sobre a COVID-19.  O objetivo é produzir...",
          imagem: "time1.png",
          slug: "covid",
        },
        {
          titulo: "Timeline 2",
          texto:
            "Linha cronológica (timeline) de informações midiáticas sobre a COVID-19.  O objetivo é produzir...",
          imagem: "time1.png",
          slug: "covid",
        },
        {
          titulo: "COVID",
          texto:
            "Linha cronológica (timeline) de informações midiáticas sobre a COVID-19.  O objetivo é produzir...",
          imagem: "time1.png",
          slug: "covid",
        },
        {
          titulo: "Dilma Roussef",
          texto:
            "Linha cronológica (timeline) de informações midiáticas sobre a COVID-19.  O objetivo é produzir...",
          imagem: "time1.png",
          slug: "dilma",
        },
        {
          titulo: "Timeline 2",
          texto:
            "Linha cronológica (timeline) de informações midiáticas sobre a COVID-19.  O objetivo é produzir...",
          imagem: "time1.png",
          slug: "dilma",
        },
      ],
      locator: "items",
      pageSize: 4,
      showPageNumbers: true,
      showPrevious: true,
      showNext: true,
      nextText: `Próxima <i class="fa-solid fa-arrow-right"></i>`,
      prevText: `<i class="fa-solid fa-arrow-left"></i> Anterior`,
      showFirstOnEllipsisShow: true,
      showLastOnEllipsisShow: true,
      ajax: {
        beforeSend: function () {
          container.prev().html("Loading data from flickr.com ...");
        },
      },
      callback: function (response, pagination) {
        var dataHtml = "<div class='itens'>";

        $.each(response, function (index, item) {
          dataHtml +=
            "<div class='item'><img src='/media/uploads/" +
            item.imagem +
            "' /><div class='conteudo'><h4>" +
            item.titulo +
            "</h4>";
          dataHtml += "<p>" + item.texto + "</p>";
          dataHtml += `<a href=/timeline/` + item.slug + `>Acessar timeline <i class="fa-solid fa-arrow-right"></i></a></div></div>`;
        });

        dataHtml += "</div>";

        container.prev().html(dataHtml);
      },
    });
  })("demo2");
});
var swiper = new Swiper(".mySwiper", {
  slidesPerView: "auto",
  spaceBetween: 30,
  pagination: {
    el: ".swiper-pagination",
    paginationClickable: true
  },
});
