var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _element, _state, _props, _tagName, _className;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
class Component {
  constructor(props, parent, tagName = "div", className = "") {
    __privateAdd(this, _element);
    __privateAdd(this, _state);
    __privateAdd(this, _props);
    __privateAdd(this, _tagName);
    __privateAdd(this, _className);
    __privateSet(this, _props, props);
    this.parent = parent;
    __privateSet(this, _state, {});
    __privateSet(this, _tagName, tagName);
    __privateSet(this, _className, className);
    this.setup();
    this.render();
  }
  setup() {
  }
  render() {
    if (!__privateGet(this, _element)) __privateSet(this, _element, document.createElement(__privateGet(this, _tagName)));
    if (__privateGet(this, _className)) __privateGet(this, _element).classList.add(__privateGet(this, _className));
    __privateGet(this, _element).innerHTML = this.template();
    this.onRender();
  }
  setState(nextState) {
    __privateSet(this, _state, nextState);
    this.render();
  }
  template() {
    return ``;
  }
  onRender() {
  }
  get element() {
    return __privateGet(this, _element);
  }
  get props() {
    return __privateGet(this, _props);
  }
  get state() {
    return __privateGet(this, _state);
  }
}
_element = new WeakMap();
_state = new WeakMap();
_props = new WeakMap();
_tagName = new WeakMap();
_className = new WeakMap();
class Button extends Component {
  template() {
    return `
     <button
        type=${this.props.type}
        class="button ${this.props.class} text-caption"
        id=${this.props.id}
        >
        ${this.props.message}
    </button>`;
  }
}
class Header extends Component {
  template() {
    return `
      <header class="gnb">
        <h1 class="gnb__title text-title">${this.props.title}</h1>
        <button type="button" class="gnb__button" aria-label="음식점 추가">
          <img src="../../public/images/add-button.png" alt="음식점 추가" />
        </button>
      </header>
    `;
  }
}
class InputBox extends Component {
  template() {
    var _a;
    return `
      <div class="form-item ${((_a = this.props) == null ? void 0 : _a.isRequired) ? "form-item--required" : ""}">
        <label for="${this.props.section}" class="text-caption">${this.props.label}</label>
        ${this.props.input}
        <span class="help-text text-caption">${this.props.caption ?? ""}</span>
      </div>
    `;
  }
}
const FOOD_CATEGORY = {
  한식: "korean",
  중식: "chinese",
  일식: "japanese",
  양식: "western",
  아시안: "asian",
  기타: "etc"
};
class Select extends Component {
  template() {
    return ` 
          <select name="${this.props.name}" id="${this.props.name}" required >
          <option value="">선택해 주세요</option>
            ${this.props.optionList.map(
      (option) => `<option value="${option}">${this.props.name === "distance" ? `${option}분 내` : option}</option>`
    )}
          </select>`;
  }
}
class Modal extends Component {
  template() {
    return `
        <div class="modal modal--open hidden">
        <div class="modal-backdrop"></div>
        <div class="modal-container">
            ${this.props.content}
        </div>
      </div>
        `;
  }
}
class InputModal extends Component {
  template() {
    const inputBoxList = [
      new InputBox({
        input: new Select({
          name: "category",
          optionList: ["한식", "중식", "일식", "양식", "아시안", "기타"]
        }).template(),
        section: "category",
        label: "카테고리",
        isRequired: true
      }),
      new InputBox({
        input: `<input type="text" name="name" id="name" maxlength='20' required />`,
        section: "name",
        label: "이름",
        isRequired: true
      }),
      new InputBox({
        input: new Select({
          name: "distance",
          optionList: [5, 10, 15, 20, 30]
        }).template(),
        section: "distance",
        label: "거리(도보 이동 시간)",
        isRequired: true
      }),
      new InputBox({
        input: `<textarea maxlength='1000' name="description" id="description" cols="30" rows="5"></textarea>`,
        section: "description",
        label: "설명",
        caption: "메뉴 등 추가 정보를 입력해 주세요.",
        isRequired: false
      }),
      new InputBox({
        input: `<input type="url" name="link" id="link" />`,
        section: "link",
        label: "참고 링크",
        caption: "매장 정보를 확인할 수 있는 링크를 입력해 주세요.",
        isRequired: false
      })
    ];
    const cancelButton = new Button({
      type: "button",
      class: "button--secondary",
      id: "modal-cancel",
      message: "취소하기"
    });
    const addButtom = new Button({
      type: "submit",
      class: "button--primary",
      id: "modal-add",
      message: "추가하기"
    });
    return `
             ${new Modal({
      content: `
               <h2 class="modal-title text-title">새로운 음식점</h2>
                <form class="modal-form">
                  ${inputBoxList.map((input) => input.template()).join("")}
                  <div class="button-container">
                    ${cancelButton.template()}
                    ${addButtom.template()}
                  </div>
                </form>`
    }).template()}
        `;
  }
  onRender() {
    const $modalCancelButton = this.element.querySelector("#modal-cancel");
    const $modalBackdrop = this.element.querySelector(".modal-backdrop");
    const $modal = this.element.querySelector(".modal");
    $modalCancelButton.addEventListener("click", function() {
      $modal.classList.add("hidden");
    });
    $modalBackdrop.addEventListener("click", function() {
      $modal.classList.add("hidden");
    });
    const $addRestaurantButton = this.parent.querySelector(".gnb__button");
    $addRestaurantButton.addEventListener("click", function() {
      $modal.classList.remove("hidden");
    });
    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape") $modal.classList.add("hidden");
    });
    const $modalForm = this.element.querySelector(".modal-form");
    $modalForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const $categoryInput = this.element.querySelector("#category");
      const $name = this.element.querySelector("#name");
      const $distance = this.element.querySelector("#distance");
      const $description = this.element.querySelector("#description");
      const $link = this.element.querySelector("#link");
      const modalInput = {
        imgUrl: `../../public/images/category-${FOOD_CATEGORY[$categoryInput.value]}.png`,
        category: $categoryInput.value,
        name: $name.value,
        distance: $distance.value,
        description: $description.value,
        link: $link.value
      };
      this.props.addRestaurant(modalInput);
    });
  }
}
class DetailModal extends Component {
  onRender() {
    const detailModal = new Modal({
      content: this.props.content
    });
    this.element.appendChild(detailModal.element);
    const $modal = this.element.querySelector(".modal");
    document.addEventListener("click", function(event) {
      if (event.target.closest(".modal-backdrop")) $modal.classList.add("hidden");
    });
    document.addEventListener("click", function(event) {
      if (event.target.closest("#modal-cancel")) $modal.classList.add("hidden");
    });
    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape") $modal.classList.add("hidden");
    });
  }
}
class Restaurant extends Component {
  constructor(props, parent) {
    super(props, parent, "li", "restaurant");
  }
  template() {
    return ` 
      <div class="restaurant__category">
        <img
          src="./public/images/${this.props.imgUrl}"
          alt=${this.props.category}
          class="category-icon"
        />
      </div>
      <div class="restaurant__info">
        <h3 class="restaurant__name text-subtitle">${this.props.name}</h3>
        <span class="restaurant__distance text-body"
          >캠퍼스로부터 ${this.props.distance}분 내</span
        >
        <p class="restaurant__description text-body">
          ${this.props.description}
        </p>
      </div>
  `;
  }
  onRender() {
    this.element.querySelector(".restaurant");
    const deleteButton = new Button({
      type: "submit",
      class: "button--secondary",
      id: "modal-add",
      message: "삭제하기"
    });
    const cancelButton = new Button({
      type: "button",
      class: "button--primary",
      id: "modal-cancel",
      message: "닫기"
    });
    const detailModal = new DetailModal({
      content: `
      ${this.template()}
      <a href="${this.props.link}" target="_blank">${this.props.link}</a>
       <div class="button-container">
          ${deleteButton.template()}
          ${cancelButton.template()}
      </div>
      `
    });
    this.element.appendChild(detailModal.element);
    this.element.addEventListener("click", () => {
      const $modal = this.element.querySelector(".modal");
      if ($modal) {
        $modal.classList.remove("hidden");
      }
    });
  }
}
class RestaurantList extends Component {
  template() {
    return `
        <ul class="restaurant-list"></ul>
    `;
  }
  onRender() {
    const $restaurantList = this.element.querySelector(".restaurant-list");
    const restaurantList = this.props.restaurantList.map((restaurant) => new Restaurant(restaurant)).filter((restaurant) => this.props.category === "전체" || restaurant.props.category === this.props.category).sort((a, b) => {
      if (this.props.sort === "이름순") return a.props.name.localeCompare(b.props.name);
      if (this.props.sort === "거리순") return a.props.distance - b.props.distance;
      return 0;
    });
    restaurantList.forEach((restaurant) => {
      $restaurantList.appendChild(restaurant.element);
    });
  }
}
class Filter extends Component {
  template() {
    return ` 
          <select name="${this.props.name}" id="${this.props.name}-filter" class="restaurant-filter">
             ${this.props.optionList.map(
      (option) => `<option value="${option}" ${this.props.category === option ? "selected" : ""}>${option}</option>`
    )}
          </select>`;
  }
  onRender() {
    const $categorySelect = this.element.querySelector(`#${this.props.name}-filter`);
    $categorySelect.addEventListener("change", (e) => {
      this.props.filterCategory(e.target.value);
    });
  }
}
const defaultRestaurantList = [
  {
    imgUrl: "category-korean.png",
    category: "한식",
    name: "피양콩할마니",
    distance: 10,
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, '피양'은 평안도 사투리로 '평양'을 의미한다. 딸과 함께 운영하는 이곳에선 맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은 건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만, 할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의 역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은 만큼 덜어 먹을 수 있게 준비돼 있다.",
    link: "https://naver.me/xFLMsS9n"
  },
  {
    imgUrl: "category-chinese.png",
    category: "중식",
    name: "친친",
    distance: 5,
    description: "Since 2004 편리한 교통과 주차, 그리고 관록만큼 깊은 맛과 정성으로 정통 중식의 세계를 펼쳐갑니다",
    link: "https://naver.me/FV7Y4RTm"
  },
  {
    imgUrl: "category-japanese.png",
    category: "일식",
    name: "잇쇼우",
    distance: 10,
    description: "잇쇼우는 정통 자가제면 사누끼 우동이 대표메뉴입니다. 기술은 정성을 이길 수 없다는 신념으로 모든 음식에 최선을 다하는 잇쇼우는 고객 한분 한분께 최선을 다하겠습니다",
    link: "https://naver.me/FLyTJ4dC"
  },
  {
    imgUrl: "category-western.png",
    category: "양식",
    name: "이태리키친",
    distance: 20,
    description: "늘 변화를 추구하는 이태리키친입니다.",
    link: "hhttps://naver.me/5huapW2k"
  },
  {
    imgUrl: "category-asian.png",
    category: "아시안",
    name: "호아빈 삼성점",
    distance: 15,
    description: "푸짐한 양에 국물이 일품인 쌀국수",
    link: "https://naver.me/5WOQLjn6"
  },
  {
    imgUrl: "category-etc.png",
    category: "기타",
    name: "도스타코스 선릉점",
    distance: 5,
    description: "멕시칸 캐주얼 그릴",
    link: "https://naver.me/Gn0yLQ8K"
  }
];
class Sorter extends Component {
  template() {
    return ` 
              <select name="${this.props.name}" id="${this.props.name}-filter" class="restaurant-filter" >
                 ${this.props.optionList.map(
      (option) => `<option value="${option}" ${this.props.sort === option ? "selected" : ""}>${option}</option>`
    )}
              </select>`;
  }
  onRender() {
    const $listSorter = this.element.querySelector(`#${this.props.name}-filter`);
    $listSorter.addEventListener("change", (e) => {
      this.props.sortList(e.target.value);
    });
  }
}
class Application extends Component {
  setup() {
    const storedRestaurants = localStorage.getItem("restaurantList");
    this.setState({
      restaurantList: storedRestaurants ? JSON.parse(storedRestaurants) : defaultRestaurantList,
      category: "전체",
      sort: "이름순"
    });
  }
  template() {
    return `
      ${new Header({ title: "오늘 뭐 먹지" }).template()}
      <section class="restaurant-filter-container"></section>
      <section class="restaurant-list-container"></section>
     

    `;
  }
  addRestaurant(restaurant) {
    const newRestaurantList = [...this.state.restaurantList, restaurant];
    this.setState({
      ...this.state,
      restaurantList: newRestaurantList
    });
    localStorage.setItem("restaurantList", JSON.stringify(newRestaurantList));
  }
  filterCategory(category) {
    this.setState({ ...this.state, category });
  }
  sortList(list) {
    this.setState({ ...this.state, sort: list });
  }
  onRender() {
    const $restaurantListContainer = this.element.querySelector(".restaurant-list-container");
    const restaurantList = new RestaurantList({
      restaurantList: this.state.restaurantList,
      category: this.state.category,
      sort: this.state.sort
    });
    $restaurantListContainer.appendChild(restaurantList.element);
    const $restaurantFilterContainer = this.element.querySelector(".restaurant-filter-container");
    const categoryfilter = new Filter(
      {
        name: "category",
        optionList: ["전체", "한식", "중식", "일식", "양식", "아시안", "기타"],
        filterCategory: this.filterCategory.bind(this),
        category: this.state.category
      },
      this.element
    );
    $restaurantFilterContainer.appendChild(categoryfilter.element);
    const listSorter = new Sorter(
      {
        name: "sorting",
        optionList: ["이름순", "거리순"],
        sortList: this.sortList.bind(this),
        sort: this.state.sort
      },
      this.element
    );
    $restaurantFilterContainer.appendChild(listSorter.element);
    const inputModal = new InputModal(
      {
        modalTitle: "새로운 음식점",
        addRestaurant: this.addRestaurant.bind(this)
      },
      this.element
    );
    this.element.appendChild(inputModal.element);
  }
}
addEventListener("load", () => {
  const $app = document.querySelector("#app");
  const application = new Application();
  $app.appendChild(application.element);
});
