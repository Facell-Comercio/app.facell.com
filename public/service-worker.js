self.addEventListener("push", function (e) {
  const { title, body, image_url, url } = e.data?.json() ?? {}; //* Imagem e URL são opcionais

  const options = {
    body: body,
    icon: "./src/assets/icons/favicon.ico",
    image: image_url || null,
    data: {
      url: url || null,
    },
    actions: [
      {
        action: "open_url", // Identificador da ação
        title: "Ver", // Título do botão
      },
      {
        action: "close", // Identificador para fechar
        title: "Fechar", // Título do botão
      },
    ],
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Captura o clique nos botões de ação
self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // Fecha a notificação

  const action = event.action; // Identifica qual ação foi clicada
  const urlToOpen = event.notification.data?.url;

  if (action === "open_url" && urlToOpen) {
    // Se o botão "Abrir" foi clicado e existe uma URL, abre a URL
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (let client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

self.addEventListener("install", (event) => {
  // Força o novo service worker a se ativar imediatamente após a instalação
  self.skipWaiting();
});
