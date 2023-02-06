const globalComponent = (keys) => {
  const components = [];
  const list = import.meta.globEager('/src/components/**/*.vue');
  Object.keys(list).forEach((component) => {
    const item = keys.filter((v) => component.includes(v));
    if (item.length) {
      const names = component.split('/');
      let name = names.pop().replace('.vue', '');
      if (name === 'index') {
        name = names.pop().replace('.vue', '');
      }
      const element = list[component].default;
      element.name = name;
      components.push(element);
    }
  });
  return components;
};

function setCom(list) {
  function install(app) {
    globalComponent(list).forEach((element) => {
      app.component(element.name, element);
    });
  }

  return {
    install,
  };
}

export default setCom;
