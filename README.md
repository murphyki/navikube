# navikube

> `navikube` is an intuitive front-end desktop application for navigating [kubernetes](https://kubernetes.io/) resources and exploring their details.

## Overview
`navikube` is buit using the awesome [electron](https://electronjs.org/) and [Vue.js](https://vuejs.org/) frameworks.

To make life even easier, `navikube` was scaffolded using the [electron-vue](https://github.com/SimulatedGREG/electron-vue) project and uses the [ElementUI](https://element.eleme.io/?ref=madewithvuejs.com#/en-US) component library.

`navikube` uses the kubernetes REST API to communicate with the kubernetes server courtesy of the [Javascript clients for Kubernetes](https://github.com/kubernetes-client/javascript).

`navikube` currently explores the following kubernetes resources:
- Nodes
- Pods
- Deployments
- Services
- Secrets
- ConfigMaps

`navikube` also currently explores the following [istio](https://istio.io/) resources:
- VirtualServices
- ServiceEntries

> Because `navikube` is built on electron, `navikube` should be cross-platform, but so far I have only built and tested on Linux (Ubuntu 18.04.1 LTS)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

```

## Resources
- [Building a Desktop App with Vue: Electron](https://dev.to/vuevixens/building-a-desktop-app-with-vue-electron-3pl)

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
