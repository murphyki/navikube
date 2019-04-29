<template>
    <div>
        <el-container>
            <el-header>
                <el-select v-model="namespace" no-data-text="Please select namespace" @change="loadResources">
                    <el-option
                        v-for="item in namespaces"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="resource" no-data-text="Please select resource" @change="loadResources">
                    <el-option
                        v-for="item in resources"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-header>
            <el-main>
                <el-table :data="resourceData" empty-text="Nothing to show..." stripe @expand-change="loadResource" v-loading="tableLoading">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-switch
                                v-model="props.row.formatYAML"
                                active-text="YAML"
                                inactive-color="#13ce66"
                                inactive-text="JSON"
                                @change="loadResource(props.row)">
                            </el-switch>
                            <el-input
                                type="textarea"
                                :rows="2"
                                autosize
                                v-model="props.row.resourceDetails"
                                v-loading="rowLoading">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="namespace" label="Namespace" min-width="180"></el-table-column>
                    <el-table-column prop="name" label="Name" min-width="300"></el-table-column>
                    <el-table-column prop="creationTimestamp" label="Created" min-width="180"></el-table-column>
                </el-table>
            </el-main>
        </el-container>
    </div>

</template>

<script>
  const request = require('request');
  const YAML = require('json2yaml')

  export default {
    data () {
        return {
            namespace: 'all',
            namespaces: [],
            resourceData: [],
            resource: 'nodes',
            resources: [
                {label: 'nodes', value: 'nodes'},
                {label: 'pods', value: 'pods'},
                {label: 'deployments', value: 'deployments'},
                {label: 'services', value: 'services'},
                {label: 'secrets', value: 'secrets'},
                {label: 'configmaps', value: 'configmaps'},
                {label: 'virtualservices', value: 'virtualservices'},
                {label: 'serviceentries', value: 'serviceentries'}
            ],
            tableLoading: false,
            rowLoading: false
        }
    },
    mounted() {
        this.loadNamespaces().then(() => {
            this.loadResources();
        });
    },
    methods: {
        loadResources: function() {
            return new Promise((resolve, reject) => {
                this.resourceData = []
                this.tableLoading = true;
                let url = this.formatUrl();
                request.get(url, this.$kc_opts, (error, response, body) => {
                    if (error) {
                        this.tableLoading = false;
                        this.handleGeneralError(error);
                        return reject(error);
                    }

                    if (response.statusCode != 200) {
                        this.tableLoading = false;
                        this.handleApiError(response, body);
                        return reject('API Request failed');
                    }

                    try {
                        let items = JSON.parse(body).items;
                        for (let item in items) {
                            items[item].metadata.formatYAML = true;
                            items[item].metadata.resourceDetails = '';
                            this.resourceData.push(items[item].metadata);
                        }
                    } catch(ex) {
                        this.tableLoading = false;
                        this.handleException(ex);
                        return reject(ex);
                    }

                    this.tableLoading = false;
                    console.log('resourceData:', this.resourceData);
                    return resolve(this.resourceData);
                });
            });
        },
        loadResource: function(resource, expandedRows) {
            console.log('resource:', resource);
            console.log('expandedRows:', expandedRows);

            if (expandedRows && expandedRows.length == 0) {
                return;
            }

            return new Promise((resolve, reject) => {
                resource.resourceDetails = '';
                this.rowLoading = true;
                let url = `${this.$kc.getCurrentCluster().server}${resource.selfLink}`
                request.get(url, this.$kc_opts, (error, response, body) => {
                    if (error) {
                        this.rowLoading = false;
                        this.handleGeneralError(error);
                        return reject(error);
                    }

                    if (response.statusCode != 200) {
                        this.rowLoading = false;
                        this.handleApiError(response, body);
                        return reject('API Request failed');
                    }

                    try {
                        if(resource.formatYAML) {
                            resource.resourceDetails = YAML.stringify(JSON.parse(body));
                        } else {
                            resource.resourceDetails = JSON.stringify(JSON.parse(body), null, 2);
                        }
                    } catch(ex) {
                        this.rowLoading = false;
                        this.handleException(ex);
                        return reject(ex);
                    }

                    this.rowLoading = false;
                    console.log('resourceDetails:', resource.resourceDetails);
                    return resolve(resource.resourceDetails);
                });
            });
        },
        loadNamespaces: function() {
            return new Promise((resolve, reject) => {
                let url = `${this.$kc.getCurrentCluster().server}/api/v1/namespaces`
                request.get(url, this.$kc_opts, (error, response, body) => {
                    if (error) {
                        this.handleGeneralError(error);
                        return reject(error);
                    }

                    if (response.statusCode != 200) {
                        this.handleApiError(response, body)
                        return reject('API Request failed');
                    }

                    this.namespaces = [{label: 'all', value: 'all'}];
                    try {
                        let items = JSON.parse(body).items;
                        for (let item in items) {
                            this.namespaces.push({'label': items[item].metadata.name, 'value': items[item].metadata.name});
                        }
                    } catch(ex) {
                        this.handleException(ex);
                        return reject(ex);
                    }

                    console.log('namespaces:', this.namespaces);
                    return resolve(this.namespaces);
                });
            });
        },
        formatUrl() {
            let url = `${this.$kc.getCurrentCluster().server}`;

            if (this.resource == 'virtualservices' || this.resource == 'serviceentries') {
                url = `${url}/apis/networking.istio.io/v1alpha3`;
            } else if(this.resource =='deployments') {
                url = `${url}/apis/extensions/v1beta1`;
            } else {
                url = `${url}/api/v1`;
            }

            if (this.namespace == 'all') {
                url = `${url}/${this.resource}`;
            } else {
                url = `${url}/namespaces/${this.namespace}/${this.resource}`;
            }

            console.log(`url: ${url}`);
            return url;
        },
        adaptResources() {
        },
        handleGeneralError(error) {
            console.log(`error: ${error}`);
            this.$notify({
                title: 'An error ocurred',
                message: `${error}`,
                type: 'error',
                duration: 0
            });
        },
        handleApiError(response, reason) {
            console.log(`response: ${response}`);
            console.log(`reason: ${reason}`);

            let details = {};
            try {
                details = JSON.parse(reason);
            } catch(ex) {
                this.handleException(ex);
                details.message = 'Error parsing API response body';
            }
            this.$notify({
                title: `Error ${response.statusCode}`,
                message: `${details.message}`,
                type: 'error',
                duration: 0
            });
        },
        handleException(ex) {
            console.log(`exception: ${ex}`);
            this.$notify({
                title: 'An error ocurred',
                message: `${ex}`,
                type: 'error',
                duration: 0
            });
        }
    }
  }
</script>

<style scoped>
</style>
