import ko from 'knockout';
import dock from './dock.html';

class DockWidgetViewModel {
  constructor(params) {
    this.name = params.data.name;
    this.item = params.data;
    this.parent = params.parent.parent
  }

  dragStart(model, e) {
    const element = e.target.closest('.docks__item')
    model.parent.setMode('dock')
    model.parent.dragStart(this.item, element, e)
    return true
  }
  dragEnd(model) {
    model.parent.dragEnd('item')
    //return true
  }
}

ko.components.register('dock', {
  viewModel: DockWidgetViewModel,
  template: dock
});
