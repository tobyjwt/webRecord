import { record, pack} from 'rrweb';
import axios from 'axios';
import LZString from 'lz-string';

export default class WebRecord {
    constructor(option = {}) {
        if (option.id === undefined) {
            throw new Error('id of record is necessary');
        }
        this.init(option);
    }

    eventsMatrix
    #delay = 10
    #protectId = []
    eventId = 0

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
        record({
            emit(event, isCheckout) {
                if (isCheckout) {
                    // console.log('is check');
                    // console.log(pack(_that.eventsMatrix[_that.eventsMatrix.length - 1]));
                    // console.log(JSON.stringify(_that.eventsMatrix[_that.eventsMatrix.length - 1]));
                    _that.eventsMatrix.push({
                        id: ++_that.eventId,
                        events: []
                    });
                    _that.clear();
                }
                // window.events.push(event);
                _that.eventsMatrix[_that.eventsMatrix.length - 1].events.push(event);
            },
            checkoutEveryNms: 10 * 1000 // 每10秒重新制作快照
        });

    }

    clear() {
        if (this.eventsMatrix.length > 4) {
            this.eventsMatrix.shift();
        }
    }

    report() {
        // const curEvent = this.eventsMatrix[this.eventsMatrix.length - 1];
        // console.log(curEvent);
        // this.#protectId.push(curEvent.id);
        // const eventData = curEvent.events;
        // const string = JSON.stringify(eventData);
        // const lzString = LZString.compress(string);
        // const file = new File([string], 'test.txt');
        // const param = new FormData();
        // param.append('file',file);
        // param.append('name',123);
        console.log('trigger report')
        setTimeout(() => {
            console.log(this.#delay);
            const postData = this.eventsMatrix.slice(-2).map(item => item.events).reduce((a, b) => a.concat(b));
            const string = pack(postData);
            console.log(string);
            const file = new File([string], 'test.txt');
            const param = new FormData();
            param.append('file',(file));
            param.append('name',123);
            console.log('report');
            // do report
            axios({
                url: 'http://172.24.101.146:3000/upLoad',
                method: 'post',
                headers: {
                    'content-Type': 'multipart/form-data'
                },
                data: (param)
            });
        }, this.#delay);
    }
}
