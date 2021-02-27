'use strict';

class Tag {
  constructor(form, input, tagList, btnRead) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.tagList = document.querySelector(tagList);
    this.btnRead= document.querySelector(btnRead);
    this.tagData = new Map(JSON.parse(localStorage.getItem('tagList')));
    this.stateBtnRead = new Map(JSON.parse(localStorage.getItem('stateBtnRead')));
    this.btnSave = document.querySelector('#save');
    
  }
 

  addToStorage() {
    localStorage.setItem('tagList', JSON.stringify([...this.tagData ]));
    localStorage.setItem('stateBtnRead', JSON.stringify([...this.stateBtnRead ]))
  
  }
  
  render() {
    this.tagList.textContent = '';
    this.tagData.forEach(this.createItem, this);
    this.addToStorage();
    // forEach
    this.stateBtnRead.forEach((item, i) => {
      this.btnRead.textContent = item.btnRead;
      this.input.readOnly = item.readOnly;
      this.input.value = item.inputValue;
      this.btnSave.disabled = item.disBtnSave;
    })
    // key
      // this.btnRead.textContent = this.stateBtnRead.get('state-readonly').btnRead;
      // this.input.readOnly = this.stateBtnRead.get('state-readonly').readOnly;
      // this.input.value = this.stateBtnRead.get('state-readonly').inputValue;
      // this.btnSave.disabled = this.stateBtnRead.get('state-readonly').disBtnSave;
    this.stateCloseBtn()
    
  }
  btnStateFunc() {
    const newBtnState = {
      btnRead: this.btnRead.textContent,
      readOnly: this.input.readOnly,
      inputValue: this.input.value,
      disBtnSave: this.btnSave.disabled,
      key: "state-readonly",
    };
    this.stateBtnRead.set( newBtnState.key , newBtnState );
    
  }
  createItem(tag) {
    const li = document.createElement(tag.value);
    li.classList.add('tag-item');
    li.key = tag.key;
    
    li.insertAdjacentHTML('beforeend', `
    <span class="tag-text">${tag.value}</span>
        <div class="tag-buttons">
					<button class="tag-remove">&#10060;</button>
        </div>`);

    this.tagList.append(li);
  }
  addTag(e) {
    e.preventDefault();
    if(this.input.value.trim()) {
      const newTag = {
      value: this.input.value,
      key: this.generateKey(),  
    };

    this.tagData.set(newTag.key, newTag);
    this.render();
    this.input.value = '';
    }
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  deleteItem(itemLi) {
     itemLi.remove(itemLi);
      this.tagData.forEach((item, index) => {
      if(item.key === itemLi.key) {
       this.tagData.delete(index);
       this.render();
      }
    });
  }
  readOnly(){
    
    const tagRemove = document.querySelectorAll('.tag-remove');
    this.input.readOnly ? (this.input.readOnly = false, this.btnRead.textContent = 'Read 0nly', this.btnSave.disabled = false) : 
     (this.input.readOnly = true, this.btnRead.textContent = 'Change tags', this.btnSave.disabled = true ); 
    this.btnStateFunc()
  }

  stateCloseBtn(){
    const tagRemove = document.querySelectorAll('.tag-remove');
    tagRemove.forEach(item => {
      this.input.readOnly ? item.disabled = true : item.disabled = false ;
    })
  }

  handler() {
    document.addEventListener('click', (event) => {
     let target = event.target;
      if(target.matches('.tag-remove')) {
       this.deleteItem(target.closest('.tag-item'));
      } else if(target.matches('#readonly')) {
        this.readOnly();
        this.render();
      }
      
    });
  }

  init() {
    this.input.required = true;
    this.form.addEventListener('submit', this.addTag.bind(this));
    this.handler();
    this.render();
    
  }
};

const tag = new Tag('.tag-control', '.header-input', '.tag-list', '#readonly');

tag.init();