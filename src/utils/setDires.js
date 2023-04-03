function setDire(app) {
  app.directive('loading', (el, binding) => {
    if (binding.value) {
      el.classList.add('com-loading');
      const dom = el.querySelector('.loading-container');
      if (!dom) {
        const ner = document.createElement('div');
        ner.innerHTML = '<div class="loading-main"></div>';
        ner.classList.add('loading-container');
        el.appendChild(ner);
      }
    } else {
      el.classList.remove('com-loading');
    }
  });
}

export default setDire;
