/// <reference types="@phoenix/phoenix-cli" />
/// <reference path="../../../tools/controllers/paginated-list.ts" />
namespace Accession {
    let _p = Phoenix,
        _customData = _p.customData;
    export class ArticleModelController extends PaginatedListController {
        public onModelChanged(action, model, form) {
            const that = this;
            super.onModelChanged(action, model, form);
            switch (action.property) {
                case 'articles.$links.add':
                    const selected = model.articles.$selected;
                    form.execAction('$links.saveSelected', {
                        code: selected ? selected.code : null,
                        $after: () => {
                            form.navigate('orders/articles/article-detail', {
                                canGoBack: true,
                                checkForChanges: true,
                                urlSearch: {}
                            });
                        }
                    });
                    break;
                case 'articles.$item.$links.modify':
                    form.execAction('$links.saveSelected', {
                        code: action.actionParams.code,
                        $after: () => {
                            form.navigate('orders/articles/article-detail', {
                                canGoBack: true,
                                checkForChanges: true,
                                urlSearch: { code: action.actionParams.code }
                            });
                        }
                    });
                    break;

            }
        }

    }
    _customData.register('accession.sync.articles-model.controller', new ArticleModelController());

}
