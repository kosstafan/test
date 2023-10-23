import './index.html';
import './index.scss';
import ko from 'knockout';
import './components/category.js';
import './components/dock.js';
const categories = [
    {
        name: 'Обязательные для всех',
        items: [
            {
                name: 'Паспорт'
            },
            {
                name: 'ИНН'
            }
        ]
    },
    {
        name: 'Обязательные для трудоустройства',
        items: [
            {
                name: 'Обязательный док 1'
            },
            {
                name: 'Обязательный док 2'
            }
        ]
    },
    {
        name: 'Специальные',
        items: [
            {
                name: 'Специальный док 1'
            },
            {
                name: 'Специальный док 2'
            }
        ]
    }
]

class CategoriesViewModel {
  constructor() {
    this.products = ko.observableArray();
    this.activeCategories = ko.observableArray([]);
    this.temp = ko.observable(null)
    this.dragElement = ko.observable()
    this.draggingCat = ko.observable()
    this.draggingDock = ko.observable()
    this.targetCategory = ko.observable()
    this.offsetX = ko.observable(0)
    this.offsetY = ko.observable(0)
    this.dragIndex = ko.observable()
    this.dragMode = ko.observable()
    categories.forEach(cat => {
        this.products.push({
            name: cat.name,
            items: ko.observableArray(cat.items)
        })
    })
  }

  setMode(mode) {
    this.dragMode(mode)
  }

  processCategoryDrag(e) {
    const overElement = document.elementsFromPoint(e.clientX, e.pageY).find(el => el.classList.contains('category-list__line'))
        if (overElement) {
            this.dragIndex(overElement.getAttribute("index"))
            overElement.classList.add('dragover')
            document.querySelectorAll('.dragover').forEach(el => {
                if (el !== overElement) el.classList.remove('dragover')
            })
        }
  }

  processDockDrag(e) {
    const overElement = document.elementsFromPoint(e.clientX, e.pageY).find(el => el.classList.contains('dock'))
    const overCat = document.elementsFromPoint(e.clientX, e.pageY).find(el => el.classList.contains('category-list__line'))
    if (overCat) {
        this.targetCategory(overCat.getAttribute("index"))
        if (+this.targetCategory() !== this.draggingCat()) {
            if (!this.activeCategories().includes(this.products()[this.targetCategory()].name)) {
                this.activeCategories.push(this.products()[+this.targetCategory()].name)
            }
        }
    }
    if (overElement) {
        this.dragIndex(overElement.getAttribute("index"))
        overElement.classList.add('dragover')
        document.querySelectorAll('.dragover').forEach(el => {
            if (el !== overElement) el.classList.remove('dragover')
        })
    }
  }

  setCoords(data, e) {
    if (this.dragElement()) {
        this.offsetX(e.clientX -1170)
        this.offsetY(e.pageY -25)
        if (this.dragMode() === 'category') {
            this.processCategoryDrag(e)
        } else {
            this.processDockDrag(e)
        }
        
    }
    return true
  }

  dragStart(item, element, e) {
    if (this.dragMode() === 'category') {
        this.draggingCat(this.products().indexOf(item))
    } else {
        this.products().forEach(cat => {
            if (cat.items.indexOf(item) !== -1) {
                this.draggingCat(this.products().indexOf(cat))
                this.draggingDock(this.products()[this.draggingCat()].items.indexOf(item))
            }
        })
    }
    this.temp(item)
    this.dragElement(element.outerHTML)
    return true
  }

  dragEnd() {
    document.querySelectorAll('.dragover').forEach(el => {
        el.classList.remove('dragover')
    })

    if (this.dragMode() === 'category') {
        this.products.splice(this.draggingCat(), 1)

        this.products.splice(this.draggingCat() < this.dragIndex() ? this.dragIndex() : this.dragIndex() + 1, 0, this.temp())
    } else {
        this.products()[this.draggingCat()].items.splice(this.draggingDock(), 1)
        this.products()[this.targetCategory()].items.splice(this.draggingDock() < this.dragIndex() ? this.dragIndex() : this.dragIndex() + 1, 0, this.temp())
    }

    
    this.temp(null)

    this.dragElement(null)
  }
  toggleCategory(name) {
    if (this.activeCategories().includes(name)) {
        this.activeCategories.remove((item) => item === name )
    } else {
        this.activeCategories.push(name)
    }
  }
}

ko.applyBindings(new CategoriesViewModel(), document.getElementById('root'));