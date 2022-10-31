//Storage Controller
const StorageCtrl = (function() {

  // Public methods
  return {
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    storeItem: function(item){
      let items;
      // Check if any items in ls
      if (localStorage.getItem('items') === null) {
        items = [];
        // push new item
        items.push(item);
        // Set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // get whats inside ls
        items = JSON.parse(localStorage.getItem('items'));

        // push new item
        items.push(item);

        // re set ls
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem); // get , delete, replace
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(id === item.id){
          items.splice(index, 1); // get , delete
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();

//Item Controller
const ItemCtrl = (function() {
  // Item Contructor
  const Item = function(id, front, back) {
    this.id = id;
    this.front = front;
    this.back = back;
  }

  const data = {
    // items: [
    //   {id:0, front: "anecdote", back: "a short account of an incident in someone's life"},
    //   {id:1, front: "counterfeit", back: "an imitation designed to deceive"},
    //   {id:2, front: "dominate", back: "to rule over by strength or power"},
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
  }

  // Public Methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(front, back) {
      let ID;
      
      // Create ID
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item
      newItem = new Item(ID, front, back);
      
      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = null;
      // Loop through items
      data.items.forEach(function(item) {
        if(item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(front, back) {

      let found = null;

      data.items.forEach(function(item) {
        if(item.id === data.currentItem.id) {
          item.front = front;
          item.back = back;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id){
      // Get ids
      const ids = data.items.map(function(item){
        return item.id;
      });

      // get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function(){
      data.items = [];
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
  }
})();

//UI Controller
const UICtrl = (function() {
  // Created a var for easy update across app
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemFrontInput: '#item-front',
    itemBackInput: '#item-back'
  }

  // Public Methods
  return {
    populateItemList: function(items) {
      let html = '';

      items.forEach((item) => {
        html += `
          <li class="list-group-item text-bg-secondary position relative" id="item-${item.id}">
            <div class="row p-2">
              <div class="col">
                <p class="card-text">${item.front}</p>
              </div>
              <div class="col border-start border-dark border-2">
                <p class="card-text ms-3">${item.back}
                </p>
              </div>
            </div>
            <a href="#" class="text-light position-absolute top-0 end-0 translate-middle-x">
              <i class="edit-item bi bi-pencil-square"></i>
            </a>
        </li>`
      });

      // Insert list Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        front: document.querySelector(UISelectors.itemFrontInput).value,
        back: document.querySelector(UISelectors.itemBackInput).value
      }
    },
    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'list-group-item text-bg-secondary position relative';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
        <div class="row p-2">
          <div class="col">
            <p class="card-text">${item.front}</p>
          </div>
          <div class="col border-start border-dark border-2">
            <p class="card-text ms-3">${item.back}
            </p>
          </div>
        </div>
        <a href="#" class="text-light position-absolute top-0 end-0 translate-middle-x">
          <i class="edit-item bi bi-pencil-square"></i>
        </a>
      `;
      // Insert Item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
    
      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = 
          `<div class="row p-2">
            <div class="col">
              <p class="card-text">${item.front}</p>
            </div>
            <div class="col border-start border-dark border-2">
              <p class="card-text ms-3">${item.back}
              </p>
            </div>
          </div>
          <a href="#" class="text-light position-absolute top-0 end-0 translate-middle-x">
            <i class="edit-item bi bi-pencil-square"></i>
          </a>
          `;
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemFrontInput).value = '';
      document.querySelector(UISelectors.itemBackInput).value = '';
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemFrontInput).value = ItemCtrl.getCurrentItem().front;
      document.querySelector(UISelectors.itemBackInput).value = ItemCtrl.getCurrentItem().back;
      UICtrl.showEditState();
    },
    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).classList.add('d-none')
      document.querySelector(UISelectors.deleteBtn).classList.add('d-none')
      document.querySelector(UISelectors.backBtn).classList.add('d-none')
      document.querySelector(UISelectors.addBtn).classList.remove('d-none')
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).classList.remove('d-none')
      document.querySelector(UISelectors.deleteBtn).classList.remove('d-none')
      document.querySelector(UISelectors.backBtn).classList.remove('d-none')
      document.querySelector(UISelectors.addBtn).classList.add('d-none')
    },
    getSelectors: function() {
      return UISelectors;
    }
  }
})();

//App Controller
const App = (function() {
  // Load event listeners
  const loadEventListeners = function() {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter *
    document.addEventListener('keypress', function(e) {
      if(e.key === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Back Button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', backClick);

    // Clear item event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

  }

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for front and back input
    if(input.front !== '' && input.back !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.front, input.back);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Store in local storage
      StorageCtrl.storeItem(newItem);

      // Clear Fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Click edit item
  const itemEditClick = function(e) {
    if(e.target.classList.contains('edit-item')) {
      // Get list item id 
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split('-');

      // Get the actual Id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current Item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.front, input.back);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Delete button event
  const itemDeleteSubmit = function(e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // back button event
  const backClick = function(e){
    UICtrl.clearEditState();
    e.preventDefault();
  }

  // Clear items event
  const clearAllItemsClick = function() {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Remove from UI
    UICtrl.removeItems();

    // Clear from ls
    StorageCtrl.clearItemsFromStorage();

    UICtrl.clearEditState();
  }

  //Public Methods
  return {
    init: function() {
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if(items.length !== 0) {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();