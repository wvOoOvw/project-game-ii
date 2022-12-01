const _Allow = Symbol('_Allow')

const differentArray = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false
  if (a.length !== b.length) return true
  return a.filter((i, index) => i === b[index]).length !== a.length
}

function Monitor(ImitationINS) {
  this.ImitationINS = ImitationINS
  this.dependentQueue = []
  this.monitorQueue = []
}

Monitor.prototype.dispatch = function () {
  this.monitorQueue.forEach((i, index) => {
    const dependentPrevious = this.dependentQueue[index]
    const dependentCurrent = this.executeDependent(i.dependent)

    if (dependentCurrent === _Allow) {
      this.executeEvent(i.event)
      this.dependentQueue[index] = dependentCurrent
      return
    }

    if (Array.isArray(dependentCurrent) && Array.isArray(dependentPrevious) && differentArray(dependentCurrent, dependentPrevious)) {
      this.executeEvent(i.event)
      this.dependentQueue[index] = dependentCurrent
      return
    }

    if (!Array.isArray(dependentCurrent) && !Array.isArray(dependentPrevious) & dependentCurrent !== dependentPrevious) {
      this.executeEvent(i.event)
      this.dependentQueue[index] = dependentCurrent
      return
    }

    this.dependentQueue[index] = dependentCurrent
  })
}
Monitor.prototype.register = function (event, dependent = _Allow) {
  const monitor = { event, dependent }
  this.monitorQueue.push(monitor)
  this.dependentQueue.push(this.executeDependent(dependent))

  return () => {
    this.monitorQueue.forEach((i, index) => {
      if (i === monitor) {
        this.monitorQueue = this.monitorQueue.filter((i, index_) => index_ !== index)
        this.dependentQueue = this.dependentQueue.filter((i, index_) => index_ !== index)
      }
    })
  }
}
Monitor.prototype.executeEvent = function (event) {
  event(this.ImitationINS.state)
}
Monitor.prototype.executeDependent = function (dependent) {
  return typeof dependent === 'function' ? dependent(this.ImitationINS.state) : dependent
}

function Imitation(v) {
  this.state = v
  this.MonitorINS = new Monitor(this)
}

Imitation.prototype.setState = function (v) {
  this.state = typeof v === 'function' ? v(this.state) : v
  this.dispatch()
}
Imitation.prototype.assignState = function (v) {
  this.state = Object.assign(this.state, typeof v === 'function' ? v(this.state) : v)
  this.dispatch()
}
Imitation.prototype.register = function () {
  return this.MonitorINS.register(...arguments)
}
Imitation.prototype.dispatch = function () {
  return this.MonitorINS.dispatch(...arguments)
}

const ImitationInstance = new Imitation()

export { ImitationInstance as Imitation, Imitation as ImitationClass }