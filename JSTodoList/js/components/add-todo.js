import Alert from './alert.js';

export default class AddTodo {
  constructor() {
    this.btn = document.getElementById('add');
    this.title = document.getElementById('title');
    this.description = document.getElementById('description');

    this.alert = new Alert('alert');
  }

  onClick(callback) {
    this.btn.onclick = () => {
      const dueDate = document.getElementById('due-date').value;
      if (this.title.value === '' || this.description.value === '') {
        this.alert.show('Title, description and date are required');
      } else {
        this.alert.hide();
        callback(this.title.value, this.description.value, dueDate);
      }
    };
  }  
}
