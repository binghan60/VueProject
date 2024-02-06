import userProductModal from "../components/userProductModal.js";
Object.keys(VeeValidateRules).forEach((rule) => {
	VeeValidate.defineRule(rule, VeeValidateRules[rule]);
});
VeeValidateI18n.loadLocaleFromURL("./zh_TW.json");
VeeValidate.configure({
	generateMessage: VeeValidateI18n.localize("zh_TW"),
	validateOnInput: true
});
const app = Vue.createApp({
	data() {
		return {
			url: "https://ec-course-api.hexschool.io/v2",
			path: "binghank",
			isLoading: false,
			productList: [],
			product: {},
			form: {
				user: { email: "", name: "", tel: "", address: "" },
				message: ""
			},
			cart: {}
		};
	},
	methods: {
		getProducts() {
			this.isLoading = true;
			axios(`${this.url}/api/${this.path}/products`)
				.then((res) => {
					const { products } = res.data;
					this.productList = products;
					this.isLoading = false;
				})
				.catch((error) => {
					this.isLoading = false;
				});
		},
		getProduct(id) {
			this.isLoading = true;

			axios(`${this.url}/api/${this.path}/product/${id}`)
				.then((res) => {
					this.product = res.data.product;
					this.$refs.modal.openModal();
					this.isLoading = false;
				})
				.catch((err) => {
					this.isLoading = false;
				});
		},
		getCart() {
			this.isLoading = true;
			axios(`${this.url}/api/${this.path}/cart`)
				.then((res) => {
					const { data } = res.data;
					this.cart = data;
					this.isLoading = false;
				})
				.catch((error) => {
					this.isLoading = false;
				});
		},
		addToCart(id) {
			this.isLoading = true;
			axios
				.post(`${this.url}/api/${this.path}/cart`, {
					data: {
						product_id: id,
						qty: 1
					}
				})
				.then((res) => {
					this.isLoading = false;
					this.getCart();
				})
				.catch((error) => {
					this.isLoading = false;
				});
		},
		updateCart(product) {
			this.isLoading = true;
			axios
				.put(`${this.url}/api/${this.path}/cart/${product.id}`, {
					data: {
						product_id: product.id,
						qty: product.qty
					}
				})
				.then((res) => {
					this.isLoading = false;
					this.getCart();
				})
				.catch((error) => {
					this.isLoading = false;
				});
		},
		removeCartProduct(id) {
			this.isLoading = true;
			axios
				.delete(`${this.url}/api/${this.path}/cart/${id}`)
				.then((res) => {
					this.isLoading = false;
					this.getCart();
				})
				.catch((error) => {
					this.isLoading = false;
				});
		},
		removeAllProduct() {
			this.$refs.modal.openModal();
			if (this.cart.carts.length == 0) {
				return;
			}
			this.isLoading = true;
			axios
				.delete(`${this.url}/api/${this.path}/carts`)
				.then((res) => {
					this.isLoading = false;
					this.getCart();
				})
				.catch((error) => {
					this.isLoading = false;
				});
		},
		createOrder() {
			if (this.cart.carts.length == 0) {
				alert("購物車內無商品");
				return;
			}
			axios
				.post(`${this.url}/api/${this.path}/order`, { data: this.form })
				.then((res) => {
					alert("成功送出訂單");
					this.$refs.form.resetForm();
					this.getCart();
				})
				.catch((err) => {
					alert(err.response.data.message);
				});
		},
		isPhone(value) {
			const phoneNumber = /^(09)[0-9]{8}$/;
			return phoneNumber.test(value) ? true : "請輸入正確電話號碼";
		}
	},
	mounted() {
		this.getProducts();
		this.getCart();
	}
});
app.component("userProductModal", userProductModal);
app.component("loading", VueLoading.Component);
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);
app.mount("#app");
