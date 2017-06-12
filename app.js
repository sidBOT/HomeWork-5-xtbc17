class App {
  constructor(selectors) {
    this.flicks = []
    this.flicks1 = []
    this.max = 0
    this.list = document
      .querySelector('#flick-list')
    this.list1 = document
      .querySelector('#flick-list1')
    this.template = document
      .querySelector(selectors.templateSelector)
    document
      .querySelector('#flick-form')
      .addEventListener('submit', this.addFlickViaForm.bind(this))
      this.max = JSON.parse(localStorage.getItem("max"))

    this.load()
  }

  load() {
    // Get the JSON string out of localStorage
    const flicksJSON = localStorage.getItem('flicks')
     const flicksJSON1 = localStorage.getItem('flicks1')

    // Turn that into an array
    const flicksArray = JSON.parse(flicksJSON)
    const flicksArray1 = JSON.parse(flicksJSON1)


    // Set this.flicks to that array
    if (flicksArray) {
      flicksArray
        .reverse()
        .map(this.addFlick.bind(this))
    }
    if(flicksArray1) {
      flicksArray1
        .reverse()
        .map(this.addFlick.bind(this))
    }
  }

  addFlick(flick) {
    const listItem = this.renderListItem(flick)
    const list = this.getList(flick)
    list.insertBefore(listItem, list.firstChild)
    
    if (flick.id > this.max) {
      this.max = flick.id
    }
    this.getflick(flick).unshift(flick)
    this.save()
  }

  addFlickViaForm(ev) {
    ev.preventDefault()
    const f = ev.target
    const flick = {
      id: this.max + 1,
      name: f.flickName.value,
      fav: false,
      category: f.category.value,
    }

    this.addFlick(flick)

    f.reset()
  }

  save() {
    localStorage
      .setItem('flicks', JSON.stringify(this.flicks))
      localStorage
      .setItem('flicks1', JSON.stringify(this.flicks1))

  }
  getList(flick){
        let list
        switch (flick.category){
            case "Movies": list = this.list
            break
            case "Cars": list = this.list1
            break
            default:
            break
        }
        return list
    }

  getflick(flick){
        let list
        switch (flick.category){
            case "Movies": list = this.flicks
            break
            case "Cars": list = this.flicks1
            break
            default:
            break
        }
        return list
    }

  renderListItem(flick) {
    const item = this.template.cloneNode(true)
    item.classList.remove('template')
    item.dataset.id = flick.id
    item
      .querySelector('.flick-name')
      .textContent = flick.name
    item
      .querySelector('.flick-name')
      .setAttribute('title', flick.name)

    if (flick.fav) {
      item.classList.add('fav')
    }

    item
      .querySelector('.flick-name')
      .addEventListener('keypress', this.saveOnEnter.bind(this, flick))

    item
      .querySelector('button.remove')
      .addEventListener('click', this.removeFlick.bind(this, flick))
    item
      .querySelector('button.fav')
      .addEventListener('click', this.favFlick.bind(this, flick))
    item
      .querySelector('button.move-up')
      .addEventListener('click', this.moveUp.bind(this, flick))
    item
      .querySelector('button.move-down')
      .addEventListener('click', this.moveDown.bind(this, flick))
    item
      .querySelector('button.edit')
      .addEventListener('click', this.edit.bind(this, flick))

    return item
  }

  removeFlick(flick,ev) {
    const listItem = ev.target.closest('.flick')
    const l = this.getflick(flick)
    // Find the flick in the array, and remove it
    for (let i = 0; i < l.length; i++) {
      const currentId = l[i].id.toString()
      if (listItem.dataset.id === currentId) {
        this.getflick(flick).splice(i, 1)
        break
      }
    }

    listItem.remove()
    this.save()
  }

  favFlick(flick, ev) {
    console.log(ev.currentTarget)
    const listItem = ev.target.closest('.flick')
    flick.fav = !flick.fav

    if (flick.fav) {
      listItem.classList.add('fav')
    } else {
      listItem.classList.remove('fav')
    }
    
    this.save()
  }

  moveUp(flick, ev) {
    const listItem = ev.target.closest('.flick')
    const f = this.getflick(flick)

    const index = f.findIndex((currentFlick, i) => {
      return currentFlick.id === flick.id
    })
    const list = this.getList(flick)
    if (index > 0) {
      list.insertBefore(listItem, listItem.previousElementSibling)

      const previousFlick = f[index - 1]
      f[index - 1] = flick
      f[index] = previousFlick
      this.save()
    }
  }

  moveDown(flick, ev) {
    const listItem = ev.target.closest('.flick')
    const f = this.getflick(flick)
    const index = f.findIndex((currentFlick, i) => {
      return currentFlick.id === flick.id
    })
    const list = this.getList(flick)
    if (index < this.flicks.length - 1) {
      list.insertBefore(listItem.nextElementSibling, listItem)
      
      const nextFlick = f[index + 1]
      f[index + 1] = flick
     f[index] =  nextFlick
      this.save()
    }
  }

  edit(flick, ev) {
    const listItem = ev.target.closest('.flick')
    const nameField = listItem.querySelector('.flick-name')
    const btn = listItem.querySelector('.edit.button')

    const icon = btn.querySelector('i.fa')

    if (nameField.isContentEditable) {
      // make it no longer editable
      nameField.contentEditable = false
      icon.classList.remove('fa-check')
      icon.classList.add('fa-pencil')
      btn.classList.remove('success')

      // save changes
      flick.name = nameField.textContent
      this.save()
    } else {
      nameField.contentEditable = true
      nameField.focus()
      icon.classList.remove('fa-pencil')
      icon.classList.add('fa-check')
      btn.classList.add('success')
    }
  }

  saveOnEnter(flick, ev) {
    if (ev.key === 'Enter') {
      this.edit(flick, ev)
    }
  }
}

const app = new App({
  templateSelector: '.flick.template',
})
