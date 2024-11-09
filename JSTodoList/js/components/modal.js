import Alert from './alert.js';

export default class Modal {
  constructor() {
    this.title = document.getElementById('modal-title');
    this.description = document.getElementById('modal-description');
    this.btn = document.getElementById('modal-btn');
    this.completed = document.getElementById('modal-completed');
    this.alert = new Alert('modal-alert');

    this.todo = null;
  }

  setValues(todo) {
    this.todo = todo;
    this.title.value = todo.title;
    this.description.value = todo.description;
    this.completed.checked = todo.completed;
    document.getElementById('modal-due-date').value = todo.dueDate;
  }
  
  onClick(callback) {
    this.btn.onclick = () => {
      const dueDate = document.getElementById('modal-due-date').value;
      if (!this.title.value || !this.description.value) {
        this.alert.show('Title and description are required');
        return;
      }
  
      $('#modal').modal('toggle');
  
      callback(this.todo.id, {
        title: this.title.value,
        description: this.description.value,
        dueDate: dueDate,
        completed: this.completed.checked,
      });
    };
  }  
}
