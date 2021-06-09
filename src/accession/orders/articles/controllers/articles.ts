/// <reference types="@phoenix/phoenix-cli" />
namespace Accession {
    let _p = Phoenix,
        _customData = _p.customData;
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
