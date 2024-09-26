self.addEventListener("push", function (e) {
  const { title, body } = e.data?.json() ?? {};
  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "./src/assets/icons/favicon.ico",
    })
  );
});
