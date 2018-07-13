class Foo {
  propyProp = 'vines are funny'
  
  loggyLog = (msg) => {
    return `In loggyLog method, where "this" context refers to ${JSON.stringify(this)} and also ${msg}`
  }
}

export default Foo