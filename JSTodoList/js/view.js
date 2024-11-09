import AddTodo from './components/add-todo.js';
import Modal from './components/modal.js';
import Filters from './components/filters.js';

export default class View {
  constructor() {
    this.model = null;
    this.table = document.getElementById('table');
    this.addTodoForm = new AddTodo();
    this.modal = new Modal();
    this.filters = new Filters();
    this.toggleBgButton = document.getElementById('toggle-bg'); // Botón de cambio de fondo

    // Arreglo de colores de fondo
    this.backgroundColors = ['rgb(48, 48, 48)', '#333', '#4a4a4a', '#555', '#2c3e50'];
    this.currentColorIndex = 0;

    // Configuración de eventos
    this.addTodoForm.onClick((title, description) => this.addTodo(title, description));
    this.modal.onClick((id, values) => this.editTodo(id, values));
    this.filters.onClick((filters) => this.filter(filters));
    this.toggleBgButton.addEventListener('click', () => this.toggleBackgroundColor());
  }

  setModel(model) {
    this.model = model;
  }

  render() {
    const todos = this.model.getTodos();
    todos.forEach((todo) => this.createRow(todo));
  }

  toggleBackgroundColor() {
    // Cambiar el color de fondo según el índice actual
    this.currentColorIndex = (this.currentColorIndex + 1) % this.backgroundColors.length;
    document.body.style.backgroundColor = this.backgroundColors[this.currentColorIndex];
  }

  filter(filters) {
    const { type, words } = filters;
    const [, ...rows] = this.table.getElementsByTagName('tr');
    for (const row of rows) {
      const [title, description, completed] = row.children;
      let shouldHide = false;

      if (words) {
        shouldHide = !title.innerText.includes(words) && !description.innerText.includes(words);
      }

      const shouldBeCompleted = type === 'completed';
      const isCompleted = completed.children[0].checked;

      if (type !== 'all' && shouldBeCompleted !== isCompleted) {
        shouldHide = true;
      }

      if (shouldHide) {
        row.classList.add('d-none');
      } else {
        row.classList.remove('d-none');
      }
    }
  }

  addTodo(title, description) {
    const todo = this.model.addTodo(title, description);
    this.createRow(todo);
  }

  toggleCompleted(id) {
    this.model.toggleCompleted(id);
  }

  editTodo(id, values) {
    this.model.editTodo(id, values);
    const row = document.getElementById(id);
    row.children[0].innerText = values.title;
    row.children[1].innerText = values.description;
    row.children[2].children[0].checked = values.completed;
  }

  removeTodo(id) {
    this.model.removeTodo(id);
    document.getElementById(id).remove();
  }

  createRow(todo) {
    const row = this.table.insertRow();
    row.setAttribute('id', todo.id);
  
    const isPastDue = new Date(todo.dueDate) < new Date();
    const dueDateText = todo.dueDate ? `<span ${isPastDue ? 'style="color: red;"' : ''}>${todo.dueDate}</span>` : 'No date';
  
    row.innerHTML = `
      <td>${todo.title}</td>
      <td>${todo.description}</td>
      <td class="text-center">${dueDateText}</td>
      <td class="text-center">
        <input type="checkbox" ${todo.completed ? 'checked' : ''}>
      </td>
      <td class="text-right">
      </td>
    `;
  
    const checkbox = row.children[3].children[0];
    checkbox.onclick = () => this.toggleCompleted(todo.id);
  
    const editBtn = document.createElement('button');
    editBtn.classList.add('btn', 'btn-primary', 'mb-1');
    editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
    editBtn.setAttribute('data-toggle', 'modal');
    editBtn.setAttribute('data-target', '#modal');
    editBtn.onclick = () => this.modal.setValues({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      completed: todo.completed,
    });
    row.children[4].appendChild(editBtn);
  
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('btn', 'btn-danger', 'mb-1', 'ml-1');
    removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
    removeBtn.onclick = () => this.removeTodo(todo.id);
    row.children[4].appendChild(removeBtn);
  }
}
