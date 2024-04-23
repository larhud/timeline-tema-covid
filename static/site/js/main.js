var meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
var mesAnterior;
var mesAtual;
var mesProximo;
var mes;
var anoSelecionado;

function selecionaAno(a) {
  anoSelecionado = a;
  $("#anoSelecionado").html(anoSelecionado);
  $('#ano-busca').val(anoSelecionado);
}

function seleciona(m) {
  mes = m;
  mesAnterior = m == 0 ? meses[11] : meses[m - 1];
  mesAtual = meses[m];
  mesProximo = m == 11 ? meses[0] : meses[m + 1];

  $("#mesAnterior").html(mesAnterior);
  $("#mesAtual").html(mesAtual);
  $("#mesProximo").html(mesProximo);
  $('#mes-busca').val(mes + 1);
}

$(".anterior").click(function (e) {
  e.preventDefault();
  if (mes == 0) {
      anoSelecionado -= 1;
      selecionaAno(anoSelecionado);
  }
  seleciona(mes == 0 ? 11 : mes - 1);
  buscaMesAno();
});

$(".proximo").click(function (e) {
  e.preventDefault();
  if (mes == 11) {
      anoSelecionado += 1;
      selecionaAno(anoSelecionado);
  }
  seleciona(mes == 11 ? 0 : mes + 1);
  buscaMesAno();
});

function selecionaMesEBusca(m) {
  seleciona(m);
  buscaMesAno();
}

$(function () {
  // const d = new Date();
  // let mes = d.getMonth();
  // let ano = d.getFullYear();
  // seleciona(mes);
  // selecionaAno(ano);
  window.onscroll = function () {
      scrollFunction();
  };

  function scrollFunction() {
      if (
          document.body.scrollTop > 80 ||
          document.documentElement.scrollTop > 80
      ) {
          document.getElementById("header").style.height = "70px";
      } else {
          document.getElementById("header").style.height = "100px";
      }
  }

  var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  $("#dataFiltro").daterangepicker(
      {
          autoUpdateInput: false,
          ranges: {
              Hoje: [moment(), moment()],
              Ontem: [moment().subtract(1, "days"), moment().subtract(1, "days")],
              // "Útimos 7 dias": [moment().subtract(6, "days"), moment()],
              // "Últimos 30 dias": [moment().subtract(29, "days"), moment()],
              "Esta semana": [
                  moment().startOf("week"),
                  moment().isAfter(moment().endOf("week"))
                      ? moment().endOf("week")
                      : moment(),
              ],
              "Este mês": [
                  moment().startOf("month"),
                  moment().isAfter(moment().endOf("month"))
                      ? moment().endOf("month")
                      : moment(),
              ],
              "Este ano": [
                  moment().startOf("year"),
                  moment().isAfter(moment().endOf("year"))
                      ? moment().endOf("year")
                      : moment(),
              ],
              "Ano Passado": [
                  moment().subtract(1, "year").startOf("year"),
                  moment().subtract(1, "year").endOf("year"),
              ],
              "Ano Retrasado": [
                  moment().subtract(2, "year").startOf("month"),
                  moment().subtract(2, "year").endOf("month"),
              ],
          },
          locale: {
              format: "DD/MM/YYYY",
              separator: " - ",
              applyLabel: "Aplicar",
              cancelLabel: "Cancelar",
              fromLabel: "De",
              toLabel: "Até",
              customRangeLabel: "Tempo Todo",
              weekLabel: "W",
              daysOfWeek: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
              monthNames: meses,
              firstDay: 1,
          },
          alwaysShowCalendars: true,
      },
      function (start, end, label) {
          console.log(
              "New date range selected: " +
              start.format("YYYY-MM-DD") +
              " to " +
              end.format("YYYY-MM-DD") +
              " (predefined range: " +
              label +
              ")"
          );
      }
  );
});

$('#dataFiltro').on(
  "apply.daterangepicker",
  function (ev, picker) {
      $(this).val(
          picker.startDate.format("DD/MM/YYYY") +
          " - " +
          picker.endDate.format("DD/MM/YYYY")
      );
  }
);

$('#dataFiltro').on(
  "cancel.daterangepicker",
  function (ev, picker) {
      $(this).val("");
  }
);

async function getJson(api_url) {
  let formData = new FormData(document.getElementById('form-busca'));
  let urlParams = new URLSearchParams(formData);
  let url = api_url + '?' + urlParams.toString();
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function carregaTimeLine(data) {
  let element = document.getElementById('timeline-embed');

  element.innerHTML = '';

  if (data.events.length) {
      window.timeline = new TL.Timeline('timeline-embed', data, {language: 'pt-br'});
  } else {
      let template = document.createElement('template');

      template.innerHTML = '<div class="tl-message-full"><div class="tl-message-container">' +
          '<div class="tl-loading-icon"></div><div class="tl-message-content">' +
          'Nenhuma notícia encontrada com esse critério de busca</div></div></div>';

      element.appendChild(template.content);
  }
}

async function carregarCronoCloud(requestData) {
    let data = requestData.cronocloud;

    var headers = data.header?.map(function(header) {
        return "<th>" + header + "</th>";
    });
    $("#tableHeaders").html(headers);
    $("#tableBody").empty();
    // Adiciona as linhas da tabela
    data.rows?.forEach(function(row) {
        var termosList = "<ul>"; // Inicia a lista não ordenada
        row.termos.forEach(function(termo) {
            termosList += "<li>" + termo + " " + "</li>"; // Adiciona cada termo como um item de lista
        });
        termosList += "</ul>"; // Fecha a lista não ordenada
        var rowData = "<tr><td>" + row.dt_inicial + "</td><td>" + row.dt_final + "</td><td class='termos'>" + termosList + "</td></tr>";
        $("#tableBody").append(rowData);
    });
}


async function carregaCloudWords(data) {
    let wordCloud = data['wordcloud'];

    $('#palavras').jQCloud('destroy');

    $("#palavras").jQCloud(wordCloud, {
        // fontSize: function (width, height, step) {
        //   if (step == 1) return width * 0.005 * step + "px";

        //   return width * 0.005 * step + "px";
        // },
        width: 500,
        delayedMode: false,
        autoResize: true,
        colors: ["#244CB2", "#2670E8", "#1A759F", "#168AAD", "#34A0A4", "#52B69A", "#76C893", "#99D98C", "#B5E48C", "#D9ED92" ],
    });
}

function carregaGrafico(data) {
    const trace1 = {
        type: 'bar',
        x: data.x,
        y: data.y,
        marker: {
            color: '244CB2',
            
        },
        xaxis: {title: 'Data'},
        yaxis: {title: 'Notícias'},
    };

    const dataPlot = [trace1];
    let total = data.total;

    const layout = {
        title: `Estatística Diária - Total de notícias: ${total}`,
        font: { size: 15 }
    };

    const config = { responsive: true }
    Plotly.newPlot('stats-section', dataPlot, layout, config);
}

async function carregaMesAno(data) {
  let ulAno = document.getElementById('ul-ano');
  let container = document.getElementById('container-ano-mes');

  if (data.events.length) {
      let primeiroItem = data.events[0];
      let anoItem = primeiroItem.start_date.year;
      let mesItem = primeiroItem.start_date.month;

      ulAno.innerHTML = '';
      // Adiciona um botão de ano para cada ano retornado
      for (let i of data.anos) {
          let liAno = document.createElement('li');
          let button = document.createElement('button');

          button.type = 'button';
          button.innerHTML = i;
          button.className = 'dropdown-item';

          button.onclick = function () {
              selecionaAno(i);
              buscaMesAno();
          };

          liAno.appendChild(button);
          ulAno.appendChild(liAno);
      }
      // Ajusta os botões de mês anterior/próximo e o mês/ano selecionado
      selecionaAno(anoItem);
      seleciona(mesItem - 1);
      container.classList.remove("invisible");
  } else {
      container.classList.add("invisible");
  }
}

// function consideraBuscaAvancada() {
//     // Move a div collapseExample para dentro do form quando vísivel para que os inputs dessa div
//     // sejam enviados na pesquisa
//     let container = document.getElementById('collapseExample');

//     if (container.classList.contains('show')) {
//         let divBuscaAvancadaForm = document.getElementById('busca-avancada-form');
//         divBuscaAvancadaForm.appendChild(container);
//     } else {
//         let divBuscaAvancada = document.getElementById('busca-avancada');
//         divBuscaAvancada.appendChild(container);
//     }
// }

async function buscaMesAno() {
    // consideraBuscaAvancada();
    let data = await getJson(window.url_pesquisa);
    carregaTimeLine(data);
    atualizaNuvem();
    atualizaGrafico();
}

async function buscaPrincipal() {
    document.getElementById('ano-busca').value = '';
    document.getElementById('mes-busca').value = '';
    // consideraBuscaAvancada();
    let data = await getJson(window.url_pesquisa);
    carregaTimeLine(data);
    carregaMesAno(data);
    atualizaNuvem();
    atualizaGrafico();
}

async function buscaInicial() {
    hideLoadingIndicator();
    document.getElementById('ano-busca').value = '';
    document.getElementById('mes-busca').value = '';    
    let data = await getJson(window.url_pesquisa);
    carregaTimeLine(data);
    carregaMesAno(data);    
}

let btnBusca = document.getElementById('btn-busca');
let btnDownload = document.getElementById('btn-download');
let btnFonte = document.getElementById('btn-fonte');
let cloudButton = document.getElementById("cronocloud");
let statsButton = document.getElementById("stats");

btnBusca.addEventListener('click', function (e) {
    e.preventDefault();
    buscaPrincipal();
});

btnDownload.addEventListener('click', function (e) {
    e.preventDefault();
    // consideraBuscaAvancada();
    let formData = new FormData(document.getElementById('form-busca'));
    let urlParams = new URLSearchParams(formData);
    window.location = '/arquivo_json' + '?' + urlParams.toString();
});

btnFonte.addEventListener('click', function (e) {
// Para não enviar o form de busca, quando o conteúdo de pesquisa avançada estiver dentro do mesmo
e.preventDefault();
});

window.addEventListener("load", function () {
    buscaInicial();
});

document.addEventListener('keydown', function (e) {
    e.stopPropagation(); // **put this line in your code**
    let key = e.key || e.keycode;
    if (key === 'Enter' || key === 13) {
        btnBusca.click();
    }
});

function showLoadingIndicator() {
    $('#palavras').hide();
    $('#crono-nuvem-section').hide();

    $("#loadingIndicator").addClass('d-flex');
}

function hideLoadingIndicator() {
    $("#loadingIndicator").removeClass('d-flex');
    $("#loadingIndicator").hide();

    $("#palavras").show();
    $('#crono-nuvem-section').show();
}

async function atualizaNuvem() {
  showLoadingIndicator();
  let cloudWordsData = await getJson(window.url_nuvem_de_palavras);
  hideLoadingIndicator();
  carregaCloudWords(cloudWordsData);
  carregarCronoCloud(cloudWordsData);
}

async function atualizaGrafico() {
    const graficoData = await getJson(window.url_grafico);
    carregaGrafico(graficoData);
}

cloudButton.addEventListener("click", function (e) {
    e.preventDefault();
        let timelineSection = $("#timeline-section");
        let statsSection = $("#stats-section");
        let nuvemSection = $("#nuvem-section");
        let nuvemCronoSection = $("#crono-nuvem-section");

        if (nuvemSection.is(":visible")) {
            // Se a nuvem já estiver visível, oculta todas as seções
            timelineSection.show();
            statsSection.hide();
            nuvemSection.hide();
            nuvemCronoSection.hide();
            cloudButton.classList.remove("btn-clicked");
        } else {
            // Se a nuvem estiver oculta, mostra apenas a nuvem e a seção de nuvem cronometrada
            cloudButton.classList.add("btn-clicked");
            timelineSection.hide();
            statsSection.hide();
            nuvemSection.show();
            nuvemCronoSection.show();
            atualizaNuvem(); // Suponho que você tenha uma função chamada atualizaNuvem para atualizar a nuvem
        }
});

statsButton.addEventListener("click", function (e) {
        e.preventDefault();
        let timelineSection = $("#timeline-section");
        let statsSection = $("#stats-section");
        let nuvemSection = $("#nuvem-section");
        let nuvemCronoSection = $("#crono-nuvem-section");

        if (statsSection.is(":visible")) {
            // Se a nuvem já estiver visível, oculta todas as seções
            timelineSection.show();
            statsSection.hide();
            nuvemSection.hide();
            nuvemCronoSection.hide();
            statsButton.classList.remove("btn-clicked");
        } else {
            // Se a nuvem estiver oculta, mostra apenas a nuvem e a seção de nuvem cronometrada
            timelineSection.hide();
            statsSection.show();
            statsButton.classList.add("btn-clicked");         
            nuvemSection.hide();
            nuvemCronoSection.hide();            
            atualizaGrafico();
        }

});