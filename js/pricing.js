(function () {
  const packageLinks = document.querySelectorAll('[data-package]');

  packageLinks.forEach((link) => {
    const packageId = link.dataset.package;
    if (!packageId) return;

    const destination = new URL(link.getAttribute('href') || 'contact.html', window.location.href);
    destination.searchParams.set('package', packageId);
    link.href = destination.href;
  });
})();
