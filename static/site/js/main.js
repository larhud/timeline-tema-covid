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

function selecionaMesEBusca(m){
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
  // $('.multiple-select').multipleSelect();
  var words = [
    { text: "ciência", weight: 13 },
    { text: "informação", weight: 12 },
    { text: "janeiro", weight: 8 },
    { text: "gestão", weight: 10 },
    { text: "pós-graduação", weight: 8 },
    { text: "tecnologia", weight: 7 },
    { text: "federal", weight: 7 },
    { text: "programa", weight: 6 },
    { text: "ibict", weight: 6 },
    { text: "comunicação", weight: 5 },
    { text: "membro", weight: 5 },
    { text: "grupo", weight: 4 },
    { text: "produção", weight: 4 },
    { text: "conhecimento", weight: 3 },
    { text: "mestrado", weight: 3 },
    /* ... */
  ];

  $("#palavras").jQCloud(words, {
    // fontSize: function (width, height, step) {
    //   if (step == 1) return width * 0.005 * step + "px";

    //   return width * 0.005 * step + "px";
    // },
    delayedMode: false,
    autoResize: true,
    colors: ["#0FCEFF", "#7B61FF", "#244CB2"],
  });

  $("#dataFiltro").daterangepicker(
    {
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
        "Mês Passado": [
          moment().subtract(1, "month").startOf("month"),
          moment().subtract(1, "month").endOf("month"),
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

async function getJson() {
    let formData = new FormData(document.getElementById('form-busca'));
    let urlParams = new URLSearchParams(formData);
    let url = window.url_pesquisa + '?' + urlParams.toString();
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
}

async function carregaTimeLine(data) {
    document.getElementById('timeline-embed').innerHTML = '';
    window.timeline = new TL.Timeline('timeline-embed', data);
}

async function carregaCloudWords(data) {
    // Aguardando definição dos dados para preencher a nuvem de palavras
    return data;
}

async function carregaMesAno(data){
    let ulAno = document.getElementById('ul-ano');
    let container = document.getElementById('container-ano-mes');

    if (data.events.length) {
        let primeiroItem = data.events[0];
        let anoItem = primeiroItem.start_date.year;
        let mesItem = primeiroItem.start_date.month;

        ulAno.innerHTML = '';
        // Adiciona um botão de ano para cada ano retornado
        for (let i of data.anos){
            let liAno = document.createElement('li');
            let button = document.createElement('button');

            button.type = 'button';
            button.innerHTML = i;
            button.className = 'dropdown-item';

            button.onclick = function(){
                selecionaAno(i);
                buscaMesAno();
            };

            liAno.appendChild(button);
            ulAno.appendChild(liAno);
        }
        // Ajusta os botões de mês anterior/próximo e o mês/ano selecionad
        selecionaAno(anoItem);
        seleciona(mesItem - 1);
        container.classList.remove("invisible");
    }
    else {
        container.classList.add("invisible");
    }
}

function consideraBuscaAvancada(){
    // Move a div collapseExample para dentro do form quando vísivel para que os inputs dessa div
    // sejam enviados na pesquisa
    let container = document.getElementById('collapseExample');

    if (container.classList.contains('show')) {
        let divBuscaAvancadaForm = document.getElementById('busca-avancada-form');
        divBuscaAvancadaForm.appendChild(container);
    } else {
        let divBuscaAvancada = document.getElementById('busca-avancada');
        divBuscaAvancada.appendChild(container);
    }
}

async function buscaMesAno() {
    consideraBuscaAvancada();
    let data = await getJson();
    carregaTimeLine(data);
    carregaCloudWords(data);
}

async function buscaPrincipal() {
    document.getElementById('ano-busca').value = '';
    document.getElementById('mes-busca').value = '';
    consideraBuscaAvancada();
    let data = await getJson();
    carregaTimeLine(data);
    carregaCloudWords(data);
    carregaMesAno(data);
}

let btnBusca = document.getElementById('btn-busca');
let btnBuscaAvancada = document.getElementById('btn-avancada');

btnBusca.addEventListener('click', function (e) {
    e.preventDefault();
    buscaPrincipal();
});

btnBuscaAvancada.addEventListener('click', function (e) {
    e.preventDefault();
});

window.addEventListener("load", function () {
    buscaPrincipal();
});