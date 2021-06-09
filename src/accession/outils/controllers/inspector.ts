/// <reference types="@phoenix/phoenix-cli" />
namespace Tiers {
    const
        _p = Phoenix,
        _customData = _p.customData,
        _dsPlugin = _p.DatasetPlugin,
        _utils = _p.utils;

    const
        TYPE_DS_TRACE = 'boc';


    class InspectorController extends Phoenix.ui.FormController {
        private timerSelected = 0;
        public static afterRefresh(model: any) {
        }
        public static dsSessionInfo(): Promise<any> {
            return InspectorController.loadSessionInfo(null)
        }
        public static transformData(data: any): any {
            const res = { instances: [], totalInstances: 0 };
            data.containers.forEach(container => {
                const containerInfo = { id: `Container(${container.id})`, instances: [] };
                res.instances.push(containerInfo);
                if (container.instances) {
                    Object.keys(container.instances).forEach(className => {
                        const classInfo = { id: className, instances: [] };
                        containerInfo.instances.push(classInfo);
                        const classData = container.instances[className];
                        if (classData) {
                            classData.forEach(instance => {
                                const instanceInfo = { id: `${className}(${instance.id})`, data: instance.data, status: instance.status };
                                classInfo.instances.push(instanceInfo);
                                res.totalInstances++;
                            })

                        }

                    });
                }
            });
            return res;
        }
        public static loadSessionInfo(model?: any): Promise<any> {
            const inspector = {
                name: 'inspector',
                $type: 'rest',
                $method: 'GET',
                $params: {
                    $method: 'GET',
                    $type: TYPE_DS_TRACE,
                    $url: 'profile/instances'
                }
            }
            const result: any = {};

            return new _utils.Promise((resolve, reject) => {
                _dsPlugin.executeDatasets([inspector], {}, result, [], (sended, ex) => {
                    if (!ex) {
                        const d = InspectorController.transformData(result.inspector);
                        result.inspector.instances = d.instances;
                        result.inspector.totalInstances = d.totalInstances;
                        result.inspector.containers;
                        if (model) {
                            model.instances = result.inspector.instances;
                            model.totalInstances = result.inspector.totalInstances;
                            model.instanceasstring = '';
                            InspectorController.afterRefresh(model);
                        }
                        resolve(result.inspector)
                    } else
                        reject(ex)
                });
            })
        }
        public showSelectedInstance(model) {
            const that = this;
            if (that.timerSelected) {
                window.clearTimeout(that.timerSelected);
            }
            that.timerSelected = window.setTimeout(() => {
                model.instances.enumSelectedItems('instances', (item) => {
                    if (item) {
                        const m = item.model(true);
                        if (m.data) {
                            model.instanceasstring =  JSON.stringify(m.data, null, 2);
                        } else model.instanceasstring = '';
                    }
                }, '');
            });
        }

        public changed(propName: string, action: any, model: any) {
            const bind = 'instances';
            if (propName.indexOf(bind) !== 0) return;
            if (propName === bind && action.operation === 'propchange') {
                this.showSelectedInstance(model);
                return;
            }
            const pp = propName.substr(bind.length);
            const segments = propName.split('.');
            if (segments[segments.length - 1] !== '$select') return;
            if (pp.indexOf('.$selected') >= 0) return;
            if (pp.indexOf('.$links') >= 0) return;
            this.showSelectedInstance(model);
        }


        public onModelChanged(action, model, form: Phoenix.ui.Form) {
            super.onModelChanged(action, model, form);
            if (action.operation === 'init') {
            }
            if (action.property) {
                this.changed(action.property, action, model);
            }
            switch (action.property) {
                case 'instances.$links.refresh':
                    InspectorController.loadSessionInfo(model);
                    break;

            }
        }
        static displayStatus(value: string, displayValue: string, line: any) {
            if (!value) return '<center></center>';
            const cvalue = {
                '0': 'PSLA-L',
                '1': 'S',
                '2': 'R',
                '4': 'O',
                '8': 'L',
                '16': 'V',
            }[value + ''] || 'S';

            const html = [
                '<center>',
                '<div class="bs-image-cell accession-statut accession-statut-' + cvalue + '">',
                displayValue,
                '</div>',
                '</center>'
            ];
            return html.join('');
        }

    }

    _customData.register('inspector.controller', new InspectorController());
    _customData.register('inspector.load-session-info', InspectorController.dsSessionInfo);
    _customData.register('ui.html.display-inspector-status', InspectorController.displayStatus);

}