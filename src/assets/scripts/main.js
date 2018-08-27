import DnD from "./dnd";

const source = document.querySelector("#source");
const target = document.querySelector("#target");
const filterInputSource = source.querySelector(".filter__input");
const filterInputTarget = target.querySelector(".filter__input");
const btnSave = document.querySelector(".btn--save");
let friendsListSource = [];
let friendsListTarget = [];

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

function isMatching(full, chunk) {
  return full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1;
}

function addToZone(zone, friends) {
  let template = require("pug-loader!../../views/templates/friends.pug");
  let friendsList = zone.querySelector(".friends");
  let filterInput = zone.querySelector(".filter__input");
  let friendsFilter = friends.filter(friend =>
    isMatching(`${friend.first_name} ${friend.last_name}`, filterInput.value)
  );
  let html = template({
    friends: friendsFilter
  });

  friendsList.innerHTML = html;
  return friendsFilter;
}

//получение друзей
auth()
  .then(() => callAPI("friends.get", { fields: "photo_100" }))
  .then(friends => {
    friendsListSource = friends.items;
    addToZone(source, friendsListSource);

    DnD({
      zones: [source, target],
      buttonAdd: "btn--add",
      buttonDelete: "btn--delete",
      friendsSource: friendsListSource,
      friendsTarget: friendsListTarget
    });

    filterInputSource.addEventListener("keyup", () =>
      addToZone(source, friendsListSource)
    );
    filterInputTarget.addEventListener("keyup", () =>
      addToZone(target, friendsListTarget)
    );
    btnSave.addEventListener("click", () => {
      localStorage["friend-filter"] = JSON.stringify({
        friendsListSource,
        friendsListTarget
      });
    });
  });
