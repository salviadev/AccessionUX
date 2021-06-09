/// <reference types="@phoenix/phoenix-cli" />
namespace Tiers {
    const
        _p = Phoenix,
        _customData = _p.customData,
        _dsPlugin = _p.DatasetPlugin,
        _utils = _p.utils;

    const
        TYPE_DS_TRACE = 'boc';

    class TraceController extends Phoenix.ui.FormController {
        public initObjectState(trace) {
            trace.$links = trace.$links || {};
            trace.$links['traces.trace'] = trace.$links['traces.trace'] || {};
            trace.$links['traces.stopTrace'] = trace.$links['traces.stopTrace'] || {};
            trace.$links['traces.trace'].isDisabled = trace.active;
            trace.$links['traces.stopTrace'].isDisabled = !trace.active;
        }
        public static sumTime(item: any, timeInfo: any) {
            if (item.type === 'ERROR') {
                item.$states.message.style = 'danger';
            }
            if (item.type === 'DATA') {
                timeInfo.dataTime += item.time;
                if (item.message.substr(0, 8) === 'getNewId') {
                    timeInfo.createTime += item.time;
                }
                item.$states.message.style = 'text-danger';
            } else {
                if (item.items && item.items.length) {
                    item.items.forEach(ci => {
                        TraceController.sumTime(ci, timeInfo);
                    })
                } else {
                    timeInfo.ruleTime += item.time;
                }
            }
        }
        public static calculateTime(model: any) {
            const m = model.model(true);
            let totalTime = 0;
            const timeInfo = { dataTime: 0, ruleTime: 0, createTime: 0 };
            m.traces.forEach(item => {
                totalTime += item.time;
                TraceController.sumTime(item, timeInfo);
            });
            model.totalTime = totalTime;
            model.dataTime = timeInfo.dataTime;
            model.newIdTime = timeInfo.createTime;
            model.rulesTime = totalTime - timeInfo.dataTime;
        }
        public static afterRefresh(model: any) {
            model.traces.$links.trace.isDisabled = model.active;
            model.traces.$links.stopTrace.isDisabled = !model.active;
            TraceController.calculateTime(model);

        }
        public static getTraces(model?: any): Promise<any> {
            const trace = {
                name: 'trace',
                $type: 'rest',
                $method: 'GET',
                $params: {
                    $method: 'GET',
                    $type: TYPE_DS_TRACE,
                    $url: 'profile/trace'
                }
            }
            const result: any = {};

            return new _utils.Promise((resolve, reject) => {
                _dsPlugin.executeDatasets([trace], {}, result, [], (sended, ex) => {
                    if (!ex) {
                        if (model) {
                            model.traces = result.trace.traces;
                            TraceController.afterRefresh(model);
                        }
                        resolve(result.trace)
                    } else
                        reject(ex)
                });
            })
        }
        public static execAction(action: string, data: any, model: any): Promise<any> {
            const actionData = {
                action,
                value: data
            }
            const trace = {
                name: 'trace',
                $type: 'rest',
                $method: 'PATCH',
                $params: {
                    $method: 'PATCH',
                    $type: TYPE_DS_TRACE,
                    $url: 'profile/trace',
                    $data: {
                        value: actionData,
                        type: 'literal'
                    }
                }
            }
            const result: any = {};

            return new _utils.Promise((resolve, reject) => {
                _dsPlugin.executeDatasets([trace], {}, result, [], (sended, ex) => {
                    if (!ex) {
                        if (action !== 'trace' || (action === 'trace' && data)) {
                            model.traces = result.trace.traces;
                            model.active = result.trace.active;
                            TraceController.afterRefresh(model);
                        } else {
                            model.active = result.trace.active;
                            TraceController.afterRefresh(model);
                        }
                        resolve(result.trace)
                    } else
                        model.addAjaxException(ex);
                });
            })
        }

        public static loadTraces(context: any): Promise<any> {
            return TraceController.getTraces();
        }

        public onModelChanged(action, model, form: Phoenix.ui.Form) {
            super.onModelChanged(action, model, form);
            if (action.operation === 'init') {
                TraceController.calculateTime(model);
            }
            switch (action.property) {
                case 'traces.$links.clear':
                    TraceController.execAction('clear', null, model);
                    break;
                case 'traces.$links.trace':
                    TraceController.execAction('trace', true, model);
                    break;
                case 'traces.$links.stopTrace':
                    TraceController.execAction('trace', false, model);
                    break;
                case 'traces.$links.refresh':
                    TraceController.getTraces(model);

            }
        }
    }

    _customData.register('trace.controller', new TraceController());
    _customData.register('traces.load-traces', TraceController.loadTraces);

}