import {layoutsObs, removeLayout, restoreLayout, saveLayout} from './glue-related.js';


const allLayouts = layoutsObs
  .pipe(rxjs.operators.map((layouts) => {
    return layouts
      .map(l => ({name: l.name, type: l.type}))
      .filter(l => ['Global', 'Swimlane'].includes(l.type))
  }))

function handleLayoutClick() {
  q('#layout-load>ul').addEventListener('click', e => {
    const layoutElement = e.path.find(e => e.getAttribute('layout-name'));
    const name = layoutElement.getAttribute('layout-name');
    const type = layoutElement.getAttribute('layout-type');

    if (e.target.matches('.delete-layout, .delete-layout *')) {
      removeLayout(type, name);
    } else {
      restoreLayout(type, name);
    }
  })
}

function handleLayoutSave(){
  q('#layout-save-btn').addEventListener('click', saveCurrentLayout);
  q('#layout-save-name').addEventListener('keyup', (e) => e.key === 'Enter' ? saveCurrentLayout() : null);
}

function saveCurrentLayout() {
  saveLayout(q('#layout-save-name').value);
  q('#layout-save-name').value = '';
  q('#layout-content').classList.add('hide');
  q('#layout-load').classList.remove('hide');
}

function layoutHTMLTemplate(layout) {
  return `
  <li class="nav-item" layout-name="${layout.name}" layout-type="${layout.type}">
    <div class="nav-link action-menu">
      <i class="icon-03-context-viewer ml-2 mr-4"></i>
      <span>${layout.name}${layout.type === 'Swimlane' ? ' (Swimlane)': ''}</span>
      <div class="action-menu-tool delete-layout">
        <button class="btn btn-icon secondary" id="menu-tool-4">
          <i class="icon-trash-empty"></i>
        </button>
      </div>
    </div>
  </li>`;
}

const noLayoutsHTML = `
<li class="text-center">
    <span>No Layouts Saved</span>
</li>`;

export {
  allLayouts,
  layoutHTMLTemplate,
  handleLayoutClick,
  handleLayoutSave,
  noLayoutsHTML
}