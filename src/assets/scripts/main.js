import DnD from "./dnd";

VK.init({
  apiId: 6673689
});

function auth() {
  return new Promise((resolve, reject) => {
    VK.Auth.login(data => {
      if (data.session) {
        resolve();
      } else {
        reject(new Error("Не удалось авторизоваться"));
      }
    }, 2);
  });
}

function callAPI(method, params) {
  params.v = "5.76";

  return new Promise((resolve, reject) => {
    VK.api(method, params, data => {
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data.response);
      }
    });
  });
}

//получение друзей
auth()
  .then(() => callAPI("friends.get", { fields: "photo_100" }))
  .then(friends => {
    console.log(friends);
    let template = require("pug-loader!../../views/templates/friends.pug");
    let locals = { friends: friends.items };
    let html = template(locals);
    let friendsList = document.querySelector("#source .friends");
    friendsList.innerHTML = html;
  });

const source = document.querySelector("#source");
const target = document.querySelector("#target");

DnD([source, target]);
