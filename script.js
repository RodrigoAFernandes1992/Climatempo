<!-- Supabase (UMD) -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<!-- Chart.js já está no seu head, como vi no index.html -->
<script>
  // Substitua pelos dados do seu projeto
  const SUPABASE_URL = "https://SUA-URL-PROJETO.supabase.co";
  const SUPABASE_ANON_KEY = "SUA-CHAVE-ANON";

  // Cria cliente Supabase
  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async function carregarClima() {
    try {
      // pega o registro mais recente
      const { data, error } = await supabase
        .from("clima")
        .select("*")
        .order("id", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Erro Supabase:", error);
        return;
      }
      if (!data || data.length === 0) {
        console.log("Nenhum dado disponível na tabela 'clima'.");
        return;
      }

      const clima = data[0];

      // Atualiza a temperatura principal
      const tempEl = document.querySelector(".weather-item h1");
      if (tempEl) tempEl.textContent = (clima.temperatura ?? "--") + "°";

      // Atualiza detalhes (agora inclui pressão)
      const detailsEl = document.querySelector(".weather-item.details");
      if (detailsEl) {
        detailsEl.innerHTML = `
          <p>Última leitura do sistema</p>
          <p>Pressão: <span>${clima.pressao ?? "--"} hPa</span></p>
        `;
      }

      // Atualiza gráficos
      atualizarGraficos(clima);
    } catch (err) {
      console.error("Erro ao carregar clima:", err);
    }
  }

  function atualizarGraficos(clima) {
    // Gráfico de chuva
    const ctxChuva = document.getElementById("graficoChuva");
    if (ctxChuva) {
      new Chart(ctxChuva, {
        type: "bar",
        data: {
          labels: ["Hoje"],
          datasets: [{
            label: "Chuva (%)",
            data: [clima.chuva ?? 0],
          }]
        }
      });
    }

    // Gráfico de temperatura
    const ctxTemp = document.getElementById("graficoTemperatura");
    if (ctxTemp) {
      new Chart(ctxTemp, {
        type: "line",
        data: {
          labels: ["Hoje"],
          datasets: [{
            label: "Temperatura (°C)",
            data: [clima.temperatura ?? 0],
          }]
        }
      });
    }

    // Gráfico de pressão
    const ctxPressao = document.getElementById("graficoPressao");
    if (ctxPressao) {
      new Chart(ctxPressao, {
        type: "line",
        data: {
          labels: ["Hoje"],
          datasets: [{
            label: "Pressão (hPa)",
            data: [clima.pressao ?? 0],
          }]
        }
      });
    }
  }

  // Carrega ao abrir a página
  carregarClima();

  // Opcional: atualizar a cada 60s (descomente se quiser auto-refresh)
  // setInterval(carregarClima, 60000);
</script>
