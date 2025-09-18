// Substitua pelos dados do seu projeto Supabase
const SUPABASE_URL = "https://unmnfifouemowyrkdjdj.supabase.co/rest/v1/sensores";
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVubW5maWZvdWVtb3d5cmtkamRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MjI4MDcsImV4cCI6MjA3Mjk5ODgwN30.AZAm7yidblij9Wqm-wRbM8qUmFSq8YoWSrlHiJSKDu8';

// Cria cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function carregarClima() {
  try {
    // Pega os últimos 5 registros
    const { data, error } = await supabase
      .from("sensores")   // <-- substitua pelo nome da sua tabela
      .select("*")
      .order("id", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Erro Supabase:", error);
      return;
    }
    if (!data || data.length === 0) {
      console.log("Nenhum dado disponível na tabela.");
      return;
    }

    const ultimoClima = data[0];

    // Atualiza temperatura principal
    const tempEl = document.querySelector(".weather-item h1");
    if (tempEl) tempEl.textContent = (ultimoClima.temperatura ?? "--") + "°";

    // Atualiza detalhes
    const detailsEl = document.querySelector(".weather-item.details");
    if (detailsEl) {
      detailsEl.innerHTML = `
        <p>Última leitura do sistema</p>
        <p>Pressão: <span>${ultimoClima.pressao ?? "--"} hPa</span></p>
      `;
    }

    // Atualiza gráficos
    atualizarGraficos(data.reverse()); // inverte para mostrar do mais antigo ao mais recente

  } catch (err) {
    console.error("Erro ao carregar clima:", err);
  }
}

function atualizarGraficos(dados) {
  const labels = dados.map((_, i) => `#${i+1}`); // só números 1 a 5
  const chuva = dados.map(d => d.chuva ?? 0);
  const temp = dados.map(d => d.temperatura ?? 0);
  const pressao = dados.map(d => d.pressao ?? 0);

  // Gráfico de chuva
  const ctxChuva = document.getElementById("graficoChuva");
  if (ctxChuva) {
    new Chart(ctxChuva, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Chuva (%)",
          data: chuva,
          backgroundColor: "#4a90e2"
        }],
      },
    });
  }

  // Gráfico de temperatura
  const ctxTemp = document.getElementById("graficoTemperatura");
  if (ctxTemp) {
    new Chart(ctxTemp, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Temperatura (°C)",
          data: temp,
          borderColor: "#ff5733",
          fill: false
        }],
      },
    });
  }

  // Gráfico de pressão
  const ctxPressao = document.getElementById("graficoPressao");
  if (ctxPressao) {
    new Chart(ctxPressao, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Pressão (hPa)",
          data: pressao,
          borderColor: "#33c1ff",
          fill: false
        }],
      },
    });
  }
}

// Carrega ao abrir a página
carregarClima();

// Atualiza a cada 60s
setInterval(carregarClima, 60000);
