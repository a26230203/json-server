const Api = (() => {
    const url = 'http://localhost:3000'
    const path = 'events'
    const getEvent = () => {
        return fetch([url, path].join("/")).then(res => res.json())
    }

    const deleEvent = (id) => {
        return fetch([url, path, id].join("/"), {
            method: "DELETE"
        }) 
    }

    return {
        getEvent,
        deleEvent,
    }
})()

// View 
const View = (() => {
    const domstr = {
        evenList: ".even-container",
        addBtn: ".add-btn",
        delete: ".delete-btn",
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
            <form class="event-form" >
                <input  disabled="true" value="${data.eventName}"/>
                <input  disabled="true" value="${converDate(+data.startDate)}"/>
                <input  disabled="true" value="${converDate(+data.endDate)}"/>
                <button class="edit-btn" id="${data.id}"> EDIT </button>
                <button class="delete-btn" id="${data.id}"> DELETE </button>
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

            const elm2 = document.querySelectorAll(view.domstr.delete)
            elm2.forEach(elm => {
                elm.addEventListener("click", e => {
                    this.eventList = this.#eventList.filter(data => {
                        return +data.id != + e.target.id
                    })
                    api.deleEvent(e.target.id)
                })
            })
        }
    }

    const getEvent = api.getEvent
    const deleEvent = api.deleEvent

    return {
        Event,
        State,
        getEvent,
        deleEvent
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