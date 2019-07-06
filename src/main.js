import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Table,TableColumn,Button,Dialog,Form,Input,Select,Option,FormItem  } from "element-ui";

Vue.config.productionTip = false;

Vue.use(Table).use(TableColumn).use(Button).use(Dialog).use(Form).use(Input).use(Select).use(Option).use(FormItem);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
