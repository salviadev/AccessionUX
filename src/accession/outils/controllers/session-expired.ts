/// <reference types="@phoenix/phoenix-cli" />
/// <reference path="./spo-communication.ts" />

namespace Accession {
    let _p = Phoenix,
        _history = _p.history,
        _dom = _p.dom,
        _link = _p.link,
        _customData = _p.customData,
        _ajax = _p.ajax;

    _ajax.interceptError(470, () => {
        _history.clear(false, false);
        const tenant = _dom.getCookie('tenant');
        if (tenant) {
            sendToSpo('session-expired', '', null)
        } else {
            _link.execLink({ $page: 'outils/session-expired', $replace: true }, {}, {});
        }
    }, true);
    let st = Date.now();
    _ajax.onAjax = () => {
        const delta = 3 * 60 * 1000;
        const delay = Date.now() - st;
        if (delay > delta) {
            st = Date.now();
            const tenant = _dom.getCookie('tenant');
            if (tenant) {
                sendToSpo('refresh-session', '', null)
            }
        }

    }


    class SessionExpiredPageController extends Phoenix.ui.FormController {
        public onModelChanged(action, model, form: Phoenix.ui.Form) {
            const that = this;
            super.onModelChanged(action, model, form);
            switch (action.property) {
                case '$links.home':
                    form.navigate('home-page', {
                        canGoBack: false,
                        checkForChanges: false,
                        urlSearch: {}
                    });
                    break;
            }
        }
    }

    _customData.register('accession.session-expired.controller', new SessionExpiredPageController());

}