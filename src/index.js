import * as rrweb from 'rrweb';
import axios from 'axios';
import LZString from 'lz-string';

export default class record {
    constructor(option = {}) {
        if (option.id === undefined) {
            throw new Error('id of record is necessary');
        }
        this.init(option);
    }

    eventsMatrix
    #delay = 10
    #protectId = []
    #eventId = 0

    init(option) {
        const {
            delay = 10,
        } = option;

        this.#delay = delay;
        this.eventsMatrix = [{
            id: 0,
            events: []
        }];

        const _that = this;
        rrweb.record({
            emit(event, isCheckout) {
                if (isCheckout) {
                    _that.eventsMatrix.push({
                        id: ++this.#eventId,
                        events: []
                    });
                }
                // window.events.push(event);
                _that.eventsMatrix[_that.eventsMatrix.length - 1].events.push(event);
            },
            checkoutEveryNms: 10 * 1000 // 每10秒重新制作快照
        });
        // mock trigger report
        setTimeout(() => {
            this.report();
        }, 2000);
    }

    clear() {}

    report() {
        const curEvent = this.eventsMatrix[this.eventsMatrix.length - 1];
        console.log(curEvent);
        this.#protectId.push(curEvent.id);
        const eventData = curEvent.events;
        const string = JSON.stringify(eventData);
        const lzString = LZString.compress(string);
        const file = new File([string], 'test.txt');
        console.log(string)
        const param = new FormData();
        param.append('file',file);
        param.append('name',123);
        setTimeout(() => {
            // do report
            axios({
                url: 'http://localhost:3000/upLoad',
                method: 'post',
                headers: {
                    'content-Type': 'multipart/form-data'
                },
                data: param
            });
        }, this.#delay);
    }
}
