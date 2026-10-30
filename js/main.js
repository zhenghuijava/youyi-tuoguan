// 优益托管 · 交互脚本
(function () {
  // 移动端菜单
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
  }

  // 导航高亮当前区块
  var links = nav ? Array.prototype.slice.call(nav.querySelectorAll('a')) : [];
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function highlight() {
    var pos = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (s) {
      if (s.offsetTop <= pos) current = s;
    });
    links.forEach(function (a) {
      a.classList.toggle('active', current && a.getAttribute('href') === '#' + current.id);
    });
  }
  window.addEventListener('scroll', highlight, { passive: true });
  highlight();

  // 平滑滚动（兼容旧浏览器）
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
