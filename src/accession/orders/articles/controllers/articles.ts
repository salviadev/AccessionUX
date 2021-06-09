/// <reference types="@phoenix/phoenix-cli" />
namespace Accession {
    let _p = Phoenix,
        _ui = _p.ui,
        _dom = _p.dom,
        _utils = _p.utils,
        _link = _p.link,
        _customData = _p.customData,
        _data = _p.data;
    export class ArticleController extends Phoenix.ui.FormController {
        public onModelChanged(action, model, form) {
            const that = this;
            super.onModelChanged(action, model, form);
            switch (action.property) {
                case 'articles.$links.add':
                    form.navigate('orders/articles/article-detail', {
                        canGoBack: true,
                        checkForChanges: true,
                        urlSearch: {}
                    });
                    break;
                case 'articles.$item.$links.modify':
                    form.navigate('orders/articles/article-detail', {
                        canGoBack: true,
                        checkForChanges: true,
                        urlSearch: { code: action.actionParams.code }
                    });
                    break;

            }
        }

    }
    _customData.register('accession.sync.articles.controller', new ArticleController());

}
