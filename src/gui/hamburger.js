export class Hamburger {

  /**
   * Create Hamburger Menu of Node
   *
   * @author Jean-Christophe Taveau
   */
  static create(parent,preview) {
  
        // Preview Action
      const preview_action = (evt) => {
        let eye = document.querySelector('.hamburger #hamburger__AT__eye');
        let eye_shut = document.querySelector('.hamburger #hamburger__AT__eye-slash');
        if (eye.style.display === 'none') {
          eye.style.display = 'block';
          eye_shut.style.display = 'none';
        }
        else {
          eye.style.display = 'none';
          eye_shut.style.display = 'block';
        }
      }
      
      // Inspect Action
      const inspect_action = (evt) => {
        let popup = document.getElementById('popup');
        popup.className = 'modal';
        popup.style.top = '0px';
        popup.style.left = '0px';
        popup.innerHTML = '<div class="modal-content"><span class="close">&times;</span><h1>Inspect</h1></div>';
      }
      // Help Action
      const help_action = (evt) => {
        let popup = document.getElementById('popup');
        popup.className = 'modal';
        popup.style.top = '0px';
        popup.style.left = '0px';
        popup.innerHTML = '<div class="modal-content"><span class="close">&times;</span><h1>Help</h1></div>';
      }
      // Close Action
      const close_action = (evt) => {
        console.info('Delete Node and Remove connected edges');
      }
      
    const item = (id,icon,title,callback,template) => {
      let item = document.createElement('li');
      let b = WidgetFactory.button(id,template,{},callback);
      b.classList.remove('button');
      item.appendChild(b);
      return item;
    }
      
    let menu = document.querySelector('#popup');
    menu.className = 'hamburger';
    menu.innerHTML = ''; // Reset
    // Menu Events are already defined in `board.js`
    // Define buttons in menu
    let preview_buttons = [
      {icon: 'eye', name: 'hamburger',title:'Preview - Shortcut: V',fun: preview_action},
      {icon: 'eye-slash', name: 'hamburger',title:'Preview - Shortcut: V',fun: preview_action,display: 'none'}
    ];
    let buttons = [
      {icon: 'binoculars', name: 'hamburger', title:'Inspect - Shortcut: I',fun: inspect_action},
      {icon: 'question-circle-o', name: 'hamburger', title:'Help - Shortcut: H',fun: help_action},
      {icon: 'trash', name: 'hamburger', title:'Delete - Shortcut: X',fun: close_action}
      // {icon: 'times-circle-o', name: 'hamburger', title:'Close - Shortcut: X',fun: close_action}
    ];
    let items = ( preview ? [...preview_buttons,...buttons] : buttons).map( b => item(b.icon,b.icon,b.title,b.fun,b));
    let ulist = document.createElement('ul');
    ulist.append(...items);
    menu.appendChild(ulist);
    menu.style.left = `${parent.offsetLeft + parent.offsetWidth}px`; //`${event.clientX}px`;
    menu.style.top = `${parent.offsetTop}px`; // `${event.clientY}px`;
    menu.style.display = 'block';
  }

} // End of class Hamburger

