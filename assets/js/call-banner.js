document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('callBanner');
  if (!banner) return;
  let hideTimeout;
  document.querySelectorAll('.open-call-banner').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      banner.classList.add('visible');
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => banner.classList.remove('visible'), 4000);
    });
  });
  document.addEventListener('click', e => {
    if (!banner.contains(e.target) && !e.target.classList.contains('open-call-banner')) {
      banner.classList.remove('visible');
    }
  });
  banner.addEventListener('click', e => e.stopPropagation());
});
