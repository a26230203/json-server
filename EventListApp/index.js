const Api = (() => {
    const url = 'http://localhost:3000/'
    const path = 'events'
    const getEvent = () => {
        return fetch([url, path].join("")).then(res => res.json())

    }

    return {
        getEvent
    }
})()

// View 
const View = (() => {
    const domstr = {
        evenList: ".even-container",
    }

    const renders = (elm, temp) => {
        elm.innerHTML = temp
    }

    const converDate = (time) => {
        let date = new Date(time)
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2);
        return [ date.getFullYear(), mnth, day].join("-");
    }

    const createTemp = (arr) => {
        let temp = ""
        arr.forEach((date) => {
            temp += `
            <form>
                <input  disabled="true" value="${date.eventName}"/>
                <input  disabled="true" value="${converDate(+date.startDate)}"/>
                <input  disabled="true" value="${converDate(+date.endDate)}"/>
                <button class= "edit-btn" id="${date.id}"> EDIT </button>
                <button class= "edit-btn" id="${date.id}"> DELETE </button>
            </form>
            `
        });
        return temp
    }

    return {
        domstr,
        renders,
        createTemp
    }
})()


// Model
const Model = ((api, view) => {
    class Event {
        constructor(name, stateDate, endDate) {
            this.name = name
            this.stateDate = stateDate
            this.endDate = endDate;
        }
    }

    class State {
        #eventList = []
        get eventList() {
            return this.#eventList
        }

        set eventList(newDate) {
            this.#eventList = newDate
            const elm = document.querySelector(view.domstr.evenList)
            const temp = view.createTemp(newDate)
            view.renders(elm, temp)
        }
    }

    const getEvent = api.getEvent

    return {
        Event,
        State,
        getEvent
    }

})(Api, View)


//controller
const Controller = ((model, view) => {
    const state = new model.State()

    const init = () => {
        model.getEvent().then((date) => {
            state.eventList = date
        })
    }

    const boostrap = () => {
        init()
    }

    return {
        boostrap
    }

})(Model, View)

Controller.boostrap()