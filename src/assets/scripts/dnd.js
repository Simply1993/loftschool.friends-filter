export default function DnD(zones) {
  let currentDrag;

  zones.forEach(zone => {
    zone.addEventListener("dragstart", e => {
      currentDrag = { source: zone, node: e.target };
    });

    zone.addEventListener("dragover", e => {
      e.preventDefault();
    });

    zone.addEventListener("drop", e => {
      if (currentDrag) {
        e.preventDefault();

        if (currentDrag.source !== zone) {
          let btn = currentDrag.node.querySelector(".btn");
          let list = zone.querySelector(".friends__list");

          if (btn.classList.contains("btn--add")) {
            btn.classList.remove("btn--add");
            btn.classList.add("btn--delete");
          } else {
            btn.classList.remove("btn--delete");
            btn.classList.add("btn--add");
          }

          list.appendChild(currentDrag.node);
        }

        currentDrag = null;
      }
    });
  });
}
