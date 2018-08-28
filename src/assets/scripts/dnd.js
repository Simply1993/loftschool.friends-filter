import { isMatching } from "./main";

export default function DnD(options) {
  let currentDrag;

  let moveElement = function(zone, source, node) {
    let filterInput = zone.querySelector(".filter__input");
    let itemIndex, itemFriend, itemDelete;
    if (source !== zone) {
      let btn = node.querySelector(".btn");
      let list = zone.querySelector(".friends__list");
      if (btn.classList.contains(options.buttonAdd)) {
        btn.classList.remove(options.buttonAdd);
        btn.classList.add(options.buttonDelete);
      } else {
        btn.classList.remove(options.buttonDelete);
        btn.classList.add(options.buttonAdd);
      }

      itemIndex = options.friendsSource.findIndex(
        friend => friend.id == node.getAttribute("data-id")
      );
      if (itemIndex >= 0) {
        itemDelete = options.friendsSource.splice(itemIndex, 1);
        options.friendsTarget.push(itemDelete[0]);
      } else {
        itemIndex = options.friendsTarget.findIndex(
          friend => friend.id == node.getAttribute("data-id")
        );
        itemDelete = options.friendsTarget.splice(itemIndex, 1);
        options.friendsSource.push(itemDelete[0]);
      }
      itemFriend = itemDelete[0];
      if (
        isMatching(
          `${itemFriend.first_name} ${itemFriend.last_name}`,
          filterInput.value
        )
      ) {
        list.appendChild(node);
      } else {
        node.remove();
      }
    }
  };

  options.zones.forEach((zone, index) => {
    zone.addEventListener("click", e => {
      if (e.target.classList.contains(options.buttonAdd)) {
        moveElement(
          options.zones[index + 1],
          zone,
          e.target.closest(".friend")
        );
      } else if (e.target.classList.contains(options.buttonDelete)) {
        moveElement(
          options.zones[index - 1],
          zone,
          e.target.closest(".friend")
        );
      }
    });

    zone.addEventListener("dragstart", e => {
      currentDrag = { source: zone, node: e.target };
    });

    zone.addEventListener("dragover", e => {
      e.preventDefault();
    });

    zone.addEventListener("drop", e => {
      if (currentDrag) {
        e.preventDefault();

        moveElement(zone, currentDrag.source, currentDrag.node);

        currentDrag = null;
      }
    });
  });
}
