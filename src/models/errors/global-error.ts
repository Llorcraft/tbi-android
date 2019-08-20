import { ErrorHandler } from "@angular/core";
import { MessageService } from "../../services";
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/map';

export class GlobalErrorHandler implements ErrorHandler {
    constructor(private message: MessageService, private http: Http) {
    }

    handleError(err: any) {
        //this.message.alert('ERROR', `${err.message || err.toString()}<br>${err.stack || ''}`);
        const _message = {
            text: `User: ${localStorage.getItem('tbi-user')}`,
            attachments: [
                {
                    color: 'danger',
                    fields: [
                        //{ title: 'Message', value: err.message || err.toString(), short: false },
                        { title: 'Stack', value: err.stack || '', short: false },
                    ]
                }
            ]
        };
        let _headers: Headers = new Headers();

        _headers.append("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        try {
            console.log(err);
            this.http.post('https://hooks.slack.com/services/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',
                `payload=${JSON.stringify(_message, null, 2)}`, {
                    headers: _headers
                })
                .toPromise()
                .catch(ex => this.message.alert('Error', ex.toString()));
        } catch (ex) {
            //
        }
    }
}