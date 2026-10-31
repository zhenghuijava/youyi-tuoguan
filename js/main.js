// 优益托管 · 轻量交互
(function () {
  'use strict';

  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');

  function closeMenu() {
    if (!toggle || !nav) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '打开菜单');
    document.body.classList.remove('menu-open');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
      document.body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    window.matchMedia('(min-width: 821px)').addEventListener('change', closeMenu);
  }

  // 班型选择：完整支持方向键、Home 与 End。
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-program]'));
  function selectTab(tab, focus) {
    tabs.forEach(function (item) {
      var selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById('panel-' + item.dataset.program).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { selectTab(tab, false); });
    tab.addEventListener('keydown', function (event) {
      var next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectTab(tabs[next], true);
      }
    });
  });

  // 一日安排：保留两份可访问内容，仅切换当前视图。
  var routineButtons = document.querySelectorAll('[data-routine]');
  routineButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      routineButtons.forEach(function (item) {
        var selected = item === button;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      ['midday', 'evening'].forEach(function (name) {
        var list = document.getElementById(name + '-routine');
        var selected = name === button.dataset.routine;
        list.hidden = !selected;
        list.classList.toggle('is-changing', selected);
      });
    });
  });

  // 真实照片查看器使用原生 dialog，保留焦点管理与 Escape 关闭。
  var dialog = document.getElementById('photoDialog');
  var dialogImage = document.getElementById('dialogImage');
  var dialogCaption = document.getElementById('dialogCaption');
  var closeDialog = document.getElementById('dialogClose');
  document.querySelectorAll('[data-photo]').forEach(function (button) {
    button.addEventListener('click', function () {
      dialogImage.src = button.dataset.photo;
      dialogImage.alt = button.dataset.caption;
      dialogCaption.textContent = button.dataset.caption;
      dialog.showModal();
    });
  });
  closeDialog.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) {
    var box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });

  // 当前区块导航提示，不在低性能设备上持续读取布局。
  if ('IntersectionObserver' in window) {
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav > a[href^="#"]'));
    var visible = new Map();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible.set(entry.target.id, entry.isIntersecting); });
      navLinks.forEach(function (link) {
        var id = link.getAttribute('href').slice(1);
        var active = visible.get(id) === true;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    navLinks.forEach(function (link) {
      var section = document.querySelector(link.getAttribute('href'));
      if (section) observer.observe(section);
    });
  }
})();
