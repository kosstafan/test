import ko from 'knockout';
import category from './category.html';

class CategoryWidgetViewModel {
  constructor(params) {
    this.name = params.data.name;
    this.item = params.data;
    this.docks = params.data.items;
    this.parent = params.parent
  }
  toggleCategory(model) {
    model.parent.toggleCategory(this.name);
  }

  dragStart(model, e) {
    const element = e.target.closest('.category')
    element.closest('.category-list__line').classList.add('dragging-line')
    model.parent.setMode('category')
    model.parent.dragStart(this.item, element, e)
    return true
  }
  dragEnd(model) {
    model.parent.dragEnd()
    return true
  }
}

ko.components.register('category', {
  viewModel: CategoryWidgetViewModel,
  template: category
});
