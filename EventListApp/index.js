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
        addBtn: ".add-btn",
        delete: ".delete",
        edit: ".edit-btn",
    }

    const renders = (elm, temp) => {
        elm.innerHTML = temp
    }

    const converDate = (time) => {
        if(time !== "") {
            let date = new Date(time)
            mnth = ("0" + (date.getMonth()+1)).slice(-2),
            day  = ("0" + date.getDate()).slice(-2);
            return [ date.getFullYear(), mnth, day].join("-");
        }else {
            return ""
        }

    }

    const createTemp = (arr) => {
        let temp = ""
        arr.forEach((data) => {
            temp += `
            <form>
                <input  disabled="true" value="${data.eventName}"/>
                <input  disabled="true" value="${converDate(+data.startDate)}"/>
                <input  disabled="true" value="${converDate(+data.endDate)}"/>
                <button class= "edit-btn" id="${data.id}"> EDIT </button>
                <button class= "delete-btn" id="${data.id}"> DELETE </button>
            </form>
            `
        });
        return temp
    }

    const addTemp = () => {
        const form = document.createElement('form')
        const input1 = document.createElement('input')
        const input2 = document.createElement('input')
        const input3 = document.createElement('input')
        const save = document.createElement('button')
        save.className = "save-btn"
        save.innerText = "SAVE"
        const close = document.createElement('button')
        close.className = "close-btn"
        close.innerText = "CLOSE"

       form.append(input1, input2, input3, save, close)

       return form
    } 

    return {
        domstr,
        renders,
        createTemp,
        addTemp
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

    const addBtn = () => {
        const elm = document.querySelector(view.domstr.addBtn)
        const elm2 = document.querySelector(view.domstr.evenList)
        elm.addEventListener('click', e => {
            elm2.append(view.addTemp())
        })
    }

    const boostrap = () => {
        init()
        addBtn()
    }

    return {
        boostrap
    }

})(Model, View)

Controller.boostrap()