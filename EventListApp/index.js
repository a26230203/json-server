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

    const addEvent = (event) => {
        return fetch([url, path].join("/"), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(event),
        }).then(res => res.json())
    }

    const editEvent = (id, event) =>
        fetch([url, path, id].join('/'), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(event),
        })
            .then((response) => response.json());

    return {
        getEvent,
        deleEvent,
        addEvent,
        editEvent
    }
})()

// View 
const View = (() => {
    const domstr = {
        evenList: ".even-container",
        addBtn: ".add-btn",
        delete: ".delete-btn",
        edit: ".edit-btn",
        evenForm: ".event-form",
        newInput: ".new-input",
        eventName: ".event-name",
        startDate: ".start-date",
        endDate: ".end-date",
        save: ".new-save-btn",
        close: ".new-close-btn",
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
            <div class="event-form" >
                <input id = "input-name${data.id}"  disabled="true" value="${data.eventName}"/>
                <input id = "start-date${data.id}" disabled="true" value="${converDate(+data.startDate)}"/>
                <input id = "end-date${data.id}" disabled="true" value="${converDate(+data.endDate)}"/>
                <button class="edit-btn" id="${data.id}" value="EDIT"> EDIT </button>
                <button class="delete-btn" id="${data.id}" value="DELETE"> DELETE </button>
            </div>
            `
        });
        return temp
    }

    return {
        domstr,
        renders,
        createTemp,
    }
})()

// Model
const Model = ((api, view) => {
    class Event {
        constructor(name, startDate, endDate) {
            this.eventName = name
            this.startDate = startDate
            this.endDate = endDate;
        }
    }

    class State {
        #eventList = []
        #add = false

        get eventList() {
            return this.#eventList
        }

        get add() {
            return this.#add
        }

        set eventList(newDate) {
            this.#eventList = newDate
            const elm = document.querySelector(view.domstr.evenList)
            const temp = view.createTemp(newDate)
            view.renders(elm, temp)
        }

        set add(boolean) {
            return this.#add = boolean
        } 
    }

    const getEvent = api.getEvent
    const deleEvent = api.deleEvent
    const addEvent = api.addEvent
    const editEvent = api.editEvent

    return {
        Event,
        State,
        getEvent,
        deleEvent,
        addEvent,
        editEvent,
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

    const addEvent = () => {
        const elm = document.querySelector(view.domstr.addBtn)
        const elm2 = document.querySelector(view.domstr.evenList)
        elm.addEventListener('click', e => {
            if(state.add === false) {
                const div =  document.createElement('div')
                div.className = "new-input"
                state.add = true
                div.innerHTML = `
                    <input class="event-name" />
                    <input class="start-date" />
                    <input class="end-date" />
                    <button class="new-save-btn" value="SAVE"> SAVE </button>
                    <button class="new-close-btn" value="CLOSE"> CLOSE </button>
                `
                elm2.appendChild(div)
                
                let newEvent = new model.Event()
                const inputName = document.querySelector(view.domstr.eventName)
                const statDate = document.querySelector(view.domstr.startDate)
                const endDate = document.querySelector(view.domstr.endDate)
                const saveBtn = document.querySelector(view.domstr.save)
                const closeBtn = document.querySelector(view.domstr.close)
    
                inputName.addEventListener('keyup', e => {
                    newEvent.eventName = e.target.value
                })
        
                statDate.addEventListener('keyup', e => {
                    const d = new Date(e.target.value)
                    newEvent.startDate = d.getTime()
                })
        
                endDate.addEventListener('keyup', e => {
                    const d = new Date(e.target.value)
                    newEvent.endDate = d.getTime()
                })
        
                saveBtn.addEventListener('cick', () => {
                    if(newEvent.eventName !== '' || newEvent.startDate !== '' || newEvent.endDate !== '') {
                        model.addEvent(newEvent).then(even => {
                            state.eventList = [even, ...state.eventList]
                        })
                    }else {
                        alert('please fill all infomation')
                    }
                })
    
                closeBtn.addEventListener('click', () => {
                    const newInput = document.querySelector(view.domstr.newInput)
                    state.add = false
                    newInput.remove()
                })
            }

        })
    }

    const deleteEvent = () => {
        const elm = document.querySelector(view.domstr.evenList)
        elm.addEventListener('click', e => {
            if (e.target.value === 'DELETE') {
                state.eventList = state.eventList.filter((date) => {
                    return date.id != e.target.id
                 })
                model.deleEvent(e.target.id);
            }
        });
    }

    const editEvent = () => {
        const eventContainer = document.querySelector(view.domstr.evenList);
        eventContainer.addEventListener('click', (e) => {
            if (e.target.value === 'EDIT') {
                const id = +e.target.id;
                const updateEventName = document.getElementById(`input-name${id}`);
                const updateStartDate = document.getElementById(`start-date${id}`);
                const updateEndDate = document.getElementById(`end-date${id}`);

                e.target.innerText = 'SAVE';
                
                if(e.target.innerText = 'SAVE') {
                    const eventForm = document.querySelector(view.domstr.evenForm)
                    const button = eventForm.querySelector('button')
                    let curEvent 
                    
                    updateEventName.removeAttribute("disabled");
                    updateStartDate.removeAttribute("disabled");
                    updateEndDate.removeAttribute("disabled");
                    state.eventList.forEach((e) => {
                        if (+e.id === id) return curEvent = e;
                    })

                    updateEventName.addEventListener('keyup', e => {
                        curEvent.eventName = e.target.value
                    })
            
                    updateStartDate.addEventListener('keyup', e => {
                        curEvent.startDate = e.target.value
                    })
            
                    updateEndDate.addEventListener('keyup', e => {
                        curEvent.endDate = e.target.value
                    })


                    button.addEventListener('click', e => {
                        if(curEvent.eventName === "" || curEvent.startDate === "" || curEvent.endDate === "") {
                            alert("please fill all infomation");
                        }else {
                            e.target.innerText = 'EDIT'
                            model.editEvent(e.target.id, curEvent)
                            model.getEvent().then((data) => {
                             return state.eventList = data
                            });
                        }
                    })

                }
                
            }
            
        })
    }

    const boostrap = () => {
        init()
        addEvent()
        deleteEvent()
        editEvent()
    }

    return {
        boostrap
    }

})(Model, View)

Controller.boostrap()