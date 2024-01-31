import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.15/vue.esm-browser.min.js";

const site = "https://vue3-course-api.hexschool.io/v2";

const app = createApp({
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      const api = `${site}/admin/signin`;
      axios
        .post(api, this.user)
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `camelpath2=${token}; expires=${new Date(
            expired
          )};`;
          window.location = `products-week3.html`;
        })
        .catch((err) => {
          alert("登入失敗，請重新輸入帳密。");
        });
    },
  },
  mounted() {},
});

app.mount("#app");
