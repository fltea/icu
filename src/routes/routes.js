const routes = [];
let notFound;

const pages = import.meta.globEager("/src/pages/**/*.vue");
const rootDir = "/src/pages";
// console.log(pages);

const getItem = (page) => {
  let pageName = page.replace(rootDir, "");
  pageName = pageName.replace(".vue", "");

  let name = pageName.split("/").filter((v) => !!v);
  const nlen = name.length;
  if (nlen > 1 && name[nlen - 1] === "index") {
    name.pop();
  }
  name = name.join("-");

  let path = pageName.replace(/\/?index/, "");
  path = path.replace(/_/g, ":");
  path = path.toLowerCase();
  if (!path) {
    path = "/";
  }

  let item = {
    path,
    name,
    component: pages[page].default,
  };

  return { name, item };
};
Object.keys(pages).forEach((page) => {
  // console.log('page', page);
  const { name, item } = getItem(page);
  if (name === "404") {
    notFound = true;
  }
  if (name === "index") {
    routes.unshift(item);
  } else {
    routes.push(item);
  }
});

if (notFound) {
  routes.push({
    path: "/:pathMatch(.*)*",
    redirect: "404",
  });
}

export default routes;
