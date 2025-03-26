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
    if (!__privateGet(this, _element)) {
      const templateElement = document.createElement("template");
      templateElement.innerHTML = this.template().trim();
      if (templateElement.content.childElementCount === 1) {
        __privateSet(this, _element, templateElement.content.firstElementChild);
      } else {
        const wrapper = document.createElement("section");
        wrapper.id = "app-container";
        while (templateElement.content.firstChild) {
          wrapper.appendChild(templateElement.content.firstChild);
        }
        __privateSet(this, _element, wrapper);
      }
      if (__privateGet(this, _className)) __privateGet(this, _element).classList.add(__privateGet(this, _className));
    } else {
      __privateGet(this, _element).innerHTML = this.template();
    }
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
      </header>
    `;
  }
  onRender() {
    if (!this.element.querySelector(".gnb__button")) {
      const baseURL = window.location.origin.includes("github.io") ? "/javascript-lunch" : "../..";
      const gnbButton = `
        <button type="button" class="gnb__button" aria-label="음식점 추가">
          <img src="${baseURL}/public/images/add-button.png" alt="음식점 추가" />
        </button>
      `;
      const $gnbTitle = this.element.querySelector(".gnb__title");
      $gnbTitle.insertAdjacentHTML("afterend", gnbButton);
    }
    const $gnbButton = this.element.querySelector(".gnb__button");
    $gnbButton.addEventListener("click", () => {
      const $modal = this.parent.querySelector(".modal");
      $modal.classList.remove("hidden");
    });
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
  onRender() {
    document.addEventListener("click", (event) => {
      if (event.target.closest(".modal-backdrop")) this.element.classList.add("hidden");
    });
    document.addEventListener("click", (event) => {
      if (event.target.closest("#modal-cancel")) this.element.classList.add("hidden");
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.element.classList.add("hidden");
    });
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
const BUTTON_TEXT = {
  CANCLE: "취소하기",
  ADD: "추가하기"
};
const INPUT_FIELDS = {
  CATEGORY: "category",
  NAME: "name",
  DISTANCE: "distance",
  DESCRIPTION: "description",
  LINK: "link"
};
const INPUT_LABELS = {
  CATEGORY: "카테고리",
  NAME: "이름",
  DISTANCE: "거리(도보 이동 시간)",
  DESCRIPTION: "설명",
  LINK: "참고 링크"
};
const INPUT_CAPTIONS = {
  DESCRIPTION: "메뉴 등 추가 정보를 입력해 주세요.",
  LINK: "매장 정보를 확인할 수 있는 링크를 입력해 주세요."
};
const CATEGORY_OPTIONS = ["한식", "중식", "일식", "양식", "아시안", "기타"];
const DISTANCE_OPTIONS = [5, 10, 15, 20, 30];
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
const inputBoxList = [
  new InputBox({
    input: new Select({
      name: INPUT_FIELDS.CATEGORY,
      optionList: CATEGORY_OPTIONS
    }).template(),
    section: INPUT_FIELDS.CATEGORY,
    label: INPUT_LABELS.CATEGORY,
    isRequired: true
  }),
  new InputBox({
    input: `<input type="text" name="${INPUT_FIELDS.NAME}" id="${INPUT_FIELDS.NAME}" maxlength="20" required />`,
    section: INPUT_FIELDS.NAME,
    label: INPUT_LABELS.NAME,
    isRequired: true
  }),
  new InputBox({
    input: new Select({
      name: INPUT_FIELDS.DISTANCE,
      optionList: DISTANCE_OPTIONS
    }).template(),
    section: INPUT_FIELDS.DISTANCE,
    label: INPUT_LABELS.DISTANCE,
    isRequired: true
  }),
  new InputBox({
    input: `<textarea maxlength="1000" name="${INPUT_FIELDS.DESCRIPTION}" id="${INPUT_FIELDS.DESCRIPTION}" cols="30" rows="5"></textarea>`,
    section: INPUT_FIELDS.DESCRIPTION,
    label: INPUT_LABELS.DESCRIPTION,
    caption: INPUT_CAPTIONS.DESCRIPTION,
    isRequired: false
  }),
  new InputBox({
    input: `<input type="url" name="${INPUT_FIELDS.LINK}" id="${INPUT_FIELDS.LINK}" />`,
    section: INPUT_FIELDS.LINK,
    label: INPUT_LABELS.LINK,
    caption: INPUT_CAPTIONS.LINK,
    isRequired: false
  })
];
class InputModal extends Component {
  getModalInput(modalForm) {
    const baseURL = window.location.origin.includes("github.io") ? "/javascript-lunch" : "../..";
    const formData = new FormData(modalForm);
    const modalInput = {
      id: Date.now(),
      imgUrl: `${baseURL}/public/images/category-${FOOD_CATEGORY[formData.get(INPUT_FIELDS.CATEGORY)]}.png`,
      category: formData.get(INPUT_FIELDS.CATEGORY),
      name: formData.get(INPUT_FIELDS.NAME),
      distance: formData.get(INPUT_FIELDS.DISTANCE),
      description: formData.get(INPUT_FIELDS.DESCRIPTION),
      link: formData.get(INPUT_FIELDS.LINK)
    };
    return modalInput;
  }
  onRender() {
    const cancelButton = new Button({
      type: "button",
      class: "button--secondary",
      id: "modal-cancel",
      message: BUTTON_TEXT.CANCLE
    });
    const addButtom = new Button({
      type: "submit",
      class: "button--primary",
      id: "modal-add",
      message: BUTTON_TEXT.ADD
    });
    const modal = new Modal({
      content: `
        <h2 class="modal-title text-title">새로운 음식점</h2>
        <form class="modal-form">
          ${inputBoxList.map((input) => input.template()).join("")}
          <div class="button-container">
            ${cancelButton.template()}
            ${addButtom.template()}
          </div>
        </form>
      `
    });
    this.element.appendChild(modal.element);
    const $modalForm = this.element.querySelector(".modal-form");
    $modalForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const modalInput = this.getModalInput($modalForm);
      this.props.addRestaurant(modalInput);
    });
  }
}
class Restaurant extends Component {
  constructor(props, parent) {
    super(props, parent, "li", "restaurant");
  }
  template() {
    const baseURL = window.location.origin.includes("github.io") ? "/javascript-lunch" : "../..";
    return ` 
  <div class="restaurant__category">
    <img
      src="${baseURL}/public/images/${this.props.imgUrl}"
      alt="${this.props.category}"
      class="category-icon"
    />
  </div>
  <div class="restaurant__info">
    <div class="restaurant__info--header">
      <div>
        <h3 class="restausrant__name text-subtitle">${this.props.name}</h3>
        <span class="restaurant__distance text-body">
          캠퍼스로부터 ${this.props.distance}분 내
        </span>
      </div>
      <img class="restaurant__favorite" src="${baseURL}/images/favorite-icon-${this.props.favorite ? "filled" : "lined"}.png" alt="favorite" />
    </div>
    <div>
      <p class="restaurant__description text-body">
        ${this.props.description}
      </p>
    </div>
`;
  }
  onRender() {
    this.element.dataset.id = this.props.id;
  }
}
class DetailModal extends Component {
  onRender() {
    const deleteButton = new Button({
      type: "submit",
      class: "button--secondary",
      id: "modal-delete",
      message: "삭제하기"
    });
    const cancelButton = new Button({
      type: "button",
      class: "button--primary",
      id: "modal-cancel",
      message: "닫기"
    });
    const detailModal = new Modal({
      content: `
        ${this.props.content}
        <a href="${this.props.link}" target="_blank">${this.props.link}</a>
        <div class="button-container">
          ${deleteButton.template()}
          ${cancelButton.template()}
        </div>
      `
    });
    this.element.appendChild(detailModal.element);
    const $modal = this.element.querySelector(".modal");
    const $deleteButton = this.element.querySelector("#modal-delete");
    this.element.querySelector("#modal-cancel");
    this.element.querySelector(".modal-backdrop");
    $deleteButton.addEventListener("click", () => {
      this.props.onDelete();
      $modal.classList.add("hidden");
    });
    const $modalFavorite = this.element.querySelector(".restaurant__favorite");
    if ($modalFavorite) {
      $modalFavorite.addEventListener("click", (event) => {
        const restaurantData = this.props.restaurantData;
        if (!restaurantData) return;
        if (restaurantData.favorite === true) {
          restaurantData.favorite = false;
          if (this.props.removeFavorite) {
            this.props.removeFavorite(restaurantData.id);
          }
        } else {
          restaurantData.favorite = true;
          if (this.props.addFavorite) {
            this.props.addFavorite(restaurantData.id);
          }
        }
      });
    }
  }
}
class RestaurantList extends Component {
  template() {
    return `
        <ul class="restaurant-list"></ul>
    `;
  }
  getRestaurantList() {
    return this.props.restaurantList.map((restaurant) => new Restaurant({ ...restaurant, deleteRestaurant: this.props.deleteRestaurant })).filter((restaurant) => this.filterByCategory(restaurant)).filter((restaurant) => this.filterByActiveTab(restaurant)).sort((a, b) => this.sortRestaurant(a, b));
  }
  filterByCategory(restaurant) {
    return this.props.category === "전체" || restaurant.props.category === this.props.category;
  }
  filterByActiveTab(restaurant) {
    if (this.props.activeTab === "모든 음식점") return true;
    if (this.props.activeTab === "자주 가는 음식점") return restaurant.props.favorite;
    return true;
  }
  sortRestaurant(a, b) {
    if (this.props.sort === "이름순") return a.props.name.localeCompare(b.props.name);
    if (this.props.sort === "거리순") return a.props.distance - b.props.distance;
    return 0;
  }
  onRender() {
    this.element.querySelector(".restaurant-list");
    const restaurantList = this.getRestaurantList();
    restaurantList.forEach((restaurant) => {
      this.element.appendChild(restaurant.element);
    });
    this.element.addEventListener("click", (event) => {
      const restaurantElement = event.target.closest(".restaurant");
      if (!restaurantElement) return;
      const restaurantId = restaurantElement.dataset.id;
      const restaurantData = this.props.restaurantList.find((restaurant) => String(restaurant.id) === restaurantId);
      if (!restaurantData) return;
      const detailModal = new DetailModal({
        content: `
          <div class="restaurant-detail">
            ${new Restaurant(restaurantData).template()}
          </div>
        `,
        onDelete: () => {
          this.props.deleteRestaurant(restaurantData.id);
        },
        link: restaurantData.link,
        restaurantData,
        addFavorite: this.props.addFavorite,
        removeFavorite: this.props.removeFavorite
      });
      this.element.appendChild(detailModal.element);
      const $modal = this.element.querySelector(".modal");
      if ($modal) {
        $modal.classList.remove("hidden");
      }
    });
    this.element.addEventListener("click", (event) => {
      if (event.target.closest(".modal")) return;
      if (event.target.closest(".restaurant__favorite")) {
        const restaurantElement = event.target.closest(".restaurant");
        if (event.target.src.includes("filled")) {
          event.target.src = event.target.src.replace("filled", "lined");
          this.props.removeFavorite(restaurantElement.dataset.id);
        } else {
          event.target.src = event.target.src.replace("lined", "filled");
          this.props.addFavorite(restaurantElement.dataset.id);
        }
      }
      event.stopPropagation();
    });
  }
}
class Filter extends Component {
  template() {
    return ` 
          <select name="${this.props.name}" id="${this.props.name}-filter" class="restaurant-filter">
             ${this.props.optionList.map(
      (option) => `<option value="${option}" ${this.props.standard === option ? "selected" : ""}>${option}</option>`
    )}
          </select>`;
  }
  onRender() {
    this.element.addEventListener("change", (e) => {
      this.props.filter(e.target.value);
    });
  }
}
class Tab extends Component {
  template() {
    return `
      <div class="tab all-restaurants ${this.props.activeTab === "모든 음식점" ? "tab-active" : ""}">모든 음식점</div>
      <div class="tab favorite-restaurants ${this.props.activeTab === "자주 가는 음식점" ? "tab-active" : ""}">자주 가는 음식점</div>

    `;
  }
  onRender() {
    this.element.addEventListener("click", (e) => {
      const tabElement = e.target.closest(".tab");
      const tabs = this.element.querySelectorAll(".tab");
      tabs.forEach((tab) => tab.classList.remove("tab-active"));
      tabElement.classList.add("tab-active");
      const selectedTab = tabElement.innerText;
      this.props.filterFavorite(selectedTab);
    });
  }
}
const defaultRestaurantList = [
  {
    id: 1,
    imgUrl: "category-korean.png",
    category: "한식",
    name: "피양콩할마니",
    distance: 10,
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, '피양'은 평안도 사투리로 '평양'을 의미한다. 딸과 함께 운영하는 이곳에선 맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은 건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만, 할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의 역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은 만큼 덜어 먹을 수 있게 준비돼 있다.",
    link: "https://naver.me/xFLMsS9n",
    favorite: false
  },
  {
    id: 2,
    imgUrl: "category-chinese.png",
    category: "중식",
    name: "친친",
    distance: 5,
    description: "Since 2004 편리한 교통과 주차, 그리고 관록만큼 깊은 맛과 정성으로 정통 중식의 세계를 펼쳐갑니다",
    link: "https://naver.me/FV7Y4RTm",
    favorite: true
  },
  {
    id: 3,
    imgUrl: "category-japanese.png",
    category: "일식",
    name: "잇쇼우",
    distance: 10,
    description: "잇쇼우는 정통 자가제면 사누끼 우동이 대표메뉴입니다. 기술은 정성을 이길 수 없다는 신념으로 모든 음식에 최선을 다하는 잇쇼우는 고객 한분 한분께 최선을 다하겠습니다",
    link: "https://naver.me/FLyTJ4dC",
    favorite: true
  },
  {
    id: 4,
    imgUrl: "category-western.png",
    category: "양식",
    name: "이태리키친",
    distance: 20,
    description: "늘 변화를 추구하는 이태리키친입니다.",
    link: "hhttps://naver.me/5huapW2k",
    favorite: false
  },
  {
    id: 5,
    imgUrl: "category-asian.png",
    category: "아시안",
    name: "호아빈 삼성점",
    distance: 15,
    description: "푸짐한 양에 국물이 일품인 쌀국수",
    link: "https://naver.me/5WOQLjn6",
    favorite: false
  },
  {
    id: 6,
    imgUrl: "category-etc.png",
    category: "기타",
    name: "도스타코스 선릉점",
    distance: 5,
    description: "멕시칸 캐주얼 그릴",
    link: "https://naver.me/Gn0yLQ8K",
    favorite: false
  }
];
class Application extends Component {
  setup() {
    const storedRestaurants = localStorage.getItem("restaurantList");
    this.setState({
      restaurantList: storedRestaurants ? JSON.parse(storedRestaurants) : defaultRestaurantList,
      category: "전체",
      sort: "이름순",
      activeTab: "모든 음식점"
    });
  }
  template() {
    return `
        <div id="app-header"></div>
        <section class="restaurant-favorite-tab"></section>
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
  deleteRestaurant(id) {
    const updatedList = this.state.restaurantList.filter((restaurant) => restaurant.id !== id);
    this.setState({ ...this.state, restaurantList: updatedList });
    localStorage.setItem("restaurantList", JSON.stringify(updatedList));
  }
  filterCategory(category) {
    this.setState({ ...this.state, category });
  }
  filterFavorite(activeTab) {
    this.setState({ ...this.state, activeTab });
  }
  sortList(list) {
    this.setState({ ...this.state, sort: list });
  }
  addFavorite(restaurantId) {
    const updatedList = this.state.restaurantList.map(
      (r) => r.id === Number(restaurantId) ? { ...r, favorite: true } : r
    );
    this.setState({ ...this.state, restaurantList: updatedList });
    localStorage.setItem("restaurantList", JSON.stringify(updatedList));
  }
  removeFavorite(restaurantId) {
    const updatedList = this.state.restaurantList.map(
      (r) => r.id === Number(restaurantId) ? { ...r, favorite: false } : r
    );
    this.setState({ ...this.state, restaurantList: updatedList });
    localStorage.setItem("restaurantList", JSON.stringify(updatedList));
  }
  onRender() {
    const $headerContainer = this.element.querySelector("#app-header");
    const headerInstance = new Header({ title: "점심 뭐 먹지" }, this.element);
    $headerContainer.appendChild(headerInstance.element);
    headerInstance.onRender();
    const $restaurantListContainer = this.element.querySelector(".restaurant-list-container");
    const restaurantList = new RestaurantList({
      restaurantList: this.state.restaurantList,
      category: this.state.category,
      sort: this.state.sort,
      activeTab: this.state.activeTab,
      deleteRestaurant: this.deleteRestaurant.bind(this),
      addFavorite: this.addFavorite.bind(this),
      removeFavorite: this.removeFavorite.bind(this)
    });
    $restaurantListContainer.appendChild(restaurantList.element);
    const $restaurantFilterContainer = this.element.querySelector(".restaurant-filter-container");
    const categoryfilter = new Filter(
      {
        name: "category",
        optionList: ["전체", "한식", "중식", "일식", "양식", "아시안", "기타"],
        filter: this.filterCategory.bind(this),
        standard: this.state.category
      },
      this.element
    );
    $restaurantFilterContainer.appendChild(categoryfilter.element);
    const listSorter = new Filter(
      {
        name: "sorting",
        optionList: ["이름순", "거리순"],
        filter: this.sortList.bind(this),
        standard: this.state.sort
      },
      this.element
    );
    $restaurantFilterContainer.appendChild(listSorter.element);
    const $restaurantFavoriteTab = this.element.querySelector(".restaurant-favorite-tab");
    const tab = new Tab({
      activeTab: this.state.activeTab,
      filterFavorite: this.filterFavorite.bind(this)
    });
    $restaurantFavoriteTab.appendChild(tab.element);
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
