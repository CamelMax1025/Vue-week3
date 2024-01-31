import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.15/vue.esm-browser.min.js";

const site = "https://vue3-course-api.hexschool.io/v2";
const api_path = "camelpath2";

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imageUrl: [],
      },
      modalProduct: null,
      modalDel: null,
      isNew: false, //用於判別新增與編輯差別。
    };
  },
  methods: {
    getProducts() {
      const api = `${site}/api/${api_path}/admin/products`; //product 因應第四周加入 【分頁需求】。
      axios.get(api).then((res) => {
        this.products = res.data.products;
      });
    },
    //彈跳視窗
    openModal(status, product) {
      if (status === "new") {
        this.tempProduct = {
          imageUrl: [], //該欄位會動態變動，為防止變動，將其再初始化。
        };
        this.isNew = true; //二層防錯
        this.modalProduct.show();
      } else if (status === "edit") {
        this.tempProduct = { ...product }; //淺拷貝
        if (!Array.isArray(this.tempProduct.imagesUrl)) {
          //判斷imagesUrl不是陣列，就補進陣列。
          this.tempProduct.imagesUrl = [];
        }
        this.isNew = false;
        this.modalProduct.show();
      } else if (status === "delete") {
        this.tempProduct = { ...product };
        this.modalDel.show();
      }
    },
    // 新增
    updateProduct() {
      let api = `${site}/api/${api_path}/admin/product`; //建立產品
      let method = "post";
      //更新編輯
      if (!this.isNew) {
        //如果判斷this.isNew為false 就會轉PUT 的API路徑
        api = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
        method = "put";
      }
      axios[method](api, { data: this.tempProduct }).then((res) => {
        this.getProducts(); //建立完列表 要再次顯示列表。
        this.modalProduct.hide(); //新增完要關閉該頁面
        this.tempProduct = {}; //清除輸入框
      });
    },
    // 刪除
    deleteProduct() {
      const api = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
      axios.delete(api, { data: this.tempProduct }).then((res) => {
        this.getProducts();
        this.modalDel.hide();
      });
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)camelpath2\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.getProducts();
    this.modalProduct = new bootstrap.Modal(this.$refs.productModal); //老師使用refs (也可element id方式)
    this.modalDel = new bootstrap.Modal(this.$refs.delProductModal);
  },
});

app.mount("#app");
