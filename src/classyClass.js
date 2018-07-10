class classyClass {
  propyProp = 'vines are funny'
  loggyLog = (msg) => {
    console.log(
    `In loggyLog method, where "this" context refers to ${JSON.stringify(this)} and also ${msg}`
    )
  }
}

export default classyClass