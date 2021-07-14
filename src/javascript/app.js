import './script'
import { DnD } from './dnd'
import { Note } from './note'

const element = document.querySelector('#element')

const dndElement = new DnD(element)

// console.log(dndElement)


const noteElement = new Note()


// window.addEventListener('dnd:end', (event) => {
//   console.log(position)
// })
